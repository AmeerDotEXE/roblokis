"use strict";
var Rkis = Rkis || {};

//To Do: wrap this whole file in 1 function


window.ContextScript = true;

let manifestData = chrome.runtime.getManifest();
Rkis.version = manifestData.version;

Rkis.id = chrome.runtime.id;
Rkis.fileLocation = `chrome-extension://${Rkis.id}/`;

//Rkis.InjectFile(Rkis.fileLocation + "js/Main/Utility.js");
Rkis.InjectFile(Rkis.fileLocation + "js/Main/Inject.js");

if(window.location.href.includes("/games/")) {
  Rkis.GameId = window.location.href.split("/games/")[1].split("/")[0];
  Rkis.pageName = "game";
}
else if(window.location.href.includes("/users/")) {
  Rkis.UserId = window.location.href.split("/users/")[1].split("/")[0];
  Rkis.pageName = "users";
}
else if(window.location.href.includes("/groups/")) {
  Rkis.GroupId = window.location.href.split("/groups/")[1].split("/")[0];
  Rkis.pageName = "groups";
}
else if(window.location.href.includes("/home")) Rkis.pageName = "home";
else Rkis.pageName = "all";

let wholedata = localStorage.getItem("Roblokis");
if(wholedata) wholedata = JSON.parse(wholedata) || {};

Rkis.wholeData = {...wholedata};
Rkis.SubDomain = (window.location.hostname.startsWith("web") == true ? "web" : "www");
Rkis.codeLoader = {save: {}, load: {}};

(function() {
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
	Rkis.GetSettingValue = function (setting) {
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
	}
	Rkis.GetSettingDetails = function (details) {
		if (details == null) return null;

		let code = details.default;
		if (details[Rkis.languageCode] != null) code = Rkis.languageCode;

		return details[code];
	}
	Rkis.IsSettingEnabled = function(setting, defaultSetting, callback) {
		if (typeof defaultSetting == "function") [callback, defaultSetting] = [defaultSetting, null];

		let rksetting = setting;
		if (typeof setting == "string") rksetting = Rkis.wholeData[setting];

		if (defaultSetting != null) {
			if (rksetting && rksetting.id == null) {
				if (typeof setting == "string") {
					let valueObject = {};

					if (typeof rksetting == "boolean") valueObject.switch = Rkis.wholeData[setting];
					else if (typeof rksetting == "string") valueObject.text = Rkis.wholeData[setting];

					if (valueObject == {}) Rkis.wholeData[setting] = {...defaultSetting};
					else Rkis.wholeData[setting] = {...defaultSetting, ...{value: valueObject}};
				}
				rksetting = Rkis.wholeData[setting];
				localStorage.setItem("Roblokis", JSON.stringify(Rkis.wholeData));
			}
			if (Rkis.wholeData[setting] != null) Rkis.wholeData[setting].details = defaultSetting.details;
			if (Rkis.wholeData[setting] == null) {
				Rkis.wholeData[setting] = {...defaultSetting};
				(() => {localStorage.setItem("Roblokis", JSON.stringify(Rkis.wholeData));})();
			}
		} else if (rksetting.id == null) Rkis.ErrorToast("Unregistered Feature: " + setting);

		if (setting.options && setting.options.disabled == true) return false;

		let value = Rkis.GetSettingValue(rksetting);
		let result = true;

		if (value == null || value == "" || value == false) { result = false; }
		if (result && callback != null) return callback.apply();
		return result;
	}
	Rkis.IsSettingDisabled = function(setting, defaultSetting, callback) {
		return Rkis.IsSettingEnabled(setting, defaultSetting, callback) == false;
	}
})();

(function() {
  Rkis.language = Rkis.language || {};
  Rkis.language.get = (msg, txt1, txt2, txt3, txt4, txt5, txt6, txt7, txt8, txt9) => {
	if (Rkis.language[msg] == null) {
		if (Rkis.ErrorToast != null) Rkis.ErrorToast("G121: "+msg);
		return "Error";
	}
	return Rkis.language[msg].split("$1$").join(txt1).split("$2$").join(txt2).split("$3$").join(txt3).split("$4$").join(txt4).split("$5$").join(txt5).split("$6$").join(txt6).split("$7$").join(txt7).split("$8$").join(txt8).split("$9$").join(txt9);
  }

  let allCodes = {};

  document.$watchLoop("[data-translate]", (e) => {
    let place = e.dataset.translate;
    if(place == null || place == "") return;
	let valueText;

    if(Rkis.language[place] != null && Rkis.language[place] != "") {
		valueText = Rkis.language[place];
	}
	else {

		valueText = chrome.i18n.getMessage(place, [ e.dataset.translate1, e.dataset.translate2, e.dataset.translate3, e.dataset.translate4, e.dataset.translate5, e.dataset.translate6, e.dataset.translate7, e.dataset.translate8, e.dataset.translate9 ]);
		valueText = (allCodes[place] != null ? (allCodes[place].message || valueText) : valueText);

		valueText.split("$").forEach((e, i) => {
		if(i == 0) return valueText = e;

		if((i / 2).toString().includes(".")) valueText += `$${Math.floor(i / 2) + 1}$`;
		else valueText += e;
		})
	}
	if (valueText == null) return;

    valueText = valueText.split("$1$").join(e.dataset.translate1).split("$2$").join(e.dataset.translate2).split("$3$").join(e.dataset.translate3).split("$4$").join(e.dataset.translate4).split("$5$").join(e.dataset.translate5).split("$6$").join(e.dataset.translate6).split("$7$").join(e.dataset.translate7).split("$8$").join(e.dataset.translate8).split("$9$").join(e.dataset.translate9);

    if(e.tagName == "INPUT") e.placeholder = valueText;
    else e.innerText = valueText;
  })

  if(Rkis.IsSettingEnabled("SiteLanguage", {
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
    Rkis.roblokisCodes = {"pt": "pt_BR"};

    Rkis.languageCode = Rkis.robloxCode.split("_")[0];
    Rkis.languageCode = Rkis.roblokisCodes[Rkis.languageCode] || Rkis.languageCode;

    fetch(Rkis.fileLocation + `_locales/${Rkis.languageCode}/messages.json`)
    .then((res) => res.text())
    .then((rawtext) => {
      if(rawtext == null || rawtext == "") return;

      let text = null;

      try { text = JSON.parse(rawtext); }
      catch { console.trace("Rkis | Couldn't Convert Data.", Rkis.fileLocation + `_locales/${Rkis.languageCode}/messages.json`, rawtext); text = null; }

      if(text == null || text == {}) return;
      allCodes = text;

      for (var code in allCodes) {
        Rkis.language[code] = allCodes[code].message || Rkis.language[code];
          
        Rkis.language[code].split("$").forEach((e, i) => {
          if(i == 0) return Rkis.language[code] = e;

          if((i / 2).toString().includes(".")) Rkis.language[code] += `$${Math.floor(i / 2) + 1}$`;
          else Rkis.language[code] += e;
        })
      }
    })
    .catch((err) => {console.error("Rkis", err)})
  }

  //Rkis.language[""] = chrome.i18n.getMessage("");
  let l = (msg) => {
    if(Rkis.language[msg] != null && Rkis.language[msg] != "") return;
	Rkis.languageCode = chrome.i18n.getUILanguage();

    Rkis.language[msg] = chrome.i18n.getMessage(msg, ["$1$", "$2$", "$3$", "$4$", "$5$", "$6$", "$7$", "$8$", "$9$"]);
    Rkis.language[msg] = (allCodes[msg] != null ? (allCodes[msg].message || Rkis.language[msg]) : Rkis.language[msg]);
        
    Rkis.language[msg].split("$").forEach((e, i) => {
      if(i == 0) return Rkis.language[msg] = e;

      if((i / 2).toString().includes(".")) Rkis.language[msg] += `$${Math.floor(i / 2) + 1}$`;
      else Rkis.language[msg] += e;
    })
  }
  //lc = (msg) => { Rkis.language = (msg, txt) => this.l.split("$1$").join(txt); Rkis.language[msg]["l"] = chrome.i18n.getMessage(msg, "$1$"); };

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
}());

(() => {
	//onload
	Rkis.OnReady = function (func) {
		document.addEventListener("readystatechange", function() {
		if(document.readyState != "complete") return;
		func();
		});
	};

	//delay
	Rkis.delay = function delay(ms) {
		return new Promise(resolve => {
		setTimeout(function() { return resolve(); }, ms);
		});
	}
})();

document.$watchLoop("loadcode", (e) => {
  let name = e.getAttribute("code");
  if (name == null || name == "") return Rkis.ErrorToast("G206");
  if (name.startsWith("edit") || name == "setupsize" || name == "loadedits" || name == "settingload") return;

  return Rkis.ErrorToast("G208, "+name);
});

//copy function
Rkis.CopyText = function (text) {
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
}

Rkis.GetTextFromLocalFile = function(filelocation) {
  return new Promise(resolve => {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", Rkis.fileLocation + filelocation, false);
    xmlhttp.send();

    resolve(xmlhttp.responseText);
  })
}

Rkis.Toast = function (text, ms) {
  if(Rkis.ToastHolder == null) {
    alert(text);
    return;
  }

  Rkis.ToastHolder.innerText = text;
  Rkis.ToastHolder.style.opacity = "1";
  Rkis.ToastHolder.style.bottom = "30px";
  setTimeout(() => {Rkis.ToastHolder.style.opacity = "0";Rkis.ToastHolder.style.bottom = "0px";}, ms || 4000)
}

Rkis.ErrorToast = function (text, ms) {
  if(Rkis.ToastHolder == null) {
    alert(`${Rkis.language["errorCode"]} ` + text);
    return;
  }

  Rkis.ToastHolder.innerText = text;
  Rkis.ToastHolder.innerHTML = `<span style='color:#f00;font-size:17px;'>${Rkis.language["errorCode"]}</span> ` + Rkis.ToastHolder.innerHTML;
  Rkis.ToastHolder.style.opacity = "1";
  Rkis.ToastHolder.style.bottom = "30px";
  setTimeout(() => {Rkis.ToastHolder.style.opacity = "0";Rkis.ToastHolder.style.bottom = "0px";}, ms || 4000)
}


if(Rkis.ToastHolder == null || Rkis.ToastHolder == {}) {
  Rkis.ToastHolder = document.createElement("div");
  Rkis.ToastHolder.id = "rk-toastholder";
  Rkis.ToastHolder.style = "opacity: 0;min-width: 250px;background-color: #333;color: #fff;text-align: center;padding: 16px;position: fixed;z-index: 999999;left: 50%;transform: translate(-50%, 0);bottom: 0px;font-size: 17px;border-radius: 20px;box-shadow: black 0 0 16px;transition: all 200ms ease-in-out;pointer-events: none;";
  document.firstElementChild.appendChild(Rkis.ToastHolder);
}

(function(){
  let weburl = window.location.href;
  if (weburl.includes("open=roblokis")) {
    window.location.replace(weburl.split("roblox.com/")[0] + "roblox.com/roblokis");
  }
}());

(async function() {
  let stng = await document.$watch("#navbar-settings").$promise();
  if(stng == null) return;

  stng.addEventListener("click", async () => {
    if(stng.getAttribute("aria-describedby") != null) return;

    let rkisbtn = document.createElement("li");
    rkisbtn.innerHTML = `<a class="rbx-menu-item roblokis-settings-button" href="https://${Rkis.SubDomain}.roblox.com/roblokis" style="color: rgb(255,64,64);">Roblokis</a>`;

    let doc = await document.$watch("#settings-popover-menu").$promise();
    if(doc == null || doc.querySelector(".roblokis-settings-button") != null) return;
    doc.insertBefore(rkisbtn, doc.firstElementChild);
  })
}());

(async function() {
	//Get default settings
	let defaultSettings = await fetch(`https://ameerdotexe.github.io/roblokis/data/settings/default.json`)
	.then(res => res.json()).catch(() => null);
	if (defaultSettings == null) return;

	//Modify defaults without changing user's settings
	for (let settingName in defaultSettings) {
		let setting = defaultSettings[settingName];
		if (setting == null || typeof setting != "object" || setting.id == null) continue;

		if (Rkis.wholeData[settingName] == null) {
			Rkis.wholeData[settingName] = setting;
			continue;
		}

		Rkis.wholeData[settingName].options = setting.options;
		Rkis.wholeData[settingName].details = setting.details;
	}

	//Save Modified Settings
	localStorage.setItem("Roblokis", JSON.stringify(Rkis.wholeData));
})();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

document.$watch("body", (e) => {e.classList.add("Roblokis-installed")});
Rkis.generalLoaded = true;
document.$triggerCustom("rk-general-loaded");


// CSS Functionality
document.$watchLoop(".rk-tab", (tab) => {
	if (tab.getAttribute("page") == null) return;
	if (tab.dataset.listening == "1") return;
	tab.dataset.listening = "1";
	
	const e = tab.closest(`*:has(.rk-tabs)`);

	tab.addEventListener("click", () => {
		if (tab.classList.contains("is-active")) return;

		e.$findAll(".rk-tab.is-active", (offtab) => {offtab.classList.remove("is-active");});
		tab.classList.add("is-active");

		e.$findAll(".rk-tab-page.is-active", (page) => {page.classList.remove("is-active");});
		e.$find(`.rk-tab-page[tab="${tab.getAttribute("page")}"]`, (page) => {page.classList.add("is-active");});
	});
});
document.$watchLoop("[data-nav-page]", (tab) => {
	if (tab.dataset.listening == "1") return;
	tab.dataset.listening = "1";

	const e = tab.closest(`*:has([data-nav-tab])`);

	tab.addEventListener("click", () => {
		if (tab.classList.contains("active")) return;

		e.$findAll(".active[data-nav-page]", (offtab) => {offtab.classList.remove("active");});
		tab.classList.add("active");

		e.$findAll(".active[data-nav-tab]", (page) => {page.classList.remove("active");});
		e.$find(`[data-nav-tab="${tab.dataset.navPage}"]`, (page) => {page.classList.add("active");});
	});
});