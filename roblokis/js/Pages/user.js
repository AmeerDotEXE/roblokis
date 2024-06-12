"use strict";
var Rkis = Rkis || {};
Rkis.page = Rkis.page || {};

Rkis.page.user = () => {
	if (Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			Rkis.page.user();
		}, { once: true });
		return;
	}
	
	//load styles
	document.$watch('#rk-theme-loaded', () => {
		let styles = {
			users: {
				userbanner: {
					imglink: {
						js: (style) => {
							let options = style.options;
							if (options == null) return;
							if (options.bannerImage == null) return;

							const bannerGradient = document.createElement("div");
							bannerGradient.style.height = "300px";
							bannerGradient.style.width = "100%";
							bannerGradient.style.marginBottom = "6px";
							bannerGradient.style.borderRadius = "var(--rk-profile-corners-radius, 8px)";
							bannerGradient.style.backgroundPosition = "center";
							bannerGradient.style.backgroundSize = "cover";
							bannerGradient.style.backgroundAttachment = "local";
							bannerGradient.style.backgroundRepeat = "no-repeat";

							let url = options.bannerImage;
							let fill = null;
							if (url === "") {
								fill = "";
								return;
							} else if (url.startsWith("linear-gradient")) {
								fill = url.split(')')[0]+')';
							} else if (url.startsWith("data:image/")) {
								fill = 'url('+url.split(')')[0]+')';
							} else {
								FetchImage(url).then((bannerImg) => {
									bannerGradient.style.backgroundImage = bannerImg;
								});
							}

							bannerGradient.style.backgroundImage = fill;

							document.$watch("#profile-header-container > div.profile-header", (/** @type {HTMLDivElement} */profileHeader) => {
								let placingElement = profileHeader.parentElement;
								if (options.combineprofileheader == true) {
									placingElement = profileHeader;
									bannerGradient.style.marginBottom = '';
									bannerGradient.style.borderBottomLeftRadius = '0px';
									bannerGradient.style.borderBottomRightRadius = '0px';
								}
								placingElement.prepend(bannerGradient);
							});
						}
					}
				},
			}
		};
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
					if (style.css != null) {
						Rkis.Designer.addCSS(style.css);
					}
					if (style.js != null) {
						style.js(innderStyleLocation);
					}
				}
			}

			findFile(theme.styles, styles);
		}
	});

	if (Rkis.IsSettingEnabled("QuickRemove", {
		id: "QuickRemove",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionQRB",
				description: "sectionQRB1",
				note: "sectionQRB2"
			},
			"en": {
				name: "Quick Remove Button",
				description: "Small button to remove friends faster.",
				note: "You have to double click the button to remove friends!"
			}
		}
	})) {

		Rkis.Scripts = Rkis.Scripts || {};
		Rkis.Scripts.QuickFriendRemove = Rkis.Scripts.QuickFriendRemove || {};

		Rkis.Scripts.QuickFriendRemove.unFriend = function (btn, theid) {
			if (document.$find("#rbx-body > meta") == null) {
				btn.remove();
				console.error(`QFR11`);
				return;
			}

			fetch(`https://friends.roblox.com/v1/users/${theid}/unfriend`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'x-csrf-token': document.$find("#rbx-body > meta").dataset.token
				}
			})
			.then((resp) => {
				if (resp.ok == true) {
					//window.location.reload();
					var daitm = document.$find("#delbtn" + theid);
					if (daitm) daitm.remove();
				}
			})
			.catch((err) => { console.error(err); console.error("Couldn't UnFriend the Person"); })
		}

		Rkis.Scripts.QuickFriendRemove.setup = function () {

			document.$watch("div.tab-content.rbx-tab-content > div.tab-pane.active > div.friends-content.section", (check) => {
				return $r("#friends > a").classList.contains("active") || false;
			}, () => { }).$then()
			.$watchLoop("ul.avatar-cards > li.avatar-card", (e) => {

				var placetoadd = e.$find("div > div > div.avatar-card-caption > span");
				if (placetoadd && e.id && document.$find("#delbtn" + e.id) == null) {

					var deletebutton = document.createElement("div");
					deletebutton.id = "delbtn" + e.id;
					deletebutton.setAttribute("style", "float: right; width: 24px; height: 24px; text-align: center; border: 2px dashed red; color: red; border-radius: 50%; font-size: 14px; background-color: transparent;");
					deletebutton.setAttribute("onmouseover", "this.style.backgroundColor='rgb(255,255,255,0.1)';this.style.border='2px solid red';");
					deletebutton.setAttribute("onmouseout", "this.style.backgroundColor='transparent';this.style.border='2px dashed red';");
					//deletebutton.setAttribute("ondblclick", `Rkis.Scripts.QuickFriendRemove.unFriend(this, "${e.id}")`);
					deletebutton.addEventListener("dblclick", () => { Rkis.Scripts.QuickFriendRemove.unFriend(this, "" + e.id) })
					deletebutton.textContent = "-";

					placetoadd.insertBefore(deletebutton, placetoadd.firstChild);

				}

			});

		}

		Rkis.Scripts.QuickFriendRemove.first = async function () {
			await document.$watch("#container-main").$promise();
			var weburl = window.location.href;

			var robloxuserid = document.$find("head > meta[data-userid]", (e) => { return e.dataset.userid; })

			if (weburl.includes(`users${robloxuserid ? `/${robloxuserid}` : ``}/friends`) ||
				weburl.includes(`users/friends`)) {

				document.$watch("#friends", (btn) => {
					btn.addEventListener("click", Rkis.Scripts.QuickFriendRemove.setup);
				});
				Rkis.Scripts.QuickFriendRemove.setup();

			}
		}

		Rkis.Scripts.QuickFriendRemove.first();

	}

	if (Rkis.IsSettingEnabled("CancelPending", {
		id: "CancelPending",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionCP",
				description: "sectionCP1"
			},
			"en": {
				name: "Cancel Pending",
				description: "Shows a \"Cancel Pending\" Button instead of \"Pending\"."
			}
		}
	})) {

		Rkis.Scripts = Rkis.Scripts || {};
		Rkis.Scripts.CancelFriendPending = Rkis.Scripts.CancelFriendPending || {};

		document.$watch(`ul.details-actions > li.btn-friends > button`, (check) => {
			if (check.textContent == "Pending") return true;
			return false;
		}, (penbtn) => {
			penbtn.textContent = Rkis.language["cancelRequest"];
			penbtn.classList.remove("disabled");
			penbtn.parentElement.addEventListener("click", Rkis.Scripts.CancelFriendPending.secondone);
			penbtn.parentElement.style.cursor = "pointer";
		});

		Rkis.Scripts.CancelFriendPending.secondone = function () {
			var target = $r(`ul.details-actions > li.btn-friends > button`);
			var theid = Rkis.UserId;
			if (theid == null) return;

			fetch(`https://friends.roblox.com/v1/users/${theid}/unfriend`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'x-csrf-token': document.querySelector("#rbx-body > meta").dataset.token
				}
			})
				.then((resp) => {
					if (resp.status == 200) {
						target.textContent = Rkis.language["canceledRequest"];
						target.classList.add("disabled");
						target.parentElement.removeEventListener("click", Rkis.Scripts.CancelFriendPending.secondone);
						target.parentElement.style.cursor = "";
					}
				})
				.catch(() => { })

		}

	}

	if (Rkis.IsSettingEnabled("LastStats", {
		id: "LastStats",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionLS",
				description: "sectionLS1"
			},
			"en": {
				name: "Last Status",
				description: "Shows Player's Last Activity on his Profile Page."
			}
		}
	})) {

		Rkis.Scripts = Rkis.Scripts || {};

		Rkis.Scripts.LastStats = async function () {

			var id = Rkis.UserId;
			if (id == null) return;

			function getPresences(url, json) {
				return new Promise(resolve => {
					BROWSER.runtime.sendMessage({ about: "postURLRequest", url: url, jsonData: json },
					function (data) {
						resolve(data)
					})
				})
			}

			// function getData(url) {
			// 	return new Promise(resolve => {
			// 		BROWSER.runtime.sendMessage({ about: "getURLRequest", url: url },
			// 		function (data) {
			// 			resolve(data)
			// 		})
			// 	})
			// }

			var result = await getPresences(`https://presence.roblox.com/v1/presence/users`, { "userIds": [ id ] });
			/*var result = await getData(`https://api.roblox.com/users/${id}/onlinestatus/`);/*fetch("https://presence.roblox.com/v1/presence/users", {
				method: 'POST',
				credentials: 'include',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({ "userIds": [ id ] })
			})
			.then((response) => response.json())
			.catch(() => {return null;});*/
			if(result != null && result.userPresences != null) result = result.userPresences;
			if(result != null && result.length > 0) result = result[0];

			if (result == null) return;

			var statusholder = await document.$watch("#profile-statistics-container > .section.profile-statistics").$promise();
			if (statusholder == null) return;

			var oldthingytodelete = document.querySelector("#lastseentheprofileis");
			if (oldthingytodelete != null) oldthingytodelete.remove();

			var onlinestats = null;
			var onlineseen = null;
			var onlinegame = null;

			if (result != null) {
				var award = new Date(result.lastOnline);//small start letters

				if (result.placeId != null) onlinestats = `<a class="text-lead" href="${window.location.origin}/games/refer?PlaceId=${escapeHTML(result.placeId)}" style="text-decoration: underline;">${escapeHTML(result.lastLocation)}</a>`;
				else onlinestats = `<p class="text-lead">${escapeHTML(result.lastLocation)}</p>`;

				if (result.placeId != null && result.gameId != null) onlinegame = `<li class="profile-stat" style="display: grid;justify-items: center;"><p class="text-label">${Rkis.language["lastGame"]}</p> <p class="text-lead" onclick="Roblox.GameLauncher.joinGameInstance(${escapeHTML(result.placeId)}, '${escapeHTML(result.gameId)}')" style="width: fit-content;background-color: #00b06f;border-radius: 10px;padding: 0 20%;cursor: pointer;align-self: center;">${Rkis.language["joinButtons"]}</p> </li>`;

				onlineseen = `<p class="text-lead"
			title="${Rkis.language.get("lastSeenLong", award.$format("MM/DD/YYYY, hh:mm"))}">${award.$since(new Date(), false, true)}</p>`;
			}

			var status = document.createElement("div");
			status.id = "lastseentheprofileis";
			status.classList.add("section-content");
			status.setAttribute("style", "margin: 10px;display: grid;");
			status.innerHTML = `<ul class="profile-stats-container" style="display: flex;">
			<li class="profile-stat"><p class="text-label">${Rkis.language["lastSeen"]}</p> ${onlineseen || `<p class="text-lead">Unknown</p>`} </li>
			<li class="profile-stat"><p class="text-label">${Rkis.language["lastPlace"]}</p> ${onlinestats || `<p class="text-lead">Unknown</p>`} </li>${onlinegame || ""}</ul>`;

			statusholder.insertBefore(status, statusholder.children[1]);

		};

		Rkis.Scripts.LastStats();

	}

	return {};
}

Rkis.page.user();