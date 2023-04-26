"use strict";
var Rkis = Rkis || {};
Rkis.page = Rkis.page || {};

Rkis.page.all = () => {
	if (Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			Rkis.page.all();
		}, {once: true});
		return;
	}

	//Custom Name
	if(Rkis.IsSettingEnabled("CustomName", {
		id: "CustomName",
		type: "text",
		value: { text: "" },
		details: {
			default: "en",
			translate: {
				name: "sectionCNT",
				description: "sectionCNT1"
			},
			"en": {
				name: "Custom Name Text",
				description: "This replaces the top right username text on all roblox sites.",
				note: ""
			}
		}
	})) {
		(function() {
			document.$watch("#right-navigation-header > div.navbar-right > ul > div > a > span.age-bracket-label-username", (topright) => {
				topright.textContent = Rkis.GetSettingValue("CustomName");
			})
		})();
	}

	//Custom Robux
	//can be improved!!!
	if(Rkis.IsSettingEnabled("CustomRobux", {
			id: "CustomRobux",
			type: "text",
			value: { text: "" },
			details: {
				default: "en",
				translate: {
					name: "sectionCRT",
					description: "sectionCRT1"
				},
				"en": {
					name: "Custom Robux Text",
					description: "This replaces the top right robux text on all roblox sites.",
					note: "This won't get you free Robux!"
				}
			}
	})) {
		(function() {
			//set Custom Robux
			//use listener of element change then added
			document.$watch("#navbar-robux").$then()
			.$watch("#nav-robux-amount", async (rbxplate) => {
				rbxplate.$watchData((element) => element.textContent != Rkis.GetSettingValue("CustomRobux"), (element) => {
					element.id = "nav-custom-robux-amount";
					element.textContent = Rkis.GetSettingValue("CustomRobux");
				});
			});


			//set popup Robux
			//change to addeventlistener
			document.$on("click", "#navbar-robux", () => {
				var rbxmenu = $r("#nav-robux-balance");
				if(rbxmenu) {
					rbxmenu.id = "nav-custom-robux-balance";
					rbxmenu.textContent = Rkis.GetSettingValue("CustomRobux") + " Robux";
				}
			})
		})();
	}

	//Quick Game Join
	//can be improved!!!
	if(Rkis.IsSettingEnabled("QuickGameJoin", {
		id: "QuickGameJoin",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionQJB",
				description: "sectionQJB1"
			},
			"en": {
				name: "Quick Join Button",
				description: "Adds a join button under every game on game and discover pages."
			}
		}
	})) {
		(function() {
			var lastnumber = 0;

			document.$watchLoop("a.game-card-link", (elem) => {
				if(elem == null || elem.href == null || elem.dataset.addedjoin == "true") return;
				elem.dataset.addedjoin = "true";

				/*
					https://www.roblox.com/games/refer?IsLargeGameTile=false&PageId=4a6d26c8-7d80-4a32-ab3b-9e9365bcad66&PageType=Games&PlaceId=6872265039&Position=7&SortName=PersonalRecommendation&SortPosition=2&LocalTimestamp=2022-01-10T08:07:43.575Z
					https://www.roblox.com/games/537413528/Build-A-Boat-For-Treasure?gameSetTypeId=100000003&homePageSessionInfo=6f32c5c3-dca9-47ae-9182-94c864d9fd15&isAd=false&numberOfLoadedTiles=6&page=homePage&placeId=537413528&position=1&sortPos=0&universeId=210851291
					https://www.roblox.com/games/refer?SortFilter=5&PlaceId=537413528&Position=1&SortPosition=1&PageId=11c345b9-248d-4d6b-a4e8-9cdc1c8adcff&PageType=Profile
					https://www.roblox.com/games/refer?PlaceId=4883151089&Position=2&PageType=Profile
					https://www.roblox.com/games/refer?PlaceId=537413528&PageType=GroupDetail&LocalTimestamp={localTimestamp}
				*/

				var id = elem.href.toLowerCase().split("placeid=")[1].split("&")[0];
				elem.dataset.id = id;

				//random button angle generator
				var num = getRndInteger(-5, 5);
				while (num - 1 == lastnumber || num == lastnumber || num + 1 == lastnumber) num = getRndInteger(-5, 5);
				lastnumber = num;

				var elmnt = document.createElement("a");
				elmnt.className = "btn-full-width btn-control-xs rbx-game-server-join rk-quickgamejoin rk-btn-r" + num;
				elmnt.dataset.placeid = id;
				elmnt.setAttribute("onclick", `Roblox.GameLauncher.joinMultiplayerGame(${elmnt.dataset.placeid})`);
				elmnt.setAttribute("style", `margin: 0; display: inline-block;`);
				elmnt.dataset.translate = "joinButtons";

				var namethingy = elem.$find("div.game-card-name.game-name-title");
				elem.insertBefore(elmnt, namethingy);
				document.$event("rk-quickgamejoin", {buttonid: id});
			});
		})();
	}

	//Desktop App
	//add translation for button
	if(Rkis.IsSettingEnabled("DesktopApp", {
		id: "DesktopApp",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionDApp",
				description: "sectionDApp1"
			},
			"en": {
				name: "Desktop App",
				description: "Enables the desktop app design by Roblox. (Access from Menu)"
			}
		}
	})) {
		(function() {
			Rkis.InjectFile(Rkis.fileLocation + "js/Scripts/RobloxScriptCopy.js");

			document.$watch("#navigation > div > div.simplebar-wrapper > div.simplebar-mask > div > div > div > ul", (leftpanel) => {

				var newbtn = document.createElement("li");
				var newbutton = document.createElement("a");

				newbutton.className = "dynamic-overflow-container text-nav";
				newbutton.id = "rk-desktopapp";
				newbutton.innerHTML = `<div><span class="icon-nav-giftcards" style="background-image: url(${escapeHTML(Rkis.fileLocation)}images/icons/icon_300x300.png);background-position: center;background-size: 30px;"></span></div><span class="font-header-2 dynamic-ellipsis-item">Desktop App</span>`;
				newbutton.addEventListener("click", () => { document.$event("rk-desktopapp"); });
				newbtn.append(newbutton);

				var theloop = true;
				leftpanel.querySelectorAll("li").forEach((e) => {
					if(e.className != "" && theloop) {
						leftpanel.insertBefore(newbtn, e);
						theloop = false;
					}
				});

			})
		})();
	}

	if (Rkis.IsSettingEnabled("InfiniteGameScrolling", {
		id: "InfiniteGameScrolling",
		type: "switch",
		value: { switch: false },
		details: {
			default: "en",
			translate: {
				note: "experimental"
			},
			"en": {
				name: "Infinite Games Scrolling",
				description: "Allows touchpad/mouse wheel to scroll hotizantally in Discover page.",
				note: "EXPERIMENTAL: This feature might change over time!"
			}
		}
	})) {
		//https://stackoverflow.com/a/71841743 (modified)
		document.$watchLoop(".horizontal-scroller > .horizontal-scroll-window > .horizontally-scrollable", (x) => {
			x.parentElement.addEventListener("wheel", function (e) {
				e.preventDefault();
				let curr = parseInt(x.style.left.substring(-2));

				if (e.deltaY > 0) {
					if (curr <= -2560) return; // thats roblox's maximum pixels that load per row
					x.style.left = (curr - 100) + "px";
				}
				else {
					if (curr >= 0) return;
					x.style.left = (curr + 100) + "px";
				}
			});
		});
	}

	return {};
	
}

Rkis.page.all();