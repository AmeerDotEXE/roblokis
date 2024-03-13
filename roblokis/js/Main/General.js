"use strict";
var Rkis = {
	...Rkis,
	...{
		SubDomain: (window.location.hostname.startsWith("web") == true ? "web" : "www"),
		id: BROWSER.runtime.id,
		manifest: BROWSER.runtime.getManifest(),

		database: {
			async save() {
				let data = Rkis.wholeData;

				//save to new database
				await BROWSER.storage.local.set({
					Roblokis: data
				}).catch(err => {
					if (err == "Error: QUOTA_BYTES quota exceeded") {
						Rkis.Toast("ERROR: not enough space to save your data.", 5000);
						return;
					}
					Rkis.Toast("ROBLOKIS SAVING ERROR", 3000);
					console.error(err);
				});

				// ? temporary save to old database
				// saveOldDatabase();
				return;

				function saveOldDatabase() {
					let strigifiedData = null;

					try {
						strigifiedData = JSON.stringify(Rkis.wholeData);
					} catch {}

					if (strigifiedData === null) return;
					localStorage.setItem("Roblokis", strigifiedData);
				}
			},
			async load() {
				let data = null;

				// load from new database
				data = await BROWSER.storage.local.get('Roblokis');
				if (typeof data === 'undefined') data = null;
				else if (data === null) {}
				else if (JSON.stringify(data) === '{}') data = null;
				if (data !== null && typeof data.Roblokis !== 'undefined') data = data.Roblokis;

				//load from old database
				if (data === null) {
					data = loadFromOldDatabase();
				}

				//load default data
				if (data === null) data = {};
				
				//un-modify saving structure

				Rkis.wholeData = { ...data };
				return Rkis.wholeData;

				function loadFromOldDatabase() {
					let oldData = null;
					let rawOldData = localStorage.getItem("Roblokis");
					if (rawOldData) {
						try {
							oldData = JSON.parse(rawOldData);
						} catch {}
					}
					return oldData;
				}
			},
			async clearDatabase(confirmation = false) {
				if (confirmation !== true) return false;

				//clear old database
				if (localStorage.getItem('Roblokis') !== null) {
					localStorage.removeItem('Roblokis');
				}

				//clear new database
				await BROWSER.storage.local.clear().catch(() => {});

				//clear current data
				Rkis.wholeData = {}; // for double checking only
				await Rkis.database.load();
				return true;
			}
		},
		contextMenu: {
			/**
			 * wrapper for contextmenu api that communicates with backend.
			 *
			 * @param {"create" | "add" | "clear" | "remove"} actionType
			 * @param {string} id
			 * @param {string} title
			 * @param {function} callback
			 * @return {Promise} 
			 */
			handleContextMenu(actionType = "create", id, title, callback) {
				return new Promise(resolve => {
					BROWSER.runtime.sendMessage({about: actionType+"ContextMenu", info: {
						id,
						title,
						type: "normal",
						contexts: ["all"],
					}, id}, 
					function(data) {
						if (typeof callback == "function" && (actionType == "add" || actionType == "create")) {
							BROWSER.runtime.onMessage.addListener(async (request) => {
								if (request.type == "clickedContextmenu") {
									const requestData = request.data;
									if (requestData.menuItemId !== id) return;
									callback?.(requestData);
								}
							});
						} else callback?.(data);
						resolve(data)
					})
				})
			},
			/**
			 * adds context menu item only when mouse over the element
			 *
			 * @param {HTMLElement} element
			 * @param {string} id
			 * @param {string} title
			 * @param {function} callback
			 */
			elementContextMenu(element, id, title, callback) {
				element.addEventListener("mouseenter", () => {
					Rkis.contextMenu.handleContextMenu("add", id, title, callback);
				});
				element.addEventListener("mouseleave", () => {
					Rkis.contextMenu.handleContextMenu("remove", id);
				});
			},
			/**
			 * adds context menu item on the entire page.
			 *
			 * @param {string} id
			 * @param {string} title
			 * @param {function} callback
			 * @return {Promise} 
			 */
			pageContextMenu(id, title, callback) {
				Rkis.contextMenu.handleContextMenu("add", id, title, callback);
				window.addEventListener("focus", () => {
					Rkis.contextMenu.handleContextMenu("add", id, title, callback);
				});
			}
		},

		GetSettingValue(setting) {
			if (setting == null) return null;
			if (typeof setting == "string") setting = Rkis.wholeData[setting];
			if (setting == null || typeof setting.type != "string") return null;
			let value = setting.value;
			if (value == null) return null;
		
			switch (setting.type) {
				default:
					return null;
				case "switch":
					return value.switch;
				case "text":
					return value.text || "";
			}
		},
		GetSettingCustomization(setting) {
			if (setting == null) return null;
			if (typeof setting == "string") setting = Rkis.wholeData[setting];
			if (setting == null || typeof setting.id != "string") return null;
			return setting.data?.customization;
		},
		GetSettingDetails(details) {
			if (details == null) return null;
		
			let code = details.default;
			if (details[Rkis.languageCode] != null) code = Rkis.languageCode;
		
			return details[code];
		},
		IsSettingEnabled(setting, defaultSetting, callback) {
			if (typeof defaultSetting == "function") [callback, defaultSetting] = [defaultSetting, null];

			if (typeof Rkis.wholeData === 'undefined' || Rkis.wholeData === null) {
				Rkis.wholeData = Rkis.wholeData || {};
			}
		
			let rksetting = setting;
			if (typeof setting == "string") rksetting = Rkis.wholeData[setting];
			if (rksetting == null && defaultSetting == null) {
				console.error("Missing Setting:", setting);
				return false;
			}
		
			if (defaultSetting != null) {
				if (rksetting && rksetting.id == null) {
					let valueObject = {};
	
					if (typeof rksetting == "boolean") valueObject.switch = Rkis.wholeData[setting];
					else if (typeof rksetting == "string") valueObject.text = Rkis.wholeData[setting];
	
					if (valueObject == {}) Rkis.wholeData[setting] = { ...defaultSetting };
					else Rkis.wholeData[setting] = { ...defaultSetting, ...{ value: valueObject } };

					rksetting = Rkis.wholeData[setting];
					Rkis.database.save();
				}
				if (Rkis.wholeData[setting] == null) {
					Rkis.wholeData[setting] = { ...defaultSetting };
					(() => { Rkis.database.save() })();
				}
				if (Rkis.wholeData[setting] != null && typeof Rkis.wholeData[setting] == "object") {
					Rkis.wholeData[setting].details = defaultSetting.details;
					if (Rkis.wholeData[setting].data == null && defaultSetting.data != null) {
						Rkis.wholeData[setting].data = defaultSetting.data;
						(() => { Rkis.database.save() })();
					}
				}
			} else if (rksetting.id == null) {
				console.error("Unregistered Feature: " + setting);
				return false;
			}
		
			if (rksetting && rksetting.options && rksetting.options.disabled == true) return false;
		
			let value = Rkis.GetSettingValue(rksetting);
			let result = true;
		
			if (value == null || value == "" || value == false) { result = false; }
			if (result && callback != null) return callback.apply();
			return result;
		},
		IsSettingDisabled(setting, defaultSetting, callback) {
			return Rkis.IsSettingEnabled(setting, defaultSetting, callback) == false;
		},
		delay(ms) {
			return new Promise(resolve => {
				setTimeout(function () { return resolve(); }, ms);
			});
		},
		CopyText(text) {
			let textArea = document.createElement("textarea");
		
			textArea.value = text;
			textArea.style.top = "0";
			textArea.style.left = "0";
			textArea.style.position = "fixed";
		
			document.firstElementChild.appendChild(textArea);
			textArea.focus();
			textArea.select();
		
			try {
				let successful = document.execCommand("copy");
				let msg = successful ? Rkis.language["copyTextSuccess"] : Rkis.language["copyTextUnseccuss"];
				Rkis.Toast(msg);
			} catch (err) {
				Rkis.Toast(Rkis.language["cantCopyText"], err);
			}
		
			document.firstElementChild.removeChild(textArea);
		},
		GetTextFromLocalFile(filelocation) {
			return new Promise(resolve => {
				let xmlhttp = new XMLHttpRequest();
				xmlhttp.open("GET", Rkis.fileLocation + filelocation, false);
				xmlhttp.send();
		
				resolve(xmlhttp.responseText);
			})
		},
		Toast(text, ms) {
			if (Rkis.ToastHolder == null) {
				alert(text);
				return;
			}
		
			Rkis.ToastHolder.textContent = text;
			Rkis.ToastHolder.style.opacity = "1";
			Rkis.ToastHolder.style.bottom = "30px";
			setTimeout(() => { Rkis.ToastHolder.style.opacity = "0"; Rkis.ToastHolder.style.bottom = "0px"; }, ms || 4000)
		},
		/**
		 * returns 0 when same
		 * 1 if first is bigger
		 * 2 if second is bigger
		 */
		versionCompare(a, b) {
			if (typeof a != "string" || typeof b != "string") return 0;
			if (a === "" || b === "") return 0;
			if (a.startsWith("v")) a = a.substring(1);
			if (b.startsWith("v")) b = b.substring(1);
			if (a == b) return 0;

			let aParts = a.split(".").map(x => parseInt(x));
			let bParts = b.split(".").map(x => parseInt(x));
			
			for (let i = 0; i < aParts.length; i++) {
				if (aParts[i] > bParts[i]) return 1;
				if (aParts[i] < bParts[i]) return 2;
			}

			return 2;
		},
	}
};

window.ContextScript = true;

Rkis.version = Rkis.manifest.version;
Rkis.fileLocation = BROWSER.runtime.getURL("");


if (window.location.href.includes(".com/games/")) {
	Rkis.GameId = window.location.href.split("/games/")[1].split("/")[0];
	Rkis.pageName = "game";
	Rkis.contextMenu.pageContextMenu("placeid", "Copy Place Id", () => {
		Rkis.CopyText(Rkis.GameId);
	});
}
else if (window.location.href.includes(".com/users/")) {
	Rkis.UserId = window.location.href.split("/users/")[1].split("/")[0];
	Rkis.pageName = "users";
	Rkis.contextMenu.pageContextMenu("userid", "Copy User Id", () => {
		Rkis.CopyText(Rkis.UserId);
	});
}
else if (window.location.href.includes(".com/groups/")) {
	Rkis.GroupId = window.location.href.split("/groups/")[1].split("/")[0];
	Rkis.pageName = "groups";
	Rkis.contextMenu.pageContextMenu("userid", "Copy User Id", () => {
		Rkis.CopyText(Rkis.GroupId);
	});
}
else if (window.location.href.includes(".com/my/avatar")) Rkis.pageName = "avatarpage";
else if (window.location.href.includes(".com/home")) Rkis.pageName = "home";
else if (window.location.href.includes(".com/catalog")) Rkis.pageName = "catalog";
else Rkis.pageName = "all";

const databaseLoading = Rkis.database.load();

//clear context menu items from other tabs
Rkis.contextMenu.handleContextMenu("clear");
window.addEventListener("blur", () => {
	Rkis.contextMenu.handleContextMenu("clear");
});

//Rkis.InjectFile(Rkis.fileLocation + "js/Main/Utility.js");
Rkis.InjectFile(Rkis.fileLocation + "js/Main/Inject.js");


/*//		Settings Structure
{
	id: "customrobux",
	overwrite: false,
	hidden: false,
	type: "switch", //text, check, color
	value: {
		switch: true
	},
	details: {
		default: "en",
		translate: { //optional
			name: "sectionCR",
			description: "sectionCR1",
			note: "sectionCR2"
		}
		"en": {
			name: "Custom Robux Text",
			description: "Changes robux text from top right",
			note: ""
		}
	}
}
*/


if (Rkis.ToastHolder == null || Rkis.ToastHolder == {}) {
	Rkis.ToastHolder = document.createElement("div");
	Rkis.ToastHolder.id = "rk-toastholder";
	Rkis.ToastHolder.style = "opacity: 0;min-width: 250px;background-color: #333;color: #fff;text-align: center;padding: 16px;position: fixed;z-index: 999999;left: 50%;transform: translate(-50%, 0);bottom: 0px;font-size: 17px;border-radius: 20px;box-shadow: black 0 0 16px;transition: all 200ms ease-in-out;pointer-events: none;";
	document.firstElementChild.appendChild(Rkis.ToastHolder);
};

//open=roblokis
(function () {
	let weburl = window.location.href;
	if (weburl.includes("open=roblokis")) {
		window.location.replace(weburl.split("roblox.com/")[0] + "roblox.com/roblokis");
	}
})();

//settings button
(async function () {
	let stng = await document.$watch("#navbar-settings").$promise();
	if (stng == null) return;

	stng.addEventListener("click", async () => {
		if (stng.getAttribute("aria-describedby") != null) return;

		let rkisbtn = document.createElement("li");
		rkisbtn.innerHTML = `<a class="rbx-menu-item roblokis-settings-button" href="https://${escapeHTML(Rkis.SubDomain)}.roblox.com/roblokis" style="color: rgb(255,64,64);">Roblokis</a>`;

		let doc = await document.$watch("#settings-popover-menu").$promise();
		if (doc == null || doc.querySelector(".roblokis-settings-button") != null) return;
		doc.insertBefore(rkisbtn, doc.firstElementChild);
	});

	Rkis.contextMenu.elementContextMenu(stng, "themetoggle", "Toggle Theme", () => {
		changeRobloxTheme(document.querySelector("body").classList.contains("light-theme") ? "Dark" : "Light")
	});
})();

//default features
(async function () {
	//Get default settings
	// let defaultSettings = await fetch(`https://ameerdotexe.github.io/roblokis/data/settings/default.json`)
	// 	.then(res => res.json()).catch(() => null);
	// ! TODO - switch to background fetch
	let defaultSettings = await BROWSER.runtime.sendMessage({about: 'getURLRequest', url: 'https://ameerdotexe.github.io/roblokis/data/settings/default.json'}).catch(() => null);
	if (defaultSettings == null) return;

	await databaseLoading;

	//Modify defaults without changing user's settings
	for (let settingName in defaultSettings) {
		let setting = defaultSettings[settingName];
		if (setting == null || typeof setting != "object" || setting.id == null) continue;

		if (setting.options?.deleted === true) {
			delete Rkis.wholeData[settingName];
			continue;
		}

		if (Rkis.wholeData[settingName] == null || typeof Rkis.wholeData[settingName] != "object") {
			Rkis.wholeData[settingName] = setting;
			continue;
		}

		Rkis.wholeData[settingName].options = setting.options;
		if (setting.details) Rkis.wholeData[settingName].details = setting.details;
	}

	//Save Modified Settings
	Rkis.database.save();
})();

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Function below is roblox's official theme changer simplified and integerated with roblokis
function changeRobloxTheme(themeType) {
	let types = {
		Classic: "light-theme",
		Dark: "dark-theme",
		Light: "light-theme"
	};
	let siteElement = [
		"#navigation-container",
		".container-main",
		"#chat-container", 
		".notification-stream-base",
		"#notification-stream-popover"
	];
	let newType = types[themeType];

	let hasBody = false;
	document.$watch('.rbx-body', (siteBody) => {
		hasBody = true;

		for (let type in types) {
			siteBody.classList.remove(types[type]);
		}

		siteBody.classList.add(newType);
	});

	siteElement.forEach(elemstr => {
		document.$watch(elemstr, (elem) => {
			for (let type in types) {
				elem.classList.remove(types[type]);
			}
			if (hasBody == true) return;
			elem.classList.add(newType);
		});
	});
}

databaseLoading.then(() => {
	Rkis.generalTriggerTheme = true;
	document.$triggerCustom("rk-general-trigger-theme");
	(function () {
		Rkis.language = Rkis.language || {};
		Rkis.language.get = (msg, txt1, txt2, txt3, txt4, txt5, txt6, txt7, txt8, txt9) => {
			if (Rkis.language[msg] == null) {
				if (console.error != null) console.error("G121: " + msg);
				return "Error";
			}
			return Rkis.language[msg].split("$1$").join(txt1).split("$2$").join(txt2).split("$3$").join(txt3).split("$4$").join(txt4).split("$5$").join(txt5).split("$6$").join(txt6).split("$7$").join(txt7).split("$8$").join(txt8).split("$9$").join(txt9);
		}
	
		let allCodes = {};
	
		document.$watchLoop("[data-translate]", (e) => {
			let place = e.dataset.translate;
			if (place == null || place == "") return;
			let valueText;
	
			if (Rkis.language[place] != null && Rkis.language[place] != "") {
				valueText = Rkis.language[place];
			}
			else {
	
				if (allCodes[place] != null)
					valueText = allCodes[place].message;
				if (valueText == null)
					valueText = getLocaleMessage(place, [
						e.dataset.translate1,
						e.dataset.translate2,
						e.dataset.translate3,
						e.dataset.translate4,
						e.dataset.translate5,
						e.dataset.translate6,
						e.dataset.translate7,
						e.dataset.translate8,
						e.dataset.translate9
					]);
	
				valueText.split("$").forEach((e, i) => {
					if (i == 0) return valueText = e;
	
					if ((i / 2).toString().includes(".")) valueText += `$${Math.floor(i / 2) + 1}$`;
					else valueText += e;
				})
			}
			if (valueText == null) return;
	
			valueText = valueText
				.split("$1$").join(e.dataset.translate1)
				.split("$2$").join(e.dataset.translate2)
				.split("$3$").join(e.dataset.translate3)
				.split("$4$").join(e.dataset.translate4)
				.split("$5$").join(e.dataset.translate5)
				.split("$6$").join(e.dataset.translate6)
				.split("$7$").join(e.dataset.translate7)
				.split("$8$").join(e.dataset.translate8)
				.split("$9$").join(e.dataset.translate9);
	
			valueText = escapeHTML(valueText);
	
			if (e.tagName == "INPUT") e.placeholder = valueText;
			else e.textContent = valueText;
		})
	
		if (Rkis.IsSettingEnabled("SiteLanguage", {
			id: "SiteLanguage",
			type: "switch",
			value: { switch: true },
			details: {
				default: "en",
				translate: {
					name: "sectionLSite",
					description: "sectionLSite1"
				},
				"en": {
					name: "Use Roblox language",
					description: "Limits Roblokis Language to Roblox Site Language."
				}
			}
		})) {
			Rkis.robloxCode = localStorage.getItem("RobloxLocaleCode") || "en";
			Rkis.roblokisCodes = { "pt": "pt_BR" };
	
			Rkis.languageCode = Rkis.robloxCode.split("_")[0];
			Rkis.languageCode = Rkis.roblokisCodes[Rkis.languageCode] || Rkis.languageCode;
	
			// fetch(Rkis.fileLocation + `_locales/${Rkis.languageCode}/messages.json`)
			// 	.then((res) => res.text())
			BROWSER.runtime.sendMessage({about: 'getURLRequest', url: Rkis.fileLocation + `_locales/${Rkis.languageCode}/messages.json`})
				.then((text) => {
					// if (rawtext == null || rawtext == "") return;
	
					// let text = null;
	
					// try { text = JSON.parse(rawtext); }
					// catch { console.error("Rkis | Couldn't Convert Data.", Rkis.fileLocation + `_locales/${Rkis.languageCode}/messages.json`, rawtext); text = null; }
	
					// if (text == null || text == {}) return;
					allCodes = text;
	
					for (var code in allCodes) {
						Rkis.language[code] = allCodes[code].message || Rkis.language[code];
	
						Rkis.language[code].split("$").forEach((e, i) => {
							if (i == 0) return Rkis.language[code] = e;
	
							if ((i / 2).toString().includes(".")) Rkis.language[code] += `$${Math.floor(i / 2) + 1}$`;
							else Rkis.language[code] += e;
						})
					}
				})
				.catch((err) => { console.error("Rkis", err) })
		}
	
		//Rkis.language[""] = chrome .i18n.getMessage("");
		let l = (msg) => {
			if (Rkis.language[msg] != null && Rkis.language[msg] != "") return;
			Rkis.languageCode = BROWSER.i18n.getUILanguage().replace('_');
	
			if (allCodes[msg] != null) Rkis.language[msg] = allCodes[msg].message;
			if (Rkis.language[msg] == null) Rkis.language[msg] = getLocaleMessage(msg, ["$1$", "$2$", "$3$", "$4$", "$5$", "$6$", "$7$", "$8$", "$9$"]);
	
			Rkis.language[msg].split("$").forEach((e, i) => {
				if (i == 0) return Rkis.language[msg] = e;
	
				if ((i / 2).toString().includes(".")) Rkis.language[msg] += `$${Math.floor(i / 2) + 1}$`;
				else Rkis.language[msg] += e;
			})
	
			Rkis.language[msg] = escapeJSON(Rkis.language[msg]);
		}
		//lc = (msg) => { Rkis.language = (msg, txt) => this.l.split("$1$").join(txt); Rkis.language[msg]["l"] = chrome .i18n.getMessage(msg, "$1$"); };
	
		l("errorCode");
		l("error");
		l("errorNameLength");
		l("errorDescLength");
		l("errorAtoZ");
		l("errorMaxSlots");
		l("errorNameExist");
		l("cantImage");
		l("errorNoImage");
	
		l("btnSaved");
		l("btnSave");//
		l("themeSlotNumber");
	
		l("copyTextSuccess");
		l("copyTextUnseccuss");
		l("cantCopyText");
	
		l("settingsPageTitle");//
		l("themeImport");
		l("themeBackground");
		l("themeCorners");
		l("themeBorders");
	
		l("badgeNoDescription");
		l("badgeNoName");//
		l("badgeRare");
		l("badgeLastWon");
		l("badgeWon");//
		l("badgeAchievedShort");
		l("badgeAchievedLong");
		l("badgeCreatedShort");
		l("badgeCreatedLong");
		l("badgeUpdatedShort");
		l("badgeUpdatedLong");
	
		l("joinButtons");
		l("sectionDApp");
	
		l("cancelRequest");
		l("canceledRequest");//
		l("lastGame");
		l("lastPlace");
		l("lastSeen");
		l("lastSeenLong");
	
		l("smallSection");
		l("slowServer");
		l("loadMore");
		l("joinPrivateServer");
		l("JoinPublicServer");
	})();

	document.$watch("body", (e) => {
		e.classList.add("Roblokis-installed");


		//CSS experiments
		(async function () {
			//apply external fixes
			Rkis.Designer.addCSS(["https://ameerdotexe.github.io/roblokis/data/remoteFixes.css"], true);

			//check if Rkis.wholeData.ExperimentsCSS has experiments enabled
			if (Rkis.wholeData.ExperimentsCSS instanceof Array && Rkis.wholeData.ExperimentsCSS.length > 0) {
				//get experimentsCSS from server
				let experimentsCSS = await BROWSER.runtime.sendMessage({about: 'getURLRequest', url: 'https://ameerdotexe.github.io/roblokis/data/experiments/css.json'}).catch(() => null);
				if (experimentsCSS == null || experimentsCSS.experimentsCSS == null) return;
				let experimentsList = experimentsCSS.experimentsCSS;

				//clear non-existant css from our list
				Rkis.wholeData.ExperimentsCSS = Rkis.wholeData.ExperimentsCSS.filter(experimentId => experimentsList[experimentId] != null);

				//apply experiments
				for (let index = 0; index < Rkis.wholeData.ExperimentsCSS.length; index++) {
					const experimentId = Rkis.wholeData.ExperimentsCSS[index];
					const experiment = experimentsList[experimentId];
					if (experiment == null || typeof experiment.cssUrl != "string") continue;
					if (experiment.filterUrls != null) {
						let foundMatch = false;
						for (let partIndex = 0; partIndex < experiment.filterUrls.length; partIndex++) {
							const urlPart = experiment.filterUrls[partIndex];
							if (!window.location.href.toLowerCase().includes(urlPart.toLowerCase())) continue;

							foundMatch = true;
							break;
						}
						if (foundMatch === false) continue;
					}

					Rkis.Designer.addCSS([experiment.cssUrl], true);
				}
			}
		})();
	});
	Rkis.generalLoaded = true;
	document.$triggerCustom("rk-general-loaded");
});


// CSS Functionality
document.$watchLoop(".rk-tab", (tab) => {
	if (tab.getAttribute("page") == null) return;
	if (tab.dataset.listening == "1") return;
	tab.dataset.listening = "1";

	const tabHolder = tab.parentElement;
	const pageHolder = tabHolder.parentElement.querySelector('.rk-tab-pages');

	tab.addEventListener("click", () => {
		if (tab.classList.contains("is-active")) return;

		tabHolder.$findAll(".rk-tab.is-active", (offtab) => { offtab.classList.remove("is-active"); });
		tab.classList.add("is-active");

		pageHolder.$findAll(".rk-tab-page.is-active", (page) => { page.classList.remove("is-active"); });
		pageHolder.$find(`.rk-tab-page[tab="${tab.getAttribute("page")}"]`, (page) => { page.classList.add("is-active"); });
	});
});
document.$watchLoop("[data-nav-page]", (tab) => {
	if (tab.dataset.listening == "1") return;
	tab.dataset.listening = "1";

	const popupElement = tab.closest('.rk-popup');

	tab.addEventListener("click", () => {
		if (tab.classList.contains("active")) return;

		popupElement.$findAll(".active[data-nav-page]", (offtab) => { offtab.classList.remove("active"); });
		tab.classList.add("active");

		popupElement.$findAll(".active[data-nav-tab]", (page) => { page.classList.remove("active"); });
		popupElement.$find(`[data-nav-tab="${tab.dataset.navPage}"]`, (page) => { page.classList.add("active"); });
	});
});


//Ameer's custom made API wrappers
//(Copyright) AmeerDotEXE. All rights reserved.
function getLocaleMessage(messageName, _substitutions) {
	let message = "";

	//fixes - Chrome max of 9 substitutions
	let substitutions = [];
	if (typeof _substitutions === 'object') substitutions = _substitutions.slice(0, 8);
	else if (typeof _substitutions === 'string') substitutions.push(_substitutions);

	//fixes - Edge strings only
	substitutions = substitutions.filter(x => typeof x === 'string');

	//fixes - Edge returns exception instead of empty string
	try {
		message = BROWSER.i18n.getMessage(messageName, substitutions);
	} catch {};

	// fixes - firefox 47- not returning empty string when not found
	if (message === "??") message = "";
	
	if (typeof message === 'undefined') message = "";

	//NOTE - 'message' might contain html excutable code
	//either add result in textContent or escape characters
	
	return message;
}