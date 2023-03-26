"use strict";
var Rkis = Rkis || {};
var Designer = Designer || {};

Designer.Selected = {};
Designer.MaxCustomThemes = 5;


function FetchImage(url, quick) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({about: "getImageRequest", url: url, quick: quick}, 
		function(data) {
			resolve(data)
		})
	})
}


Designer.LoadThemesData = async function() {
	var customthemesholder = await document.$watch("#customthemesholder").$promise();
	customthemesholder.innerHTML = "";

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Theme = wholedata.Designer.Theme || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var letterNumber = /^[\s0-9a-zA-Z-_]+$/g;

	document.querySelector("#currentthemeplace").innerText = (wholedata.Designer.Theme.isDefaultTheme != true ? (wholedata.Designer.Themes[wholedata.Designer.Theme.id] ? wholedata.Designer.Themes[wholedata.Designer.Theme.id].name : "Default Theme") : wholedata.Designer.Theme.name);

	for(var i = 0; i < Designer.MaxCustomThemes; i++) {
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
				<div class="theme-template">
					<div>
						<div>${daname ? daname[0] : Rkis.language["error"]}</div>
						<span>${dadesc ? dadesc[0] : Rkis.language["error"]}</span>
					</div>
					<div style="margin-left: auto;"></div>
				<span style="font-size: 12px;font-weight: 100;margin-right: 1%;">(${fileSize} ${fileSizeText})</span>
					<button class="designer-btn export" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 59 184);color: rgb(35 37 39);font-size: 20px;">⤓</button>
					<button class="designer-btn delete" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(184 59 61);color: rgb(35 37 39);font-weight: 600;">X</button>
					<button class="designer-btn edit" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 184 61);color: rgb(35 37 39);" data-translate="btnEdit">Edit</button>
					<button class="designer-btn select" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 59 61);color: white;${theme.all == null ? "display: none;" : ""}" data-translate="btnSelect">Select</button>
				</div>`;
		}
		else {
			customthemesholder.innerHTML += `
				<div class="theme-template">
					<div>
						<div>${Rkis.language.get("themeSlotNumber", i + 1)}</div>
						<span></span>
					</div>
					<div style="margin-left: auto;"></div>
					<button class="designer-btn create" style="background-color: rgb(57 184 61);color: rgb(35 37 39);" data-translate="btnCreate">Create</button>
				</div>`;
		}
	}
}

Designer.SaveNewTheme = async function(name, desc, themedata) {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	if(wholedata.Designer.Themes.length >= Designer.MaxCustomThemes) return {error: Rkis.language["errorMaxSlots"]};

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

	if(themedata != null) thenewtheme = jsonConcat(themedata, thenewtheme);

	wholedata.Designer.Themes.push(jsonConcat(themetemplate, thenewtheme));

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

	return {};
	
}

Designer.SelectThemeButton = function(button) {
	if(button == null) return;

	Designer.Selected.name = button.dataset.theme;
	Designer.Selected.id = button.dataset.themeid;
	Designer.Selected.isDefaultTheme = button.dataset.isdefaulttheme != "false";

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};

	wholedata.Designer.Theme = {...Designer.Selected};

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

	Designer.LoadThemesData();
}

Designer.CreateTheme = function() {
	document.querySelector("#rk-createthemesection").style.display = "flex";
}

Designer.CreateNewTheme = async function(button) {
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
	if (newthemeimage != null) themeimage = newthemeimage.value;

	if (newthemefile != null) {
		try{
			if(newthemefile.files.length > 0) {
				filetheme = JSON.parse(await newthemefile.files[0].text())
			}
		}catch{}
	}

	if(filetheme != null) {
		if(themename == "") {
			themename = filetheme.name;
		}

		if(themedesc == "") {
			themedesc = filetheme.description;
		}
	}

	var safetycheck = await Designer.TestThemeDetails(themename, themedesc, themeimage);

	if (newthemeimage != null) filetheme = {"all":{"css":{"background":{"image":{"link":themeimage}}}}};

	if (safetycheck.error == null) safetycheck = await Designer.SaveNewTheme(themename, themedesc, filetheme);
	if (safetycheck.error != null) {
		errorplace.innerText = safetycheck.error;

		button.disabled = false;
		button.style.opacity = "1";

		return;
	}

	Designer.LoadThemesData();

	document.querySelector("#rk-createthemesection").style.display = "none";
	errorplace.innerText = "";

	button.disabled = false;
	button.style.opacity = "1";
}

Designer.TestThemeDetails = async function(name, desc, imageUrl) {
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

	if (imageUrl != null) {
		if (imageUrl == "" || imageUrl.toLowerCase().startsWith("https") == false) return {error: Rkis.language["errorNoImage"]};

		var result = await FetchImage(imageUrl, true);
		if (result == null || result == imageUrl) return {error: Rkis.language["cantImage"]};

		return {image: result};
	}
	
	return {};
}

Designer.ExportTheme = function(button, themename, themeId) {
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

	makeTextFile(JSON.stringify(theme), themename + ".roblokis");

	button.disabled = false;
	button.style.opacity = "1";
}

Designer.DeleteTheme = function(themename, themeId) {
	document.querySelector("#deletetheme-button").dataset.themeid = themeId;
	document.querySelector("#deletetheme-themename").innerText = themename;
	document.querySelector("#rk-deletethemesection").style.display = "flex";
}

Designer.DeleteTheTheme = function(button) {
	button.disabled = true;
	button.style.opacity = "0.5";

	if(button.dataset.themeid == null || button.dataset.themeid == "") {
		document.querySelector("#rk-deletethemesection").style.display = "none";
		button.disabled = false;
		button.style.opacity = "1";
		return;
	}

	var themeId = Number(button.dataset.themeid);
	if(isNaN(themeId)) {
		document.querySelector("#rk-deletethemesection").style.display = "none";
		button.disabled = false;
		button.style.opacity = "1";
		return;
	}

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	if(wholedata.Designer.Themes[themeId] != null)
		wholedata.Designer.Themes.splice(themeId, 1);

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

	Designer.LoadThemesData();

	document.querySelector("#rk-deletethemesection").style.display = "none";
	button.disabled = false;
	button.style.opacity = "1";
}

Designer.EditTheme = function(themeId) {
	Designer.ThemeEditor.themeId = themeId;

	Designer.ThemeEditor.Load();
	document.querySelector("#rk-editthemesection").style.display = "flex";
}



Designer.ThemeEditor = Designer.ThemeEditor || {};

Designer.ThemeEditor.Save = function() {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var theme = wholedata.Designer.Themes[Designer.ThemeEditor.themeId];
	if(theme == null) return;

	var allThemeTabs = document.querySelectorAll(`[data-editthemetabs]`);
	for(var tabindex = 0; tabindex < allThemeTabs.length; tabindex++) {
		var tab = allThemeTabs[tabindex];
		if(tab.dataset.editthemetabs == null || tab.dataset.editthemetabs == "") return;
		if(theme[tab.dataset.editthemetabs] == null || theme[tab.dataset.editthemetabs].css == null)
			theme[tab.dataset.editthemetabs] = {css: {}};

		var allInputs = tab.querySelectorAll(`[data-location][data-type]`);
		for(var inputindex = 0; inputindex < allInputs.length; inputindex++) {
			var input = allInputs[inputindex];
			if(input.dataset.location == null || input.dataset.location == "") continue;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;
			var newplace = theme[tab.dataset.editthemetabs].css;
			var stringplace = "null";

			for (var i = 0; i < placewithoutdots.length && newplace != null; i++) {
				newplace = newplace[placewithoutdots[i]];
			}

			for (var i = 0; i < placewithoutdots.length; i++) {
				stringplace = stringplace.replace("null" ,`{"${placewithoutdots[i]}":null}`);
			}

			var valueToInput = input.value;
			var valueData = Designer.ThemeEditor.GetTypeValue(input.dataset.type, valueToInput, newplace);

			stringplace = stringplace.replace("null", JSON.stringify(valueData));

			var jsonplace = null;

			try {
				jsonplace = JSON.parse(stringplace);
			}
			catch {}

			theme[tab.dataset.editthemetabs].css = jsonConcat(place, jsonplace);
		}


		if(theme[tab.dataset.editthemetabs] == null || theme[tab.dataset.editthemetabs].css == null) {
			theme[tab.dataset.editthemetabs] = {css: {}};
		}

		tab.querySelectorAll(`[data-location][data-enabled]`).forEach(input => {
			if(input.dataset.location == null) return;

			if(page.getSwich(input)) return;

			if(theme[tab.dataset.editthemetabs] == null) return;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;
			var stringplace = "null";

			for(var i = 0; i < placewithoutdots.length; i++) {
				stringplace = stringplace.replace("null" ,`{"${placewithoutdots[i]}":null}`);
			}

			var jsonplace = null;

			try {
				jsonplace = JSON.parse(stringplace);
			}
			catch {}

			theme[tab.dataset.editthemetabs].css = jsonConcat(place, jsonplace);
		})
	}

	theme.current_version = Rkis.version;

	wholedata.Designer.Themes[Designer.ThemeEditor.themeId] = theme;

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

	document.querySelector("#rk-editthemesection").style.display = "none";
}

Designer.ThemeEditor.Load = function() {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var theme = wholedata.Designer.Themes[Designer.ThemeEditor.themeId];
	if(theme == null) return;

	document.$triggerCustom("designer-edittheme-loading");

	document.querySelectorAll(`[data-editthemetabs]`).forEach((tab, tabindex, tablist) => {
		if(tab.dataset.editthemetabs == null || tab.dataset.editthemetabs == "") return;
		if(theme[tab.dataset.editthemetabs] == null || theme[tab.dataset.editthemetabs].css == null) return;

		tab.querySelectorAll(`[data-location][data-type]`).forEach(input => {
			if(input.dataset.location == null || input.dataset.location == "") return;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;

			for(var i = 0; i < placewithoutdots.length && place != null; i++) {
				place = place[placewithoutdots[i]];
			}

			if(place == null && input.dataset.type != "corner") {
				if(input.getAttribute("value") != null) return input.value = input.getAttribute("value");
				if(input.getAttribute("selected") != null) return input.value = input.getAttribute("selected");
				return; //make this set value to default
			}

			input.value = Designer.ThemeEditor.GetValueToType(input.dataset.type, place);
			//input.$triggerCustom("input");
		})

		tab.querySelectorAll(`[data-location][data-enabled]`).forEach((input, theindex, thelist) => {
			if(input.dataset.location == null) return;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;

			for(var i = 0; i < placewithoutdots.length && place != null; i++) {
				place = place[placewithoutdots[i]];
			}

			if(input.dataset.enabled == "switch") page.toggleSwich(input, place != null);
			//input.$triggerCustom("input");
		})
	})


	document.$triggerCustom("designer-edittheme-loaded");
}

Designer.ThemeEditor.GetTypeValue = function(type, value, place) {
	if(type == null || type == "" || type == "value") return value;

	if(type == "color") return hexToRgb(value);
	if(type == "color-alpha") return place != null ? rgbTorgba(place, value) : value;

	if(type == "corner" && value == "-1") return null;
	if(type == "corner") return value + "px";

	if(type == "px") return value + "px";
	if(type == "percent") return value + "%";
}

Designer.ThemeEditor.GetValueToType = function(type, value) {
	if(type == null || type == "" || type == "value") return value;

	if(type == "color") return rgbToHex(rgbaTovar(value).r, rgbaTovar(value).g, rgbaTovar(value).b);
	if(type == "color-alpha") return rgbaTovar(value).a;

	if(type == "corner" && value == null) return "-1";
	if(type == "corner") return value.replace("px", "");

	if(type == "px") return value.replace("px", "");
	if(type == "percent") return value.replace("%", "");
}

Designer.ThemeEditor.SelectTab = function(tab) {
	if(tab.dataset.editthemetab == null || tab.dataset.editthemetab == "") return;

	var tabdiv = document.querySelector(`[data-editthemetabs="${tab.dataset.editthemetab}"]`);
	if(tabdiv == null) return;

	document.querySelectorAll(`[data-editthemetab]`).forEach(tabs => {tabs.classList.remove("active");})
	document.querySelectorAll(`[data-editthemetabs]`).forEach(tabsdiv => {tabsdiv.style.display = "none";})

	tab.classList.add("active");
	tabdiv.style.display = "";
	Designer.ThemeEditor.ActiveTab = tabdiv;
}



function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : null;
}

function rgbTorgba(rgb, alpha) {
	var result = rgb.replace("rgb(", "rgba(");
	if(result.split(",").length > 3) result = result.split(",").slice(0, -1).join(",") + ")";
	return result.replace(")", `,${alpha}%)`);
}

function rgbaTovar(rgba) {
	var vars = rgba.split("(")[1].split(")")[0].split("%")[0].split(",");
	return {r: Number(vars[0]), g: Number(vars[1]), b: Number(vars[2]), a: Number(vars[3])};
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function jsonConcat(o1, o2) {
	for (var key in o2) {
 		if(o1[key] == null) o1[key] = o2[key];
 		else {
 			if(o1[key].toString() == "[object Object]" && o2[key] != null && o2[key].toString() == "[object Object]")
 				jsonConcat(o1[key], o2[key]);
 			else o1[key] = o2[key];
 		}
	}
	return o1;
}

function makeTextFile(text, filename) {
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
};

function onclicked(target, code) {
	target.addEventListener("click", (e) => {
		if(e.target == target) code();
	})
}


Designer.waitingForGeneral = function() {
	if (Rkis == null || Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			Designer.waitingForGeneral();
		}, {once: true});
		return;
	}
	
	//Designer.LoadThemesData();
	document.$watch("#rkpage .main .themes", (e) => { e.$on("script", () => {Designer.LoadThemesData();}) })

	document.$watchLoop("#rkpage .main .themes .designer-btn", (e) => {
		var i = e.dataset.themeid;
		if(isNaN(Number(i)) == false) i = Number(i);
		var daname = e.dataset.theme;

		if(e.classList.contains("export")) {
			e.$on("click", () => {
				Designer.ExportTheme(e, daname, i);
			})
		} else if(e.classList.contains("delete")) {
			e.$on("click", () => {
				Designer.DeleteTheme(daname, i);
			})
		} else if(e.classList.contains("edit")) {
			e.$on("click", () => {
				Designer.EditTheme(i);
			})
		} else if(e.classList.contains("select")) {
			e.$on("click", () => {
				Designer.SelectThemeButton(e);
			})
		} else if(e.classList.contains("create")) {
			e.$on("click", () => {
				Designer.CreateTheme();
			})
		} else if(e.classList.contains("createthetheme")) {
			e.$on("click", () => {
				Designer.CreateNewTheme(e);
			})
		} else if(e.classList.contains("deletethetheme")) {
			e.$on("click", () => {
				Designer.DeleteTheTheme(e);
			})
		} else if(e.classList.contains("editorsave")) {
			e.$on("click", () => {
				Designer.ThemeEditor.Save();
			})
		} else if(e.classList.contains("editortab")) {
			e.$on("click", () => {
				Designer.ThemeEditor.SelectTab(e);
			})
		} else if(e.classList.contains("showthelem")) {
			e.$on("click", (a) => {
				//console.log(e,a)
				if(a.target.tagName != "LOADCODE") {
					document.$triggerCustom("openedit", e.firstElementChild)
					e.firstElementChild.style.display = "flex";
				}
			})
		}
	})

	document.$watchLoop("#rkpage .main .themes [data-designer-func]", (e) => {
		var i = e.dataset.themeid;
		if(isNaN(Number(i)) == false) i = Number(i);
		var daname = e.dataset.theme;

		switch (e.dataset.designerFunc.toLowerCase()) {
			default: return console.error("D618");
			case "editorsave":
				e.$on("click", () => {
					Designer.ThemeEditor.Save();
				})
				break;
		}

		if(e.classList.contains("export")) {
			e.$on("click", () => {
				Designer.ExportTheme(e, daname, i);
			})
		} else if(e.classList.contains("delete")) {
			e.$on("click", () => {
				Designer.DeleteTheme(daname, i);
			})
		} else if(e.classList.contains("edit")) {
			e.$on("click", () => {
				Designer.EditTheme(i);
			})
		} else if(e.classList.contains("select")) {
			e.$on("click", () => {
				Designer.SelectThemeButton(e);
			})
		} else if(e.classList.contains("create")) {
			e.$on("click", () => {
				Designer.CreateTheme();
			})
		} else if(e.classList.contains("createthetheme")) {
			e.$on("click", () => {
				Designer.CreateNewTheme(e);
			})
		} else if(e.classList.contains("deletethetheme")) {
			e.$on("click", () => {
				Designer.DeleteTheTheme(e);
			})
		} else if(e.classList.contains("editorsave")) {
			e.$on("click", () => {
				Designer.ThemeEditor.Save();
			})
		} else if(e.classList.contains("editortab")) {
			e.$on("click", () => {
				Designer.ThemeEditor.SelectTab(e);
			})
		} else if(e.classList.contains("showthelem")) {
			e.$on("click", (a) => {
				//console.log(e,a)
				if(a.target.tagName != "LOADCODE") {
					document.$triggerCustom("openedit", e.firstElementChild)
					e.firstElementChild.style.display = "flex";
				}
			})
		}
	})
}

Designer.waitingForGeneral();