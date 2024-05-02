"use strict";
var Rkis = Rkis || {};
Rkis.page = Rkis.page || {};

Rkis.page.game = () => {
	if (Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			Rkis.page.game();
		}, { once: true });
		return;
	}

	if (Rkis.pageName != "game") return;

	Rkis.Scripts = Rkis.Scripts || {};
	const ROBLOX_ICON_LIMIT = 5; //visible players per server
	const ROBLOX_SERVERS_LIMIT = 8; //servers per page

	//fixes roblox's site errors
	document.$watchLoop(`[class$="'"]`, (e) => {
		var broken_class = e.classList[e.classList.length - 1];
		var fixed_class = broken_class.slice(0, -1);

		e.classList.remove(broken_class);
		e.classList.add(fixed_class);
	});

	//load styles
	document.$watch('#rk-theme-loaded', () => {
		let styles = {
			game: {
				servers: {
					card: {
						css: ["js/Theme/styles/serversCard.css"],
						js: (style) => {
							let options = style.options;
							if (options == null) return;
							if (options.hidePlayers == true) {
								let body = document.querySelector("body");
								if (body) body.classList.add("servers-no-players");
							}
						}
					}
				},
				badges: {
					card: {
						css: ["js/Theme/styles/badgesCard.css"]
					},
					simple: {
						css: ["js/Theme/styles/badgesSimple.css"]
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
	
	if (Rkis.IsSettingEnabled("GameBannerToBackground", {
		id: "GameBannerToBackground",
		type: "switch",
		value: { switch: false },
		details: {
			default: "en",
			translate: {
				name: "sectionGBtB",
				description: "sectionGBtB1"
			},
			"en": {
				name: "Game Banner to Background.",
				description: "Uses first game image as page's background. (Works best with dark theme)"
			}
		}
	})) {
		document.$watch("#game-details-carousel-container > div > span > img", (imgElement) => {

			let backgroundElement = document.createElement('div');
			backgroundElement.classList.add('rk-page-background', 'rk-blurred');
			backgroundElement.style.backgroundImage = `url(${imgElement.src})`;

			document.body.prepend(backgroundElement);

		});
	}

	//Small Servers
	if (Rkis.IsSettingEnabled("SmallServer", {
		id: "SmallServer",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "SectionSSS",
				description: "SectionSSS1"
			},
			"en": {
				name: "Small Servers Section",
				description: "A new section show servers with few players.",
			}
		}
	})) {
		(function () {
			Rkis.Scripts.SmallServer = Rkis.Scripts.SmallServer || {};
			Rkis.Scripts.SmallServer.running = false;

			Rkis.Scripts.SmallServer.createSection = function () {
				document.removeEventListener("rkrequested-friends", Rkis.Scripts.SmallServer.createSection);

				if (Rkis.Scripts.SmallServer.running == true) return;
				Rkis.Scripts.SmallServer.running = true;

				var smallrunninggames = document.querySelector("#rbx-small-running-games");
				if (smallrunninggames == null) {
					smallrunninggames = document.createElement("div");
					smallrunninggames.id = "rbx-small-running-games";
					smallrunninggames.className = "stack server-list-section";
					smallrunninggames.innerHTML = /*html*/`
					<div class="container-header">
						<div class="server-list-container-header">
							<h2 class="server-list-header" data-translate="smallSection">Some Small Servers</h2>
							<button type="button" class="btn-more rbx-refresh refresh-link-icon btn-control-xs btn-min-width" data-translate="refresh">Refresh</button>
						</div>
					</div>
					<ul id="rbx-small-game-server-item-container" class="card-list rbx-game-server-item-container">
						<span class="spinner spinner-default"></span>
					</ul>
					<div class="rbx-running-games-footer"></div>`;

					smallrunninggames.$find('div.container-header button.rbx-refresh', (e) => {
						if (e.dataset.islistening == "true") return;
						e.dataset.islistening = "true";

						e.addEventListener("click", () => {
							Rkis.Scripts.SmallServer.createSection();
						})
					})
					document.querySelector("#running-game-instances-container")
					.insertBefore(smallrunninggames, document.querySelector("#rbx-running-games"));
				}

				smallrunninggames.$findAll("button", (e) => {
					e.disabled = true;
				});
				smallrunninggames.$findAll("button.rbx-running-games-load-more", (e) => { e.remove(); });

				smallrunninggames.$find('ul', (e) => {
					if (e.querySelector("span.spinner") != null) return;
					e.innerHTML = `<span class="spinner spinner-default"></span>`;
				});

				var placeId = Rkis.GameId;
				Rkis.Scripts.SmallServer.getServers(placeId, "");
			}

			Rkis.Scripts.SmallServer.getServers = function (GameID, nextPage) {
				if (Rkis.Scripts.SmallServer.running == false) return;

				fetch(`https://games.roblox.com/v1/games/${escapeHTML(GameID)}/servers/Public?limit=25&sortOrder=Asc&cursor=${escapeHTML(nextPage)}`)
					.then((resp) => resp.json())
					.then((servers) => {
						if (servers.data == null) return null;
						if (servers.nextPageCursor != null
							&& servers.data.filter(x => x.playing > 0).length < 4
							) {
							Rkis.Scripts.SmallServer.getServers(GameID, servers.nextPageCursor);
						} else {
							Rkis.Scripts.SmallServer.showServers(GameID, servers.data.filter(x => x.playing > 0));
						}
					})
					.catch(err => {
						console.error(`[Roblokis Error]`, err);
						console.error("GP74 (Couldn't get Servers)");
					})
			}

			Rkis.Scripts.SmallServer.showServers = async function (PlaceId, servers) {

				Rkis.Scripts.SmallServer.running = false;

				if (servers.length <= 0) return;
				//servers = servers.reverse();

				let gameinstances = document.querySelector("#running-game-instances-container");
				if (!gameinstances) return;

				let smallrunninggames = document.querySelector("#rbx-small-running-games");
				if (!smallrunninggames) return Rkis.Scripts.SmallServer.createSection();

				smallrunninggames.$findAll("button", (e) => {
					e.disabled = false;
				});

				let smallservers = smallrunninggames.$find('ul', (e) => {
					if (e.querySelector("span.spinner") == null) return e;
					e.$clear();
					return e;
				});

				let thumbnailsToFetch = [];
				let loadmorelists = [];
				let hasLink = Rkis.IsSettingEnabled("SmallServerLink", {
					id: "SmallServerLink",
					type: "switch",
					value: { switch: true },
					details: {
						default: "en",
						translate: {
							name: "sectionSLB",
							description: "sectionSLB1",
							note: "sectionSLink"
						},
						"en": {
							name: "Server Link Button",
							description: "Shows a link button next to the join button and gives server's join link.",
							note: "NOTE: Sharing the link won't work unless the person also have this extension!"
						}
					}
				});

				for (let i = 0; i < servers.length; i++) {
					if (servers[i].playing <= 0) continue;

					let smallserverHolder = document.createElement("li");
					smallserverHolder.className = "rbx-small-game-server-item col-md-3 col-sm-4 col-xs-6";
					let smallserver = HTMLParser('<div class="card-item">');
					smallserverHolder.appendChild(smallserver);

					let smallserverplayers = document.createElement("div");
					smallserverplayers.className = "player-thumbnails-container";

					for (let o = 0; o < ROBLOX_ICON_LIMIT && o < servers[i].playerTokens.length; o++) {
						//{"requestId":"0:11EE4E2238B3D801907FBA48A12E4F0E:AvatarHeadshot:150x150:png:regular","type":"AvatarHeadShot","targetId":0,"token":"11EE4E2238B3D801907FBA48A12E4F0E","format":"png","size":"150x150"}
						let thumbnail = {
							requestId: "0:" + servers[i].playerTokens[o] + ":AvatarHeadshot:150x150:png:regular",
							type: "AvatarHeadShot",
							size: "150x150",
							format: "png",
							token: servers[i].playerTokens[o],
							targetId: 0
						};
						smallserverplayers.append(
							HTMLParser('<span class="avatar avatar-headshot-md player-avatar">',
								HTMLParser('<span class="thumbnail-2d-container avatar-card-image">',
									HTMLParser(`<img data-thumbnailrequestid="${escapeHTML(thumbnail.requestId)}">`)
								)
							)
						);

						thumbnailsToFetch.push(thumbnail);
					}
					if (servers[i].playerTokens.length > ROBLOX_ICON_LIMIT) {
						let differenceMore = servers[i].playerTokens.length - ROBLOX_ICON_LIMIT;
						
						smallserverplayers.append(
							HTMLParser('<span class="avatar avatar-headshot-md player-avatar hidden-players-placeholder">',
								'+' + differenceMore
							)
						);
					}

					smallserver.append(smallserverplayers);


					let lineWidth = (servers[i].playing / servers[i].maxPlayers) * 100;
					if (lineWidth > 100) lineWidth = 100;
					let smallserverdetails = HTMLParser('<div class="rbx-game-server-details game-server-details">',
						HTMLParser('<div class="text-info rbx-game-status rbx-game-server-status text-overflow">',
							`${escapeHTML(servers[i].playing)} / ${escapeHTML(servers[i].maxPlayers)}`
						),
						HTMLParser('<div class="server-player-count-gauge border">',
							HTMLParser(`<div class="gauge-inner-bar border" style="width: ${escapeHTML(lineWidth)}%;">`)
						)
					);

					//if(servers[i].ShowSlowGameMessage) smallserverdetails.innerHTML += `<div class="rbx-game-server-alert"><span class="icon-remove"></span>${Rkis.language["slowServer"]}</div>`;
					if (hasLink) {
						smallserverdetails.append(
							HTMLParser(`<span data-placeid="${escapeHTML(PlaceId)}" class="rk-multi-button">`,
								HTMLParser(`<a class="btn-control-xs rk-copy-link-btn" data-placeid="${escapeHTML(PlaceId)}" data-serverid="${escapeHTML(servers[i].id)}">`,
									'🔗'
								),
								HTMLParser(`<button type="button" class="btn-full-width btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width" onclick="Roblox.GameLauncher.joinGameInstance(${escapeHTML(PlaceId)}, '${escapeHTML(servers[i].id)}');">`,
									Rkis.language["joinButtons"]
								)
							)
						);
					}
					else {
						smallserverdetails.append(
							HTMLParser(`<span data-placeid="${escapeHTML(PlaceId)}">`,
								HTMLParser(`<button type="button" class="btn-full-width btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width" onclick="Roblox.GameLauncher.joinGameInstance(${escapeHTML(PlaceId)}, '${escapeHTML(servers[i].id)}');">`,
									Rkis.language["joinButtons"]
								)
							)
						);
					}

					smallserverdetails.$find(".rk-copy-link-btn", (e) => {
						e.addEventListener("click", () => {
							Rkis.CopyText(`https://${escapeHTML(Rkis.SubDomain)}.roblox.com/home?placeid=${escapeHTML(e.dataset.placeid)}&gameid=${escapeHTML(e.dataset.serverid)}`);
						});
					});
					smallserverdetails.$find(".game-server-join-btn", (joinButton) => {
						Rkis.contextMenu.elementContextMenu(joinButton, "jobid", "Copy Job Id", () => {
							Rkis.CopyText(servers[i].id);
						});
					});

					smallserver.append(smallserverdetails);
					

					if (i < ROBLOX_SERVERS_LIMIT) smallservers.append(smallserverHolder);
					else loadmorelists.push(smallserverHolder);
				}

				for (let i = 0; i < loadmorelists.length; i += ROBLOX_SERVERS_LIMIT) {
					let serversToAdd = [];
					for (let o = i; o < (i + ROBLOX_SERVERS_LIMIT) && o < loadmorelists.length; o++) {
						serversToAdd.push(loadmorelists[o]);
					}

					let loadmorebutton = document.createElement("button");
					loadmorebutton.className = "rbx-running-games-load-more btn-control-md btn-full-width";
					loadmorebutton.textContent = Rkis.language["loadMore"];

					if (i / ROBLOX_SERVERS_LIMIT != 0) loadmorebutton.style.display = "none";
					if (i / ROBLOX_SERVERS_LIMIT != 0) loadmorebutton.dataset.loadmore = (i / ROBLOX_SERVERS_LIMIT) - 1;
					loadmorebutton.dataset.loadnum = (i / ROBLOX_SERVERS_LIMIT);

					loadmorebutton.addEventListener("click", (event) => {
						if (event.target.tagName != "BUTTON"
						|| event.target.dataset.loadnum == null
						|| event.target.dataset.loadnum == "") return;

						let selector = `[data-loadmore="${event.target.dataset.loadnum}"]`;
						let list = smallrunninggames.querySelectorAll(selector);
						
						list.forEach((e) => {
							if (e.hidden == true) e.hidden = false;
							else e.style.display = "inline-block";
						});
						event.target.remove();
					});
					smallrunninggames.querySelector('.rbx-running-games-footer').append(loadmorebutton);

					serversToAdd.forEach((e) => {
						e.dataset.loadmore = i / ROBLOX_SERVERS_LIMIT;
						e.hidden = true;
						smallservers.append(e);
					});
				}

				for (let i = 0; i < thumbnailsToFetch.length; i += 99) {
					fetch("https://thumbnails.roblox.com/v1/batch", {
						"headers": {
							"content-type": "application/json",
							"x-csrf-token": document.$find("#rbx-body > meta").dataset.token
						},
						"body": JSON.stringify(thumbnailsToFetch.filter((x, xi) => xi >= i && xi < i + 99)),
						"method": "POST",
						"mode": "cors",
						"credentials": "include"
					})
						.then(response => response.json())
						.then(list => {
							list.data.forEach((e) => {
								let elem = document.querySelector(`img[data-thumbnailrequestid="${e.requestId}"]`);
								if (elem == null) return;

								elem.setAttribute('loading', 'lazy');
								elem.src = e.imageUrl;
							});
						})
						.catch()
				}

				Rkis.Scripts.SmallServer.running = false;
			}

			document.addEventListener("rkrequested-friends", Rkis.Scripts.SmallServer.createSection);
		})();
	}

	//public server pager
	if (Rkis.IsSettingEnabled("PageNav", {
		id: "PageNav",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionSPN",
				description: "sectionSPN1"
			},
			"en": {
				name: "Server Page Nav",
				description: "Shows Nav. buttons under \"Load More\" button.",
			}
		}
	})) {
		(function () {

			Rkis.Scripts.PageNav = Rkis.Scripts.PageNav || {};
			Rkis.Scripts.PageNav.running = false;
			Rkis.Scripts.PageNav.totalServers = [];
			Rkis.Scripts.PageNav.nextPage = "";

			Rkis.Scripts.PageNav.firstone = async function () {

				var result = await fetch(`https://games.roblox.com/v1/games/${Rkis.GameId}/servers/Public?limit=100&sortOrder=Desc&excludeFullGames=true`)
					.then((response) => response.json())
					.then((data) => {
						if (data.data == null) return null;
						return data;
					})
					.catch(() => { return null });
				if (result == null) return;
				Rkis.Scripts.PageNav.totalServers = result.data;
				Rkis.Scripts.PageNav.nextPage = result.nextPageCursor;

				var buttonplace = await document.$watch("#rbx-running-games > div.rbx-running-games-footer").$promise();
				if (buttonplace == null) return;
				buttonplace.style.display = "none";

				document.$find("#rbx-running-games").innerHTML += `<div class="rbx-running-games-footer roblokis-footer"><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more">${Rkis.language["loadMore"]}</button></div>`;
				buttonplace = document.$find("#rbx-running-games > div.rbx-running-games-footer.roblokis-footer");

				var pagecount = Math.floor((Rkis.Scripts.PageNav.totalServers.length || 0) / 10) + 1;

				buttonplace.innerHTML += `
				<div id="rkpagenav" style="margin: 12px 20% 0;display: flex;height: 40px;" data-page="1" data-max="${escapeHTML(pagecount)}">
					<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">|&lt;</button>
					<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&lt;</button>
					<span class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;">
						<input type="textfield" style="border: none;width: 42%;text-align: right;" class="btn-control-sm rbx-running-games-load-more" id="rkpagenavnum" value="1" placeholder="Page">
						<span>/ ${escapeHTML(pagecount)}+</span></span>
					<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&gt;</button>
					<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&gt;|</button>
				</div>`;

				buttonplace.$find("button").addEventListener("click", () => { Rkis.Scripts.PageNav.next(true) });
				document.$find("#rbx-game-server-item-container", (e) => { e.classList.add("pagenav"); });

				$r("#rkpagenav > button:nth-child(1)").addEventListener("click", () => { Rkis.Scripts.PageNav.getpage(1) })
				$r("#rkpagenav > button:nth-child(2)").addEventListener("click", () => { Rkis.Scripts.PageNav.back() })

				$r("#rkpagenavnum").addEventListener("change", () => { Rkis.Scripts.PageNav.getpage($r("#rkpagenavnum").value) })

				$r("#rkpagenav > button:nth-child(4)").addEventListener("click", () => { Rkis.Scripts.PageNav.next() })
				$r("#rkpagenav > button:nth-child(5)").addEventListener("click", () => { Rkis.Scripts.PageNav.last() })

				Rkis.Scripts.PageNav.getpage(1);

				document.$find("#rbx-running-games > div.btr-pager-holder.btr-server-pager", (e) => { e.remove(); })
			}



			Rkis.Scripts.PageNav.getpage = async function (pagenum, more) {
				if (Rkis.Scripts.PageNav.running == true) return;
				Rkis.Scripts.PageNav.running = true;

				if (isNaN(Number(pagenum))) return;
				if (Number(pagenum) < 1) pagenum = "1";

				var pagecount = Math.floor((Rkis.Scripts.PageNav.totalServers.length || 0) / 10) + 1;
				if (pagenum > pagecount) pagenum = pagecount;

				var pagenav = document.$find("#rkpagenav");
				if (pagenav) pagenav.dataset.page = pagenum;;

				var pagenavnum = document.$find("#rkpagenavnum");
				if (pagenavnum) pagenavnum.value = pagenum;

				if (pagenum >= pagecount) {
					var result = await fetch(`https://games.roblox.com/v1/games/${Rkis.GameId}/servers/Public?limit=100&sortOrder=Desc&cursor=${Rkis.Scripts.PageNav.nextPage || ''}&excludeFullGames=true`)
						.then((response) => response.json())
						.then((data) => {
							if (data.data == null) return null;
							return data;
						})
						.catch(() => { return null });
					if (result == null) return;
					Rkis.Scripts.PageNav.nextPage = result.nextPageCursor || '';

					result.data.forEach((e) => { Rkis.Scripts.PageNav.totalServers.push(e); });
				}
				//https://stackoverflow.com/a/74442647
				Rkis.Scripts.PageNav.totalServers = Rkis.Scripts.PageNav.totalServers.reduce((accumulator, current) => {
					let exists = accumulator.find(item => {
						return item.id === current.id;
					});
					if(!exists) { 
						accumulator = accumulator.concat(current);
					}
					return accumulator;
				}, [])

				pagecount = Math.floor((Rkis.Scripts.PageNav.totalServers.length || 0) / 10) + 1;
				if (pagenav) pagenav.dataset.max = pagecount;
				let hasMore = Rkis.Scripts.PageNav.nextPage !== '';
				if (hasMore) hasMore = pagenav.dataset.max !== pagenum+'';
				if (pagenav) pagenav.$find("span > span").textContent = `/ ${pagenav.dataset.max}` + (hasMore ? '+' : '');

				var serversToAdd = [];
				for (var o = (pagenum * 10) - 10; o < (pagenum * 10) && o < Rkis.Scripts.PageNav.totalServers.length; o++) { serversToAdd.push(Rkis.Scripts.PageNav.totalServers[o]); }

				Rkis.Scripts.PageNav.setpage(serversToAdd, more);
			}

			Rkis.Scripts.PageNav.next = function (more) {
				var pagenav = document.$find("#rkpagenav");
				if (pagenav == null || pagenav.dataset.page == null) return;

				var num = Number(pagenav.dataset.page) + 1;
				if (num < 1) num = 1;
				if (num > pagenav.dataset.max) num = pagenav.dataset.max;

				Rkis.Scripts.PageNav.getpage(num, more);
			}

			Rkis.Scripts.PageNav.back = function () {
				var pagenav = document.$find("#rkpagenav");
				if (pagenav == null || pagenav.dataset.page == null) return;

				var num = Number(pagenav.dataset.page) - 1;
				if (num < 1) num = 1;
				if (num > pagenav.dataset.max) num = pagenav.dataset.max;

				Rkis.Scripts.PageNav.getpage(num);
			}

			Rkis.Scripts.PageNav.last = function () {
				var pagenav = document.$find("#rkpagenav");
				if (pagenav == null || pagenav.dataset.page == null) return;

				var num = Number(pagenav.dataset.max);

				Rkis.Scripts.PageNav.getpage(num);
			}



			Rkis.Scripts.PageNav.setpage = function (data, more) {
				var holder = document.$find("#rbx-game-server-item-container");
				if (holder == null || data == null) return;

				if (more != true) holder.innerHTML = "";
				var thumbnailsToFetch = [];

				let useLimit = Rkis.IsSettingDisabled("UseThemes");

				for (var i = 0; i < data.length; i++) {
					var server = data[i];

					var fullcode = "";

					fullcode += `
					<li class="rbx-game-server-item col-md-3 col-sm-4 col-xs-6 pagenav" data-gameid="${escapeHTML(server.id)}">
						<div class="card-item">
							<div class="player-thumbnails-container">`;

					for (var o = 0; o < server.playerTokens.length && (useLimit == false || o < ROBLOX_ICON_LIMIT); o++) {
						var thumbnail = {
							requestId: "0:" + server.playerTokens[o] + ":AvatarHeadshot:150x150:png:regular",
							type: "AvatarHeadShot",
							size: "150x150",
							format: "png",
							token: server.playerTokens[o],
							targetId: 0
						};

						fullcode += `
						<span class="avatar avatar-headshot-md player-avatar">
							<span class="thumbnail-2d-container avatar-card-image">
								<img class="" data-thumbnailrequestid="${escapeHTML(thumbnail.requestId)}" alt="" title="">
							</span>
						</span>`;

						thumbnailsToFetch.push(thumbnail);
					}

					if (useLimit && server.playing > ROBLOX_ICON_LIMIT)
						fullcode += `<span class="avatar avatar-headshot-md player-avatar hidden-players-placeholder">+${escapeHTML(server.playing - ROBLOX_ICON_LIMIT)}</span>`;

					fullcode += `
							</div>
							<div class="rbx-game-server-details game-server-details">
								<div class="text-info rbx-game-status rbx-game-server-status text-overflow">${escapeHTML(server.playing)} / ${escapeHTML(server.maxPlayers)}</div>
								<div class="server-player-count-gauge border">
									<div class="gauge-inner-bar border" style="width: ${escapeHTML(Math.floor((server.playing / server.maxPlayers) * 100))}%;"></div>
								</div>
								<span data-placeid="${escapeHTML(Rkis.GameId)}">
									<button type="button" class="btn-full-width btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width" onclick="Roblox.GameLauncher.joinGameInstance(${escapeHTML(Rkis.GameId)}, '${escapeHTML(server.id)}');">${Rkis.language["joinButtons"]}</button>
								</span>
							</div>
						</div>
					</li>`;
					holder.innerHTML += fullcode;
				}

				for (var i = 0; i < thumbnailsToFetch.length; i += 99) {
					fetch("https://thumbnails.roblox.com/v1/batch", {
						"headers": {
							"content-type": "application/json",
							"x-csrf-token": document.$find("#rbx-body > meta").dataset.token
						},
						"body": JSON.stringify(thumbnailsToFetch.filter((x, xi) => xi >= i && xi < i + 99)),
						"method": "POST",
						"mode": "cors",
						"credentials": "include"
					})
						.then(response => response.json())
						.then(list => {
							if (list.data == null) return null;
							list.data.forEach((e, ei) => {
								var elems = document.querySelectorAll(`img[data-thumbnailrequestid="${e.requestId}"]`);
								if (elems == null) return;

								elems.forEach((elem) => {
									elem.src = e.imageUrl
									elem.removeAttribute("data-thumbnailrequestid");
								});
							})
						})
						.catch()
				}

				Rkis.Scripts.PageNav.running = false;
			}

			Rkis.Scripts.PageNav.firstone();
		})();
	}

	//public server link
	if (Rkis.IsSettingEnabled("PublicServersLink", {
		id: "PublicServersLink",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionSLB",
				description: "sectionSLB1",
				note: "sectionSLink"
			},
			"en": {
				name: "Server Link Button",
				description: "Shows a link button next to the join button and gives server's join link.",
				note: "NOTE: Sharing the link won't work unless the person also have this extension!"
			}
		}
	})) {
		(function () {
			Rkis.Scripts.PublicServersLink = Rkis.Scripts.PublicServersLink || {};
			Rkis.Scripts.PublicServersLink.isOn = true;
			Rkis.Scripts.PublicServersLink.cursor = '';
			Rkis.Scripts.PublicServersLink.loadedServers = [];

			// document.$watchLoop("li.rbx-game-server-item[data-gameid]", (server) => {
			// 	var serverid = server.dataset.gameid;
			// 	if (serverid != '' && serverid != null) {
			// 		var joinbtn = server.querySelector('.rbx-game-server-join');
			// 		if (joinbtn == null) {
			// 			if (Rkis.IS_DEV) console.error(`join button not found`, server);
			// 			return;
			// 		}
			// 		var parent = joinbtn.parentElement;
			// 		Rkis.Scripts.PublicServersLink.secondone(joinbtn, parent, serverid);
			// 	}
			// });

			document.$watch("#rbx-running-games", (publicServerContainer) => {
				let excludeFullGames = false;
				let sortOrder = 'Desc';

				publicServerContainer.$watch('.rbx-running-games-load-more', btn => {
					btn.addEventListener('click', () => {
						Rkis.Scripts.PublicServersLink.loadMore(Rkis.GameId, {
							excludeFullGames,
							sortOrder
						});
					})
				});
				
				publicServerContainer.querySelector('.rbx-refresh')
				.addEventListener('click', () => {
					Rkis.Scripts.PublicServersLink.loadMore(Rkis.GameId, {
						excludeFullGames,
						sortOrder,
						cursor: ''
					});
				});


				
				publicServerContainer.$watch('input#filter-checkbox', input => {
					input.addEventListener('change', (e) => {
						excludeFullGames = e.target.value
					})
				});
				
				publicServerContainer.$watch('select.rbx-select', input => {
					input.addEventListener('change', (e) => {
						excludeFullGames = e.target.value
					})
				});

				Rkis.Scripts.PublicServersLink.loadMore(Rkis.GameId, {
					excludeFullGames,
					sortOrder
				});
			});

			Rkis.Scripts.PublicServersLink.loadMore = async function (placeId, options) {
				if (Rkis.Scripts.PublicServersLink.isOn == false) return;
				Rkis.Scripts.PublicServersLink.isOn = false;
				
				document.$watch('#rbx-game-server-item-container .rbx-game-server-item *:not(.rk-multi-button) > .game-server-join-btn', input => {
					Rkis.Scripts.PublicServersLink.setupLinks(placeId);
				});
				
				let payload = [];
				if (options.sortOrder != null) payload.push('sortOrder=' + options.sortOrder);
				if (options.excludeFullGames != null) payload.push('excludeFullGames=' + options.excludeFullGames);
				if (options.cursor != null) payload.push('cursor=' + options.cursor);
				else payload.push('cursor=' + Rkis.Scripts.PublicServersLink.cursor);
				
				let result = await fetch(`https://games.roblox.com/v1/games/${placeId}/servers/Public?${payload.join('&')}`)
				.then(response => response.json())
				.catch(() => null);
				
				if (result && result.data && result.data.length > 0) {
					Rkis.Scripts.PublicServersLink.cursor = result.nextPageCursor;

					Rkis.Scripts.PublicServersLink.loadedServers.push(...result.data);
					Rkis.Scripts.PublicServersLink.setupLinks(placeId);
				}
				
				Rkis.Scripts.PublicServersLink.isOn = true;
				return result;
			}

			Rkis.Scripts.PublicServersLink.setupLinks = function (placeId) {
				let noLinkPublicServers = document.querySelectorAll('#rbx-game-server-item-container .rbx-game-server-item *:not(.rk-multi-button) > .game-server-join-btn');

				noLinkPublicServers.forEach((joinButton, index) => {
					let server = Rkis.Scripts.PublicServersLink.loadedServers[0];
					if (server == null) return;
					
					Rkis.Scripts.PublicServersLink.addButton(joinButton, server.id, placeId);
					Rkis.Scripts.PublicServersLink.loadedServers.shift();
				});
			}

			Rkis.Scripts.PublicServersLink.addButton = function (joinButton, serverId, placeId) {
				var newbtnexist = document.querySelector(`[data-serverid="${escapeHTML(serverId)}"]`);
				if (newbtnexist) return;

				var linkButton = document.createElement("a");
				linkButton.className = "btn-control-xs rk-copy-link-btn";
				linkButton.textContent = "🔗";

				linkButton.dataset.serverid = serverId;
				linkButton.dataset.placeid = placeId;

				var link = `https://${Rkis.SubDomain}.roblox.com/home?placeid=${placeId}&gameid=${serverId}`;

				linkButton.addEventListener("click", () => { Rkis.CopyText(link); });
				joinButton.parentElement.insertBefore(linkButton, joinButton);
				joinButton.parentElement.classList.add("rk-multi-button");

				Rkis.contextMenu.elementContextMenu(joinButton, "jobid", "Copy Job Id", () => {
					Rkis.CopyText(serverId);
				});
			}

			
			//document.addEventListener("rkrequested-public", Rkis.Scripts.SmallServer.createSection);
		})();
	}

	//should or shouldn't show the max players count (ex. 7 => 7/8)
	if (Rkis.IsSettingEnabled("ShowMaxPlayers", {
		id: "ShowMaxPlayers",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionMPN",
				description: "sectionMPN1"
			},
			"en": {
				name: "Maximum Players Number",
				description: "Shows Maximum players number next to the available players number."
			}
		}
	})) {
		document.$watch("#game-instances", (e) => {

			document.$watch("ul.game-stats-container > li > p.text-label",
				(check) => check.textContent.toLowerCase() == "server size",
				(label) => {
					let playercount = label.parentElement.children[1];

					Rkis.gamePlayers = parseInt(playercount.textContent);
					if (isNaN(Rkis.gamePlayers)) Rkis.gamePlayers = undefined;

					// if (!(isNaN(Rkis.gamePlayers) != true && Rkis.gamePlayers < 10)) {
					// 	e.classList.add("max-players-text");
					// }
				}
			);

		});
	}

	if (Rkis.IsSettingEnabled("Badges", {
		id: "Badges",
		type: "switch",
		value: { switch: true },
		data: {
			customization: {
				showHiddenBadges: true
			}
		},
		details: {
			default: "en",
			translate: {
				name: "sectionCBV",
				description: "sectionCBV1"
			},
			"en": {
				name: "New Badges Look & Load all",
				description: "Shows the new Style design by Ameer!\nloads first 100 badges automatically."
			}
		}
	})) {
		(function () {

			Rkis.Scripts.BadgesView = Rkis.Scripts.BadgesView || {};

			let customization = Rkis.GetSettingCustomization("Badges");
			let showHiddenBadges = true;
			if (typeof customization.showHiddenBadges == "boolean") {
				showHiddenBadges = customization.showHiddenBadges;
			}

			Rkis.Scripts.BadgesView.firstone = async function () {

				var universe = document.$find("#game-detail-meta-data", (e) => { return e.dataset.universeId; });
				if (universe == null) return;

				var results = await fetch(`https://badges.roblox.com/v1/universes/${universe}/badges?cursor=&limit=100&sortOrder=Asc`)
					.then(res => res.json());
				if (results == null) return;

				var secondloop = false;

				var requestsforimges = [];
				var idsforbadges = [];
				var awardedBadges = null;

				for (var i = 0; i < results.data.length; i++) {
					var badge = results.data[i];
					idsforbadges.push(badge.id);

					requestsforimges.push({ "requestId": `${badge.id}:undefined:BadgeIcon:150x150:null:regular`, "type": "BadgeIcon", "targetId": badge.id, "format": null, "size": "150x150" });
				}

				if (Rkis.wholeData.Designer == null || Rkis.wholeData.Designer.wholeData == null || Rkis.wholeData.Designer.wholeData["BadgesAwarded"] != false) {
					awardedBadges = await fetch(`https://badges.roblox.com/v1/users/${document.$find("head > meta[data-userid]", (e) => { return e.dataset.userid; })}/badges/awarded-dates?badgeIds=${idsforbadges}`)
						.then((response) => response.json())
						.catch(() => { return null; });
				}

				var badgeImg = await fetch(`https://thumbnails.roblox.com/v1/batch`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(requestsforimges)
				})
					.then((response) => response.json())
					.catch(() => { return null; });

				var badgessection = await document.$watch(".rbx-body .game-badges-list > ul.stack-list").$promise();
				if (badgessection == null) return console.error("didn't find badge place");
				badgessection.innerHTML = "";
				badgessection.classList.add("roblokis-badges-loaded");

				for (var x = 0; x < 2; x++) {

					for (var i = 0; i < results.data.length; i++) {
						var badge = results.data[i];
						if (badge.enabled == false && secondloop == false) continue;
						else if (badge.enabled == true && secondloop == true) continue;

						var mainelement = document.createElement("li");
						mainelement.className = "stack-row badge-row";
						if (badge.enabled == false) mainelement.style.opacity = "0.6";

						var badgeimg = badgeImg.data.find(x => x.targetId == badge.id);
						var thecut = false;

						if (awardedBadges != null && awardedBadges.data != null) var badgeawr = awardedBadges.data.find(x => x.badgeId == badge.id);

						var creat = null;
						var updat = null;

						if (Rkis.wholeData.Designer == null || Rkis.wholeData.Designer.wholeData == null || Rkis.wholeData.Designer.wholeData["BadgesCreated"] != false) { creat = new Date(badge.created); thecut = true; }
						if (Rkis.wholeData.Designer == null || Rkis.wholeData.Designer.wholeData == null || Rkis.wholeData.Designer.wholeData["BadgesUpdated"] != false) { updat = new Date(badge.updated); thecut = true; }

						var badgeawrd = "";
						if (badgeawr != null) {
							var award = new Date(badgeawr.awardedDate);

							badgeawrd = `<li title="${Rkis.language.get("badgeAchievedLong", award.$format("MMM D, YYYY | hh:mm A (T)"))}"> <div class="text-label">${Rkis.language["badgeAchievedShort"]}</div> 
						<div class="font-header-2 badge-stats-info">${award.$since()}</div> </li>`;
							thecut = true;
						}

						if (Rkis.Designer.currentTheme?.styles?.badges != "card") thecut = false;

						if (badgeimg?.imageUrl != null) mainelement.innerHTML = `<div class="badge-image"> <a href="${window.location.origin}/badges/${escapeHTML(badge.id)}/${escapeHTML(badge.name)}"> <img src="${escapeHTML(badgeimg.imageUrl)}"></a> </div>`;
						mainelement.innerHTML += /*html*/`
						<div class="badge-content">
							<div class="badge-data-container">
								<div class="font-header-2 badge-name">${escapeHTML(badge.name) || Rkis.language["badgeNoName"]}</div>
								<p class="para-overflow">${escapeHTML(badge.description) || Rkis.language["badgeNoDescription"]}</p>
							</div>
							<ul class="badge-stats-container">
								<li>
									<div class="text-label">${Rkis.language["badgeRare"]}</div>
									<div class="font-header-2 badge-stats-info">${escapeHTML(Math.floor(badge.statistics.winRatePercentage * 1000) / 10)}%</div>
								</li>
								<li>
									<div class="text-label">${Rkis.language["badgeLastWon"]}</div>
									<div class="font-header-2 badge-stats-info">${escapeHTML(badge.statistics.pastDayAwardedCount)}</div>
								</li>
								<li>
									<div class="text-label">${Rkis.language["badgeWon"]}</div> 
									<div class="font-header-2 badge-stats-info">${escapeHTML(badge.statistics.awardedCount)}</div>
								</li>
								${thecut == true ? `<li class="thecut"></li>` : ""}
								${creat != null ? /*html*/`
								<li title="${Rkis.language.get("badgeCreatedLong", creat.$format("MMM D, YYYY | hh:mm A (T)"))}">
									<div class="text-label">${Rkis.language["badgeCreatedShort"]}</div> 
									<div class="font-header-2 badge-stats-info">${creat.$since()}</div>
								</li>` : ""}
								${updat != null ? /*html*/`
								<li title="${Rkis.language.get("badgeUpdatedLong", updat.$format("MMM D, YYYY | hh:mm A (T)"))}">
									<div class="text-label">${Rkis.language["badgeUpdatedShort"]}</div> 
									<div class="font-header-2 badge-stats-info">${updat.$since()}</div>
								</li>` : ""}
								${badgeawrd}
							</ul>
						</div>`;

						badgessection.append(mainelement);
					}

					if (showHiddenBadges) secondloop = true;
					else x = 2;

				}

				document.querySelector(".game-badges-list > li")?.remove?.();
			}

			document.addEventListener("rkrequested-badge", Rkis.Scripts.BadgesView.firstone);
		})();

	}

	if (Rkis.IsSettingEnabled("AvailPrivateServers", {
		id: "AvailPrivateServers",
		type: "switch",
		value: { switch: false },
		details: {
			default: "en",
			translate: {
				name: "sectionASO",
				description: "sectionASO1"
			},
			"en": {
				name: "Available Servers Only",
				description: "Removes all unavailable servers or all servers without a join button.",
			}
		}
	})) {

		document.$watchLoop("#rbx-private-running-games > ul > li", (server) => {
			var jionBtn = server.querySelector('div.rbx-private-game-server-details > span > button.rbx-private-game-server-join');

			if (jionBtn == null) {
				server.style = "display: none !important;";
			}

		})

	}

	if (Rkis.IsSettingEnabled("ShowPrivateServers", {
		id: "ShowPrivateServers",
		type: "switch",
		value: { switch: true },
		details: {
			default: "en",
			translate: {
				name: "sectionALM",
				description: "sectionALM1"
			},
			"en": {
				name: "Automatic Load More",
				description: "Automatically clicks load more then the servers refresh.",
			}
		}
	})) {

		//seems that roblox fixed it
		// document.$watchLoop(`#rbx-private-game-server-item-container > li`, (x) => {
		// 	let serverTitle = x.querySelector(`.game-server-details > div.section-header > span`)?.textContent;
		// 	let ownerUrl = x.querySelector(`.game-server-details > div.rbx-private-owner > a.owner-avatar[href]`)?.href;

		// 	let index = -1;

		// 	x.parentElement.querySelectorAll(`.game-server-details:has(div.rbx-private-owner > a.owner-avatar[href="${ownerUrl}"]) > div.section-header > span`)
		// 	.forEach((z, index) => {
		// 		if (z.textContent !== serverTitle) return;
		// 		index++;
		// 		if (index == 0) return;
		// 		x.remove();
		// 	});
		// });

		document.$watchLoop("#rbx-private-running-games > div.rbx-private-running-games-footer > button", async (loadmoreBTN) => {
			while (document.contains(loadmoreBTN)) {
				if (loadmoreBTN.getAttribute("disabled") == null) {
					loadmoreBTN.click();
				}

				await Rkis.delay(200);
			}
		});

	}

	//permanitly disabled might get added later
	//but for now, it looks bad
	if (false && Rkis.wholeData.UseThemes != false) {

		//TODO update counter on refresh
		Rkis.Scripts.ServerPlayerCounterLoader = function (serversitm) {
			var rightsection = serversitm.$find("div.player-thumbnails-container");
			if (!rightsection) return;
			if (rightsection.$find("span.rk-plr-counter")) return;

			var players = serversitm.$findAll("div.player-thumbnails-container > span:not(.hidden-players-placeholder)");
			if (players.length < 1) return;

			let hiddenPlayers = serversitm.$find("div.player-thumbnails-container > span.hidden-players-placeholder");
			let totalPlayerCount = players.length;
			if (hiddenPlayers != null) {
				totalPlayerCount += Number(hiddenPlayers.textContent);

				hiddenPlayers.textContent = '+' + (Number(hiddenPlayers.textContent) + 1);
				//players[players.length - 1].hidden = true;
			}

			let counter = document.createElement("span");
			counter.className = "avatar avatar-headshot-md player-avatar hidden-players-placeholder rk-plr-counter";

			var stylee = "";

			var playercount = Rkis.gamePlayers;
			if (playercount == null) playercount = document.$find("ul.game-stats-container > li:nth-child(6) > p.text-lead.font-caption-body")?.textContent;
			if (playercount == null) playercount = $r("#game-detail-page > div.btr-game-main-container.section-content > div.remove-panel.btr-description > ul > li:nth-child(6) > p.text-lead.font-caption-body")?.textContent;

			if (playercount && parseInt(playercount) <= totalPlayerCount) stylee += "background-color: darkred;color: white;";
			else if (playercount && (parseInt(playercount) / 2) <= totalPlayerCount) stylee += "background-color: orangered;color: white;";
			else stylee += "background-color: lightgray;color: black;";

			counter.setAttribute("style", stylee);
			counter.textContent = totalPlayerCount + (Rkis.IsSettingEnabled("ShowMaxPlayers") ? "/" + (playercount || "?") : "");
			//counter.id = "rk-plr-counter";

			rightsection.insertBefore(counter, rightsection.firstChild);
		}


		Rkis.Scripts.PrivateServersView = Rkis.Scripts.PrivateServersView || {};


		document.$watch("#rbx-private-game-server-item-container", () => {
			document.$watchLoop("#rbx-private-game-server-item-container > li", (serverslist) => {
				Rkis.Scripts.PrivateServersView.secondone(serverslist);
			})
		})

		Rkis.Scripts.PrivateServersView.secondone = function (serversitm) {
			//Server Name Highlight
			var serverNameElement = serversitm.$find("div.rbx-private-game-server-details > div.section-header > span");
			if (serverNameElement != null) serverNameElement.setAttribute("title", serverNameElement.textContent);

			//Remove Empty Image Highlight
			serversitm.$watch("div.rbx-private-game-server-details > div.rbx-private-owner > a.owner-avatar > span > img", (serverAvatarElement) => {
				serverAvatarElement.removeAttribute("title")
			});

			Rkis.Scripts.ServerPlayerCounterLoader(serversitm);
		}

		////////////

		Rkis.Scripts.FriendsServersView = Rkis.Scripts.FriendsServersView || {};


		document.$watch("#rbx-friends-game-server-item-container", () => {
			document.$watchLoop("#rbx-friends-game-server-item-container > li", (serverslist) => {
				Rkis.Scripts.FriendsServersView.secondone(serverslist);
			})
		})

		Rkis.Scripts.FriendsServersView.secondone = function (serversitm) {

			Rkis.Scripts.ServerPlayerCounterLoader(serversitm);

			var leftsection = serversitm.$find("div.game-server-details");
			if (leftsection == null) return;

			leftsection.$find("div.rbx-friends-game-server-status").setAttribute("title", leftsection.$find("div.rbx-friends-game-server-status").textContent);
		}

		////////////

		Rkis.Scripts.SmallServersView = Rkis.Scripts.SmallServersView || {};


		document.$watch("#rbx-small-game-server-item-container", () => {
			document.$watchLoop("#rbx-small-game-server-item-container > li", (serverslist) => {
				Rkis.Scripts.SmallServersView.secondone(serverslist);
			})
		})

		Rkis.Scripts.SmallServersView.secondone = function (serversitm) {
			Rkis.Scripts.ServerPlayerCounterLoader(serversitm);
		}

		////////////

		Rkis.Scripts.PublicServersView = Rkis.Scripts.PublicServersView || {};


		document.$watch("#rbx-game-server-item-container", () => {
			document.$watchLoop("#rbx-game-server-item-container > li", (serverslist) => {
				Rkis.Scripts.PublicServersView.secondone(serverslist);
			})
		})

		Rkis.Scripts.PublicServersView.secondone = function (serversitm) {
			Rkis.Scripts.ServerPlayerCounterLoader(serversitm);
		}

	}



	return {};

}

Rkis.page.game();