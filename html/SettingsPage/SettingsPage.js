"use strict";
var Rkis = Rkis || {};
var page = page || {};

function FetchImage(url, quick) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({about: "getImageRequest", url: url, quick: quick}, 
		function(data) {
			resolve(data)
		})
	})
}

page.setup = function () {
	var wholedata = Rkis.wholeData || {};

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
		//daplacetoload.innerHTML = await Rkis.GetTextFromLocalFile(`html/SettingsPage/Pages/${pagetoopen}.html`);
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

		return stat
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
	var wholedata = Rkis.wholeData || {};

	var buttons = document.querySelectorAll(".rk-button:not(.rk-input-bool)");
	buttons.forEach((e) => {
		if (e.dataset.file == null) return;
		wholedata[e.dataset.file] = page.getSwich(e);
	});

	var textfields = document.querySelectorAll(".rk-textfield:not(.rk-input-string)");
	textfields.forEach((e) => {
		if (e.dataset.file == null) return;
		wholedata[e.dataset.file] = e.value;
	});
	
	var textfields = document.querySelectorAll(".rk-input-string");
	textfields.forEach((e) => {
		if (e.dataset.file == null) return;

		var setting = wholedata[e.dataset.file];
		if (setting.options && setting.options.disabled == true) return;
		wholedata[e.dataset.file].value[setting.type] = e.value;
	});

	var buttons = document.querySelectorAll(".rk-input-bool");
	buttons.forEach((e) => {
		if (e.dataset.file == null) return;
		
		var setting = wholedata[e.dataset.file];
		if (setting.options && setting.options.disabled == true) return;
		wholedata[e.dataset.file].value[setting.type] = page.getSwich(e);
	});

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

	button.innerText = Rkis.language["btnSaved"];
	setTimeout((btn) => { btn.innerText = Rkis.language["btnSave"]; }, 1000, button);
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
				var setting = Rkis.wholeData[settingId];
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
			case "editbackground":
				var loc = element.dataset.location;
				if (loc == null || loc == "") return;

				var togglebtn = (element.dataset.togglebtn == "on" ? "" : 'style="display: none;"');

				element.innerHTML += `
				<div class="section-content">
					<div style="display: flex;justify-content: space-between;align-items: center;">
						<h4 style="width: fit-content;" data-translate="themeBackground">${element.dataset.title || '${Rkis.language["themeBackground"]}'}</h4>
						<span data-location="${loc}" data-enabled="switch" class="rk-button receiver-destination-type-toggle ${element.dataset.toggle || 'on'}" ${togglebtn}>
							<span class="toggle-flip"></span>
							<span class="toggle-on"></span>
							<span class="toggle-off"></span>
						</span>
					</div>


					<div style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin-right: 5px;" data-translate="themeColor">Color:</span><input type="color" value="#232527" data-location="${loc}.color" data-type="color" class="form-control input-field"></div>

					<div style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin-right: 5px;" data-translate="themeAlpha">Alpha:</span><input type="range" value="100" step="10" data-location="${loc}.color" data-type="color-alpha" class="form-control input-field"></div>


					<div class="rbx-divider" style="margin: 12px;"></div>


					<div style="display: flex;align-items: center;justify-content: space-between;">
						<span style="min-width: fit-content;margin-right: 5px;" data-translate="themeLink">File:</span>
						<input type="url" value="" data-location="${loc}.image.link" data-type="value" class="form-control input-field">
					</div>

					<div style="display: flex;align-items: center;justify-content: space-between;">
						<span data-translate="themeSize">Size:</span>
						<select selected="contain" data-location="${loc}.image.size" data-type="value">
							<option value="contain" data-translate="themeFillX">Fill X</option>
							<option value="cover" data-translate="themeFillY">Fill Y</option>
							<option value="auto" data-translate="themeAuto">Auto</option>
						</select>
					</div>

					<div style="display: flex;align-items: center;justify-content: space-between;">
						<span data-translate="themeRepeatT">Repeat:</span>
						<select selected="round" data-location="${loc}.image.repeat" data-type="value">
							<option value="round" data-translate="themeRound">Round</option>
							<option value="repeat" data-translate="themeRepeat">Repeat</option>
							<option value="space" data-translate="themeSpace">Space</option>
							<option value="no-repeat" data-translate="themeNoRepeat">No Repeat</option>
						</select>
					</div>

					<div style="display: flex;align-items: center;justify-content: space-between;">
						<span data-translate="themeScroll">Scroll:</span>
						<select selected="fixed" data-location="${loc}.image.attachment" data-type="value">
							<option value="fixed" data-translate="themeEnabled">Enabled</option>
							<option value="scroll" data-translate="themeDisabled">Disabled</option>
						</select>
					</div>

				</div>`;
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
			case "editcorners":
				var loc = element.dataset.location;
				if (loc == null || loc == "") return;

				var togglebtn = (element.dataset.togglebtn == "on" ? "" : 'style="display: none;"');

				element.innerHTML += `
				<div class="section-content">
						<div style="display: flex;justify-content: space-between;align-items: center;">
							<h4 style="width: fit-content;margin-right: 10px;" data-translate="themeCorners">${element.dataset.title || '${Rkis.language["themeCorners"]}'}</h4>
							<span data-location="${loc}.corners" data-enabled="switch" class="rk-button receiver-destination-type-toggle ${element.dataset.toggle || 'on'}" ${togglebtn}>
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
							</span>
						</div>

						<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin-right: 5px;" data-translate="themeAllCorners">All Corners:</span><input type="range" value="0" data-location="${loc}.corners.all.radius" data-type="corner" class="form-control input-field" max="20" min="0"></div>

						<div class="rbx-divider" style="margin: 12px;"></div>

						<div class="text-lead"><div style="text-align: center;" data-translate="themeTLCorner">Top-Left Corner</div><input type="range" value="-1" data-location="${loc}.corners.top-left.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20px);margin: 10px;"></div>

						<div class="text-lead"><div style="text-align: center;" data-translate="themeTRCorner">Top-Right Corner</div><input type="range" value="-1" data-location="${loc}.corners.top-right.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20px);margin: 10px;"></div>

						<div class="text-lead"><div style="text-align: center;" data-translate="themeBRCorner">Bottom-Right Corner</div><input type="range" value="-1" data-location="${loc}.corners.bottom-right.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20px);margin: 10px;"></div>

						<div class="text-lead"><div style="text-align: center;" data-translate="themeBLCorner">Bottom-Left Corner</div><input type="range" value="-1" data-location="${loc}.corners.bottom-left.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20px);margin: 10px;"></div>

				</div>`;
				break;
			case "editborders":
				var loc = element.dataset.location;
				if (loc == null || loc == "") return;

				var togglebtn = (element.dataset.togglebtn == "on" ? "" : 'style="display: none;"');

				element.innerHTML += `
				<div class="section-content" style="min-width: 260px;">
						<div style="display: flex;justify-content: space-between;align-items: center;">
							<h4 style="width: fit-content;" data-translate="themeBorders">${element.dataset.title || '${Rkis.language["themeBorders"]}'}</h4>
							<span data-location="${loc}.borders.all" data-enabled="switch" class="rk-button receiver-destination-type-toggle ${element.dataset.toggle || 'on'}" ${togglebtn}>
							<span class="toggle-flip"></span>
							<span class="toggle-on"></span>
							<span class="toggle-off"></span>
							</span>
						</div>
						<div>
							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeWidth">Width:</span><input type="range" value="0" data-location="${loc}.borders.all.size" data-type="px" class="form-control input-field" max="10"></div>
							<div style="display: flex;align-items: center;justify-content: space-between;">
									<span data-translate="themeStyle">Style:</span>
									<select selected="solid" data-location="${loc}.borders.all.style" data-type="value">
										<option value="solid" data-translate="themeSolid">Solid</option>
										<option value="double" data-translate="themeDouble">Double</option>
										<option value="dashed" data-translate="themeDashed">Dashed</option>
										<option value="dotted" data-translate="themeDotted">Dotted</option>
										<option value="inset" data-translate="themeInset">Inset</option>
										<option value="outset" data-translate="themeOutset">Outset</option>
										<option value="groove" data-translate="themeGroove">Groove</option>
										<option value="ridge" data-translate="themeRidge">Ridge</option>
									</select>
							</div>
							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeColor">Color:</span><input type="color" value="#ffffff" data-location="${loc}.borders.all.color" data-type="color" class="form-control input-field"></div>
							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeAlpha">Alpha:</span><input type="range" value="100" step="10" data-location="${loc}.borders.all.color" data-type="color-alpha" class="form-control input-field"></div>
						</div>
						<div class="rbx-divider" style="margin: 12px;"></div>

						<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
							<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
							<label class="accordion__label" style="font-weight: 400;" data-translate="themeTBorder">Top Border</label>

							<span data-location="${loc}.borders.top" data-enabled="switch" class="rk-button receiver-destination-type-toggle off" style="float: right;">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
							</span>
							<div class="accordion__content">
									<div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeWidth">Width:</span><input type="range" value="0" data-location="${loc}.borders.top.size" data-type="px" class="form-control input-field" max="10"></div>
										<div style="display: flex;align-items: center;justify-content: space-between;">
												<span data-translate="themeStyle">Style:</span>
												<select selected="solid" data-location="${loc}.borders.top.style" data-type="value">
													<option value="solid" data-translate="themeSolid">Solid</option>
													<option value="double" data-translate="themeDouble">Double</option>
													<option value="dashed" data-translate="themeDashed">Dashed</option>
													<option value="dotted" data-translate="themeDotted">Dotted</option>
													<option value="inset" data-translate="themeInset">Inset</option>
													<option value="outset" data-translate="themeOutset">Outset</option>
													<option value="groove" data-translate="themeGroove">Groove</option>
													<option value="ridge" data-translate="themeRidge">Ridge</option>
												</select>
										</div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeColor">Color:</span><input type="color" value="#ffffff" data-location="${loc}.borders.top.color" data-type="color" class="form-control input-field"></div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeAlpha">Alpha:</span><input type="range" value="100" step="10" data-location="${loc}.borders.top.color" data-type="color-alpha" class="form-control input-field"></div>
									</div>
							</div>
						</div>

						<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
							<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
							<label class="accordion__label" style="font-weight: 400;" data-translate="themeLBorder">Left Border</label>

							<span data-location="${loc}.borders.left" data-enabled="switch" class="rk-button receiver-destination-type-toggle off" style="float: right;">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
							</span>
							<div class="accordion__content">
									<div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeWidth">Width:</span><input type="range" value="0" data-location="${loc}.borders.left.size" data-type="px" class="form-control input-field" max="10"></div>
										<div style="display: flex;align-items: center;justify-content: space-between;">
												<span data-translate="themeStyle">Style:</span>
												<select selected="solid" data-location="${loc}.borders.left.style" data-type="value">
													<option value="solid" data-translate="themeSolid">Solid</option>
													<option value="double" data-translate="themeDouble">Double</option>
													<option value="dashed" data-translate="themeDashed">Dashed</option>
													<option value="dotted" data-translate="themeDotted">Dotted</option>
													<option value="inset" data-translate="themeInset">Inset</option>
													<option value="outset" data-translate="themeOutset">Outset</option>
													<option value="groove" data-translate="themeGroove">Groove</option>
													<option value="ridge" data-translate="themeRidge">Ridge</option>
												</select>
										</div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeColor">Color:</span><input type="color" value="#ffffff" data-location="${loc}.borders.left.color" data-type="color" class="form-control input-field"></div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeAlpha">Alpha:</span><input type="range" value="100" step="10" data-location="${loc}.borders.left.color" data-type="color-alpha" class="form-control input-field"></div>
									</div>
							</div>
						</div>

						<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
							<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
							<label class="accordion__label" style="font-weight: 400;" data-translate="themeBBorder">Bottom Border</label>

							<span data-location="${loc}.borders.bottom" data-enabled="switch" class="rk-button receiver-destination-type-toggle off" style="float: right;">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
							</span>
							<div class="accordion__content">
									<div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeWidth">Width:</span><input type="range" value="0" data-location="${loc}.borders.bottom.size" data-type="px" class="form-control input-field" max="10"></div>
										<div style="display: flex;align-items: center;justify-content: space-between;">
												<span data-translate="themeStyle">Style:</span>
												<select selected="solid" data-location="${loc}.borders.bottom.style" data-type="value">
													<option value="solid" data-translate="themeSolid">Solid</option>
													<option value="double" data-translate="themeDouble">Double</option>
													<option value="dashed" data-translate="themeDashed">Dashed</option>
													<option value="dotted" data-translate="themeDotted">Dotted</option>
													<option value="inset" data-translate="themeInset">Inset</option>
													<option value="outset" data-translate="themeOutset">Outset</option>
													<option value="groove" data-translate="themeGroove">Groove</option>
													<option value="ridge" data-translate="themeRidge">Ridge</option>
												</select>
										</div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeColor">Color:</span><input type="color" value="#ffffff" data-location="${loc}.borders.bottom.color" data-type="color" class="form-control input-field"></div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeAlpha">Alpha:</span><input type="range" value="100" step="10" data-location="${loc}.borders.bottom.color" data-type="color-alpha" class="form-control input-field"></div>
									</div>
							</div>
						</div>

						<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
							<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
							<label class="accordion__label" style="font-weight: 400;" data-translate="themeRBorder">Right Border</label>

							<span data-location="${loc}.borders.right" data-enabled="switch" class="rk-button receiver-destination-type-toggle off" style="float: right;">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
							</span>
							<div class="accordion__content">
									<div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeWidth">Width:</span><input type="range" value="0" data-location="${loc}.borders.right.size" data-type="px" class="form-control input-field" max="10"></div>
										<div style="display: flex;align-items: center;justify-content: space-between;">
												<span data-translate="themeStyle">Style:</span>
												<select selected="solid" data-location="${loc}.borders.right.style" data-type="value">
													<option value="solid" data-translate="themeSolid">Solid</option>
													<option value="double" data-translate="themeDouble">Double</option>
													<option value="dashed" data-translate="themeDashed">Dashed</option>
													<option value="dotted" data-translate="themeDotted">Dotted</option>
													<option value="inset" data-translate="themeInset">Inset</option>
													<option value="outset" data-translate="themeOutset">Outset</option>
													<option value="groove" data-translate="themeGroove">Groove</option>
													<option value="ridge" data-translate="themeRidge">Ridge</option>
												</select>
										</div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeColor">Color:</span><input type="color" value="#ffffff" data-location="${loc}.borders.right.color" data-type="color" class="form-control input-field"></div>
										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span data-translate="themeAlpha">Alpha:</span><input type="range" value="100" step="10" data-location="${loc}.borders.right.color" data-type="color-alpha" class="form-control input-field"></div>
									</div>
							</div>
						</div>

				</div>`;
				break;
			case "editsectioncheckbox":
				var id = element.dataset.id;
				if (id == null || id == "") return;

				element.innerHTML = `
				<div class="section-content">
						<input type="checkbox" class="accordion__input" id="${id}sectioncheckbox" style="display: none;">
						<label for="${id}sectioncheckbox" class="accordion__label" style="text-align: center;font-weight: 600;font-size: calc(20px + 10%);display: block;" data-translate="themeSection">${element.dataset.title || '${Rkis.language["themeSection"]}'}</label>
						<div class="accordion__content">

							${element.innerHTML}

						</div>
				</div>`;
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
			case "setupsize":
				var loc = element.dataset.size;
				if (loc == null || loc == "") return;

				var parent = element.parentElement;
				var percent = 100;

				var size = document.querySelector("#themeedit-resulution");
				if (size == null) {
					var temp = loc.split("x");
					var tempw = temp[0];
					var temph = temp[1];

					tempw = tempw.split("$").join(`100%`);
					temph = temph.split("$").join(`clamp(10rem, 40vh, 30rem)`);

					parent.style.width = tempw;
					parent.style.height = temph;

					element.remove();
					return;
				}

				parent.style.setProperty("--editor-size-percent", percent / 100);

				var percentdiv = document.querySelector("#themeedit-percent");
				if (percentdiv != null) {
					percent = Number(percentdiv.value);
					parent.style.setProperty("--editor-size-percent", percent / 100);
					percentdiv.addEventListener("input", () => {
						percent = Number(percentdiv.value);
						parent.style.setProperty("--editor-size-percent", percent / 100);
					})
				}

				size.addEventListener("input", editwindow);

				function editwindow() {
					var sizes = size.value.split(" ").join("").split("x");
					if (sizes[1] == null) sizes[1] = 200
					sizes.forEach((e, i) => {
						e = e.split(".")[0];
						if (isNaN(Number(e)) == false) {
							var num = Number(e);
							if (num < 200) num = 200;
							if (num > 5000) num = 5000;
							sizes[i] = num
						}
						else sizes[i] = 200;
					})

					var temp = loc.split("x");
					var tempw = temp[0];
					var temph = temp[1];

					tempw = tempw.split("$").join(`calc(${sizes[0]}px * var(--editor-size-percent))`);
					temph = temph.split("$").join(`calc(${sizes[1]}px * var(--editor-size-percent))`);

					parent.style.width = tempw;
					parent.style.height = temph;
				}

				editwindow();

				element.remove();
				break;
		}
	});

	document.$watch("#container-main > div.content > div.request-error-page-content", (err404) => err404.remove());

	document.$watch("#container-main > div.content", async (mainplace) => {

		mainplace.innerHTML = `
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
									<a href="https://ameerdotexe.github.io/roblokis/" data-translate="sectionWhatRkis2">Click here for roblokis site and privacy policy.</a>
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
											<td class="text-lead" data-translate="${setting.details.translate.name}">${setting.details[setting.details.default].name}</td>
											<td class="text-description" data-translate="${setting.details.translate.description}">${setting.details[setting.details.default].description}</td>
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
						</div>
						<div class="tabcontent changelog">
							<h3>Main &gt; Changelog</h3>
							
							<div class="section-content">
								<h4>Roblokis V4 Pre-Release</h4>
								<div>
										Rebuild Roblokis from zero Again Again
								</div><br>
								<ul style="padding-left: 5%;">
									<li style="list-style: disc;">This is an Early Release</li>
									<li style="list-style: disc;">Fixed Bugs</li>
								</ul>	
							</div>

							<div class="section-content">
								<h4>Roblokis V3.1.2.2</h4>
								<div>
										Rebuild Roblokis from zero Again
								</div><br>
								<ul style="padding-left: 5%;">
									<li style="list-style: disc;">Roblokis now loads faster</li>
									<li style="list-style: disc;">added animations</li>
									<li style="list-style: disc;">new themes</li>
									<li style="list-style: disc;">new theme designer</li>
									<li style="list-style: disc;">improved speed of every feature by 1.5x to 10x</li>
									<li style="list-style: disc;">added roblokis button in settings</li>
									<li style="list-style: disc;">Server, badges, etc. styles will load instantly</li>
									<li style="list-style: disc;">added option to disable themes</li>
									<li style="list-style: disc;">added support for BTRoblox, RoPro, RoGold, Roblox+</li>
									<li style="list-style: disc;">Changed default theme to match default site</li>
									<li style="list-style: disc;">fixed logout button not working</li>
									<li style="list-style: disc;">fixed link copying, quick join buttons and more stuff</li>
									<li style="list-style: disc;">added language support & option to limit it</li>
									<li style="list-style: disc;">added light theme support & added default light theme</li>
									<li style="list-style: disc;">fixed public servers pager</li>
									<li style="list-style: disc;">fixed spanish translation problem</li>
									<li style="list-style: disc;">added maximum players number option</li>
									<li style="list-style: disc;">fixed and disabled some features after site update</li>
									<li style="list-style: disc;">randomized the rotation of the quick join button</li>
									<li style="list-style: disc;">fixed extension goig down by the lastest chrome update</li>
								</ul>	
							</div>

							<div class="section-content">
								<h4>Roblokis V2.6.3.2</h4>
								<div>
										added new features<br>
										fixed a lot of stuff
								</div><br>
								<ul style="padding-left: 5%;">
									<li style="list-style: disc;">quick join button in all tab</li>
									<li style="list-style: disc;">fixed settings page not showing for some people</li>
									<li style="list-style: disc;">fixed some fetching & searching errors</li>
									<li style="list-style: disc;">added loading cubes for small servers section</li>
									<li style="list-style: disc;">fixed public links not working</li>
									<li style="list-style: disc;">added badge achieve date</li>
									<li style="list-style: disc;">added last seen & last place on profiles</li>
									<li style="list-style: disc;">fixed "web" and "www" mistakes</li>
									<li style="list-style: disc;">Roblox status are back</li>
									<li style="list-style: disc;">fixed removing friend not show on profile page</li>
									<li style="list-style: disc;">fixed overflowing text on servers</li>
									<li style="list-style: disc;">fixed links for public servers not working</li>
									<li style="list-style: disc;">small servers join button not working</li>
								</ul>	
							</div>

							<div class="section-content">
								<h4>Roblokis V2.5.0</h4>
								<div>
										changed the core loading system
								</div><br>
								<ul style="padding-left: 5%;">
									<li style="list-style: disc;">badges will load 40x faster</li>
									<li style="list-style: disc;">server design will load 40x to 60x faster</li>
									<li style="list-style: disc;">automatic load will be 120x to 140x faster</li>
									<li style="list-style: disc;">servers link will load 2x to 10x faster</li>
									<li style="list-style: disc;">friends removing button will show 2x to 10x faster</li>
									<li style="list-style: disc;">name and robux changing will be 2x to 10x faster</li>
									<li style="list-style: disc;">settings page will load 2x to 10x faster</li>
									<li style="list-style: disc;">server removing will be 40x to 60x faster</li>
									<li style="list-style: disc;">added timer to page nav. to prevent spamming</li>
									<li style="list-style: disc;">no option will be selected on servers tab</li>
								</ul>	
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
													<input type="file" id="newtheme-file" accept=".roblokis" oninput="if(this.files.length > 0) this.parentElement.querySelector('label').innerText = this.files[0].name; else this.parentElement.querySelector('label').innerText = '${Rkis.language['themeImport']}'" hidden>
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
											
												<li data-nav-page="all" class="designer-btn editortab menu-option active" style="border-radius: 10px 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAll">All</span> </a> </li>

												<li data-nav-page="home" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabHome">Home</span> </a> </li>

												<li data-nav-page="users" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabUsers">Users</span> </a> </li>

												<li data-nav-page="groups" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabGroups">Groups</span> </a> </li>

												<li data-nav-page="game" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 10px;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabGame">Game</span> </a> </li>

											</ul>

										</div>

										<!--save button-->
										<div class="rk-gap"></div>
										<div class="rk-flex rk-center-y">

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
													width: calc(100% - 80px);
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
												[data-editthemetabs] {
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
										
										<div data-nav-tab="all" data-editthemetabs="all" class="active">


												<div style="background-color: #fff;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus "></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>


										</div>



										<div data-nav-tab="home" data-editthemetabs="home">


												<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>


										</div>



										<div data-nav-tab="users" data-editthemetabs="users">


												<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>



												<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$xfit-content"></loadcode>

													<div style="margin: 10px 0;text-align: center;">
															<div class="colors bright" style="font-weight: 600;" data-translate="themePreviewProfile">Profile Example Preview</div>
													</div>

													<div class="recreate-profile profile-header-content designer-btn showthelem">
															<loadcode code="editelement">

																<loadcode code="editbackground" data-location="profile.background" data-togglebtn="on" data-toggle="off" data-title="Profile "></loadcode>
																<loadcode code="editcorners" data-location="profile" data-togglebtn="on" data-toggle="off" data-title="Profile "></loadcode>
																<loadcode code="editborders" data-location="profile" data-togglebtn="on" data-toggle="off" data-title="Profile "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="profile-header-top">
																<div class="avatar avatar-headshot-lg card-plain profile-avatar-image">
																		<span class="avatar-card-link avatar-image-link" style="background-color: #d4d4d4;"></span>
																</div>
																<div class="header-caption">
																		<div class="header-names">
																			<div class="header-title" style="display: flex;align-items: center;">
																					<h2 class="profile-name text-overflow" style="padding: 0;display: inline-block;margin: 0 12px 0 0;float: left;font-size: calc(32px * 2 * var(--editor-size-percent));">Roblox</h2>
																			</div>
																			<div class="recreate-12px-text-size profile-display-name font-caption-body text text-overflow">@Roblox</div>
																		</div>
																		<div class="header-details">
																			<ul class="details-info" style="display: flex;">
																						<li>
																								<div class="recreate-12px-text-size text-label font-caption-header" data-translate="themeFriends">Friends</div>
																								<a class="text-name"><span class="recreate-text-size font-header-2" style="margin-right: 6px;" title="0">0</span></a>
																						</li>
																						<li>
																								<div class="recreate-12px-text-size text-label font-caption-header" data-translate="themeFollowers">Followers</div>
																								<a class="text-name"><span class="recreate-text-size font-header-2" style="margin-right: 6px;" title="999">999</span></a>
																						</li>
																						<li>
																								<div class="recreate-12px-text-size text-label font-caption-header" data-translate="themeFollowing">Following</div>
																								<a class="text-name"><span class="recreate-text-size font-header-2" style="margin-right: 6px;" title="0">0</span></a>
																						</li>
																			</ul>
																			<ul class="details-actions desktop-action" style="display: block;">
																					<li class="btn-messages" style="float: right;padding-right: 15px;">
																							<button class="recreate-text-size btn-control-md" data-translate="themeMessage">Message</button>
																					</li>
																			</ul>
																		</div>
																</div>
															</div>
															<div id="profile-header-more" class="profile-header-more" ng-show="profileHeaderLayout.isMoreBtnVisible">
																<a id="popover-link" class="rbx-menu-item" data-toggle="popover"><span class="icon-more"></span></a>
															</div>

													</div>

												</div>


										</div>



										<div data-nav-tab="groups" data-editthemetabs="groups">


												<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>



												<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$xfit-content"></loadcode>

													<div style="margin: 10px 0;text-align: center;">
															<div class="colors bright" style="font-weight: 600;" data-translate="themePreviewGroup">Group Example Preview</div>
													</div>

													<div class="recreate-group designer-btn showthelem">
															<loadcode code="editelement">

																<loadcode code="editbackground" data-location="group.background" data-togglebtn="on" data-toggle="off" data-title="Group "></loadcode>
																<loadcode code="editcorners" data-location="group" data-togglebtn="on" data-toggle="off" data-title="Group "></loadcode>
																<loadcode code="editborders" data-location="group" data-togglebtn="on" data-toggle="off" data-title="Group "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="group-header">
																<div class="group-image" style="width: calc(256px * var(--editor-size-percent));margin-right: calc(24px * var(--editor-size-percent)); float: left;">
																		<div style="width: calc(256px * var(--editor-size-percent)); height: calc(256px * var(--editor-size-percent)); background-color: gray; display: inline-block; border-radius: calc(16px * var(--editor-size-percent)); float: left;"></div>
																</div>
																<div class="group-caption">
																		<div class="group-title">
																			<h1 class="group-name text-overflow" style="font-size: calc(64px * var(--editor-size-percent));">Roblox</h1>
																			<div class="group-owner text font-caption-body">
																					<span class="recreate-12px-text-size" data-translate="themeGroupBy">By</span> <a class="text-link recreate-12px-text-size">Roblox</a>
																			</div>
																		</div>
																		<div class="group-info">
																			<ul class="group-stats" style="display: flex;max-width: 100%;">
																					<li class="group-members">
																						<span class="font-header-2 recreate-text-size" title="0000000">0</span>
																						<div class="text-label font-caption-header recreate-12px-text-size" data-translate="themeMembers">Members</div>
																					</li>
																					<li class="group-rank text-overflow">
																						<span class="text-overflow font-header-2 recreate-text-size" title="-">-</span>
																						<div class="text-label font-caption-header recreate-12px-text-size" data-translate="themeRank">Rank</div>
																					</li>
																			</ul>
																		</div>
																</div>
																<div class="group-menu"> <a tabindex="0" class="rbx-menu-item" popover-placement="bottom-right" popover-trigger="'outsideClick'" uib-popover-template="'group-menu-popover'"> <span class="icon-more"></span> </a> </div>
															</div>

													</div>

												</div>


										</div>



										<div data-nav-tab="game" data-editthemetabs="game">


											<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
												<loadcode code="setupsize" data-size="$x$"></loadcode>


												<div class="recreate-background selectable designer-btn showthelem">
														<loadcode code="editelement">
															<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
															<loadcode code="loadedits"></loadcode>
														</loadcode>
												</div>

												<div class="recreate-content selectable dark designer-btn showthelem">
														<loadcode code="editelement">

															<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																	<div style="display: flex;align-items: center;justify-content: space-between;">
																		<span data-translate="themeShadow">Shadow:</span>
																		<select selected="" data-location="content.shadow" data-type="value">
																				<option value="" data-translate="themeEnabled">Enabled</option>
																				<option value="disabled" data-translate="themeDisabled">Disabled</option>
																		</select>
																	</div>
															</div>

															<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
															<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
															<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

															<loadcode code="loadedits"></loadcode>
														</loadcode>
												</div>

												<div class="recreate-menus group designer-btn showthelem">
														<loadcode code="editelement">
															<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
															<loadcode code="loadedits"></loadcode>
														</loadcode>

														<div class="recreate-topmenu dark"></div>
														<div class="recreate-bottommenu dark"></div>
														<div class="recreate-rightmenu dark"></div>
												</div>

											</div>


											<div class="designer-section" style="display: flex;margin-bottom: 20px;">
												<div class="designer-section" style="transition: all 400ms;position: relative;overflow: hidden;">
														<loadcode code="setupsize" data-size="calc($ * 0.5)xfit-content"></loadcode>

														<div style="margin: 10px 0;text-align: center;">
															<div class="colors bright" style="font-weight: 600;" data-translate="themePreviewBadge">Badge Example Preview</div>
														</div>

														<div class="recreate-badge selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																	<div class="section-content" style="min-width: 280px;">
																		<div style="display: flex;justify-content: space-between;align-items: center;">
																				<h4 style="width: fit-content;" data-translate="themeTxtColor">Text Color</h4>
																				<span data-location="badge.colors" data-enabled="switch" class="rk-button receiver-destination-type-toggle on">
																					<span class="toggle-flip"></span>
																					<span class="toggle-on"></span>
																					<span class="toggle-off"></span>
																				</span>
																		</div>

																		<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeBrtColor">Bright Color:</span><input type="color" value="#ffffff" data-location="badge.colors.bright" data-type="value" class="form-control input-field"></div>
																		
																		<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeDrkColor">Dark Color:</span><input type="color" value="#bdbebe" data-location="badge.colors.dark" data-type="value" class="form-control input-field"></div>

																	</div>

																	<loadcode code="editcorners" data-location="badge" data-togglebtn="on" data-toggle="off" data-title="Badge "></loadcode>
																	<loadcode code="editbackground" data-title="Badge " data-location="badge.background" data-togglebtn="on" data-toggle="off"></loadcode>
																	<loadcode code="editborders" data-location="badge" data-togglebtn="on" data-toggle="off" data-title="Badge "></loadcode>

																	<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div style="width: calc(150px * 1.5 * var(--editor-size-percent));height: calc(150px * 1.5 * var(--editor-size-percent));background-color: #d4d4d4;border-radius: 50%;"></div>

															<div style="margin-top: calc(9px * var(--editor-size-percent));">
																	<div style="padding: 0 calc(12px * var(--editor-size-percent));">
																		<div class="colors bright recreate-text-size" data-translate="themeNameBadge">Installed Roblokis!</div>
																		<p class="colors dark recreate-text-size" data-translate="themeDescBadge">Owners of this badge have Roblokis installed.</p>
																	</div>
																	<ul class="badge-content-data">
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeRare">Rarity</div>
																				<div class="colors bright recreate-text-size">20.0%</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeLastWon">Won Yesterday</div>
																				<div class="colors bright recreate-text-size">100</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeWon">Won Ever</div> 
																				<div class="colors bright recreate-text-size">101</div></li>
																		<li class="thecut"></li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeCreatedShort">Created</div> 
																				<div class="colors bright recreate-text-size" data-translate="themeTimeAgo">Time ago</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeUpdatedShort">Updated</div> 
																				<div class="colors bright recreate-text-size" data-translate="themeTimeAgo">Time ago</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeAchievedShort">Achieved</div> 
																				<div class="colors bright recreate-text-size" data-translate="themeTimeAgo">Time ago</div> </li>
																	</ul>
															</div>
														</div>

												</div>

												<div class="designer-section" style="transition: all 400ms;position: relative;overflow: hidden;">
														<loadcode code="setupsize" data-size="calc($ * 0.4)xfit-content"></loadcode>

														<div style="margin: 10px 0;text-align: center;">
															<div class="bright" style="font-weight: 600;" data-translate="themePreviewServer">Servers Example Preview</div>
														</div>

														<div class="recreate-servers mainpreview selectable dark designer-btn showthelem" data-type="server">
															<loadcode code="editelement">

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewDefault">Default Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<loadcode code="editcorners" data-location="defaultserver" data-title="Server " data-togglebtn="on" data-toggle="off"></loadcode>

																					<loadcode code="editbackground" data-location="defaultserver.background" data-title="Server " data-togglebtn="on" data-toggle="off"></loadcode>

																					<loadcode code="editborders" data-location="defaultserver" data-title="Server " data-togglebtn="on" data-toggle="off"></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																								<loadcode code="editcorners" data-location="defaultserver.button" data-title="Button "	data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="defaultserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="defaultserver.button" data-title="Button " data-togglebtn="on" data-toggle="off"></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: lightgrey;color: black;" id="rk-plr-counter">3</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewPrivate">Private Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="privateserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="privateserver.gap" data-type="percent" class="form-control input-field" max="2"></div>

																							<div class="rbx-divider" style="margin: 12px;"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="privateserver.color" data-type="color" class="form-control input-field"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeOwnBG">Owner Background:</span><input type="color" value="#d4d4d4" data-location="privateserver.owner.background.color" data-type="color" class="form-control input-field"></div>
																							
																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 5px 5px 0px 0px;" data-translate="themeOwnBGAlp">Owner Bg Alpha:</span><input type="range" value="100" step="10" data-location="privateserver.owner.background.color" data-type="color-alpha" class="form-control input-field"></div>
																					</div>


																					<loadcode code="editcorners" data-location="privateserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="privateserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="privateserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="privateserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="privateserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="privateserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="privateserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-full-width btn-control-xs rbx-private-server-renew recreate-12px-text-size color dark" data-inside="button" style="margin: 0;">Renew</a>
																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="stack-header">
																					<span class="font-bold recreate-14px-text-size color bright" title="A Private Server" style="display: inline-block;text-overflow: ellipsis;width: 100%;white-space: nowrap;overflow: hidden;">A Private Server</span>
																					<div class="link-menu rbx-private-server-menu"></div>
																				</div>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-owner">
																							<a class="avatar avatar-card-fullbody owner-avatar" title="Some Person" style="display: block;margin: 6px auto;width: calc(90px * 2 * var(--editor-size-percent));height: calc(90px * 2 * var(--editor-size-percent));background-color: #d4d4d4;" data-inside="owner"></a>
																					</div>

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<div class="rbx-private-server-inactive recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="themePrvSvrInac">Inactive.</span>
																					</div>

																					<a class="btn-full-width btn-control-xs rbx-private-server-renew recreate-12px-text-size color dark" data-inside="button" style="margin: 0;" data-translate="themePrvSvrRenu">Renew</a>
																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: lightgrey;color: black;" id="rk-plr-counter">4</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewFriends">Friends Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="friendsserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="friendsserver.gap" data-type="percent" class="form-control input-field" max="2"></div>

																							<div class="rbx-divider" style="margin: 12px;"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="friendsserver.color" data-type="color" class="form-control input-field"></div>
																					</div>


																					<loadcode code="editcorners" data-location="friendsserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="friendsserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="friendsserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="friendsserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="friendsserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="friendsserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="friendsserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>
																							
																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="JoinPublicServer">Join Public Server</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="text-info rbx-game-status rbx-friends-game-server-status recreate-90p-text-size color dark" style="text-overflow: ellipsis;overflow: hidden;" data-translate="themeFrnSvrPlr">Friends in this server: Roblox</div>

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="JoinPublicServer">Join Public Server</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: orangered;color: white;" id="rk-plr-counter">5</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewSmall">Small Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="smallserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="smallserver.gap" data-type="percent" class="form-control input-field" max="2"></div>
																					</div>


																					<loadcode code="editcorners" data-location="smallserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="smallserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="smallserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">
																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="smallserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="smallserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="smallserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="smallserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: lightgrey;color: black;" id="rk-plr-counter">2</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewPublic">Public Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="publicserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="publicserver.gap" data-type="percent" class="form-control input-field" max="2"></div>
																					</div>


																					<loadcode code="editcorners" data-location="publicserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="publicserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="publicserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																										<div class="section-content" style="min-width: 200px;">
																											<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="publicserver.button.color" data-type="color" class="form-control input-field"></div>
																										</div>


																										<loadcode code="editcorners" data-location="publicserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																										<loadcode code="editbackground" data-title="Button " data-location="publicserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																										<loadcode code="editborders" data-location="publicserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																										<loadcode code="loadedits"></loadcode>
																								</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>
																				
																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: darkred;color: white;" id="rk-plr-counter">8</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewSmall">Filtered Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="filteredserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="filteredserver.gap" data-type="percent" class="form-control input-field" max="2"></div>
																					</div>


																					<loadcode code="editcorners" data-location="filteredserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="filteredserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="filteredserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">
																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="filteredserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="filteredserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="filteredserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="filteredserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: orangered;color: white;" id="rk-plr-counter">7</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="stack-header">
																	<span class="font-bold recreate-14px-text-size color bright" title="Roblokis Hangout" style="display: inline-block;text-overflow: ellipsis;width: 100%;white-space: nowrap;overflow: hidden;" data-translate="themePrvSvr">Roblokis Hangout</span>
																	<div class="link-menu rbx-private-server-menu"></div>
															</div>

															<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																	<div class="rbx-private-owner">
																		<a class="avatar avatar-card-fullbody owner-avatar" title="Some Person" style="display: block;margin: 6px auto;width: calc(90px * 2 * var(--editor-size-percent));height: calc(90px * 2 * var(--editor-size-percent));background-color: #d4d4d4;" data-inside="owner"></a>
																	</div>

																	<div class="rbx-private-server-alert recreate-text-size">
																			<span class="icon-remove"></span>
																			<span data-translate="slowServer">Slow Server</span>
																	</div>

																	<a class="btn-full-width btn-control-xs rbx-private-server-renew recreate-12px-text-size color dark" data-inside="button" style="margin: 0;" data-translate="themePrvSvrRenu">Renew</a>
																	<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																	<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;", data-translate="joinButtons">Join</a>
															</div>

															<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																	<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: darkred;color: white;" id="rk-plr-counter">16</span>

																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
															</div>
														</div>

												</div>
											</div>


											<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;">
												<loadcode code="setupsize" data-size="$xfit-content"></loadcode>


												<div class="recreate-loadmore group designer-btn showthelem">
													<loadcode code="editelement">

														<div class="section-content" style="min-width: 200px;">
																<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="pagenav.color" data-type="color" class="form-control input-field"></div>
														</div>

														<loadcode code="editcorners" data-location="pagenav" data-togglebtn="on" data-toggle="off" data-title="Navigator "></loadcode>
														<loadcode code="editbackground" data-title="Navigator " data-location="pagenav.background" data-togglebtn="on" data-toggle="off"></loadcode>
														<loadcode code="editborders" data-location="pagenav" data-togglebtn="on" data-toggle="off" data-title="Navigator "></loadcode>

														<loadcode code="loadedits"></loadcode>
													</loadcode>

													<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" data-translate="loadMore">Load More</button>

													<div class="inner-group" id="rkpagenav" style="margin: 12px 20% 0;display: flex;height: calc(30px * 2 * var(--editor-size-percent));" data-page="1" data-max="326">
														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">|&lt;</button>
														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">&lt;</button>

														<span class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;height: 120%;justify-content: center;">2 / 64</span>

														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">&gt;</button>
														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">&gt;|</button>
													</div>
												</div>

											</div>


										</div>

									</div>
								</div>
							</div>


							<!--div id="rk-editthemesection-old" class="rk-popup-holder" style="z-index: 1000;">
								<div class="rk-popup" style="width: 85%;height: 100%;padding: calc(4% + 10px) calc(3% + 10px);overflow: auto;flex-direction: column;justify-content: flex-start;">

									<div style="display: flex;justify-content: space-evenly;margin-bottom: 10px;">

										<button onclick="document.querySelector('#rk-editthemesection').style.display = 'none';" style="background-color: rgb(57 59 61);color: white;border: 0;border-radius: 10px;margin: 0 2px;" data-translate="btnCancel">Close</button>

										<button class="designer-btn editorsave" style="background-color: rgb(57 184 61);border: 0;border-radius: 10px;margin: 0 2px;" data-translate="btnSave">Save</button>

									</div>

									<div style="display: flex;">
										
										<ul class="menu-vertical submenus" role="tablist" style="border-radius: 10px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;margin: 0 10px 12px 0;display: flex;width: fit-content;">
												
												<li data-editthemetab="all" class="designer-btn editortab menu-option active" style="border-radius: 10px;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAll">All</span> </a> </li>

										</ul>

												
										<ul class="menu-vertical submenus" role="tablist" style="border-radius: 10px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;margin: 0 10px 12px 0;display: flex;width: fit-content;">

												<li data-editthemetab="home" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 10px;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabHome">Home</span> </a> </li>

												<li data-editthemetab="users" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabUsers">Users</span> </a> </li>

												<li data-editthemetab="groups" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabGroups">Groups</span> </a> </li>

												<li data-editthemetab="game" class="designer-btn editortab menu-option" style="border-radius: 0 0 10px 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabGame">Game</span> </a> </li>

										</ul>

									</div>

									<div class="rbx-divider" style="padding: 1px 20%;margin-bottom: 10px;"></div>

									<div class="section-content">
										<div style="display: flex;">
												<input id="themeedit-resulution" value="1280x720" placeholder="Size x Size" class="form-control input-field" style="border-radius: 8px;" data-translate="screenLength">
												<select id="themeedit-percent">
													<option value="150">150%</option>
													<option value="125">125%</option>
													<option value="100">100%</option>
													<option value="75">75%</option>
													<option value="50" selected>50%</option>
												</select>
										</div>
									</div>

									<div>


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
													width: calc(100% - 80px);
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
												#rk-editthemesection .menu-option:hover {
													box-shadow: inset 0px -3px 0 0 #656668;
												}

												#rk-editthemesection .menu-option.active {
													box-shadow: inset 0px -3px 0 0 #fff;
												}

												#rk-editthemesection .menu-option-content {
													padding: 9px;
												}

												.rk-popup-holder {
													display: none;
													position: fixed;
													top: 0px;
													left: 0px;
													right: 0;
													bottom: 0;
													font-size: 16px;
													font-weight: 300;
													align-items: center;
													justify-content: center;
													flex-direction: column;
													flex-wrap: wrap;
													pointer-events: all;
													background-color: rgb(0 0 0 / 40%);
													width: 100%;
													height: 100%;
													padding: 4%;
												}

												.rk-popup {
													display: flex;
													flex-direction: column;
													width: fit-content;
													height: fit-content;
													background: rgb(35 37 39);
													box-shadow: 0 0 20px 2px black;
													border-radius: 20px;
													overscroll-behavior: contain;
													pointer-events: all;
													position: relative;
													align-items: center;
													justify-content: center;
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
												[data-editthemetabs] {
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
										
										<div data-editthemetabs="all">


												<div style="background-color: #fff;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus "></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>


										</div>



										<div data-editthemetabs="home" style="display: none;">


												<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>


										</div>



										<div data-editthemetabs="users" style="display: none;">


												<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>



												<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$xfit-content"></loadcode>

													<div style="margin: 10px 0;text-align: center;">
															<div class="colors bright" style="font-weight: 600;" data-translate="themePreviewProfile">Profile Example Preview</div>
													</div>

													<div class="recreate-profile profile-header-content designer-btn showthelem">
															<loadcode code="editelement">

																<loadcode code="editbackground" data-location="profile.background" data-togglebtn="on" data-toggle="off" data-title="Profile "></loadcode>
																<loadcode code="editcorners" data-location="profile" data-togglebtn="on" data-toggle="off" data-title="Profile "></loadcode>
																<loadcode code="editborders" data-location="profile" data-togglebtn="on" data-toggle="off" data-title="Profile "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="profile-header-top">
																<div class="avatar avatar-headshot-lg card-plain profile-avatar-image">
																		<span class="avatar-card-link avatar-image-link" style="background-color: #d4d4d4;"></span>
																</div>
																<div class="header-caption">
																		<div class="header-names">
																			<div class="header-title" style="display: flex;align-items: center;">
																					<h2 class="profile-name text-overflow" style="padding: 0;display: inline-block;margin: 0 12px 0 0;float: left;font-size: calc(32px * 2 * var(--editor-size-percent));">Roblox</h2>
																			</div>
																			<div class="recreate-12px-text-size profile-display-name font-caption-body text text-overflow">@Roblox</div>
																		</div>
																		<div class="header-details">
																			<ul class="details-info" style="display: flex;">
																						<li>
																								<div class="recreate-12px-text-size text-label font-caption-header" data-translate="themeFriends">Friends</div>
																								<a class="text-name"><span class="recreate-text-size font-header-2" style="margin-right: 6px;" title="0">0</span></a>
																						</li>
																						<li>
																								<div class="recreate-12px-text-size text-label font-caption-header" data-translate="themeFollowers">Followers</div>
																								<a class="text-name"><span class="recreate-text-size font-header-2" style="margin-right: 6px;" title="999">999</span></a>
																						</li>
																						<li>
																								<div class="recreate-12px-text-size text-label font-caption-header" data-translate="themeFollowing">Following</div>
																								<a class="text-name"><span class="recreate-text-size font-header-2" style="margin-right: 6px;" title="0">0</span></a>
																						</li>
																			</ul>
																			<ul class="details-actions desktop-action" style="display: block;">
																					<li class="btn-messages" style="float: right;padding-right: 15px;">
																							<button class="recreate-text-size btn-control-md" data-translate="themeMessage">Message</button>
																					</li>
																			</ul>
																		</div>
																</div>
															</div>
															<div id="profile-header-more" class="profile-header-more" ng-show="profileHeaderLayout.isMoreBtnVisible">
																<a id="popover-link" class="rbx-menu-item" data-toggle="popover"><span class="icon-more"></span></a>
															</div>

													</div>

												</div>


										</div>



										<div data-editthemetabs="groups" style="display: none;">


												<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$x$"></loadcode>


													<div class="recreate-background selectable designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-content selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																		<div style="display: flex;align-items: center;justify-content: space-between;">
																			<span data-translate="themeShadow">Shadow:</span>
																			<select selected="" data-location="content.shadow" data-type="value">
																					<option value="" data-translate="themeEnabled">Enabled</option>
																					<option value="disabled" data-translate="themeDisabled">Disabled</option>
																			</select>
																		</div>
																</div>

																<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
																<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>
													</div>

													<div class="recreate-menus group designer-btn showthelem">
															<loadcode code="editelement">
																<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="recreate-topmenu dark"></div>
															<div class="recreate-bottommenu dark"></div>
															<div class="recreate-rightmenu dark"></div>
													</div>


												</div>



												<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;">
													<loadcode code="setupsize" data-size="$xfit-content"></loadcode>

													<div style="margin: 10px 0;text-align: center;">
															<div class="colors bright" style="font-weight: 600;" data-translate="themePreviewGroup">Group Example Preview</div>
													</div>

													<div class="recreate-group designer-btn showthelem">
															<loadcode code="editelement">

																<loadcode code="editbackground" data-location="group.background" data-togglebtn="on" data-toggle="off" data-title="Group "></loadcode>
																<loadcode code="editcorners" data-location="group" data-togglebtn="on" data-toggle="off" data-title="Group "></loadcode>
																<loadcode code="editborders" data-location="group" data-togglebtn="on" data-toggle="off" data-title="Group "></loadcode>

																<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="group-header">
																<div class="group-image" style="width: calc(256px * var(--editor-size-percent));margin-right: calc(24px * var(--editor-size-percent)); float: left;">
																		<div style="width: calc(256px * var(--editor-size-percent)); height: calc(256px * var(--editor-size-percent)); background-color: gray; display: inline-block; border-radius: calc(16px * var(--editor-size-percent)); float: left;"></div>
																</div>
																<div class="group-caption">
																		<div class="group-title">
																			<h1 class="group-name text-overflow" style="font-size: calc(64px * var(--editor-size-percent));">Roblox</h1>
																			<div class="group-owner text font-caption-body">
																					<span class="recreate-12px-text-size" data-translate="themeGroupBy">By</span> <a class="text-link recreate-12px-text-size">Roblox</a>
																			</div>
																		</div>
																		<div class="group-info">
																			<ul class="group-stats" style="display: flex;max-width: 100%;">
																					<li class="group-members">
																						<span class="font-header-2 recreate-text-size" title="0000000">0</span>
																						<div class="text-label font-caption-header recreate-12px-text-size" data-translate="themeMembers">Members</div>
																					</li>
																					<li class="group-rank text-overflow">
																						<span class="text-overflow font-header-2 recreate-text-size" title="-">-</span>
																						<div class="text-label font-caption-header recreate-12px-text-size" data-translate="themeRank">Rank</div>
																					</li>
																			</ul>
																		</div>
																</div>
																<div class="group-menu"> <a tabindex="0" class="rbx-menu-item" popover-placement="bottom-right" popover-trigger="'outsideClick'" uib-popover-template="'group-menu-popover'"> <span class="icon-more"></span> </a> </div>
															</div>

													</div>

												</div>


										</div>



										<div data-editthemetabs="game" style="display: none;">


											<div style="background-color: #fff;margin-bottom: 20px;transition: all 400ms;position: relative;">
												<loadcode code="setupsize" data-size="$x$"></loadcode>


												<div class="recreate-background selectable designer-btn showthelem">
														<loadcode code="editelement">
															<loadcode code="editbackground" data-location="background" data-togglebtn="on" data-toggle="off"></loadcode>
															<loadcode code="loadedits"></loadcode>
														</loadcode>
												</div>

												<div class="recreate-content selectable dark designer-btn showthelem">
														<loadcode code="editelement">

															<div class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
																	<div style="display: flex;align-items: center;justify-content: space-between;">
																		<span data-translate="themeShadow">Shadow:</span>
																		<select selected="" data-location="content.shadow" data-type="value">
																				<option value="" data-translate="themeEnabled">Enabled</option>
																				<option value="disabled" data-translate="themeDisabled">Disabled</option>
																		</select>
																	</div>
															</div>

															<loadcode code="editbackground" data-location="content.background" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
															<loadcode code="editcorners" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>
															<loadcode code="editborders" data-location="content" data-togglebtn="on" data-toggle="off" data-title="Content "></loadcode>

															<loadcode code="loadedits"></loadcode>
														</loadcode>
												</div>

												<div class="recreate-menus group designer-btn showthelem">
														<loadcode code="editelement">
															<loadcode code="editbackground" data-location="menu.background" data-title="Menus " data-togglebtn="on" data-toggle="off"></loadcode>
															<loadcode code="loadedits"></loadcode>
														</loadcode>

														<div class="recreate-topmenu dark"></div>
														<div class="recreate-bottommenu dark"></div>
														<div class="recreate-rightmenu dark"></div>
												</div>

											</div>


											<div class="designer-section" style="display: flex;margin-bottom: 20px;">
												<div class="designer-section" style="transition: all 400ms;position: relative;overflow: hidden;">
														<loadcode code="setupsize" data-size="calc($ * 0.5)xfit-content"></loadcode>

														<div style="margin: 10px 0;text-align: center;">
															<div class="colors bright" style="font-weight: 600;" data-translate="themePreviewBadge">Badge Example Preview</div>
														</div>

														<div class="recreate-badge selectable dark designer-btn showthelem">
															<loadcode code="editelement">

																	<div class="section-content" style="min-width: 280px;">
																		<div style="display: flex;justify-content: space-between;align-items: center;">
																				<h4 style="width: fit-content;" data-translate="themeTxtColor">Text Color</h4>
																				<span data-location="badge.colors" data-enabled="switch" class="rk-button receiver-destination-type-toggle on">
																					<span class="toggle-flip"></span>
																					<span class="toggle-on"></span>
																					<span class="toggle-off"></span>
																				</span>
																		</div>

																		<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeBrtColor">Bright Color:</span><input type="color" value="#ffffff" data-location="badge.colors.bright" data-type="value" class="form-control input-field"></div>
																		
																		<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeDrkColor">Dark Color:</span><input type="color" value="#bdbebe" data-location="badge.colors.dark" data-type="value" class="form-control input-field"></div>

																	</div>

																	<loadcode code="editcorners" data-location="badge" data-togglebtn="on" data-toggle="off" data-title="Badge "></loadcode>
																	<loadcode code="editbackground" data-title="Badge " data-location="badge.background" data-togglebtn="on" data-toggle="off"></loadcode>
																	<loadcode code="editborders" data-location="badge" data-togglebtn="on" data-toggle="off" data-title="Badge "></loadcode>

																	<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div style="width: calc(150px * 1.5 * var(--editor-size-percent));height: calc(150px * 1.5 * var(--editor-size-percent));background-color: #d4d4d4;border-radius: 50%;"></div>

															<div style="margin-top: calc(9px * var(--editor-size-percent));">
																	<div style="padding: 0 calc(12px * var(--editor-size-percent));">
																		<div class="colors bright recreate-text-size" data-translate="themeNameBadge">Installed Roblokis!</div>
																		<p class="colors dark recreate-text-size" data-translate="themeDescBadge">Owners of this badge have Roblokis installed.</p>
																	</div>
																	<ul class="badge-content-data">
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeRare">Rarity</div>
																				<div class="colors bright recreate-text-size">20.0%</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeLastWon">Won Yesterday</div>
																				<div class="colors bright recreate-text-size">100</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeWon">Won Ever</div> 
																				<div class="colors bright recreate-text-size">101</div></li>
																		<li class="thecut"></li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeCreatedShort">Created</div> 
																				<div class="colors bright recreate-text-size" data-translate="themeTimeAgo">Time ago</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeUpdatedShort">Updated</div> 
																				<div class="colors bright recreate-text-size" data-translate="themeTimeAgo">Time ago</div> </li>
																		<li> <div class="colors dark recreate-text-size" data-translate="badgeAchievedShort">Achieved</div> 
																				<div class="colors bright recreate-text-size" data-translate="themeTimeAgo">Time ago</div> </li>
																	</ul>
															</div>
														</div>

												</div>

												<div class="designer-section" style="transition: all 400ms;position: relative;overflow: hidden;">
														<loadcode code="setupsize" data-size="calc($ * 0.4)xfit-content"></loadcode>

														<div style="margin: 10px 0;text-align: center;">
															<div class="bright" style="font-weight: 600;" data-translate="themePreviewServer">Servers Example Preview</div>
														</div>

														<div class="recreate-servers mainpreview selectable dark designer-btn showthelem" data-type="server">
															<loadcode code="editelement">

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewDefault">Default Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<loadcode code="editcorners" data-location="defaultserver" data-title="Server " data-togglebtn="on" data-toggle="off"></loadcode>

																					<loadcode code="editbackground" data-location="defaultserver.background" data-title="Server " data-togglebtn="on" data-toggle="off"></loadcode>

																					<loadcode code="editborders" data-location="defaultserver" data-title="Server " data-togglebtn="on" data-toggle="off"></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																								<loadcode code="editcorners" data-location="defaultserver.button" data-title="Button "	data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="defaultserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="defaultserver.button" data-title="Button " data-togglebtn="on" data-toggle="off"></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: lightgrey;color: black;" id="rk-plr-counter">3</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewPrivate">Private Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="privateserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="privateserver.gap" data-type="percent" class="form-control input-field" max="2"></div>

																							<div class="rbx-divider" style="margin: 12px;"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="privateserver.color" data-type="color" class="form-control input-field"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeOwnBG">Owner Background:</span><input type="color" value="#d4d4d4" data-location="privateserver.owner.background.color" data-type="color" class="form-control input-field"></div>
																							
																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 5px 5px 0px 0px;" data-translate="themeOwnBGAlp">Owner Bg Alpha:</span><input type="range" value="100" step="10" data-location="privateserver.owner.background.color" data-type="color-alpha" class="form-control input-field"></div>
																					</div>


																					<loadcode code="editcorners" data-location="privateserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="privateserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="privateserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="privateserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="privateserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="privateserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="privateserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-full-width btn-control-xs rbx-private-server-renew recreate-12px-text-size color dark" data-inside="button" style="margin: 0;">Renew</a>
																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="stack-header">
																					<span class="font-bold recreate-14px-text-size color bright" title="A Private Server" style="display: inline-block;text-overflow: ellipsis;width: 100%;white-space: nowrap;overflow: hidden;">A Private Server</span>
																					<div class="link-menu rbx-private-server-menu"></div>
																				</div>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-owner">
																							<a class="avatar avatar-card-fullbody owner-avatar" title="Some Person" style="display: block;margin: 6px auto;width: calc(90px * 2 * var(--editor-size-percent));height: calc(90px * 2 * var(--editor-size-percent));background-color: #d4d4d4;" data-inside="owner"></a>
																					</div>

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<div class="rbx-private-server-inactive recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="themePrvSvrInac">Inactive.</span>
																					</div>

																					<a class="btn-full-width btn-control-xs rbx-private-server-renew recreate-12px-text-size color dark" data-inside="button" style="margin: 0;" data-translate="themePrvSvrRenu">Renew</a>
																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: lightgrey;color: black;" id="rk-plr-counter">4</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewFriends">Friends Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="friendsserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="friendsserver.gap" data-type="percent" class="form-control input-field" max="2"></div>

																							<div class="rbx-divider" style="margin: 12px;"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="friendsserver.color" data-type="color" class="form-control input-field"></div>
																					</div>


																					<loadcode code="editcorners" data-location="friendsserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="friendsserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="friendsserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="friendsserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="friendsserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="friendsserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="friendsserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>
																							
																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="JoinPublicServer">Join Public Server</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="text-info rbx-game-status rbx-friends-game-server-status recreate-90p-text-size color dark" style="text-overflow: ellipsis;overflow: hidden;" data-translate="themeFrnSvrPlr">Friends in this server: Roblox</div>

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="JoinPublicServer">Join Public Server</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: orangered;color: white;" id="rk-plr-counter">5</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewSmall">Small Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="smallserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="smallserver.gap" data-type="percent" class="form-control input-field" max="2"></div>
																					</div>


																					<loadcode code="editcorners" data-location="smallserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="smallserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="smallserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">
																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="smallserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="smallserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="smallserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="smallserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: lightgrey;color: black;" id="rk-plr-counter">2</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewPublic">Public Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="publicserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="publicserver.gap" data-type="percent" class="form-control input-field" max="2"></div>
																					</div>


																					<loadcode code="editcorners" data-location="publicserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="publicserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="publicserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">

																										<div class="section-content" style="min-width: 200px;">
																											<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="publicserver.button.color" data-type="color" class="form-control input-field"></div>
																										</div>


																										<loadcode code="editcorners" data-location="publicserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																										<loadcode code="editbackground" data-title="Button " data-location="publicserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																										<loadcode code="editborders" data-location="publicserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																										<loadcode code="loadedits"></loadcode>
																								</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>
																				
																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: darkred;color: white;" id="rk-plr-counter">8</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;overflow: hidden;min-width: 240px;">

																		<div style="margin: 10px 0;text-align: center;">
																				<div class="bright" style="font-weight: 600;" data-translate="themePreviewSmall">Filtered Server Preview</div>
																		</div>

																		<div class="recreate-servers selectable dark designer-btn showthelem">
																				<loadcode code="editelement">

																					<div class="section-content">
																							<div style="display: flex;justify-content: space-between;align-items: center;">
																								<h4 style="width: fit-content;" data-translate="themeSvrStng">Servers Settings</h4>
																							</div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span><input type="range" value="5" data-location="filteredserver.column" data-type="value" class="form-control input-field" max="8"></div>

																							<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span><input type="range" value="0.3" step="0.1" data-location="filteredserver.gap" data-type="percent" class="form-control input-field" max="2"></div>
																					</div>


																					<loadcode code="editcorners" data-location="filteredserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<loadcode code="editbackground" data-title="Server " data-location="filteredserver.background" data-togglebtn="on" data-toggle="off"></loadcode>


																					<loadcode code="editborders" data-location="filteredserver" data-togglebtn="on" data-toggle="off" data-title="Server "></loadcode>


																					<div class="section-left rbx-private-server-details group designer-section designer-btn showthelem" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 10px;border-radius: 20px;margin-bottom: 20px;min-width: 220px;">
																							<loadcode code="editelement">
																								<div class="section-content" style="min-width: 200px;">
																										<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="filteredserver.button.color" data-type="color" class="form-control input-field"></div>
																								</div>


																								<loadcode code="editcorners" data-location="filteredserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>


																								<loadcode code="editbackground" data-title="Button " data-location="filteredserver.button.background" data-togglebtn="on" data-toggle="off"></loadcode>


																								<loadcode code="editborders" data-location="filteredserver.button" data-togglebtn="on" data-toggle="off" data-title="Button "></loadcode>

																								<loadcode code="loadedits"></loadcode>
																							</loadcode>

																							<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																							<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																					</div>

																					<loadcode code="loadedits"></loadcode>
																				</loadcode>

																				<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																					<div class="rbx-private-server-alert recreate-text-size">
																							<span class="icon-remove"></span>
																							<span data-translate="slowServer">Slow Server</span>
																					</div>

																					<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																					<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;" data-translate="joinButtons">Join</a>
																				</div>

																				<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																					<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: orangered;color: white;" id="rk-plr-counter">7</span>

																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link" title="Some Person"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																					<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																				</div>
																		</div>

																	</div>

																	<loadcode code="loadedits"></loadcode>
															</loadcode>

															<div class="stack-header">
																	<span class="font-bold recreate-14px-text-size color bright" title="Roblokis Hangout" style="display: inline-block;text-overflow: ellipsis;width: 100%;white-space: nowrap;overflow: hidden;" data-translate="themePrvSvr">Roblokis Hangout</span>
																	<div class="link-menu rbx-private-server-menu"></div>
															</div>

															<div class="section-left rbx-private-server-details" style="float: none;width: auto;border-width: initial;border-style: none;border-color: initial;border-image: initial;padding: 0px;">

																	<div class="rbx-private-owner">
																		<a class="avatar avatar-card-fullbody owner-avatar" title="Some Person" style="display: block;margin: 6px auto;width: calc(90px * 2 * var(--editor-size-percent));height: calc(90px * 2 * var(--editor-size-percent));background-color: #d4d4d4;" data-inside="owner"></a>
																	</div>

																	<div class="rbx-private-server-alert recreate-text-size">
																			<span class="icon-remove"></span>
																			<span data-translate="slowServer">Slow Server</span>
																	</div>

																	<a class="btn-full-width btn-control-xs rbx-private-server-renew recreate-12px-text-size color dark" data-inside="button" style="margin: 0;" data-translate="themePrvSvrRenu">Renew</a>
																	<a class="btn-control-xs recreate-12px-text-size color dark" data-inside="button" style="width: calc(18% - 2px);">🔗</a>
																	<a class="btn-full-width btn-control-xs rbx-private-server-join recreate-12px-text-size color dark" data-inside="button" style="width: 80%;margin: 0 0 0 0;", data-translate="joinButtons">Join</a>
															</div>

															<div class="section-right rbx-friends-game-server-players" style="float: none;width: 99%;">
																	<span class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image recreate-text-size" style="background-color: darkred;color: white;" id="rk-plr-counter">16</span>

																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
																	<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image"></a></span>
															</div>
														</div>

												</div>
											</div>


											<div class="designer-section" style="margin-bottom: 20px;transition: all 400ms;position: relative;">
												<loadcode code="setupsize" data-size="$xfit-content"></loadcode>


												<div class="recreate-loadmore group designer-btn showthelem">
													<loadcode code="editelement">

														<div class="section-content" style="min-width: 200px;">
																<div class="text-lead" style="display: flex;align-items: center;justify-content: space-between;"><span style="min-width: fit-content;" data-translate="themeTextColor">Text Color:</span><input type="color" value="#ffffff" data-location="pagenav.color" data-type="color" class="form-control input-field"></div>
														</div>

														<loadcode code="editcorners" data-location="pagenav" data-togglebtn="on" data-toggle="off" data-title="Navigator "></loadcode>
														<loadcode code="editbackground" data-title="Navigator " data-location="pagenav.background" data-togglebtn="on" data-toggle="off"></loadcode>
														<loadcode code="editborders" data-location="pagenav" data-togglebtn="on" data-toggle="off" data-title="Navigator "></loadcode>

														<loadcode code="loadedits"></loadcode>
													</loadcode>

													<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" data-translate="loadMore">Load More</button>

													<div class="inner-group" id="rkpagenav" style="margin: 12px 20% 0;display: flex;height: calc(30px * 2 * var(--editor-size-percent));" data-page="1" data-max="326">
														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">|&lt;</button>
														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">&lt;</button>

														<span class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;height: 120%;justify-content: center;">2 / 64</span>

														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">&gt;</button>
														<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more recreate-text-size color" style="margin: 0 4px;">&gt;|</button>
													</div>
												</div>

											</div>


										</div>



									</div>
								</div>
							</div-->
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
								<div class="serversection filteredservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversFiltered">Filtered Servers</span></h3>

									<div class="section-content">
										<span class="text-lead" data-translate="sectionFSS">Filtered Servers Section.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle off" data-file="FilteredServer">
												<span class="toggle-flip"></span>
												<span class="toggle-on"></span>
												<span class="toggle-off"></span>
										</span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionFSS1">A new section with sorting options.</span>
										<span class="text-description" data-translate="experimental">(EXPERIMENTAL)</span>
									</div>

									<div class="section-content">
										<span class="text-lead" data-translate="sectionSPN">Server Page Nav.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="FilteredPageNav">
												<span class="toggle-flip"></span>
												<span class="toggle-on"></span>
												<span class="toggle-off"></span>
										</span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionSPN1">Shows Nav. buttons under "Load More" button.</span>
									</div>

									<div class="section-content">
										<span class="text-lead" data-translate="sectionSLB">Servers Link Button.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="FilteredServerLink">
												<span class="toggle-flip"></span>
												<span class="toggle-on"></span>
												<span class="toggle-off"></span>
										</span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionSLB1">Shows a link button next to the join button and gives server's join link.</span>
										<div class="text-description" style="color: red;" data-translate="sectionSLink">NOTE: Sharing the link won't work unless the person also have this extension!</div>
									</div>
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
		ttle.innerText = Rkis.language["settingsPageTitle"];

		document.firstElementChild.insertBefore(ttle, document.firstElementChild.firstElementChild);

		page.start();

		mainplace.querySelector(`#download-roblokis-data`).addEventListener('click', () => {
			let rawText = localStorage.getItem('Roblokis');
			makeTextFile(rawText, 'Raw Roblokis Data.json');
		});
		mainplace.querySelector(`#delete-roblokis-data`).addEventListener('click', () => {
			let confirmation = confirm("WARNING: This can not be undone!\nContinuing will remove all your Roblokis information;\n-settings\n-themes\nare included, Continue?");
			if (confirmation === true) {
				localStorage.removeItem('Roblokis');
				location.reload();
			}
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