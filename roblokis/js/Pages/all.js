"use strict";
var Rkis = Rkis || {};
Rkis.page = Rkis.page || {};
Rkis.StylesList = Rkis.StylesList || {};

Rkis.StylesList.all = {
	menu: {
		float: {
			css: ["js/Theme/styles/menuFloat.css"],
			load: () => {
				var allMaxWidthPages = [
					".com/discover",
					".com/charts",
					".com/catalog",
					".com/my/avatar",
				];
			
				for (let index = 0; index < allMaxWidthPages.length; index++) {
					const matchUrl = allMaxWidthPages[index];
					if(!window.location.href.toLowerCase().includes(matchUrl)) continue;
					
					document.body.classList.add("menufloat-spacing");
					break;
				}
			},
			unload: () => {
				document.body.classList.remove("menufloat-spacing");
			}
		},
		rod: {
			css: ["js/Theme/styles/menuFloat.css", "js/Theme/styles/menuRod.css"],
			load: function (style) {
				var allMaxWidthPages = [
					".com/discover",
					".com/charts",
					".com/catalog",
					".com/my/avatar",
				];
			
				for (let index = 0; index < allMaxWidthPages.length; index++) {
					const matchUrl = allMaxWidthPages[index];
					if(!window.location.href.toLowerCase().includes(matchUrl)) continue;
					
					document.body.classList.add("menufloat-spacing");
					break;
				}

				this.update(style);
			},
			update: (style) => {
				let options = style?.options;
				if (options == null) return;
				document.body.classList.toggle("extended-menu-rod", options.extendedDesign == true);
				document.body.classList.toggle("center-menu-list", options.centerMenuItems == true);
				document.body.classList.toggle("menu-avatar-bottom", options.moveAvatarBottom == true);
			},
			unload: () => {
				document.body.classList.remove("menufloat-spacing");
				document.body.classList.remove("extended-menu-rod");
				document.body.classList.remove("center-menu-list");
				document.body.classList.remove("menu-avatar-bottom");
			}
		},
		buttons: {
			css: ["js/Theme/styles/menuButtons.css"],
			load: function (style) {
				var allMaxWidthPages = [
					".com/discover",
					".com/charts",
					".com/catalog",
					".com/my/avatar",
				];
			
				for (let index = 0; index < allMaxWidthPages.length; index++) {
					const matchUrl = allMaxWidthPages[index];
					if(!window.location.href.toLowerCase().includes(matchUrl)) continue;
					
					document.body.classList.add("menubtns-spacing");
					break;
				}

				this.update(style);
			},
			update: (style) => {
				let options = style?.options;
				if (options == null) return;
				document.body.classList.toggle("menu-icons-only", options.iconsOnly == true);
			},
			unload: () => {
				document.body.classList.remove("menubtns-spacing");
				document.body.classList.remove("menu-icons-only");
			}
		}
	},
	icons: {
		"2018": {
			css: ["js/Theme/styles/icons2018.css"]
		},
		"custom": {
			css: ["js/Theme/styles/iconsCustom.css"],
			load: function(style) {
				this.update(style);
			},
			update: (style) => {
				let options = style.options;
				if (options == null) return;
				if (options.iconPackLink == null) return;

				let url = options.iconPackLink;
				let fill = null;
				if (url === "") {
					fill = "";
				} else if (url.startsWith("linear-gradient")) {
					fill = url.split(')')[0]+')';
				} else if (url.startsWith("data:image/")) {
					fill = 'url('+url.split(')')[0]+')';
				} else {
					FetchImage(url).then((iconsImage) => {
						document.body.parentElement.style.setProperty("--menubtns-icons-image", iconsImage);
					});
				}

				if (fill !== null) {
					document.body.parentElement.style.setProperty("--menubtns-icons-image", fill);
				}
			},
			unload: () => {
				document.body.parentElement.style.removeProperty("--menubtns-icons-image");
			}
		}
	},
	videobackground: {
		videoplayer: {
			load: function(style) {
				this.update(style);
			},
			update: function(style) {
				let options = style.options;
				if (options == null) return;
				if (options.videolink == null) return;

				let videoLink = options.videolink;
				let isMuted = options.mutevideo != false;
				let videoVolume = parseInt(options.videoVolume || "100") / 100;

				if (!videoLink.startsWith("https://")) return;
				if (videoLink.includes("youtube.com") || videoLink.includes("youtu.be")) {
					styles.all.videobackground.youtubeplayer.js(style);
					return;
				}

				let backgroundElement = null;
				if (this.backgroundElement != null) {
					backgroundElement = this.backgroundElement;
				} else backgroundElement = document.createElement('video');
				backgroundElement.classList.add('rk-page-background-video');
				backgroundElement.src = videoLink;
				backgroundElement.autoplay = true;
				backgroundElement.loop = true;
				// backgroundElement.muted = true;
				backgroundElement.volume = 0;
				backgroundElement.muted = isMuted;
				// backgroundElement.style.backgroundImage = `url(${imgElement.src})`;
				this.backgroundElement = backgroundElement;
				document.body.prepend(backgroundElement);

				let playVideo = () => {
					try {
						backgroundElement.play();
						// if (backgroundElement.paused == false) {
						// 	backgroundElement.muted = isMuted;
						// 	backgroundElement.volume = 0.75;
						// 	return;
						// }
					} catch {}
					// setTimeout(playVideo, 1000);
				};
				backgroundElement.oncanplay = playVideo;
				backgroundElement.oncanplaythrough = playVideo;
				backgroundElement.onload = playVideo;
				playVideo();

				document.addEventListener("click", async () => {
					backgroundElement.volume = videoVolume;
				}, {once: true});

				window.addEventListener("blur", () => {
					backgroundElement.pause();
					localStorage.setItem("videoBackgroundTime", backgroundElement.currentTime);
				});
				window.addEventListener("focus", () => {
					let sessionVideoTime = parseFloat(localStorage.getItem("videoBackgroundTime") || "0");
					backgroundElement.currentTime = sessionVideoTime;
					backgroundElement.play();
				});
			},
			unload: function() {
				if (this.backgroundElement == null) return;
				document.body.removeChild(this.backgroundElement);
				this.backgroundElement.remove();
				this.backgroundElement = null;
			},
		},
		youtubeplayer: {
			load: function(style) {
				this.update(style);
			},
			update: function(style) {
				let options = style?.options;
				if (options == null) return;
				if (options.videolink == null) return;

				let videoLink = options.videolink;
				if (!videoLink.startsWith("https://")) return;
				if (!videoLink.includes("youtube.com") && !videoLink.includes("youtu.be")) return;

				let videoId = escapeHTML(this.getYoutubeId(videoLink));
				// console.log(videoId, videoLink);
				let backgroundElement = null;
				if (this.backgroundElement != null) {
					backgroundElement = this.backgroundElement;
				} else backgroundElement = document.createElement('iframe');
				backgroundElement.classList.add('rk-page-background-video');
				backgroundElement.id = 'rk-page-background-video-yt';
				backgroundElement.src = "https://www.youtube.com/embed/"+videoId+`?controls=0&disablekb=1&fs=0&autoplay=1&mute=1&playsinline=1&playlist=${videoId}&loop=1`;
				// console.log(backgroundElement.src);
				backgroundElement.frameBorder = 0;
				backgroundElement.style.border = "0";
				backgroundElement.style.pointerEvents = "none";
				backgroundElement.height = "100%";
				backgroundElement.width = "100%";
				this.backgroundElement = backgroundElement;
				document.body.prepend(backgroundElement);
			},
			unload: function() {
				if (this.backgroundElement == null) return;
				document.body.removeChild(this.backgroundElement);
				this.backgroundElement.remove();
				this.backgroundElement = null;
			},
			getYoutubeId: (str) => {
				if (str == null) return str;

				if (str.includes(`youtu.be/`)) return str.split(`youtu.be/`)[1].split(`/`)[0].split(`?`)[0];
				else if (str.includes(`youtube.com/`)) {
					if (str.includes(`youtube.com/v/`)) return str.split(`youtube.com/v/`)[1].split(`/`)[0].split(`?`)[0];

					return str.split(`v=`)[1].split(`&`)[0];
				}
				else return str;
			}
		}
	},
	navbar: {
		float: {
			css: ["js/Theme/styles/navbarFloat.css"],
			load: function(style) {
				this.update(style);
			},
			update: (style) => {
				let options = style?.options;
				if (options == null) return;
				document.body.classList.toggle("navbar-no-splitting", options.connectedIslands == true);
				document.body.classList.toggle("rk-hide-roblox-logo", options.hideRobloxLogo == true);
				document.body.classList.toggle("navbar-no-nav-buttons", options.hideNavBtns == true);
				document.body.classList.toggle("navbar-search-button", options.makeSearchBtn == true);
				if (typeof options.searchbarLength == "string" && options.searchbarLength != '') {
					document.$watch("#right-navigation-header > div.navbar-search", (searchbar) => {
						searchbar.style.width = options.searchbarLength + "%";
					});
				}
			},
			unload: () => {
				document.body.classList.remove("navbar-no-splitting");
				document.body.classList.remove("rk-hide-roblox-logo");
				document.body.classList.remove("navbar-no-nav-buttons");
				document.body.classList.remove("navbar-search-button");
				document.$watch("#right-navigation-header > div.navbar-search", (searchbar) => {
					searchbar.style.width = "";
				});
			}
		}
	},
	gamecards: {
		'1': {
			css: ["js/Theme/styles/gamecards1.css"],
			load: function(style) {
				this.update(style);
			},
			update: (style) => {
				let options = style?.options;
				if (options == null) return;
				document.body.classList.toggle("gamecards-no-text", options.hideText == true);
				document.body.classList.toggle("gamecards-join-text", options.showjointext == true);
			},
			unload: () => {
				document.body.classList.remove("gamecards-no-text");
				document.body.classList.remove("gamecards-join-text");
			}
		},
		'': {
			load: function(style) {
				this.update(style);
			},
			update: (style) => {
				let options = style?.options;
				if (options == null) return;
				document.body.classList.toggle("gamecards-text-center", options.centerText == true);
				document.body.classList.toggle("gamecards-join-text", options.showjointext == true);
			},
			unload: () => {
				document.body.classList.remove("gamecards-text-center");
				document.body.classList.remove("gamecards-join-text");
			}
		}
	},
	chat: {
		bubble: {
			css: ["js/Theme/styles/chatBubble.css"]
		}
	},
};

Rkis.page.all = () => {
	if (Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			Rkis.page.all();
		}, {once: true});
		return;
	}

	//load styles
	/*document.$watch('#rk-theme-loaded', async () => {
		let styleCodeToRun = [];
		if (Rkis.Designer.currentTheme != null
			&& Rkis.Designer.currentTheme.styles != null)
			{
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
		}
		await document.$watch("body").$promise();
		styleCodeToRun.forEach(f => f());
	});*/

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
	//* can be improved!!!
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
	//* can be improved!!!
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
				if(elem.href == null || elem.dataset.addedjoin == "true") return;
				elem.dataset.addedjoin = "true";
				if (elem.querySelector(".featured-game-icon-container") != null) return;

				/*
					https://www.roblox.com/games/refer?IsLargeGameTile=false&PageId=4a6d26c8-7d80-4a32-ab3b-9e9365bcad66&PageType=Games&PlaceId=6872265039&Position=7&SortName=PersonalRecommendation&SortPosition=2&LocalTimestamp=2022-01-10T08:07:43.575Z
					https://www.roblox.com/games/537413528/Build-A-Boat-For-Treasure?gameSetTypeId=100000003&homePageSessionInfo=6f32c5c3-dca9-47ae-9182-94c864d9fd15&isAd=false&numberOfLoadedTiles=6&page=homePage&placeId=537413528&position=1&sortPos=0&universeId=210851291
					https://www.roblox.com/games/refer?SortFilter=5&PlaceId=537413528&Position=1&SortPosition=1&PageId=11c345b9-248d-4d6b-a4e8-9cdc1c8adcff&PageType=Profile
					https://www.roblox.com/games/refer?PlaceId=4883151089&Position=2&PageType=Profile
					https://www.roblox.com/games/refer?PlaceId=537413528&PageType=GroupDetail&LocalTimestamp={localTimestamp}
				*/

				var id = elem.href.toLowerCase().split("placeid=")[1]?.split("&")[0];
				if (id == null) return;
				elem.dataset.id = id;

				Rkis.contextMenu.elementContextMenu(elem, "quickplaceid", "Copy Game Place Id", () => {
					Rkis.CopyText(id);
				});
				let universeId = elem.href.toLowerCase().split("universeid=")[1]?.split("&")[0];
				if (universeId !== "" && typeof universeId == "string") {
					Rkis.contextMenu.elementContextMenu(elem, "quickuniverseid", "Copy Game Universe Id", () => {
						Rkis.CopyText(universeId);
					});
				}

				//random button angle generator
				var num = getRndInteger(-5, 5);
				while (num - 1 == lastnumber || num == lastnumber || num + 1 == lastnumber) num = getRndInteger(-5, 5);
				lastnumber = num;

				var elmnt = document.createElement("a");
				elmnt.className = "btn-full-width btn-control-xs rbx-game-server-join rk-quickgamejoin rk-btn-r" + num;
				elmnt.dataset.placeid = id;
				//elmnt.setAttribute("onclick", `Roblox.GameLauncher.joinMultiplayerGame(${elmnt.dataset.placeid})`);
				elmnt.setAttribute("onclick", `Roblox.GameLauncher.joinMultiplayerGame(${elmnt.dataset.placeid});event.preventDefault();return false;`);
				// elmnt.setAttribute("style", `margin: 0; display: inline-block;`);
				elmnt.style.display = "inline-block";
				// elmnt.dataset.translate = "joinButtons";
				elmnt.innerHTML = Rkis.language["joinButtons"];

				var namethingy = elem.$find("div.game-card-name.game-name-title");
				elem.insertBefore(elmnt, namethingy);
				// document.$event("rk-quickgamejoin", {buttonid: id});
				elem.parentElement?.classList.add("rk-has-quickjoinbtn");
				elem.closest(".game-card")?.classList.add("rk-has-quickjoinbtn");
			});
		})();
	}

	//Filter Game Name
	//* can be improved!!!
	if(Rkis.IsSettingEnabled("GameNameFilter", {
		id: "GameNameFilter",
		type: "switch",
		value: { switch: true },
		data: {
			customization: {
				removeEmojis: false
			}
		},
		details: {
			default: "en",
			"en": {
				name: "Game Name Filter",
				description: "Removes anything inside parentheses on a game's name."
			}
		}
	})) {
		(function() {
			const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
			
			let customization = Rkis.GetSettingCustomization("GameNameFilter");
			let removeEmojis = false;
			if (typeof customization.removeEmojis == "boolean") {
				removeEmojis = customization.removeEmojis;
			}

			document.$watchLoop(".game-card-name, .game-name-title, .place-name, .friends-carousel-tile-experience", updateElementName);

			function updateElementName(elem, tries = 10) {
				if (elem.textContent === "") {
					if (tries === 0) return;
					setTimeout(() => {
						updateElementName(elem, tries - 1);
					}, 500);
					return;
				}
				if(elem.dataset.filteredName == "true") return;
				elem.dataset.filteredName = "true";

				let filteredText = elem.textContent;

				if (filteredText.includes("[") && filteredText.includes("]")) filteredText = filteredText.split("[")[0] + filteredText.split("]")[1];
				if (filteredText.includes("{") && filteredText.includes("}")) filteredText = filteredText.split("{")[0] + filteredText.split("}")[1];
				if (filteredText.includes("(") && filteredText.includes(")")) filteredText = filteredText.split("(")[0] + filteredText.split(")")[1];

				if (removeEmojis === true) {
					filteredText = filteredText.replace(emojiRegex, '');
				}

				elem.textContent = filteredText.replace(/\s+/g, ' ').trim();
			}
		})();
	}

	//Desktop App
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
				newbutton.innerHTML = `<div><span class="icon-nav-giftcards" style="background-image: url(${escapeHTML(Rkis.fileLocation)}images/icons/icon_300x300.png);background-position: center;background-size: 30px;"></span></div><span class="font-header-2 dynamic-ellipsis-item">${Rkis.language["sectionDApp"]}</span>`;
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

	if(Rkis.IsSettingEnabled("StatusRing", {
		id: "StatusRing",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "StatusRing",
				description: "StatusRingDesc"
			},
			"en": {
				name: "Friend Status Ring",
				description: "Shows friend's status icon color around their avatar."
			}
		}
	})) {
		(function() {
			let customization = Rkis.GetSettingCustomization("StatusRing");
			let getStatus = function(avatarStatus) {
				if (avatarStatus.classList.contains("game")) return "hsl(148, 98%, 36%)";
				else if (avatarStatus.classList.contains("online")) return "hsl(202, 100%, 50%)";
				else if (avatarStatus.classList.contains("studio")) return "hsl(33, 98%, 49%)";
				return "hsl(0, 0%, 0%)";
			}
			document.$watchLoop(".avatar-status", (element) => {
				// console.log("found", getStatus(element), element);
				element.$watchData((statusElement) => {
					// console.log("edited", getStatus(statusElement), statusElement);
					if (statusElement.firstElementChild != null) statusElement = statusElement.firstElementChild;
					let container = statusElement.closest(".avatar")
					if (container) {
						container.classList.add("rk-status-ring");
						container.style.setProperty("--friend-status-color", getStatus(statusElement));

						if (customization?.shadow && customization.shadow !== "0px 0px 0px 0px") {
							container.style.setProperty("--friend-status-glow", customization.shadow + " " + getStatus(statusElement));
						}
					}
				});
			});
			// tested but out of sync
			// document.$watchLoop(".avatar-container", (container) => {
			// 	// console.log("found", getStatus(element), element);
			// 	let element = container.querySelector(".avatar-status");
			// 	element.$watchData((statusElement) => {
			// 		// console.log("edited", getStatus(statusElement), statusElement);
			// 		container.classList.add("rk-status-ring");
			// 		container.style.setProperty("--friend-status-color", getStatus(statusElement));
			// 	});
			// });
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

	if (Rkis.IsSettingEnabled("CustomNavMenuButtons", {
		id: "CustomNavMenuButtons",
		type: "switch",
		value: { switch: false },
		data: {
			customization: {}
		},
		details: {
			default: "en",
			"en": {
				name: "Custom Menu Navigations",
				description: "Press Customize to edit menu buttons.",
			}
		}
	})) {
		(function() {
			function FetchImage(url) {
				return new Promise(resolve => {
					BROWSER.runtime.sendMessage({about: "getImageRequest", url: url}, 
					function(data) {
						resolve(data)
					})
				})
			}

			let customization = Rkis.GetSettingCustomization("CustomNavMenuButtons");
			if (typeof customization.SortedMenuButtonsList != "undefined" && customization.SortedMenuButtonsList != null && customization.SortedMenuButtonsList.length > 0) {
				let sortedMenu = customization.SortedMenuButtonsList;
				document.$watch('.rbx-left-col .left-col-list', updateMenu);
				// updateMenu();
				document.$watchLoop(".left-col-list > * > *[id]", updateMenu);

				function updateMenu() {
					let currentMenu = document.querySelector('.rbx-left-col .left-col-list');
					currentMenu.querySelectorAll(`[data-custom-btn="true"]`).forEach(x => x.remove());
					let currentIndex = 0;
	
					for (let btnIndex = 0; btnIndex < sortedMenu.length; btnIndex++) {
						const btnData = sortedMenu[btnIndex];
						if (btnData.type == 'system') {
							let btnElements = Array.from(currentMenu.querySelectorAll("#"+btnData.id));
							if (btnElements.length == 0) continue;

							let btnElement = btnElements[0];
							if (btnElements.length > 1) {
								btnElement = btnElements.find(btn => {
									let text = btn.textContent || "Unknown";
									if (btn.id === 'btr-blogfeed') text = "Blog Content";
									else text = text.trim().split(/\d/g)[0];
									return text == btnData.text;
								});
							}
							if (btnElement == null) continue;
	
							if (btnData.hidden) {
								btnElement.parentElement.style.display = 'none';
							}
							insertChildAtIndex(currentMenu, btnElement.parentElement, currentIndex);
							currentIndex++;
						} else if (btnData.type == 'custom') {
							//create button
							let btnElement = createCustomButton(btnData);
	
							insertChildAtIndex(currentMenu, btnElement, currentIndex);
							currentIndex++;
						}
					}
				}
			}

			//https://stackoverflow.com/a/39181175
			function insertChildAtIndex(parent, child, index) {
				if (!index) index = 0;
				if (index === 0) {
					parent.prepend(child);
				} else if (index >= parent.children.length) {
					parent.appendChild(child);
				} else {
					parent.insertBefore(child, parent.children[index]);
				}
			}

			function createCustomButton(btnData) {
				let wrapperElement = document.createElement("li");
				let buttonElement = document.createElement("a");
				let iconWrapper = document.createElement("div");
				let iconElement = document.createElement("span");
				let textElement = document.createElement("span");

				wrapperElement.style.display = "block";
				wrapperElement.dataset.customBtn = "true";
				buttonElement.className = "dynamic-overflow-container text-nav";
				buttonElement.href = btnData.url;
				buttonElement.target = "_self";
				textElement.className = "font-header-2 dynamic-ellipsis-item";
				textElement.textContent = btnData.text;

				if (btnData.icon.type == "navbar-icon") {
					iconElement.className = btnData.icon.value;
				} else if (btnData.icon.type == "url-icon") {
					iconElement.className = "new-menu-icon icon-nav-charactercustomizer";
					iconElement.style.backgroundPosition = "center";
					iconElement.style.backgroundSize = "28px";

					let url = btnData.icon.value;
					let fill = null;
					if (url === "") {
						fill = "";
					} else if (url.startsWith("linear-gradient")) {
						fill = url.split(')')[0]+')';
					} else if (url.startsWith("data:image/")) {
						fill = 'url('+url.split(')')[0]+')';
					} else {
						FetchImage(url).then((imageData) => {
							iconElement.style.backgroundImage = imageData;
						});
					}

					if (fill !== null) {
						iconElement.style.backgroundImage = fill;
					}
				}

				iconWrapper.appendChild(iconElement);
				buttonElement.append(iconWrapper, textElement);
				wrapperElement.appendChild(buttonElement);
				return wrapperElement;
			}
		})();
	}

	// left out, might return to it later when i have time
	// if (Rkis.pageName == "home") {
	// 	if (Rkis.IsSettingEnabled("CustomHomeSections", {
	// 		id: "CustomHomeSections",
	// 		type: "switch",
	// 		value: { switch: false },
	// 		data: {
	// 			customization: {}
	// 		},
	// 		details: {
	// 			default: "en",
	// 			"en": {
	// 				name: "Custom Home Sections",
	// 				description: "Press Customize to edit sections in homepage.",
	// 			}
	// 		}
	// 	})) {
	// 		(function() {

	// 			document.$watch(`#place-list .game-home-page-container > div`, (homeContainer) => {
	// 				homeContainer.$watchLoop('[data-testid="home-page-game-grid"]', (ads) => {
	// 					if (ads.dataset.testid != null) {
	// 						ads.remove();
	// 					}

	// 					let sortedMenu = Array.from(homeContainer.children).sort((a,b) => {
	// 						if (a.classList.contains('game-sort-carousel-wrapper')) return -1;
	// 						return 1;
	// 					});
	
	// 					for (let rowIndex = 0; rowIndex < sortedMenu.length; rowIndex++) {
	// 						const element = sortedMenu[rowIndex];
	// 						insertChildAtIndex(homeContainer, element, rowIndex);
	// 					}
	// 				});
	// 			});


	// 			function createGameCard() {
	// 				return /*html*/`
	// 					<div class="grid-item-container game-card-container" data-testid="game-tile">
	// 						<a class="game-card-link" tabindex="0" aria-hidden="false" id="6035872082" data-id="17625359962"
	// 							href="https://www.roblox.com/games/17625359962/GAMEMODES-RIVALS?gameSetTypeId=100000003&amp;homePageSessionInfo=ad303b7b-1c62-4f12-a7c6-e25cfb89eb9c&amp;isAd=false&amp;numberOfLoadedTiles=6&amp;page=homePage&amp;placeId=17625359962&amp;playContext=homePage&amp;position=0&amp;sortPos=2&amp;universeId=6035872082">
	// 							<span class="thumbnail-2d-container game-card-thumb-container">
	// 								<img class="" alt="[🕹️GAMEMODES] RIVALS" title="[🕹️GAMEMODES] RIVALS"
	// 									src="https://tr.rbxcdn.com/180DAY-014e7039b194ee303fd204e0be26d3cb/256/256/Image/Webp/noFilter">
	// 							</span>
	// 							<div class="game-card-name game-name-title" title="[🕹️GAMEMODES] RIVALS">RIVALS</div>
	// 							<div class="game-card-info" data-testid="game-tile-stats">
	// 								<span class="info-label icon-votes-gray"></span>
	// 								<span class="info-label vote-percentage-label">95%</span>
	// 								<span class="info-label icon-playing-counts-gray"></span>
	// 								<span class="info-label playing-counts-label">54.1K</span>
	// 							</div>
	// 						</a>
	// 					</div>
	// 				`;
	// 			}
	// 			function createGamesRow() {
	// 				return /*html*/`
	// 					<div class="game-sort-carousel-wrapper">
	// 						<div class="game-sort-header-container">
	// 							<div class="container-header">
	// 								<h2 class="sort-header">
	// 									<a class=""
	// 										href="https://www.roblox.com/discover#/sortName/v2/Continue?homePageSessionInfo=ad303b7b-1c62-4f12-a7c6-e25cfb89eb9c&amp;page=homePage&amp;position=2&amp;sortId=100000003&amp;treatmentType=Carousel">Continue</a>
	// 								</h2>
	// 								<a class="btn-secondary-xs see-all-link-icon btn-more"
	// 									href="https://www.roblox.com/discover#/sortName/v2/Continue?homePageSessionInfo=ad303b7b-1c62-4f12-a7c6-e25cfb89eb9c&amp;page=homePage&amp;position=2&amp;sortId=100000003&amp;treatmentType=Carousel">See
	// 									All</a>
	// 							</div>
	// 						</div>
	// 						<div data-testid="game-carousel" class="game-carousel expand-home-content-disabled">
	// 							${createGameCard()}
	// 							${createGameCard()}
	// 							${createGameCard()}
	// 							${createGameCard()}
	// 							${createGameCard()}
	// 							${createGameCard()}
	// 						</div>
	// 					</div>
	// 				`;
	// 			}

				
	// 			//https://stackoverflow.com/a/39181175
	// 			function insertChildAtIndex(parent, child, index) {
	// 				if (!index) index = 0;
	// 				if (index === 0) {
	// 					parent.prepend(child);
	// 				} else if (index >= parent.children.length) {
	// 					parent.appendChild(child);
	// 				} else {
	// 					parent.insertBefore(child, parent.children[index]);
	// 				}
	// 			}

	// 		})();
	// 	}
	// }

	return {};
	
}

Rkis.page.all();