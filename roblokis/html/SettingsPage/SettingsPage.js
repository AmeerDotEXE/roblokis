"use strict";
var Rkis = Rkis || {};
var page = page || {};

function FetchImage(url, quick) {
	return new Promise(resolve => {
		BROWSER.runtime.sendMessage({about: "getImageRequest", url: url, quick: quick}, 
		function(data) {
			resolve(data)
		})
	})
}

page.setup = function () {
	document.querySelectorAll("button.main-save-button").forEach((e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		e.addEventListener("click", () => { page.save(e); });
	});
}

page.open = async function (pagetoopen, bypass) {
	if (document.querySelector(`[data-file="${pagetoopen}"]`) == null) return "404";

	var currentactivetab = document.querySelector("#vertical-menu > li.menu-option.active");
	if (bypass != true && currentactivetab.dataset.file == pagetoopen) return; //already on the page

	window.location.replace(window.location.href.split("#")[0] + "#!/" + pagetoopen); //change link
	currentactivetab.classList.remove("active"); //change tab

	document.querySelector(`[data-file="${pagetoopen}"]`).classList.add("active"); //make tab active

	var daplacetoload = $r("#rkpage ." + pagetoopen.toLowerCase().split(" ").join("-").split("/").join(" ."));
	if (daplacetoload == null) return console.error("SP42");
	try {
		document.$findAll(".tabcontent").forEach((e) => {
			e.classList.remove("active")
		})
		daplacetoload.classList.add("active");
		daplacetoload.$triggerCustom("script");
		//daplacetoload.inner HTML = await Rkis.GetTextFromLocalFile(`html/SettingsPage/Pages/${pagetoopen}.html`);
		//var scrpt0 = document.createElement("script");
		//scrpt0.src = Rkis.fileLocation + `html/SettingsPage/Pages/${pagetoopen}.js`;
		//daplacetoload.append(scrpt0);
		//eval(`(function() {`+await Rkis.GetTextFromLocalFile(`html/SettingsPage/Pages/${pagetoopen}.js`)+`})()`);
	} catch { }
	page.setup();
}

page.toggleSwich = function (swich, stat) {
	if (!swich) return null;

	if (stat == null) {
		stat = page.getSwich(swich) == false;
	}

	if (stat != null) {
		swich.classList.remove("on");
		swich.classList.remove("off");
		swich.classList.add(stat ? "on" : "off");

		swich.dispatchEvent(new Event('switched'));
		return stat;
	}

	return null;
}

page.getSwich = function (swich) {
	if (!swich) return null;

	if (swich.classList.contains("on")) return true;
	else if (swich.classList.contains("off")) return false;

	return null;
}

page.save = function (button) {

	document.querySelectorAll(".rk-button:not(.rk-input-bool)")
	.forEach((e) => {
		if (e.dataset.file == null) return;
		Rkis.wholeData[e.dataset.file] = page.getSwich(e);
	});

	document.querySelectorAll(".rk-textfield:not(.rk-input-string)")
	.forEach((e) => {
		if (e.dataset.file == null) return;
		Rkis.wholeData[e.dataset.file] = e.value.slice(0, 500);
	});
	
	document.querySelectorAll(".rk-input-string[data-file]")
	.forEach((e) => {
		if (e.dataset.file == '') return;

		var setting = Rkis.wholeData[e.dataset.file];
		if (setting && setting.options && setting.options.disabled == true) return;
		Rkis.wholeData[e.dataset.file].value[setting.type] = e.value.slice(0, 500);
	});

	document.querySelectorAll(".rk-input-bool[data-file]")
	.forEach((e) => {
		if (e.dataset.file == '') return;

		var setting = Rkis.wholeData[e.dataset.file];
		if (setting && setting.options && setting.options.disabled == true) return;
		Rkis.wholeData[e.dataset.file].value[setting.type] = page.getSwich(e);
	});

	Rkis.database.save().then(() => {
		button.textContent = Rkis.language["btnSaved"];
		setTimeout((btn) => { btn.textContent = Rkis.language["btnSave"]; }, 1000, button);
	});
}

page.E = "A";
page.Sports = "It's in the Game";

page.start = async function () {
	await document.$watch("#rkmainpage").$promise()
	if (await page.open(window.location.hash.split("#!/")[1], true) == "404") {
		if (await page.open(document.querySelector("#vertical-menu > li.menu-option.active").dataset.file, true) == "404") {
			page.open(document.querySelector("#vertical-menu > li.menu-option").dataset.file, true);
		}
	}

	document.querySelectorAll("#vertical-menu > li.menu-option").forEach((e) => {
		e.addEventListener("click", () => { page.open(e.dataset.file); });
	});
	
	var wholedata = Rkis.wholeData || {};

	document.$watchLoop(".rk-button:not(.rk-input-bool)", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		e.addEventListener("click", () => { page.toggleSwich(e); });
		if (e.dataset.file == null || wholedata[e.dataset.file] == null) return;
		//console.error(e.dataset.file+"is still using old load");
		page.toggleSwich(e, wholedata[e.dataset.file]);
	});

	document.$watchLoop(".rk-textfield:not(.rk-input-string)", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		if (e.dataset.file == null || wholedata[e.dataset.file] == null) return;
		//console.error(e.dataset.file+"is still using old load");
		e.value = wholedata[e.dataset.file];
	});

	document.$watchLoop(".rk-input-string", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		var setting = wholedata[e.dataset.file];

		if (e.dataset.file == null || setting == null || (setting.options && setting.options.disabled == true)) return;
		e.value = setting.value[setting.type];
	});

	document.$watchLoop(".rk-input-bool", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";
		
		var setting = wholedata[e.dataset.file];

		e.addEventListener("click", () => { page.toggleSwich(e); });
		if (e.dataset.file == null || setting == null || (setting.options && setting.options.disabled == true)) return;
		page.toggleSwich(e, setting.value[setting.type]);
	});
};

page.settingsWaitingForGeneral = function() {
	if (Rkis == null || Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			page.settingsWaitingForGeneral();
		}, {once: true});
		return;
	}
	
	//auto load feature names and description in about tab
	document.$watchLoop("loadcode", (element) => {
		var name = element.getAttribute("code");
		if (name == null || name == "") return console.error("SP127");

		switch (name.toLowerCase()) {
			default:
				return console.error(`Rkis | loadcode error` + name);
			case "settingload":
				var settingId = element.dataset.id;

				//get settings
				var setting = escapeJSON(Rkis.wholeData[settingId]);
				if (setting == null || typeof setting.type != "string") return;

				let canEdit = true;
				if (setting.options) {
					if (setting.options.hidden == true) return;
					setting.options.disabled == true && (canEdit = false);
				}

				var details = Rkis.GetSettingDetails(setting.details);
				var trDetails = setting.details.translate || {};

				//get structer depending on type
				var getStructureByType = {
					"text": 
						`<div class="section-content">
							<span class="text-lead" data-translate="${trDetails.name || ""}">${details.name || "Error: SP146"}</span>
							<input class="rk-input-string rk-textfield form-control input-field" placeholder="Leave empty for default" data-file="${setting.id}"${setting.options && setting.options.disabled == true ? " hidden" : ""}>
							<div class="rbx-divider" style="margin: 12px;"></div>
							<span class="text-description" data-translate="${trDetails.description || ""}">${details.description || "Error: SP149"}</span>
							<div style="color: red;" class="text-description" data-translate="${trDetails.note || ""}">${details.note || ""}</div>
						</div>`,
					"switch": 
						`<div class="section-content">
							<span class="text-lead" data-translate="${trDetails.name || ""}">${details.name || "Error: SP154"}</span>
							<span class="rk-input-bool rk-button receiver-destination-type-toggle on" data-file="${setting.id}"${setting.options && setting.options.disabled == true ? " hidden" : ""}>
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
							<div class="rbx-divider" style="margin: 12px;"></div>
							<span class="text-description" data-translate="${trDetails.description || ""}">${details.description || "Error: SP161"}</span>
							<div style="color: red;" class="text-description" data-translate="${trDetails.note || ""}">${details.note || ""}</div>
						</div>`
				};

				//console.log(setting, getStructureByType);

				//apply structer info from setting
				element.innerHTML = getStructureByType[setting.type];
				break;
			case "editelement":
				//onclick="hidethelem(this,event)" class="rk-popup-holder" style="z-index: 999;"
				element.addEventListener("click", function (e) {
					if (e.target == element) {
						document.$triggerCustom("closeedit", element.parentElement)
						element.style.display = "none";
					}
				})
				element.classList.add("rk-popup-holder");
				element.style.zIndex = "999";
				break;
			case "loadedits":
				function clearelemstyle(eto) {
					eto.style.background = "";
					eto.style.backgroundImage = "";
					eto.style.borderRadius = "";
					eto.style.border = "";
				}

				function CreateStyleformto(efrom, eto) {

					document.addEventListener("closeedit", function (event) {
						if (efrom != event.detail) return;
						run();
					})

					document.addEventListener("openedit", function (event) {
						$r.each(event.detail.children, function (x) { if (x == efrom.parentElement) run(); })
					})

					async function run() {
						var updatedtheme = {};
						var ismainsystem = efrom.classList.contains("mainpreview");

						var settingelements = efrom.querySelectorAll(`[data-location][data-type]`);
						for (var stnnum = 0; stnnum < settingelements.length; stnnum++) {
							var input = settingelements[stnnum];
							if (input.dataset.location == null || input.dataset.location == "") continue;

							var placewithoutdots = input.dataset.location.split(".");
							var place = updatedtheme;
							var newplace = updatedtheme;
							var stringplace = "null";

							for (var i = 0; i < placewithoutdots.length && newplace != null; i++) {
								if (ismainsystem == false && i == 0 && placewithoutdots[i] != "background") continue;
								newplace = newplace[placewithoutdots[i]];
							}

							for (var i = 0; i < placewithoutdots.length; i++) {
								if (ismainsystem == false && i == 0 && placewithoutdots[i] != "background") continue;
								stringplace = stringplace.replace("null", `{"${placewithoutdots[i]}":null}`);
							}

							var rgbTorgba = function (rgb, alpha) {
								var result = rgb.replace("rgb(", "rgba(");
								if (result.split(",").length > 3) result = result.split(",").slice(0, -1).join(",") + ")";
								return result.replace(")", `,${alpha}%)`);
							}

							var GetTypeValue = function (type, value, place) {
								if (type == null || type == "" || type == "value") return value;

								if (type == "color") return hexToRgb(value);
								if (type == "color-alpha") return place != null ? rgbTorgba(place, value) : value;

								if (type == "corner" && value == "-1") return null;
								if (type == "corner") return value + "px";

								if (type == "px") return value + "px";
								if (type == "percent") return value + "%";
							}

							var valueToInput = input.value;
							var valueData = GetTypeValue(input.dataset.type, valueToInput, newplace);

							stringplace = stringplace.replace("null", JSON.stringify(valueData));

							var jsonplace = null;

							try {
								jsonplace = JSON.parse(stringplace);
							}
							catch { }

							updatedtheme = jsonConcat(place, jsonplace);
						}

						var settingswitchs = efrom.querySelectorAll(`[data-location][data-enabled]`);
						for (var stnnum = 0; stnnum < settingswitchs.length; stnnum++) {
							var input = settingswitchs[stnnum];
							if (input.dataset.location == null) continue;

							if (input.classList.contains("on")) continue;

							if (updatedtheme == null) continue;

							var placewithoutdots = input.dataset.location.split(".");
							var place = updatedtheme;
							var stringplace = "null";

							for (var i = 0; i < placewithoutdots.length; i++) {
								if (ismainsystem == false && i == 0 && placewithoutdots[i] != "background") continue;
								stringplace = stringplace.replace("null", `{"${placewithoutdots[i]}":null}`);
							}

							var jsonplace = null;

							try {
								jsonplace = JSON.parse(stringplace);
							}
							catch { }

							updatedtheme = jsonConcat(place, jsonplace);
						}

						if (ismainsystem && efrom.dataset.type == "server") {
							var newlst = { ...updatedtheme.friendsserver };
							newlst = jsonConcat(newlst, updatedtheme.privateserver);
							newlst = jsonConcat(newlst, updatedtheme.defaultserver);
							updatedtheme = newlst;
						}

						function loasd(repet, elmsin, drctelm) {
							for (var elm in elmsin) {
								var selctd = { ...elmsin };
								var itmstoedit = [drctelm];

								if (elm != "background" && elm != "corners" && elm != "borders" && elm != "colors" && elm != "color" && repet == true) {
									if (drctelm.dataset.inside != null && drctelm.dataset.inside.includes(elm)) {
										selctd = selctd[elm];
										loasd(false, selctd, drctelm);
										continue;
									} else {
										itmstoedit = [];
										drctelm.querySelectorAll("[data-inside]").forEach(e => {
											if (e.dataset.inside.includes(elm)) itmstoedit.push(e);
										})

										selctd = selctd[elm];

										itmstoedit.forEach(e => { loasd(false, selctd, e); })
										continue;
									}
								}

								itmstoedit.forEach(elmnt => {
									if (elmnt == null) return;

									if (elm == "background") {
										if (selctd[elm] != null) {
											var bg = selctd.background;
											if (bg.color != null) {
												elmnt.style.backgroundColor = bg.color;
											}

											if (bg.image != null) {
												var img = bg.image;

												if (img.link != null && img.link != "") {
													//elmnt.style.backgroundImage = `url(${img.link})`;
													FetchImage(img.link).then((res) => {
														elmnt.style.backgroundImage = `url(${res})`;
													})
													// if ((
													// 	img.link.includes("rbxcdn.com") ||
													// 	img.link.includes("roblox.com") ||
													// 	img.link.includes("robloxlabs.com") ||
													// 	img.link.includes("i.ytimg.com") ||
													// 	img.link.includes("data:image/")
													// ) == false) {
													// 	Rkis.Toast("Background Images Can't Be Loaded in Preview Mode\nSave and Check it ", 6000);
													// }
												} else elmnt.style.backgroundImage = ``;

												// if (img.attachment != null)
												// 	elmnt.style.backgroundAttachment = img.attachment;

												if (img.size != null)
													elmnt.style.backgroundSize = img.size;

												if (img.repeat != null)
													elmnt.style.backgroundRepeat = img.repeat;
											}
										}
										else {
											elmnt.style.background = "";
											elmnt.style.backgroundImage = ``;
										}
									}

									if (elm == "corners") {
										if (selctd[elm] != null) {
											var cr = selctd.corners;
											if (cr.all != null && cr.all.radius != null)
												elmnt.style.borderRadius = `calc(${cr.all.radius} * 2 * var(--editor-size-percent))`;

											if (cr["bottom-left"] != null && cr["bottom-left"].radius != null)
												elmnt.style.borderBottomLeftRadius = cr["bottom-left"].radius;

											if (cr["bottom-right"] != null && cr["bottom-right"].radius != null)
												elmnt.style.borderBottomRightRadius = cr["bottom-right"].radius;

											if (cr["top-left"] != null && cr["top-left"].radius != null)
												elmnt.style.borderTopLeftRadius = cr["top-left"].radius;

											if (cr["top-right"] != null && cr["top-right"].radius != null)
												elmnt.style.borderTopRightRadius = cr["top-right"].radius;
										}
										else {
											elmnt.style.borderRadius = "";
										}
									}

									if (elm == "borders") {
										if (selctd[elm] != null) {
											var br = selctd.borders;
											if (br.all != null) elmnt.style.border = `${br.all.size} ${br.all.style} ${br.all.color}`;
											else elmnt.style.border = "";

											if (br.bottom != null) elmnt.style.borderBottom = `${br.bottom.size} ${br.bottom.style} ${br.bottom.color}`;
											else if (br.all == null) elmnt.style.borderBottom = "";

											if (br.left != null) elmnt.style.borderLeft = `${br.left.size} ${br.left.style} ${br.left.color}`;
											else if (br.all == null) elmnt.style.borderLeft = "";

											if (br.right != null) elmnt.style.borderRight = `${br.right.size} ${br.right.style} ${br.right.color}`;
											else if (br.all == null) elmnt.style.borderRight = "";

											if (br.top != null) elmnt.style.borderTop = `${br.top.size} ${br.top.style} ${br.top.color}`;
											else if (br.all == null) elmnt.style.borderTop = "";
										}
										else {
											elmnt.style.border = "";
										}
									}

									if (elm == "colors") {
										if (selctd[elm] != null) {
											var cl = selctd.colors;

											for (var clr in cl) {
												elmnt.querySelectorAll(".colors." + clr).forEach((e) => { e.style.color = cl[clr] })
											}
										}
										else {
											elmnt.querySelectorAll(".colors").forEach((e) => { e.style.color = "" })
											elmnt.querySelectorAll(".colors.dark").forEach((e) => { e.style.color = "#bdbebe" })
										}
									}

									if (elm == "color") {
										if (elmnt.classList.contains("color")) {
											if (selctd[elm] != null) {
												elmnt.style.color = selctd.color;
											}
											else {
												elmnt.style.color = "";
												if (elmnt.classList.contains("dark")) elmnt.style.color = "#bdbebe";
											}
										} else {
											if (selctd[elm] != null) {
												elmnt.querySelectorAll(".color").forEach((e) => { e.style.color = selctd.color })
											}
											else {
												elmnt.querySelectorAll(".color").forEach((e) => { e.style.color = "" })
												elmnt.querySelectorAll(".color.dark").forEach((e) => { e.style.color = "#bdbebe" })
											}
										}
									}
								})
							}
						}
						loasd(true, updatedtheme, eto);

						//console.log(updatedtheme);
					}

					run();

				}

				function editgroupingfunc(grb) {

					if (grb.children == null) return;

					$r.each(grb.children, function (e) {
						if (e.tagName == "LOADCODE") return;
						if (e.classList.contains("inner-group")) return editgroupingfunc(e);
						if (grb.classList.contains("inner-group")) grb = grb.parentElement;

						document.addEventListener("designer-edittheme-loading", function () {
							if (document.contains(e) == false) return;
							clearelemstyle(e);
						})
						document.addEventListener("designer-edittheme-loaded", function () {
							if (document.contains(e) == false) return;
							CreateStyleformto(grb, e);
						})
					})
				}

				var parent = element.parentElement.parentElement;
				if (parent.classList.contains("group")) {
					editgroupingfunc(parent);
				}
				else {
					document.addEventListener("designer-edittheme-loading", function () {
						if (document.contains(parent) == false) return;
						clearelemstyle(parent);
					})
					document.addEventListener("designer-edittheme-loaded", function () {
						if (document.contains(parent) == false) return;
						CreateStyleformto(parent, parent);
					})
				}
				break;
		}
	});

	document.$watch("#container-main > div.content > div.request-error-page-content", (err404) => err404.remove());

	document.$watch("#container-main > div.content", async (mainplace) => {

		mainplace.innerHTML = /*html*/`
		<div id="rkmainpage">
			<div id="rkmaintitle" style="text-align: center;font-weight: 800;font-size: 32px;margin: 1%;" data-translate="settingsPageTitle">Roblokis Settings Page</div>
			<div style="display: flex;justify-content: center;">
				<div class="left-navigation">

					<div data-translate="categoryMain">Main</div>
					<ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
							<li class="menu-option active" data-file="Main/About"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAbout">About</span> </a> </li>
							<li class="menu-option" data-file="Main/Changelog"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabChangelog">Changelog</span> </a> </li>
							<li class="menu-option" data-file="Main/All"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAll">All</span> </a> </li>
							<li class="menu-option" data-file="Main/Design"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabDesign">Design</span> </a> </li>
							<li class="menu-option" data-file="Main/Themes"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabThemes">Themes</span> </a> </li>
					</ul>

					<div data-translate="categoryGamePage">Game Page</div>
					<ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
							<li class="menu-option" data-file="GamePage/Badges"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabBadges">Badges</span> </a> </li>
							<li class="menu-option" data-file="GamePage/Servers"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabServers">Servers</span> </a> </li>
					</ul>

					<div data-translate="categoryProfiles">Profiles</div>
					<ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
							<li class="menu-option" data-file="Profiles/ProfilePage"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabProfilePage">Profile Page</span> </a> </li>
							<li class="menu-option" data-file="Profiles/FriendsPage"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabFriendsPage">Friends Page</span> </a> </li>
					</ul>
				
				</div>
				<div id="rkpage" style="margin: 0 0 0 1%;width: 60%;">
					<div class="main">
						<div class="tabcontent about">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabAbout">About</span></h3>

							<div class="section-content">
								<h4 data-translate="sectionWhatRkis">What is Roblokis?</h4>
								<div>
									<div data-translate="sectionWhatRkis1">Roblokis is a broswer extenstion made by Ameer! to make roblox easier to use and more accessable.</div><br>
									<a href="https://ameerdotexe.github.io/roblokis/" style="text-decoration: underline;" data-translate="sectionWhatRkis2">Click here for roblokis site and privacy policy.</a>
								</div>
							</div>

							<div class="section-content">
								<h4 data-translate="sectionHelpNeed">Help!</h4>
								<div>
									<div data-translate="sectionHelpNeed1">if the extension have problems you can contact me on discord:</div>
									<a href="https://discord.gg/uH47YYKEex">https://discord.gg/uH47YYKEex</a><br><br>
									<div data-translate="sectionHelpNeed2">or message me on Roblox (Ameer_Khalid):</div>
									<a href="https://www.roblox.com/messages/compose?recipientId=678363483">https://www.roblox.com/messages/compose?recipientId=678363483</a>
								</div>
							</div>

							<div class="section-content">
								<h4 data-translate="credits">Credits</h4>
								<div>
									<div data-translate="creditsTranslate">Translation By Ameer!</div>
								</div>
							</div>

							<div class="section-content">
								<h4 data-translate="sectionFeatures">Features:</h4>
								<span class="text-description" data-translate="sectionFeatures1">Stuff Roblokis Can do</span>
								<div class="rbx-divider" style="margin: 12px;"></div>
								<table class="table table-striped features-table" style="border-radius: 12px;">
									<thead>
										<tr style="color: white;font-size: 120%;display: contents;align-items: center;">
											<th style="padding: 23px 10px;"></th>
											<th style="color: #0ff;text-align: center;">Feature</th>
											<th style="color: #fc0;text-align: center;">Description</th>
										</tr>
									</thead>
									<tbody>
										${Object.values(Rkis.wholeData)
										.filter((setting) => setting != null && typeof setting == "object" && setting.id != null)
										.filter((setting) => setting.options && !setting.options.disabled && !setting.options.hidden && setting.options.main == true)
										.map((setting) => (`
										<tr>
											<td></td>
											<td class="text-lead" data-translate="${escapeHTML(setting.details.translate.name)}">${escapeHTML(setting.details[setting.details.default].name)}</td>
											<td class="text-description" data-translate="${escapeHTML(setting.details.translate.description)}">${escapeHTML(setting.details[setting.details.default].description)}</td>
										</tr>`)).join("")}
									</tbody>
								</table>
								<div class="rbx-divider" style="margin: 12px 0 0 0;"></div>
							</div>

							<div class="section-content">
								<h4>Roblokis Data</h4>
								<div>
									<button class="btn-control-sm" id="download-roblokis-data">Download</button>
									<button class="btn-control-sm" data-translate="btnDelete" id="delete-roblokis-data">Delete</button>
								</div>
							</div>
						</div>
						<div class="tabcontent all">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabAll">All</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="CustomRobux"></loadcode>
							<loadcode code="settingload" data-id="CustomName"></loadcode>

							<loadcode code="settingload" data-id="SiteLanguage"></loadcode>
							<loadcode code="settingload" data-id="QuickGameJoin"></loadcode>
							<loadcode code="settingload" data-id="DesktopApp"></loadcode>

							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="InfiniteGameScrolling"></loadcode>
						</div>
						<div class="tabcontent changelog">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabChangelog">Changelog</span></h3>
							
							<div class="section-content">
								<h4 data-translate="changelogGithubTitle">Moved to Github</h4>
								<div>
									<div data-translate="changelogGithubDescription">All changes are listed on our open source github repository.</div><br>
									<a href="https://github.com/AmeerDotEXE/roblokis/commits/release" style="text-decoration: underline;" data-translate="changelogGithubRedirection">Click here to view full changelog.</a>
								</div>	
							</div>
						</div>
						<div class="tabcontent design">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabDesign">Design</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<loadcode code="settingload" data-id="UseThemes"></loadcode>

							<div class="section-content">
								<span class="text-lead" data-translate="sectionAAnim">Allow animations?</span>
								<span class="rk-button receiver-destination-type-toggle off" data-file="BasicAnim">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</span>
								<div class="rbx-divider" style="margin: 12px;"></div>
								<span class="text-description" data-translate="sectionAAnim1">Some pages might have some animation effects. (Requires Themes Option)</span>
							</div>

							<loadcode code="settingload" data-id="ExtraShadows"></loadcode>

							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="StatusRing"></loadcode>
						</div>
						<div class="tabcontent themes">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabThemes">Themes</span></h3>

							<div id="rk-themesection">

								<div style="display: flex;flex-direction: column;text-align: center;background-color: rgb(114, 118, 122, 0.4);border-radius: 20px;padding: 1% 4%;box-shadow: 0 0 8px rgb(114, 118, 122, 0.4);margin: 9px 0;"><span style="color: white;" data-translate="themeSelected">Selected Theme</span><span id="currentthemeplace" class="text-description" data-translate="themeNotLoad">Not Loaded</span></div>

								<div class="section-content">
										<span style="font-weight: 700;" data-translate="themeDefaultSection">Default Themes:</span>
										<span class="text-description" data-translate="themeDefaultSection1">Comes with the extension...</span>
										<div class="rbx-divider" style="margin: 12px;"></div>

										<div class="default-theme-template">
											<div>
													<div>Default Dark Theme</div>
													<span>Simple Design made to match default roblox.</span>
											</div>
											<div style="margin-left: auto;"></div>
											<button class="designer-btn select" data-theme="Default Dark Theme" data-themeid="0" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
										</div>

										<div class="default-theme-template">
											<div>
													<div>Default Light Theme</div>
													<span>Simple Design made to match default roblox.</span>
											</div>
											<div style="margin-left: auto;"></div>
											<button class="designer-btn select" data-theme="Default Light Theme" data-themeid="1" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
										</div>

										<div class="rbx-divider" style="margin: 12px 0 0 0;"></div>
								</div>



								<div class="section-content">
										<span style="font-weight: 700;" data-translate="themeCustomSection">Custom Themes:</span>
										<span class="text-description" data-translate="themeCustomSection1">You use or create your own themes...</span>
										<div class="rbx-divider" style="margin: 12px;"></div>

										<div id="customthemesholder">
										</div>

										<div class="rbx-divider" style="margin: 12px 0 0 0;"></div>
								</div>

							</div>

							
							<div id="rk-createthemesection" class="rk-popup-holder" style="z-index: 10000;">
								<div class="rk-popup">
										<h3 data-translate="themeNewTitle">New Theme</h3>
										<div class="rk-page-tab">
											<div class="rk-tabs">
												<div class="rk-tab" page="emptytheme">Empty</div>
												<div class="rk-tab is-active" page="imagetheme">Image</div>
												<div class="rk-tab" page="importtheme">Import</div>
												<a class="rk-tab" href="https://ameerdotexe.github.io/roblokis/themes/top/" target="_blank">Browse</a>
											</div>
											<div class="rk-tab-pages">
												<div class="rk-tab-page" tab="emptytheme">
													<input id="newtheme-name" placeholder="Name" data-translate="themeName">
													<input id="newtheme-desc" placeholder="Description (Optional)" style="margin-bottom: 20px;" data-translate="themeDescription">
													<div id="newtheme-error" class="info" style="font-size: 12px;"></div>
													<div>
														<button onclick="document.querySelector('#rk-createthemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
														<button class="designer-btn createthetheme rk-createbtn" data-translate="btnCreate">Create</button>
													</div>
												</div>
												<div class="rk-tab-page is-active" tab="imagetheme">
													<input id="newtheme-name" placeholder="Name" data-translate="themeName">
													<input id="newtheme-desc" placeholder="Description (Optional)" style="margin-bottom: 20px;" data-translate="themeDescription">
													<input type="url" id="newtheme-image" placeholder="Image URL">
													<div id="newtheme-error" class="info" style="font-size: 12px;"></div>
													<div>
														<button onclick="document.querySelector('#rk-createthemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
														<button class="designer-btn createthetheme rk-createbtn" data-translate="btnCreate">Create</button>
													</div>
												</div>
												<div class="rk-tab-page" tab="importtheme">
													<input type="file" id="newtheme-file" accept=".roblokis" oninput="if(this.files.length > 0) this.parentElement.querySelector('label').textContent = this.files[0].name; else this.parentElement.querySelector('label').textContent = '${Rkis.language['themeImport']}'" hidden>
													<label id="newtheme-filename" for="newtheme-file" data-translate="themeImport">Import Theme</label>
													<div id="newtheme-error" class="info" style="font-size: 12px;">NOTE: Only "Pre-made" Roblokis themes are accepted.<br>For Images: Upload image online and use it's link instead!</div>
													<div>
														<button onclick="document.querySelector('#rk-createthemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
														<button class="designer-btn createthetheme rk-createbtn" data-translate="btnCreate">Create</button>
													</div>
												</div>
											</div>
										</div>
								</div>
							</div>


							<div id="rk-deletethemesection" class="rk-popup-holder" style="z-index: 5000;">
								<div class="rk-popup">
										<h3 data-translate="themeDeleteTitle">Delete Theme</h3>
										<div class="info">
											<span data-translate="themeDeleteText">Are You Sure on Deleting </span>
											<span id="deletetheme-themename"></span>
										</div>
										<div>
											<button onclick="document.querySelector('#rk-deletethemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
											<button class="designer-btn deletethetheme" id="deletetheme-button" data-themeid="" data-translate="btnDelete">Delete</button>
										</div>
								</div>
							</div>

							<div id="rk-editthemesection" class="rk-popup-holder" style="z-index: 1050;">
								<div class="rk-popup rk-scroll rk-flex-top rk-flex-row" style="align-items: unset;width: min(100%, 70rem);">
									<div class="rk-popup-navbar">
										<!--name & description-->

										<!--style manager-->

										<!--page list-->
										<div class="rk-flex rk-center-y">

											<ul class="menu-vertical submenus" role="tablist" style="border-radius: 10px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
											
												<li data-nav-page="details" class="designer-btn editortab menu-option" style="border-radius: 10px 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="editorInfoTab">Info</span> </a> </li>

												<li data-nav-page="pages" class="designer-btn editortab menu-option active" style="border-radius: 0 0 0 0px;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="editorPagesTab">Pages</span> </a> </li>
												<li data-nav-page="styles" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 10px;"> <a class="menu-option-content"> <span class="font-caption-header" data-trenslate="editorStylesTab">Styles</span> </a> </li>

											</ul>

										</div>

										<div class="rk-gap"></div>

										<div>
											<span class="text-lead" data-translate="editorlivepages">Live Pages.</span>
											<span class="rk-input-bool rk-button receiver-destination-type-toggle off" data-designer-func='livepreview'>
												<span class="toggle-flip"></span>
												<span class="toggle-on"></span>
												<span class="toggle-off"></span>
											</span>
											<div class="text-lead" style="font-size: 0.75em;color: red;" data-translate="experimental">(EXPERIMENTAL)</div>
										</div>

										<!--save button-->
										<div class="rk-flex rk-center-y" style="margin-top: 1rem;">

											<button onclick="document.querySelector('#rk-editthemesection').style.display = 'none';" class="rk-btn" data-translate="btnCancel">Close</button>

											<button class="rk-btn rk-green" data-designer-func="editorsave" data-translate="btnSave">Save</button>

										</div>
									</div>
									<div class="rk-popup-content" style="--editor-size-percent: 0.5;overflow: auto;">
										<style>

												/*Preview*/
												.group:hover > *:not(loadcode):not(.inner-group) {
													background-color: rgba(0, 255, 0, 0.2);
												}

												.group:hover > .dark {
													background-color: rgba(0, 128, 0, 0.4);
												}

												.group:hover > .inner-group > *:not(loadcode) {
													background-color: rgba(0, 255, 0, 0.2);
												}

												.group:hover > .inner-group > .dark {
													background-color: rgba(0, 128, 0, 0.4);
												}

												.selectable:hover {
													background-color: rgba(0, 255, 0, 0.2);
												}

												.selectable.dark:hover {
													background-color: rgba(0, 128, 0, 0.4);
												}

												*:has(> .selectable:hover) > .selectable:not(:hover),
												*:has(> .selectable:hover) > .group > *:not(:hover),
												*:has(> .group > *:hover) > .selectable:not(:hover),
												*:has(> .group > *:hover) > .group:not(:hover) > *:not(:hover) {
													filter: saturate(0.5) grayscale(1);
												}

												.recreate-background {
													width: 100%;
													height: 100%;
													position: absolute;
												}

												.recreate-content {
													background-color: rgba(0, 0, 0, 0.4);
													top: calc(60px * var(--editor-size-percent));
													left: 10%;
													height: calc(100% - calc(263px * var(--editor-size-percent)));
													width: 80%;
													position: absolute;
													border-radius: calc(20px * var(--editor-size-percent));
												}

												.recreate-menus {
													width: 100%;
													height: 100%;
												}

												.recreate-menus > *:not(loadcode) {
													background-color: rgba(0,0,0,0.4);
													position: absolute;
												}

												.recreate-topmenu {
													width: 100%;
													height: calc(40px * var(--editor-size-percent));
													border-radius: 0 0 calc(16px * var(--editor-size-percent)) calc(16px * var(--editor-size-percent));
												}

												.recreate-rightmenu {
													width: calc(175px * var(--editor-size-percent));
													height: 80%;
													border-radius: calc(20px * var(--editor-size-percent));
													margin: 1%;
													top: calc(40px * var(--editor-size-percent));
												}

												.recreate-bottommenu {
													border-radius: calc(60px * var(--editor-size-percent)) calc(60px * var(--editor-size-percent)) 0px 0px;
													width: 100%;
													height: calc(173px * var(--editor-size-percent));
													bottom: 0px;
												}

												.recreate-badge {
													background-color: rgba(0, 0, 0, 0.4);
													width: 80%;
													left: 10%;
													height: fit-content;
													position: relative;
													margin-bottom: 20px;
													border-radius: calc(20px * 2 * var(--editor-size-percent));

													display: flex;
													flex-direction: column;
													align-items: center;
													padding: calc(12px * 2 * var(--editor-size-percent));
												}

												.badge-content-data > li {
													display: flex;
													gap: 4%;
													justify-content: center;
												}

												.recreate-servers {
													background-color: rgba(0, 0, 0, 0.4);
													width: 80%;
													left: 10%;
													position: relative;
													margin-bottom: 20px;
													border-radius: calc(20px * 2 * var(--editor-size-percent));
													padding: calc(12px * 2 * var(--editor-size-percent));
												}

												.recreate-servers .section-right .avatar {
													top: 8px;
													width: calc(34px * 2 * var(--editor-size-percent));
													height: calc(34px * 2 * var(--editor-size-percent));
													display: inline-block;
													margin: 0px -10px 6px 0px;
												}

												.recreate-servers .section-right #rk-plr-counter.avatar {
													display: inline-grid;
													align-content: center;
													font-weight: bold;
													text-align: center;
													margin: 0px -8px 6px 0px;
												}

												.recreate-loadmore {
													padding: 2%;
													position: relative;
												}

												.recreate-profile {
													padding: 2%;
													position: relative;
													margin: 0 4% 4%;
													display: grid;
												}

												#profile-header-more {
													position: absolute;
													top: 0;
													right: 6px;
												}

												div.recreate-profile > div.profile-header-top > div.profile-avatar-image {
													position: relative;
													margin-right: calc(12px * 2 * var(--editor-size-percent));
													width: calc(128px * 2 * var(--editor-size-percent));
													height: calc(128px * 2 * var(--editor-size-percent));
													float: left;
												}

												div.recreate-profile > div.profile-header-top > div.header-caption {
													width: calc(100% - 128px - 24px * 2 * var(--editor-size-percent));
													height: calc(128px * 2 * var(--editor-size-percent));
													position: relative;
													float: left;
													display: flex;
													justify-content: space-between;
													flex-direction: column;
												}

												div.recreate-profile > div.profile-header-top > div.header-caption > div.header-details {
													position: relative;
													float: left;
													display: flex;
													align-items: center;
													justify-content: space-between;
													min-height: 35px;
												}

												div.recreate-profile > div.profile-header-top > div.header-caption > div.header-details > ul.details-info > li {
													float: left;
													display: flex;
													align-items: center;
													flex-direction: row-reverse;
													padding-right: 15px;
												}

												.recreate-group {
													padding: 2%;
													position: relative;
													margin: 0 4% 4%;
													display: grid;
												}

												div.group-header .group-caption {
													width: calc(100% - 156px * 2 * var(--editor-size-percent));
													position: relative;
													float: left;
													height: calc(128px * 2 * var(--editor-size-percent));
													display: flex;
													justify-content: space-between;
													flex-direction: column;
												}

												div.group-header .group-caption .group-name {
													max-width: 100%;
													padding: 0;
												}

												div.group-header .group-caption .group-info {
													width: 100%;
													position: relative;
													float: left;
													display: flex;
													align-items: center;
													justify-content: space-between;
													min-height: calc(35px * 2 * var(--editor-size-percent));
												}

												.group-header .group-caption .group-info .group-stats li {
													float: left;
													display: flex;
													align-items: center;
													padding-right: calc(15px * 2 * var(--editor-size-percent));
												}

												.group-header .group-caption .group-info .group-stats li .font-header-2 {
													margin-right: calc(6px * 2 * var(--editor-size-percent));
												}

												.text-overflow {
													overflow: hidden;
													text-overflow: ellipsis;
													white-space: nowrap;
												}

												.group-menu {
													position: absolute;
													top: 0;
													right: calc(6px * 2 * var(--editor-size-percent));
												}

												p.recreate-text-size,
												div.recreate-text-size,
												.recreate-profile .recreate-text-size,
												.recreate-text-size {
													font-size: calc(16px * 2 * var(--editor-size-percent));
												}

												p.recreate-12px-text-size,
												div.recreate-12px-text-size,
												.recreate-profile	.recreate-12px-text-size,
												.recreate-12px-text-size {
													font-size: calc(12px * 2 * var(--editor-size-percent));
												}

												.stack-header span.recreate-14px-text-size,
												div.recreate-14px-text-size,
												.recreate-14px-text-size {
													font-size: calc(175% * var(--editor-size-percent));
												}

												p.recreate-90p-text-size,
												div.recreate-90p-text-size,
												.recreate-90p-text-size {
													font-size: calc(90% * 2 * var(--editor-size-percent));
												}

												[data-editthemetabs] input:not([type="radio"]),
												[data-editthemetabs] select {
													margin: 0 3px 0 3px;
													border-radius: 8px;
													width: calc(100% - 10ch);
												}

												[data-editthemetabs] div > label.rk-label-input,
												[data-editthemetabs] button {
													border-radius: 8px;
													border-width: 1px;
													border-style: solid;
												}

												[data-editthemetabs] input:not([type="color"]),
												[data-editthemetabs] select {
													height: auto;
												}

												[data-editthemetabs] select,
												[data-editthemetabs] div > label.rk-label-input,
												[data-editthemetabs] button {
													background-color: rgba(0,0,0,.7);
													border-color: hsla(0,0%,100%,.2);
													color: #bdbebe;
													padding: 5px 12px;
												}

												.light-theme [data-editthemetabs] select {
													background-color: white;
													border-color: rgb(96 97 98 / 20%);
													color: rgb(96 97 98);
												}

												#themeedit-percent {
													border-radius: 8px;
													background-color: rgba(0,0,0,.7);
													border-color: hsla(0,0%,100%,.2);
													color: #bdbebe;
													padding: 5px 12px;
												}

												.light-theme #themeedit-percent {
													background-color: white;
													border-color: rgb(96 97 98 / 20%);
													color: rgb(96 97 98);
												}

												/*Tab Selection*/

												#rk-editthemesection .menu-option-content {
													padding: 9px;
												}

												.light-theme .rk-popup {
													background-color: rgb(242, 244, 245);
													box-shadow: 0 0 20px 2px white;
												}

												.designer-section {
													background-color: rgb(70 74 78);
												}

												.light-theme .designer-section {
													background-color: rgb(212 212 212);
												}

												/*test*/
												[data-editthemetabs],
												[data-component-holder] {
													display: flex;
													flex-direction: column;
													align-items: center;
												}

												/*Section Selection*/
												.accordion__input:checked ~ .accordion__label {
													color: rgba(255, 255, 255, 0.8);
												}

												.accordion__content {
													animation: fadeout 400ms ease-in-out;
													opacity: 0;
													display: none;
													background-color: rgb(35, 37, 39);
													border-radius: 20px;
													padding: 10px;
													margin-top: 10px;
												}

												.accordion__input:checked ~ .accordion__content {
													animation: fadein 400ms ease-in-out;
													opacity: 1;
													display: block;
												}

												@keyframes fadein {
													from {
															opacity: 0;
													}
													to {
															opacity: 1;
													}
												}

												@keyframes fadeout {
													from {
															opacity: 1;
													}
													to {
															opacity: 0;
													}
												}
										</style>
										
										<div data-nav-tab="details" data-editthemetabs="details">

											<div class="section-content" style="width: 100%;">
												<input class="form-control input-field" style="width: 100%;" placeholder="Name" id="rk-editor-name">
												<input class="form-control input-field" style="width: 100%;" placeholder="Description" id="rk-editor-desc">
												<div class="rbx-divider" style="margin: 12px;"></div>
												<div>
													<button style="width: calc(50% - 0.4rem);margin: auto;" class="rk-btn" id="rk-editor-theme-dark" data-translate="themeDark">Dark theme</button>
													<button style="width: calc(50% - 0.4rem);" class="rk-btn" id="rk-editor-theme-light" data-translate="themeLight">Light theme</button>
												</div>
											</div>

										</div>
										
										<div data-nav-tab="pages" data-editthemetabs="pages" data-head-component-id="pages" class="active" data-designer-func="add-edits">

											<button class="section-content rk-btn" style="width: 100%;" data-designer-func="add-edits-btn">Add Component</button>

										</div>
										
										<div data-nav-tab="styles" data-editthemetabs="styles" data-head-component-id="styles" data-designer-func="add-edits">

											<button class="section-content rk-btn" style="width: 100%;" data-designer-func="add-edits-btn">Add Component</button>

										</div>

									</div>
								</div>
							</div>
						
							<div id="rk-editthemesectionadding" class="rk-popup-holder" style="z-index: 1100;" data-designer-func="close-edit-adding">
								<div class="rk-popup" style="min-width: 25rem;">
										<h3 style="margin: 0;" data-translate="editorComponentAdding">Add Component</h3>
										<div class="rbx-divider" style="margin: 12px;width: 100%;"></div>
										<input class="form-control input-field" id="rk-search-component-list" placeholder="Search Components" data-translate="editorComponentSearching">
										<div class="rbx-divider" style="margin: 12px;width: 100%;"></div>
										<div class="rk-popup-content rk-scroll" id="rk-add-edits-list" style="padding: 1rem;width: calc(100% + 2rem);max-height: 40vh;">
										
										</div>
								</div>
							</div>

						</div>
					</div>
					<div class="gamepage">
						<div class="tabcontent badges">
							<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabBadges">Badges</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="Badges"></loadcode>
							<loadcode code="settingload" data-id="BadgesHidden"></loadcode>
						</div>
						<div class="tabcontent servers">
							<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="GameBannerToBackground"></loadcode>
							<loadcode code="settingload" data-id="ShowMaxPlayers"></loadcode>

							<div class="serversselector" style="margin: 6px;border-radius: 20px;border: 1px solid grey;padding: 6px 12px;display: flex;align-items: center;">
								<span style="width: 35%;" data-translate="chooseSection">Choose Section:</span>
								<select selected="" style="width: 100%;background-color: rgb(128 128 128 / 40%);padding: 6px;border-radius: 10px;border-right: 1px solid;border-bottom: 1px solid;">
										<option disabled value="" data-translate="chooseSelect">Click to Select</option>
										<option value="privateservers" data-translate="serversPrivate">Private Servers</option>
										<option hidden value="friendservers" data-translate="serversFriends">Friends Servers</option>
										<option value="smallservers" data-translate="serversSmall">Small Servers</option>
										<option value="publicservers" data-translate="serversPublic">Public Servers</option>
										<option hidden value="filteredservers" data-translate="serversFiltered">Filtered Servers</option>
								</select>
							</div>
							<div id="pageloadplace">
								<div class="serversection privateservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversPrivate">Private Servers</span></h3>

									<div class="section-content" hidden>
										<span class="text-lead" data-translate="sectionSLB">Server Link Button.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="PrivateServersLink"><span class="toggle-flip"></span><span class="toggle-on"></span><span class="toggle-off"></span></span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionSLB1">Shows a link button next to the join button and gives server's join link.</span>
									</div>

									<loadcode code="settingload" data-id="AvailPrivateServers"></loadcode>
									<loadcode code="settingload" data-id="ShowPrivateServers"></loadcode>
								</div>
								<div class="serversection friendservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversFriends">Friend Servers</span></h3>

									<div class="section-content">
										<span class="text-lead" data-translate="sectionRJB">Rename Join Button.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="FriendsServersText"><span class="toggle-flip"></span><span class="toggle-on"></span><span class="toggle-off"></span></span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionRJB1">Renames the join button to "Join Private Server" or "Join Public Server" according to the server.</span>
									</div>

									<div class="section-content" hidden>
										<span class="text-lead" data-translate="sectionSLB">Server Link Button.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="FriendsServersLink"><span class="toggle-flip"></span><span class="toggle-on"></span><span class="toggle-off"></span></span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionSLB1">Shows a link button next to the join button and gives server's join link.</span>
										<div class="text-description" style="color: red;" data-translate="sectionSLink">NOTE: Sharing the link won't work unless the person also have this extension!</div>
									</div>
								</div>
								<div class="serversection smallservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversSmall">Small Servers</span></h3>

									<loadcode code="settingload" data-id="SmallServer"></loadcode>
									<loadcode code="settingload" data-id="SmallServerLink"></loadcode>
								</div>
								<div class="serversection publicservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversPublic">Public Servers</span></h3>

									
									<loadcode code="settingload" data-id="PublicServersLink"></loadcode>
									<loadcode code="settingload" data-id="PageNav"></loadcode>
								</div>
							</div>
						</div>
					</div>
					<div class="profiles">
						<div class="tabcontent profilepage">
							<h3><span data-translate="categoryProfiles">Profiles</span> &gt; <span data-translate="tabProfilePage">Profile Page</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>
							
							<loadcode code="settingload" data-id="LastStats"></loadcode>
							<loadcode code="settingload" data-id="CancelPending"></loadcode>
						</div>
						<div class="tabcontent friendspage">
							<h3><span data-translate="categoryProfiles">Profiles</span> &gt; <span data-translate="tabFriendsPage">Friends Page</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="QuickRemove"></loadcode>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		var ttle = document.createElement("title");
		ttle.textContent = Rkis.language["settingsPageTitle"];

		document.firstElementChild.insertBefore(ttle, document.firstElementChild.firstElementChild);

		page.start();

		mainplace.querySelector(`#download-roblokis-data`).addEventListener('click', () => {
			let rawText = JSON.stringify(Rkis.wholeData);
			makeTextFile(rawText, 'Raw Roblokis Data.json');
		});
		mainplace.querySelector(`#delete-roblokis-data`).addEventListener('click', () => {
			let confirmation = confirm("WARNING: This can not be undone!\nContinuing will remove all your Roblokis information;\n-settings\n-themes\nare included, Continue?");
			if (confirmation === true) {
				Rkis.database.clearDatabase(confirmation);
				location.reload();
			}
		});

		mainplace.querySelector(`#rk-search-component-list`).addEventListener('input', (e) => {
			let componentList = mainplace.querySelectorAll(`#rk-add-edits-list > .add-components-card`);

			let input = e.target;
			let text = input.value.toLowerCase();

			componentList.forEach(x => {
				let title = x.querySelector(`div > div`).textContent.toLowerCase();
				let description = x.querySelector(`div > span`).textContent.toLowerCase();

				if (!(title.includes(text) || description.includes(text))) {
					x.style.display = 'none';
					return;
				}
				
				x.style.display = '';
			});
		});
	});
}

try {
	page.settingsWaitingForGeneral();
} catch (err) {
	if (err != null) {
		if (Rkis != null && Rkis.Toast != null) {
			Rkis.Toast('Error: '+ new String(err));
		} else {
			prompt(`A problem occured with Roblokis, Please report to the developers\nError Code:`, err.stack || new String(err));
		}
	}

	page.settingsWaitingForGeneral();
}