"use strict";
var Rkis = Rkis || {};
Rkis.Designer = Rkis.Designer || {};
Rkis.StylesList = Rkis.StylesList || {};

Rkis.Designer.DefaultThemes = [
	{
		themeId: "0",
		location: "js/Theme/DefaultDark.Roblokis",
		name: "Default Dark Theme",
		description: "Simple Design made to match default roblox.",
		isDefault: true,
	},
	{
		themeId: "1",
		location: "js/Theme/DefaultLight.Roblokis",
		name: "Default Light Theme",
		description: "Simple Design made to match default roblox.",
	},
	{
		themeId: "2",
		location: "js/Theme/Default/Simple Gradient.Roblokis",
		name: "Simple Gradient",
		description: "Simple Red-Blue gradient theme",
	},
	{
		themeId: "3",
		location: "js/Theme/Default/Dark Shadow Theme.Roblokis",
		name: "Dark Shadow Theme",
		description: "",
	},
];

function FetchImage(url) {
	return new Promise(resolve => {
		BROWSER.runtime.sendMessage({about: "getImageRequest", url: url}, 
		function(data) {
			resolve(data)
		})
	})
}

Rkis.Designer.GetPageTheme = function() {

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Theme = wholedata.Designer.Theme || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	if (wholedata.Designer.Theme.id == null) return null;

	let type = wholedata.Designer.Theme.type;
	if (type == null) type = wholedata.Designer.Theme.isDefaultTheme ? "default" : "saved";

	if (type == "saved" && wholedata.Designer.Themes.length - 1 < wholedata.Designer.Theme.id) return null;

	return {
		type,
		isDefaultTheme: wholedata.Designer.Theme.isDefaultTheme,
		themeId: wholedata.Designer.Theme.id,
		name: wholedata.Designer.Theme.name,
		extra: wholedata.Designer.Theme.extra,
	};
}

Rkis.Designer.CreateThemeElement = async function(theme) {
	
	if (typeof theme == 'undefined' || theme == null) theme = Rkis.Designer.currentTheme;
	if(theme == null) return;

	if (theme.pages == null) {
		theme.pages = theme.pages || {};

		for (let page in theme) {
			if (theme[page].css == null) continue;
			
			theme.pages[page] = theme[page].css;
			delete theme[page];
		}
	}
	
	if(theme.pages == null) return;

	var tamplate0 = null;
	var tamplate05 = "";
	var tamplate1 = "";
	var tamplate2 = "";
	var tamplate3 = "";


	// tamplate0 = await fetch(Rkis.fileLocation + "js/Theme/DefaultTamplate.css")
	// .then(response => response.text())
	// .catch(err => {return null;})
	tamplate0 = await Rkis.Designer.cssTemplateFile;
	if(tamplate0 == null) return;

	// Format
		/*>|REPLACE WITH STUFF|.value<*/
	/* Result
		stuff1.value
		stuff2.value
		...
	*/
	
	//auto complete
	tamplate0.split("/*>").forEach((e, i) => {
		if(i == 0) return tamplate05 += e;

		var n = e.split("<*/");
		if(n.length < 2) return tamplate05 += e;

		var completecode = "";

		if(n[0].includes("|CORNERS|")) {
			var alltheelements = ["all","top-left","top-right","bottom-right","bottom-left"];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|CORNERS|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += "\n"; //make them look good
			})
		}
		if(n[0].includes("|CORNER|")) {
			var alltheelements = ["top-left","top-right","bottom-right","bottom-left"];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|CORNER|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += "\n"; //make them look good
			})
		}
		if(n[0].includes("|SIDES|")) {
			var alltheelements = ["all","top","left","bottom","right"];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|SIDES|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += "\n"; //make them look good
			})
		}
		if(n[0].includes("|SIDE|")) {
			var alltheelements = ["top","right","bottom","left"];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|SIDE|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += "\n"; //make them look good
			})
		}
		if(n[0].includes("|IMAGE|")) {
			var alltheelements = ["size","repeat","position","attachment"];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|IMAGE|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += "\n"; //make them look good
			})
		}
		if(n[0].includes("|IMG|")) {
			var alltheelements = ["repeat","position","attachment"];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|IMG|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += " "; //make them look good
			})
		}

		if(completecode == "") return tamplate05 += n[1];

		tamplate05 += completecode + n[1];
	});

	/* Format
		--loopstart: 0;
			dummy: "hi";
			|replace with stuff|.value
		--loopend: 0;
	// Result
		dummy: "hi";
		stuff1.value
		dummy: "hi";
		stuff2.value
		...
	*/
	tamplate05.split("--loopstart: 0;").forEach((e, i) => {
		if(i == 0) return tamplate1 += e;

		var n = e.split("--loopend: 0;");
		if(n.length < 2) return tamplate1 += e;

		var completecode = "";

		if(n[0].includes("|server|")) {
			var alltheelements = ["publicserver","smallserver","friendsserver","privateserver"];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|server|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += "\n"; //make them look good
			})
		}
		if(n[0].includes("|fullpack|")) {
			var alltheelements = [
				"pagenav","badge","content",
				"menu","profile","group",
				"avatar","avatareditor",
				"quickgamejoin", "gameplay",
				"popup", "gamesection",
				"peoplesection",
			];

			alltheelements.forEach((element, elementnumber) => {
				completecode += n[0].split("|fullpack|").join(element);
				if(elementnumber != alltheelements.length - 1) completecode += "\n"; //make them look good
			})
		}

		if(completecode == "") return tamplate1 += n[1];

		tamplate1 += completecode + n[1];
	});

	//--rk-something: %variable%;
	//--rk-something: $value&default#;

	//auto variable
	tamplate1.split("{").forEach((selector, selectorIndex) => {
		if(selectorIndex == 0) return tamplate2 += selector; //don't change start

		let afterit = "}" + selector.split('}').slice(1).join("}");
		let beforeit = "{";
		let propertiesPart = selector.split("}")[0];

		tamplate2 += beforeit;

		propertiesPart.split(":").forEach((codepart, i) => {
			if(i == 0) return tamplate2 += codepart; //don't change start
			let afterit = ";" + codepart.split(';').slice(1).join(";");
			let beforeit = ":";
			codepart = codepart.split(';')[0]; //keep the cutted part

			var fill = ""; //values
			var filled = false; //check if css used

			if(!codepart.includes("$") && !codepart.includes("%")) return tamplate2 += codepart; //no variable detection
			var all_values = codepart.split("$"); //collect variables

			for (var dollar_num = 0; dollar_num < all_values.length; dollar_num++) {
				if(dollar_num == 0) {fill += all_values[0]; continue;} //don't change start
				
				//no end detection
				var raw_value = all_values[dollar_num].split("#");
				if(raw_value.length < 2) {fill += "$" + all_values[dollar_num]; continue;}

				var raw_multiple_value = raw_value[0].split("&")[0].split("/"); //multiple value detection

				var val = null; //value

				var checkvalue = function(check_value, allcheck) {
					var tryval = theme.pages[Rkis.pageName];
					if (allcheck == true) tryval = theme.pages.all;
					if (tryval == null) return null;

					var value_dots = check_value.split(".");

					for(var doti = 0; doti < value_dots.length && tryval != null; doti++) {
						var dot = value_dots[doti];
						tryval = tryval[dot];
					}

					return tryval;
				}

				for(var checking_num = 0; checking_num < raw_multiple_value.length && val == null; checking_num++) {
					var to_check_value = raw_multiple_value[checking_num];

					val = checkvalue(to_check_value);

					if(val != null) continue;

					val = checkvalue(to_check_value, true);
				}

				if(val == null && raw_value[0].split("&").length > 1) {
					val = raw_value[0].split("&")[1];
				}

				if(val == null) {fill += raw_value[1]; continue;}

				fill += val.split("<").join("").split(">").join("") + raw_value[1];
				filled = true;

			}

			if(codepart.includes("%") && codepart.split("%").length > 2) {
				var prts = codepart.split("%");

				var val = null;
				if(Rkis.wholeData[prts[1]] != true) val = "disabled";

				if(val != null) {
					fill += prts[0];

					fill += val;

					fill += prts[2];

					filled = true;
				}
			}

			if (filled == false) {
				let variableKey = propertiesPart.split(":")[i-1].split("\n").slice(-1)[0];
				tamplate2 = tamplate2.slice(0, -1 * variableKey.length) + afterit.slice(1);
				return;
			}

			return tamplate2 += beforeit + fill + afterit;
		});
		
		tamplate2 += afterit;
	});

	//url replacer
	var splittenTemplate2 = tamplate2.split("url(");
	for (var i = 0; i < splittenTemplate2.length; i++) {
		var codepart = splittenTemplate2[i];
		if(i == 0){tamplate3 += codepart; continue;} //don't change start
		codepart = "url(" + codepart; //keep the cutted part

		var fill = ""; //values

		if(codepart.includes(")") == false) {tamplate3 += codepart; continue;} //no variable detection
		var url = codepart.split("url(")[1];
		let openParanCount = url.split(")")[0].split("(").length - 1;
		url = url.split(")").slice(0, openParanCount+1).join(")");

		//skip if not url
		if (url === "") {
			fill = "";
		} else if (url.startsWith("linear-gradient")) {
			fill = url.split(')')[0]+')';
		} else if (url.startsWith("data:image/")) {
			fill = 'url('+url.split(')')[0]+')';
		} else {
			fill = await FetchImage(url);
		}

		//console.log(url, fill);

		tamplate3 += fill + codepart.split(")").slice(openParanCount+1).join(')');
	};

	var styl = document.createElement("style");
	styl.id = "rk-theme-loaded";
	styl.innerHTML = tamplate3;
	return styl;
}

Rkis.Designer.loadedStyleFile = false;
Rkis.Designer.SetupTheme = async function() {

	if (Rkis.generalTriggerTheme != true) {
		document.addEventListener("rk-general-trigger-theme", () => {
			Rkis.Designer.SetupTheme();
		}, {once: true});
		return;
	}

	let mainStyle = null;

	const addStyle = url => {
		const cssRule = `@import url("${url}")`;
		const ruleIndex = mainStyle.insertRule(cssRule, mainStyle.cssRules.length);
		
		return mainStyle.cssRules[ruleIndex];
	}
	const removeStyle = url => {
		//const cssRule = `@import url("${url}")`;

		let ruleIndx = -1;
		let rulesfilter = [];
		for (const r of mainStyle.rules) {
			ruleIndx++;
			if (r.href == url)
				rulesfilter.push(ruleIndx);
		}
		
		//return mainStyle.cssRules[ruleIndex];
		if (rulesfilter.length == 0) return;
		rulesfilter.reverse().forEach(r => {
			mainStyle.deleteRule(r);
		});
	}

	Rkis.Designer.addCSS = (paths, isExternal = false) => {
		if(window.ContextScript != true) return console.error("Not Context Script");
		if(typeof paths == "string") paths = [paths];

		if(!mainStyle) {
			const style = document.createElement("style");
			style.id = "rk-css-loaded";

			const parent = document.head || document.documentElement;
			parent.append(style);

			mainStyle = style.sheet;
		}
		
		paths.forEach((path) => {
			let url = Rkis.fileLocation + path;
			if (isExternal) url = path
			addStyle(url);
		})
	}
	Rkis.Designer.removeCSS = (paths, isExternal = false) => {
		if(window.ContextScript != true) return console.error("Not Context Script");
		if(typeof paths == "string") paths = [paths];

		if(!mainStyle) return;
		
		paths.forEach((path) => {
			let url = Rkis.fileLocation + path;
			if (isExternal) url = path
			removeStyle(url);
		})
	}

	var putCSS = Rkis.Designer.addCSS; //shorter form
	putCSS(["js/Theme/Extras/features.css"]);

	if(Rkis.IsSettingEnabled("ExtraShadows", {
	id: "ExtraShadows",
	type: "switch",
	value: { switch: false },
	details: {
		default: "en",
		translate: {
			name: "sectionExtraS",
			description: "sectionExtraS1"
		},
		"en": {
			name: "Extra Shadows",
			description: "Adds a shadow effect under or around some elements.",
		}
	}
	})) {
		putCSS(["js/Theme/Pages/shadows.css"]);
	}

	if(Rkis.IsSettingDisabled("UseThemes", {
	id: "UseThemes",
	type: "switch",
	value: { switch: true },
	details: {
		default: "en",
		translate: {
			name: "sectionUThemes",
			description: "sectionUThemes1"
		},
		"en": {
			name: "Use Themes",
			description: "Disabling this will disable Styles and Themes!",
		}
	}
	})) {
		putCSS(["js/Theme/Extras/extensions.css"]);
		document.$watch("body", (e) => {e.classList.add("Roblokis-no-themes")});
		return;
	}

	var allCssFiles = [
		{match: ".com/home", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/home.css" ]},
		{match: ".com/discover", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/discover.css" ]},
		{match: ".com/charts", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/discover.css" ]},
		{match: ".com/users/", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/profile.css" ]},
		{match: ".com/games/", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/games.css" ]},
		{match: ".com/groups/", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/groups.css" ]},
		{match: ".com/communities/", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/groups.css" ]},
		
		{match: ".com/catalog", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/catalog.css" ]},
		{match: ".com/badges/", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/itempage.css" ]},
		{match: ".com/upgrades/", paths: [ "js/Theme/Pages/all.css" ]},

		{match: ".com/transactions", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/transactions.css" ]},
		// {match: ".com/trades", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/trades.css" ]},
		{match: ".com/my/messages", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/messages.css" ]},
		{match: ".com/my/avatar", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/avatar.css" ]},
		{match: ".com/my/account", paths: [ "js/Theme/Pages/all.css", "js/Theme/Pages/settings.css" ]},
		{match: ".com/my/account?roseal=", paths: [ "js/Theme/Pages/roseal.css" ]}
	];

	let isSupportedPage = false;
	Rkis.Designer.loadedStyleFile = false;
	let pageUrl = window.location.href.toLowerCase();
	if (!pageUrl.includes(".com/my")) pageUrl = pageUrl.replace(/\.com\/..\//, ".com/");
	allCssFiles.forEach((e) => {
		if(!pageUrl.includes(e.match)) return;

		putCSS(e.paths);
		Rkis.Designer.loadedStyleFile = true;
		if (!isSupportedPage) isSupportedPage = e.paths.includes("js/Theme/Pages/all.css");
	});

	if (Rkis.Designer.loadedStyleFile == false) {
		return;
	}

	if (isSupportedPage) {
		
		//settings button
		(async function () {
			let stng = await document.$watch("#navbar-settings").$promise();
			if (stng == null) return;

			stng.addEventListener("click", async () => {
				if (stng.getAttribute("aria-describedby") != null) return;

				let doc = await document.$watch("#settings-popover-menu").$promise();
				if (doc == null || doc.querySelector(".roblokis-stng-themes-button") != null) return;
				
				let rkisbtn = document.createElement("li");
				rkisbtn.innerHTML = `<a class="rbx-menu-item roblokis-stng-themes-button">Themes</a>`;
				doc.insertBefore(rkisbtn, doc.firstElementChild);

				rkisbtn.addEventListener("click", () => {
					Rkis.ThemesMenu.OpenThemes();
				});
			});
		})();
	}

	await Rkis.Designer.ReloadCurrentThemeElement();
	//await Rkis.StylesList.LoadCurrentStyles();
}

Rkis.Designer.ReloadCurrentThemeElement = async function() {
	if (Rkis.Designer.loadedStyleFile == false) return;

	let isFirstLoad = true;
	let existingTheme = document.querySelector("#rk-theme-loaded");
	if (existingTheme) {
		existingTheme.remove();
		isFirstLoad = false;
	}

	var pagetheme = Rkis.Designer.GetPageTheme();

	if(pagetheme == null) {
		var continueloading = true;
		document.$watch("body", (bodyElement) => {
			if(bodyElement.classList.contains("light-theme") == Rkis.wholeData.isUsingLightTheme) return;

			Rkis.wholeData.isUsingLightTheme = bodyElement.classList.contains("light-theme");
			Rkis.database.save()
			Rkis.Designer.ReloadCurrentTheme();
			continueloading = false;
		});

		if (continueloading == false) return;

		if(Rkis.wholeData.isUsingLightTheme == true) {
			await fetch(Rkis.fileLocation + "js/Theme/DefaultLight.Roblokis")
			.then(response => response.json())
			.then(theme => {Rkis.Designer.currentTheme = theme;})
			.catch(err => {console.error(err);})
		}
		else {
			await fetch(Rkis.fileLocation + "js/Theme/DefaultDark.Roblokis")
			.then(response => response.json())
			.then(theme => {Rkis.Designer.currentTheme = theme;})
			.catch(err => {console.error(err);})
		}
	}
	else if(pagetheme.type == "remote") {
		await fetch(pagetheme.extra)
		.then(response => response.json())
		.then(theme => {Rkis.Designer.currentTheme = theme;})
		.catch(err => {console.error(err);})
	}
	else if(pagetheme.type == "saved") {
		//load custom theme
		Rkis.Designer.currentTheme = Rkis.wholeData.Designer.Themes[pagetheme.themeId];
	}
	else { // considered a default theme
		let themeInfo = Rkis.Designer.DefaultThemes.find(x => x.themeId == pagetheme.themeId);
		if (themeInfo == null) themeInfo = Rkis.Designer.DefaultThemes.find(x => x.isDefault);

		await fetch(Rkis.fileLocation + themeInfo.location)
		.then(response => response.json())
		.then(theme => {Rkis.Designer.currentTheme = theme;})
		.catch(err => {console.error(err);})
	}

	var theme = Rkis.Designer.currentTheme;

	//TODO delete in version 4.2
	if (theme != null && theme.styles != null && Rkis.versionCompare(theme.current_version, "4.0.0.19") === 2) {
		theme.styles = theme.styles || {};

		let changeOldFormat = function(styleLoc) {
			if (styleLoc == null) return null;
			if (typeof styleLoc.type != "undefined") return styleLoc;
			for (let style in styleLoc) {
				if (style == "type") return styleLoc;
				if (typeof styleLoc[style] == "string") {
					styleLoc[style] = {
						type: styleLoc[style],
						options: null
					};
					continue;
				}
				
				styleLoc[style] = changeOldFormat(styleLoc[style]);
			}
			return styleLoc
		}

		theme.styles = changeOldFormat(theme.styles);
	}

	//save image links locally
	if (false && theme != null && Rkis.versionCompare(theme.current_version, "4.0.1.1") == 2) {
		theme.current_version = "4.0.1.1";

		let changedTheme = false;

		//save image links locally
		let changeOldFormat = async function(customizationLocation) {
			if (typeof customizationLocation != "object") return customizationLocation;
			if (customizationLocation == null) return null;
			for (let locationVariable in customizationLocation) {
				if (locationVariable == "link") {
					if (customizationLocation[locationVariable] == "") break;

					if (customizationLocation[locationVariable].startsWith("http")) {
						let localizedData = await FetchImage(customizationLocation[locationVariable]);
						if (localizedData.startsWith("url(")) localizedData = localizedData.slice(4).slice(0, -1);
						customizationLocation[locationVariable] = localizedData;
						changedTheme = true;
					}
					break;
				}
				customizationLocation[locationVariable] = await changeOldFormat(customizationLocation[locationVariable]);
			}
			return customizationLocation;
		}

		// theme.styles = changeOldFormat(theme.styles);
		theme.pages = await changeOldFormat(theme.pages);
		if (changedTheme === true) {
			Rkis.database.save();
		}
	}

	if (isFirstLoad) Rkis.StylesList.LoadCurrentStyles();
	else Rkis.StylesList.ReloadCurrentStyles();
	var styl = await Rkis.Designer.CreateThemeElement(theme);
	if (styl == null) return;

	let earlyHeadElement = document.querySelector("head");
	if (earlyHeadElement != null) {
		earlyHeadElement.appendChild(styl);
	} else {
		document.$watch("head", (e) => {
			e.append(styl);
		});
	}
	document.$watch(".light-theme, .dark-theme", (e) => {
		let isDark = theme.isDark != false;
		if (pagetheme == null) isDark = !Rkis.wholeData.isUsingLightTheme;

		changeRobloxTheme(isDark ? 'Dark' : 'Light');

		document.$watch(".home-container.expand-max-width", () => {
			document.body?.classList.add("home-expand-design");
		});
	});
}
Rkis.StylesList.ReloadCurrentStyles = async function() {
	// disable all styles
	for (const pageName in Rkis.StylesList) {
		if (!Object.prototype.hasOwnProperty.call(Rkis.StylesList, pageName)) continue;
		const pageStyles = Rkis.StylesList[pageName];

		for (const styleObjName in pageStyles) {
			if (!Object.prototype.hasOwnProperty.call(pageStyles, styleObjName)) continue;
			const styleObj = pageStyles[styleObjName];

			for (const styleOptionName in styleObj) {
				if (styleOptionName == "Current Active") continue;
				if (!Object.prototype.hasOwnProperty.call(styleObj, styleOptionName)) continue;
				const styleOption = styleObj[styleOptionName];
				//console.log("disabling style:", styleObjName, styleOptionName);
	
				if (styleOption.css) Rkis.Designer.removeCSS(styleOption.css);
				styleOption.unload?.();
			}
			
			styleObj["Current Active"] = null;
		}
	}
	
	await Rkis.StylesList.LoadCurrentStyles();
	setTimeout(() => {
		window.dispatchEvent(new Event("resize"));
	}, 450);
}
Rkis.StylesList.LoadCurrentStyles = async function() {
	if (Rkis.Designer.currentTheme == null ||
		Rkis.Designer.currentTheme.styles == null) {
		return;
	}

	let styleCodeToRun = [];
	let theme = Rkis.Designer.currentTheme;
	
	let findFile = function(styleLocation, stylesObj) {
		for (let stylePath in stylesObj) {
			let innderStyleLocation = styleLocation[stylePath];
			if (innderStyleLocation == null) continue;

			let innderStyleObj = stylesObj[stylePath];

			if (innderStyleLocation.type == null) {
				//run loop on this object
				findFile(innderStyleLocation, innderStyleObj);
				continue;
			}

			let style = innderStyleObj[innderStyleLocation.type];
			if (style == null) continue;
			innderStyleObj["Current Active"] = innderStyleLocation.type;
			if (style.css != null) {
				Rkis.Designer.addCSS(style.css);
			}
			if (style.js != null) {
				styleCodeToRun.push(() => {
					style.js(innderStyleLocation);
				});
			}
			if (style.load != null) {
				styleCodeToRun.push(() => {
					style.load(innderStyleLocation);
				});
			}
		}
	}

	findFile(theme.styles, Rkis.StylesList);
	await document.$watch("body").$promise();
	styleCodeToRun.forEach(f => f());
}
Rkis.StylesList.updateStyle = function(fullpath, newStyle) {
	if (Rkis.Designer.currentTheme == null ||
		Rkis.Designer.currentTheme.styles == null) {
		return;
	}
	
	let styleLoader = Rkis.StylesList;
	if (styleLoader != null) {
		for (let pathIndex = 0; pathIndex < fullpath.length; pathIndex++) {
			const path = fullpath[pathIndex];
			styleLoader = styleLoader?.[path];
		}
	}
	if (!styleLoader) return;
	// could probably handle options updates here, but won't be needed for the time being.
	if (styleLoader["Current Active"] == newStyle.type) return;
	if (styleLoader["Current Active"] != null) {
		let activeStyle = styleLoader[styleLoader["Current Active"]];
		if (activeStyle != null) {
			if (activeStyle.css) Rkis.Designer.removeCSS(activeStyle.css);
			activeStyle.unload?.();
			//console.log("unloaded style:", styleLoader["Current Active"], activeStyle);
		}
		styleLoader["Current Active"] = null;
	}
	let selectedStyle = styleLoader[newStyle.type];
	if (selectedStyle != null) {
		if (selectedStyle.css) Rkis.Designer.addCSS(selectedStyle.css);
		selectedStyle.load?.(newStyle);
		//console.log("loaded style:", newStyle.type, selectedStyle);
		styleLoader["Current Active"] = newStyle.type;
	}
	setTimeout(() => {
		window.dispatchEvent(new Event("resize"));
	}, 450);
}

//start loading template to save couple of milliseconds
Rkis.Designer.cssTemplateFile = fetch(Rkis.fileLocation + "js/Theme/DefaultTamplate.css")
.then(response => response.text())
.catch(() => {return null;});
Rkis.Designer.SetupTheme();

Rkis.Designer.tempTimeout = null;
Rkis.Designer.tempOriginalTheme = null;
Rkis.Designer.tempPreviewTheme = null;
Rkis.Designer.SetupTempTheme = async function() {
	if (Rkis.Designer.loadedStyleFile == false) {
		return;
	}

	if(Rkis.IsSettingDisabled("UseThemes", {
		id: "UseThemes",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionUThemes",
				description: "sectionUThemes1"
			},
			"en": {
				name: "Use Themes",
				description: "Disabling this will disable Styles and Themes!",
			}
		}
	})) {
		return;
	}


	let isTempTheme = false;
	let rawTheme = localStorage.getItem('rkis-temp-theme');
	let theme = null;

	try {
		if (rawTheme !== null) theme = JSON.parse(rawTheme);
	} catch {}
	if (theme !== null) isTempTheme = true;

	if (isTempTheme === false) {
		let tempTheme = document.getElementById('rk-temp-theme-loaded');
		if (tempTheme) tempTheme.remove();

		// let defaultTheme = document.getElementById('rk-theme-loaded');
		// if (defaultTheme) defaultTheme.setAttribute('type', 'text/css');

		if (Rkis.Designer.tempOriginalTheme) document.head.appendChild(Rkis.Designer.tempOriginalTheme);

		// Rkis.Designer.SetupTheme();

		localStorage.removeItem('rkis-temp-theme');

		return;
	}
	if (Rkis.Designer.tempPreviewTheme === rawTheme) return;
	Rkis.Designer.tempPreviewTheme = rawTheme;

	let tempTheme = document.getElementById('rk-temp-theme-loaded');
	if (tempTheme) tempTheme.remove();

	let defaultTheme = document.getElementById('rk-theme-loaded');
	// if (defaultTheme) defaultTheme.remove();
	if (defaultTheme) Rkis.Designer.tempOriginalTheme = defaultTheme.parentElement.removeChild(defaultTheme);

	if (Rkis.Designer.tempTimeout !== null) {
		clearTimeout(Rkis.Designer.tempTimeout);
		Rkis.Designer.tempTimeout = null;
	}
	if (Rkis.Designer.tempTimeout === null) {
		Rkis.Designer.tempTimeout = setTimeout(() => {
			localStorage.removeItem('rkis-temp-theme');
			Rkis.Designer.tempTimeout = null;
			Rkis.Designer.SetupTempTheme();
		}, 60e3);
	}

	var pagetheme = Rkis.Designer.GetPageTheme();

	if(pagetheme.isDefaultTheme == false) {
		//load custom theme
		Rkis.Designer.currentTheme = Rkis.wholeData.Designer.Themes[pagetheme.themeId];
	} else {
		localStorage.removeItem('rkis-temp-theme');
		Rkis.Designer.SetupTempTheme();
		return;
	}

	var styl = await Rkis.Designer.CreateThemeElement(theme);
	if (styl == null) return;
	styl.id = 'rk-temp-theme-loaded';

	document.$watch("head", (e) => {
		e.append(styl);
	});

}

document.addEventListener("visibilitychange", function() {
    if (document.hidden){
        return;
    } else {
        Rkis.Designer.SetupTempTheme();
    }
});



Rkis.ThemesMenu = {
	popupHTML: /*html*/`
	<div data-themes-popup="" class="rkis-centerpage-popup">
		<div class="rk-popup" style="width: min(100%, 50rem);min-height: 40%;max-height: 90%;">
			<div id="rk-themesection">
	
				<div style="display: flex;flex-direction: column;text-align: center;background-color: rgb(114, 118, 122, 0.4);border-radius: 20px;padding: 1% 4%;box-shadow: 0 0 8px rgb(114, 118, 122, 0.4);margin: 9px 0;">
					<span style="color: white;" data-translate="themeSelected">Selected Theme</span>
					<span id="currentthemeplace" class="text-description">Not Loaded</span>
				</div>
	
				<div class="section-content">
						<span style="font-weight: 700;" data-translate="themeDefaultSection">Default Themes:</span>
						<span class="text-description" data-translate="themeDefaultSection1">Comes with the extension...</span>
						<div class="rbx-divider" style="margin: 12px;"></div>
	
						<div class="default-theme-template">
							<div>
									<div>Simple Gradient</div>
									<span>Simple Red-Blue gradient theme</span>
							</div>
							<div style="margin-left: auto;"></div>
							<button data-designer-func="select" data-theme="Simple Gradient" data-themeid="2" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
						</div>
	
						<div class="default-theme-template">
							<div>
									<div>Dark Shadow Theme</div>
									<span></span>
							</div>
							<div style="margin-left: auto;"></div>
							<button data-designer-func="select" data-theme="Dark Shadow Theme" data-themeid="3" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
						</div>
	
						<button class="default-theme-template" style="border: 0;width: 100%;justify-content: center;" data-designer-func="show-more-themes">View More Themes</button>
	
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
	
			<div id="rk-viewmore-themesection" class="rkis-centerpage-popup hidden">
				<div class="rk-popup mini" style="width: min(100%, 45rem);min-height: 40%;max-height: 90%;">
					<h3>Official Themes</h3>
					<div class="rk-page-tab" style="display: flex;flex-direction: column;overflow: hidden;">
						<div class="rk-tabs">
							<div class="rk-tab" page="defaultthemes">Default</div>
							<div class="rk-tab is-active" page="browsethemes">Browse</div>
						</div>
						<div class="rk-tab-pages" style="overflow: auto;">
							<div class="rk-tab-page" tab="defaultthemes">
								<div id="rk-default-theme-list" style="width: 100%;">
									<div style="text-align: center;">Not Loaded</div>
								</div>
							</div>
							<div class="rk-tab-page is-active" tab="browsethemes">
								<div id="rk-browse-theme-list" style="width: 100%;">
									<div style="text-align: center;">Not Loaded</div>
								</div>
							</div>
						</div>
					</div>
					<button style="margin-top: 10px;" onclick="document.querySelector('#rk-viewmore-themesection').classList.add('hidden');" data-translate="btnCancel">Cancel</button>
				</div>
			</div>
	
			<div id="rk-createthemesection" class="rkis-centerpage-popup hidden">
				<div class="rk-popup mini">
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
									<button onclick="document.querySelector('#rk-createthemesection').classList.add('hidden');" data-translate="btnCancel">Cancel</button>
									<button data-designer-func="createthetheme" class="rk-createbtn" data-translate="btnCreate">Create</button>
								</div>
							</div>
							<div class="rk-tab-page is-active" tab="imagetheme">
								<input id="newtheme-name" placeholder="Name" data-translate="themeName">
								<input id="newtheme-desc" placeholder="Description (Optional)" style="margin-bottom: 20px;" data-translate="themeDescription">
								<!-- <input type="url" id="newtheme-image" placeholder="Image URL"> -->
								<input type="file" id="newtheme-image" accept=".jpg, .jpeg, image/png, image/bmp, image/gif, image/svg" oninput="if(this.files.length > 0) this.parentElement.querySelector('label').textContent = this.files[0].name; else this.parentElement.querySelector('label').textContent = Rkis.language['themeImport']" hidden>
								<label id="newtheme-imagename" for="newtheme-image">Upload Image</label>
								<div id="newtheme-error" class="info" style="font-size: 12px;"></div>
								<div>
									<button onclick="document.querySelector('#rk-createthemesection').classList.add('hidden');" data-translate="btnCancel">Cancel</button>
									<button data-designer-func="createthetheme" class="rk-createbtn" data-translate="btnCreate">Create</button>
								</div>
							</div>
							<div class="rk-tab-page" tab="importtheme">
								<input type="file" id="newtheme-file" accept=".roblokis" oninput="if(this.files.length > 0) this.parentElement.querySelector('label').textContent = this.files[0].name; else this.parentElement.querySelector('label').textContent = Rkis.language['themeImport']" hidden>
								<label id="newtheme-filename" for="newtheme-file" data-translate="themeImport">Import Theme</label>
								<div id="newtheme-error" class="info" style="font-size: 12px;">NOTE: Only "Pre-made" Roblokis themes are accepted.<br>For Images: Upload image online and use it's link instead!</div>
								<div>
									<button onclick="document.querySelector('#rk-createthemesection').classList.add('hidden');" data-translate="btnCancel">Cancel</button>
									<button data-designer-func="createthetheme" class="rk-createbtn" data-translate="btnCreate">Create</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
	
			<div id="rk-deletethemesection" class="rkis-centerpage-popup hidden">
				<div class="rk-popup mini">
					<h3 data-translate="themeDeleteTitle">Delete Theme</h3>
					<div class="info">
						<span data-translate="themeDeleteText">Are You Sure on Deleting </span>
						<span id="deletetheme-themename"></span>
					</div>
					<div>
						<button onclick="document.querySelector('#rk-deletethemesection').classList.add('hidden');" data-translate="btnCancel">Cancel</button>
						<button data-designer-func="deletethetheme" id="deletetheme-button" data-themeid="" data-translate="btnDelete">Delete</button>
					</div>
				</div>
			</div>
	
		</div>
	</div>
	<style>

		.rkis-centerpage-popup {
			z-index: 1000000;
			display: flex;
			position: fixed;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			width: 100%;
			height: 100%;
			padding: 4%;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			flex-wrap: wrap;
			pointer-events: all;
		}

		.rkis-centerpage-popup .rk-tabbed-window {
			display: flex;
			flex-direction: column;
			width: fit-content;
			height: fit-content;
			pointer-events: all;
			position: relative;
			align-items: center;
			justify-content: center;
			overscroll-behavior: contain;
			box-shadow: black 0px 0px 20px 2px;
			padding: 1rem 2rem 1.5rem;
		}

		.rk-tabbed-window > .rk-tabs {
			display: flex;
			margin-bottom: 2rem;
			justify-content: center;
			align-items: center;
			gap: 2ch;
		}
		.rk-tabbed-window > .rk-tabs > .rk-tab {
			color: grey;
			cursor: pointer;
			box-shadow: 0px 1px;
		}
		.rk-tabbed-window > .rk-tabs > .rk-tab.is-active {
			color: white;
		}
		.rk-tabbed-window > .rk-tab-pages,
		.rk-tabbed-window > .rk-tab-pages > .rk-tab-page {
			height: 100%;
			width: 100%;
		}
		.rk-tabbed-window > .rk-tab-pages > .rk-tab-page:not(.is-active) {
			display: none;
		}

		[data-themes-popup],
		[data-themes-popup] .rkis-centerpage-popup  {
			background-color: rgba(0,0,0,0.3);
		}

		[data-themes-popup] .section-content {
			border-radius: 16px;
		}

		.rk-popup > .rk-popup-content > [data-nav-tab] > * {
			border-radius: 10px;
			overflow: hidden;
		}

		.rk-page-tab,
		.rk-tab-pages {
			width: 100%;
			height: 100%;
		}
		.rk-page-tab {
			display: flex;
			flex-direction: column;
		}
		.rk-tabs {
			display: flex;
			gap: 1ch;
			margin-bottom: 2rem;
			justify-content: center;
			align-items: center;
		}
		.rk-tabs .rk-tab {
			color: grey;
			cursor: pointer;
			box-shadow: 0 1px;
		}
		.rk-tab.is-active {
			color: white;
		}
		.rk-tab-page {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.rk-tab-page:not(.is-active) {
			display: none;
		}

		[data-nav-tab]:not(.active) {
			display: none;
		}

		[data-themes-popup] h3 {
			width: fit-content;
			border: 1px solid #b8b8b8;
			border-radius: 20px;
			padding: 0 12px;
			margin: 0 0 10px 0;
		}

		.rk-popup {
			border-radius: 12px;
			background-color: rgb(35, 37, 42);
			padding: 1rem 1.5rem;
			box-shadow: 0 0 16px black;
		}
		
		.rk-popup.mini {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	
		.default-theme-template,
		.theme-template {
			background-color: rgb(17.5, 18.5, 19.5, 0.4);
			border-radius: 20px;
			padding: calc(1% + 5px) calc(2% + 10px);
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: calc(1% + 5px);
		}
	
		.default-theme-template > button,
		.theme-template > button,
		.theme-template-button {
			font-weight: 500;
			border: 0;
			padding: 1% 3%;
			border-radius: 8px;
			font-size: 14px;
			margin-right: 1%;
		}
		.add-components-card > button {font-size: 16px;}
	
		.default-theme-template > button {
			background-color: rgb(57 59 61);
			color: white;
		}
	
		.default-theme-template > div > div,
		.theme-template > div > div {
			font-size: 12px;
			font-weight: 600;
		}
		.add-components-card > div > div {font-size: 14px;}
	
		.default-theme-template > div > span,
		.theme-template > div > span {
			font-size: 10px;
			color: rgb(255 255 255 / 60%);
			font-weight: 400;
			display: block;
			line-height: normal;
		}
		.add-components-card > div > span {font-size: 12px;}
	
	
	
		#rk-deletethemesection .rk-popup > div > button#deletetheme-button {
			background-color: rgb(184 59 61);
			color: rgb(35 37 39);
		}
	
		#rk-createthemesection .rk-popup input:not([type="file"]) {
			margin-bottom: 6px;
		}
		#rk-createthemesection .rk-popup input[type="file"] {
			margin-bottom: 2px;
			width: 0px;
			height: 0px;
		}
		#rk-createthemesection .rk-popup label {
			margin-bottom: 6px;
			width: 210.4px;
			border-radius: 2px;
			text-align: center;
			background: rgb(21 21 24);
			border-top: 2px solid rgb(6 6 7);
			border-left: 2px solid rgb(6 6 7);
			border-bottom: 1px solid rgb(17 18 21);
			border-right: 1px solid rgb(17 18 21);
			font-size: 14px;
		}
		.light-theme #rk-createthemesection .rk-popup label {
			background: rgba(0,0,0,.1);
			border-top: 2px solid rgba(0,0,0,.1);
			border-left: 2px solid rgba(0,0,0,.1);
			border-bottom: 1px solid rgba(0,0,0,.1);
			border-right: 1px solid rgba(0,0,0,.1);
		}
	
		#rk-deletethemesection .rk-popup > div.info,
		#rk-createthemesection .rk-popup div.info {
			margin-bottom: 10px;
			color: rgb(255 0 0);
			font-weight: 500;
		}
	
		#rk-viewmore-themesection .rk-popup button,
		#rk-deletethemesection .rk-popup > div > button,
		#rk-createthemesection .rk-popup div > div > button {
			background-color: rgb(57 59 61);
			border: 0;
		}
	
		#rk-createthemesection .rk-popup div > div > button.rk-createbtn {
			background-color: rgb(57 184 61);
			color: rgb(35 37 39);
		}
	
		#rk-createthemesection div.rk-popup div > div:not(.info) > button:not(.rk-createbtn),
		#rk-deletethemesection > div.rk-popup > div:not(.info) > button:not(#deletetheme-button),
		#deletetheme-themename {
			color: white;
		}
	
		.light-theme #deletetheme-themename {
			color: black;
		}
	</style>
	`,

	OpenThemes: function() {
		// add element
		let holder = document.createElement('div');
		holder.innerHTML = this.popupHTML;
		document.body.appendChild(holder);

		//setup popup
		let mainPopup = holder.querySelector("[data-themes-popup]");
		mainPopup.addEventListener("pointerdown", (e) => {
			if (e.target != mainPopup) return;
			document.addEventListener("pointerup", (e) => {
				if (e.target != mainPopup) return;
				//this.unload();
				holder.remove();
			}, { once: true });
		});
		holder.querySelectorAll(".rkis-centerpage-popup").forEach((popup) => {
			popup.addEventListener("pointerdown", (e) => {
				if (e.target != popup) return;
				document.addEventListener("pointerup", (e) => {
					if (e.target != popup) return;
					//this.unload();
					popup.classList.add("hidden");
				}, { once: true });
			});
		});

		this.Designer.documentPopup = holder;
		this.Designer.LoadThemesData();
		this.Designer.SetupListeners(holder);
	},

	Designer: {
		MaxCustomThemes: 5,
		/** @type {HTMLDivElement} */
		documentPopup: null,

		LoadThemesData: async function() {
			// update selected theme text
			document.querySelector("#currentthemeplace").textContent = Rkis.Designer.GetPageTheme()?.name || "Default Theme";
		
			this.LoadCustomThemesData();
			this.LoadDefaultThemesData();
			this.LoadBrowseThemesData();
		},
	
		LoadCustomThemesData: async function() {
			var customthemesholder = await document.$watch("#customthemesholder").$promise();
			customthemesholder.innerHTML = "";
		
			var wholedata = Rkis.wholeData || {};
			wholedata.Designer = wholedata.Designer || {};
			wholedata.Designer.Theme = wholedata.Designer.Theme || {};
			wholedata.Designer.Themes = wholedata.Designer.Themes || [];
		
			const loadedTheme = Rkis.Designer.GetPageTheme();
			let loadedCustomThemeId = -1;
			if (loadedTheme && loadedTheme.type == "saved") {
				loadedCustomThemeId = parseInt(loadedTheme.themeId);
			}
		
			var letterNumber = /^[\s0-9a-zA-Z-_]+$/g;
		
			for(var i = 0; i < this.MaxCustomThemes; i++) {
				var theme = wholedata.Designer.Themes[i];
				//name.match(letterNumber), desc.match(letterNumber)
				if(theme != null) {
					var daname = theme.name.match(letterNumber);
					var dadesc = theme.description.match(letterNumber);
					if(theme.description == "") dadesc = [""];
		
					var fileSize = JSON.stringify(theme).length;
					var fileSizeText = 'b';
		
					if(fileSize > 1024) {
						fileSize /= 1024;
						fileSizeText = 'Kb';
					}
					if(fileSize > 1024) {
						fileSize /= 1024;
						fileSizeText = 'Mb';
					}
					if(fileSize > 1024) {
						fileSize /= 1024;
						fileSizeText = 'Gb';
					}
					fileSize = Math.floor(fileSize);
		
					customthemesholder.innerHTML += `
						<div class="theme-template" style="${loadedCustomThemeId == i ? "outline: 2px solid rgb(57 184 61);": ""}">
							<div>
								<div>${daname ? daname[0] : Rkis.language["error"]}</div>
								<span>${dadesc ? dadesc[0] : Rkis.language["error"]}</span>
							</div>
							<div style="margin-left: auto;"></div>
							<span style="font-size: 12px;font-weight: 100;margin-right: 1%;">(${fileSize} ${fileSizeText})</span>
							<button data-designer-func="export" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 59 184);color: rgb(35 37 39);font-size: 20px;">⤓</button>
							<button data-designer-func="delete" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(184 59 61);color: rgb(35 37 39);font-weight: 600;">X</button>
							<button data-designer-func="edit" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 184 61);color: rgb(35 37 39);" data-translate="btnEdit">Edit</button>
							<button data-designer-func="select" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 59 61);color: white;${theme.all == null && theme.pages?.all == null ? "display: none;" : ""}" data-translate="btnSelect">Select</button>
						</div>`;
				}
				else {
					if (i != 0) continue;
					customthemesholder.innerHTML += `
						<div class="theme-template">
							<div>
								<div>${Rkis.language.get("themeSlotNumber", i + 1)}</div>
								<span></span>
							</div>
							<div style="margin-left: auto;"></div>
							<button data-designer-func="create" style="background-color: rgb(57 184 61);color: rgb(35 37 39);" data-translate="btnCreate">Create</button>
						</div>`;
				}
			}
		
			if (wholedata.Designer.Themes.length < 5) {
				const createButton = HTMLParser('<button class="theme-template-button" data-designer-func="create" style="background-color: rgb(57 184 61);color: rgb(35 37 39);border-radius: 2rem;position: absolute;top: .5rem;right: 1rem;"  data-translate="btnCreate">', "Create");
				customthemesholder.prepend(createButton);
			}
		},
		
		LoadDefaultThemesData: async function() {
			var defaultthemesholder = await document.$watch("#rk-default-theme-list").$promise();
			defaultthemesholder.innerHTML = "";
		
			for(var i = 0; i < Rkis.Designer.DefaultThemes.length; i++) {
				var theme = Rkis.Designer.DefaultThemes[i];
		
				var daname = escapeHTML(theme.name);
				var dadesc = escapeHTML(theme.description);
		
				defaultthemesholder.innerHTML += `
					<div class="default-theme-template">
						<div>
							<div>${daname ? daname : Rkis.language["error"]}</div>
							<span>${dadesc ? dadesc : ""}</span>
						</div>
						<div style="margin-left: auto;"></div>
						<button data-designer-func="select" data-theme="${daname ? daname : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
					</div>`;
			}
		},
		
		BrowseThemeList: [],
		LoadBrowseThemesData: async function() {
			var browsethemesholder = await document.$watch("#rk-browse-theme-list").$promise();
			if (this.BrowseThemeList.length == 0) {
		
				let themes = await fetch("https://ameerdotexe.github.io/roblokis/data/themes/top.json")
				.then(res => res.json())
				.catch(() => []);

				if (themes == null || themes.length == 0) return;
				this.BrowseThemeList = themes;
			}
		
			if (this.BrowseThemeList.length == 0) return;
			browsethemesholder.innerHTML = "";
		
			for(var i = 0; i < this.BrowseThemeList.length; i++) {
				var theme = this.BrowseThemeList[i];
		
				let themeUrl = theme.link.file || theme.link.dark;
				if (themeUrl == null) continue;
		
				var daname = escapeHTML(theme.name);
				var dadesc = escapeHTML(`Author: ${theme.author}`);
		
				browsethemesholder.innerHTML += `
					<div class="default-theme-template">
						<div>
							<div>${daname ? daname : Rkis.language["error"]}${theme.animated ? ` <span style="border: 1px solid;border-radius: 4px;padding: 1px 3px;color: cornflowerblue;">Animated</span>` : ''}</div>
							<span>${dadesc ? dadesc : Rkis.language["error"]}</span>
						</div>
						<div style="margin-left: auto;"></div>
						<button data-designer-func="select" data-theme="${daname ? daname : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" data-type="remote" data-extra="${escapeHTML(themeUrl)}">Try</button>
						<button data-designer-func="add-remote-theme" data-themenum="${i}">Import</button>
					</div>`;
			}
		},


		/** @param {HTMLDivElement} doc */
		SetupListeners: function(doc) {
			doc.$watchLoop("[data-designer-func]", (e) => {
				var i = e.dataset.themeid;
				if(isNaN(Number(i)) == false) i = Number(i);
				var daname = e.dataset.theme;
		
				switch (e.dataset.designerFunc.toLowerCase()) {
					default: return console.error("D618");
					case "show-more-themes":
						e.$on("click", () => {
							doc.querySelector("#rk-viewmore-themesection").classList.remove("hidden");
						})
						break;
					case "add-remote-theme":
						e.$on("click", async () => {
							e.disabled = true;
							e.style.opacity = "0.5";
		
							let themeInfo = this.BrowseThemeList[e.dataset.themenum];
							if (themeInfo == null) {
								Rkis.Toast("Error D3887: 404 not found.");
								return;
							}
		
							
							let themeUrl = themeInfo.link.file || themeInfo.link.dark;
							if (themeUrl == null) {
								Rkis.Toast("Error D3894: 404 not found.");
								return;
							}
		
							let themeFile = await fetch(themeUrl)
							.then(response => response.json())
							.catch(err => {console.error(err);return null;});
							if (themeFile == null) {
								Rkis.Toast("Error D3902: 404 not found.");
								e.disabled = false;
								e.style.opacity = "1";
								return;
							}
		
							
							var antiLetterNumber = /[^\s0-9a-zA-Z-_]/g;
							var daname = themeInfo.name.replaceAll(antiLetterNumber, "");
							var dadesc = `By ${themeInfo.author}`.replaceAll(antiLetterNumber, "");
		
							let safetycheck = await this.SaveNewTheme(daname, dadesc, themeFile, {
								skipTemplate: true,
							});
							if (safetycheck.error != null) {
								Rkis.Toast("Error D3916: "+safetycheck.error);
								// console.error(safetycheck.error);
								return;
							}
		
							this.LoadThemesData();
							document.querySelector("#rk-viewmore-themesection").classList.add("hidden");
		
							e.disabled = false;
							e.style.opacity = "1";
						})
						break;
					case "create":
						e.$on("click", () => {
							doc.querySelector("#rk-createthemesection").classList.remove("hidden");
						});
						break;
					case "export":
						e.$on("click", () => {
							this.ExportTheme(e, daname, i);
						})
						break;
					case "delete":
						e.$on("click", () => {
							this.DeleteTheme(daname, i);
						})
						break;
					case "edit":
						e.$on("click", () => {
							this.EditTheme(i);
						})
						break;
					case "select":
						e.$on("click", () => {
							this.SelectThemeButton(e);
						})
						break;
					case "createthetheme":
						e.$on("click", () => {
							this.CreateNewTheme(e);
						})
						break;
					case "deletethetheme":
						e.$on("click", () => {
							this.DeleteTheTheme(e);
						})
						break;
				}
			});
		},

		
		SaveNewTheme: async function(name, desc, themedata, options = {}) {
			var wholedata = Rkis.wholeData || {};
			wholedata.Designer = wholedata.Designer || {};
			wholedata.Designer.Themes = wholedata.Designer.Themes || [];
		
			if(wholedata.Designer.Themes.length >= this.MaxCustomThemes) return {error: Rkis.language["errorMaxSlots"]};
		
			var existingtheme = wholedata.Designer.Themes.find(x => x.name == name);
			if(existingtheme != null) return {error: Rkis.language["errorNameExist"]};
		
			var themetemplate = await fetch(Rkis.fileLocation + "js/Theme/Tamplate.Roblokis")
			.then(response => response.json())
			.catch(err => {console.error(err); return {};})
		
			var thenewtheme = {
				name: name,
				description: desc,
				start_version: Rkis.version,
				current_version: Rkis.version
			};
		
			let isOlderThenTemplate = Rkis.versionCompare("4.0.0.23", themedata.current_version) === 1;
			themedata.pages = themedata.pages || {};
			for (let page in themedata) {
				if (themedata[page].css == null) continue;
		
				themedata.pages[page] = themedata[page].css;
				delete themedata[page];
			}
		
			if(themedata != null) thenewtheme = Rkis.ThemesMenu.jsonConcat(themedata, thenewtheme);
			let finalFile = thenewtheme; //compare with latest template edit version
			if (options.skipTemplate !== true || isOlderThenTemplate === true) finalFile = Rkis.ThemesMenu.jsonConcat(themetemplate, thenewtheme);
		
			wholedata.Designer.Themes.push(finalFile);
		
			Rkis.wholeData = wholedata;
			Rkis.database.save();
		
			return {};
			
		},
		
		SelectThemeButton: function(button) {
			if(button == null) return;
		
			let SelectedTheme = {};
			SelectedTheme.name = button.dataset.theme;
			SelectedTheme.id = button.dataset.themeid;
			SelectedTheme.type = button.dataset.type;
			SelectedTheme.extra = button.dataset.extra;
			SelectedTheme.isDefaultTheme = button.dataset.isdefaulttheme != "false";
		
			Rkis.wholeData.Designer = Rkis.wholeData.Designer || {};
			Rkis.wholeData.Designer.Theme = {...SelectedTheme};
		
			Rkis.database.save();
		
			//this.LoadThemesData();
			this.documentPopup.remove();
			Rkis.Designer.ReloadCurrentThemeElement();
		
			// TODO: remove live preview stuff
			localStorage.removeItem('rkis-temp-theme');
			//Designer.ThemeEditor.liveThemeAutoReset = null;
			//Designer.ThemeEditor.isLivePreview = false;
			//page.toggleSwich(document.querySelector('#rkpage .main .themes [data-designer-func="livepreview"]'), false);
		},
		
		CreateNewTheme: async function(button) {
			button.disabled = true;
			button.style.opacity = "0.5";
		
			var tabPage = button.closest(".rk-tab-page");
		
			var newthemename = tabPage.querySelector("#newtheme-name");
			var newthemedesc = tabPage.querySelector("#newtheme-desc");
			var newthemeimage = tabPage.querySelector("#newtheme-image");
			var newthemefile = tabPage.querySelector("#newtheme-file");
			var errorplace = tabPage.querySelector("#newtheme-error");
			
			var themename = "";
			var	themedesc = "";
			var filetheme = null;
			var themeimage = null;
		
			//if has name/description then just put them
			if (newthemename != null) themename = newthemename.value;
			if (newthemedesc != null) themedesc = newthemedesc.value;
			//if (newthemeimage != null) themeimage = newthemeimage.value;
		
			if (newthemefile != null && newthemefile.files.length > 0) {
				try{
					filetheme = JSON.parse(await newthemefile.files[0].text())
				}catch{}
			} else if (newthemeimage != null && newthemeimage.files.length > 0) {
				await (new Promise(callback => {
					let reader = new FileReader();
					reader.onload = function () { callback(this.result) };
					reader.readAsDataURL(newthemeimage.files[0]);
				}))
				.then((imageUri) => {
					themeimage = imageUri;
				})
				.catch(()=>{});
			}
		
			if(filetheme != null) {
				if(themename == "") {
					themename = filetheme.name;
				}
		
				if(themedesc == "") {
					themedesc = filetheme.description;
				}
			}
		
			var safetycheck = await this.TestThemeDetails(themename, themedesc);
		
			if (filetheme == null) {
				if (newthemeimage != null) filetheme = {"pages":{"all":{"background":{
					"color": "rgba(25,27,29,100%)",
					"image":{
						"link": themeimage,
						"attachment": "fixed",
						"repeat": "round",
						"size": "contain",
					}
				}}}};
				filetheme = filetheme || {};
				filetheme.isDark = document.body.classList.contains('dark-theme');
			}
		
			if (safetycheck.error == null) safetycheck = await this.SaveNewTheme(themename, themedesc, filetheme);
			if (safetycheck.error != null) {
				errorplace.textContent = safetycheck.error;
		
				button.disabled = false;
				button.style.opacity = "1";
		
				return;
			}
		
			this.LoadThemesData();
		
			document.querySelector("#rk-createthemesection").classList.add("hidden");
			errorplace.textContent = "";
		
			button.disabled = false;
			button.style.opacity = "1";
		},
		
		TestThemeDetails: async function(name, desc) {
			if(name == null) name = "";
			if(desc == null) desc = "";
		
			if(
				name.length > 24 ||
				name.length < 3
			) {
				return {error: Rkis.language["errorNameLength"]};
			}
			if( desc.length > 36 ) {
				return {error: Rkis.language["errorDescLength"]};
			}
		
			var letterNumber = /^[\s0-9a-zA-Z-_]+$/;
			//console.log(!letterNumber.test(name), (desc != "" ? !letterNumber.test(desc) : false));
			if(!letterNumber.test(name) || (desc != "" ? !letterNumber.test(desc) : false)) {
				return {error: Rkis.language["errorAtoZ"]};
			}
		
			/*if (imageUrl != null) {
				if (imageUrl == "" || imageUrl.toLowerCase().startsWith("https") == false) return {error: Rkis.language["errorNoImage"]};
		
				var result = await FetchImage(imageUrl, true);
				if (result == null || result == imageUrl) return {error: Rkis.language["cantImage"]};
		
				return {image: result};
			}*/
			
			return {};
		},
		
		ExportTheme: function(button, themename, themeId) {
			button.disabled = true;
			button.style.opacity = "0.5";
		
			if(isNaN(themeId)) {
				button.disabled = false;
				button.style.opacity = "1";
				return;
			}
		
			var wholedata = Rkis.wholeData || {};
			wholedata.Designer = wholedata.Designer || {};
			wholedata.Designer.Themes = wholedata.Designer.Themes || [];
		
			var theme = wholedata.Designer.Themes[themeId];
		
			if(theme == null) {
				button.disabled = false;
				button.style.opacity = "1";
				return;
			}
		
			Rkis.ThemesMenu.makeTextFile(JSON.stringify(theme), themename + ".roblokis");
		
			button.disabled = false;
			button.style.opacity = "1";
		},
		
		DeleteTheme: function(themename, themeId) {
			document.querySelector("#deletetheme-button").dataset.themeid = themeId;
			document.querySelector("#deletetheme-themename").textContent = themename;
			document.querySelector("#rk-deletethemesection").classList.remove("hidden");
		},
		
		DeleteTheTheme: function(button) {
			button.disabled = true;
			button.style.opacity = "0.5";
		
			if(button.dataset.themeid == null || button.dataset.themeid == "") {
				document.querySelector("#rk-deletethemesection").classList.add("hidden");
				button.disabled = false;
				button.style.opacity = "1";
				return;
			}
		
			var themeId = Number(button.dataset.themeid);
			if(isNaN(themeId)) {
				document.querySelector("#rk-deletethemesection").classList.add("hidden");
				button.disabled = false;
				button.style.opacity = "1";
				return;
			}
		
			var wholedata = Rkis.wholeData || {};
			wholedata.Designer = wholedata.Designer || {};
			wholedata.Designer.Themes = wholedata.Designer.Themes || [];
		
			if(wholedata.Designer.Themes[themeId] != null)
				wholedata.Designer.Themes.splice(themeId, 1);
		
			Rkis.wholeData = wholedata;
			Rkis.database.save();
		
			this.LoadThemesData();
		
			document.querySelector("#rk-deletethemesection").classList.add("hidden");
			button.disabled = false;
			button.style.opacity = "1";
		},
		
		EditTheme: function(themeId) {
			//Designer.ThemeEditor.themeId = themeId;
			//Designer.ThemeEditor.Load();
		
			//document.querySelector('#rk-editthemesection').classList.remove('hidden');

			this.SelectCustomTheme(themeId);
			this.documentPopup.remove();
			Rkis.Designer.ReloadCurrentThemeElement();

			// change current theme
			Rkis.ThemeEdtior.initilize(themeId);
		},

		SelectCustomTheme: function(themeId) {
			let savedTheme = Rkis.wholeData.Designer.Themes?.[themeId];
			if (!savedTheme) return;

			let SelectedTheme = {};
			SelectedTheme.name = savedTheme.name;
			SelectedTheme.id = themeId;
			SelectedTheme.type = null;
			SelectedTheme.extra = null;
			SelectedTheme.isDefaultTheme = false;
		
			Rkis.wholeData.Designer = Rkis.wholeData.Designer || {};
			Rkis.wholeData.Designer.Theme = {...SelectedTheme};
		
			Rkis.database.save();
		},
	},

	jsonConcat: function(o1, o2) {
		for (var key in o2) {
			 if(o1[key] == null) o1[key] = o2[key];
			 else {
				 if(o1[key].toString() == "[object Object]" && o2[key] != null && o2[key].toString() == "[object Object]")
					 Rkis.ThemesMenu.jsonConcat(o1[key], o2[key]);
				 else o1[key] = o2[key];
			 }
		}
		return o1;
	},
	
	makeTextFile: function(text, filename) {
		var textFile = null;
		var data = new Blob([text], {type: 'text/plain'});

		textFile = window.URL.createObjectURL(data);

		var link = document.createElement('a');
		link.setAttribute('download', filename);
		link.href = textFile;
		document.body.appendChild(link);

		window.requestAnimationFrame(function () {
			var event = new MouseEvent('click');
			link.dispatchEvent(event);
			document.body.removeChild(link);

			if(textFile !== null) {
				window.URL.revokeObjectURL(textFile);
			}
		});
	},
}