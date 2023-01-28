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

	//fixes roblox's site errors
	document.$watchLoop(`[class$="'"]`, (e) => {
		var broken_class = e.classList[e.classList.length - 1];
		var fixed_class = broken_class.slice(0, -1);

		e.classList.remove(broken_class);
		e.classList.add(fixed_class);
	})

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
					smallrunninggames.classList.add("stack");
					smallrunninggames.innerHTML = `<div class="container-header"><h3 data-translate="smallSection">Some Small Servers</h3><button type="button" class="btn-more rbx-refresh refresh-link-icon btn-control-xs btn-min-width" data-translate="refresh">Refresh</button></div><ul id="rbx-small-game-server-item-container" class="section stack-list"><span class="spinner spinner-default"></span></ul>`;
					smallrunninggames.$find('div.container-header button.rbx-refresh', (e) => {
						if (e.dataset.islistening == "true") return;
						e.addEventListener("click", () => {
							Rkis.Scripts.SmallServer.createSection();
						})
					})
					document.querySelector("#running-game-instances-container").insertBefore(smallrunninggames, document.querySelector("#rbx-running-games"));
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

				fetch('https://games.roblox.com/v1/games/' + GameID + '/servers/Public?limit=100&sortOrder=Asc&cursor=' + nextPage)
					.then((resp) => resp.json())
					.then((servers) => {
						if (servers.data == null) return null;
						if (servers.data.length <= 0 || servers.data.filter(x => x.playing > 0).length < 5) {
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

				var gameinstances = document.querySelector("#running-game-instances-container");
				if (!gameinstances) return;

				var smallrunninggames = document.querySelector("#rbx-small-running-games");
				if (smallrunninggames == null) {
					smallrunninggames = document.createElement("div");
					smallrunninggames.id = "rbx-small-running-games";
					smallrunninggames.classList.add("stack");
					smallrunninggames.innerHTML = `<div class="container-header"><h3 data-translate="smallSection">Some Small Servers</h3><button type="button" class="btn-more rbx-refresh refresh-link-icon btn-control-xs btn-min-width" data-translate="refresh">Refresh</button></div><ul id="rbx-small-game-server-item-container" class="section stack-list"></ul>`;
					smallrunninggames.$find('div.container-header button.rbx-refresh', (e) => {
						if (e.dataset.islistening == "true") return;
						e.addEventListener("click", () => {
							Rkis.Scripts.SmallServer.createSection();
						})
					})
					document.querySelector("#running-game-instances-container").insertBefore(smallrunninggames, document.querySelector("#rbx-running-games"));
				}

				smallrunninggames.$findAll("button", (e) => {
					e.disabled = false;
				});

				var smallservers = smallrunninggames.$find('ul', (e) => {
					if (e.querySelector("span.spinner") == null) return e;
					e.innerHTML = ``;
				});
				var thumbnailsToFetch = [];
				var loadmorelists = [];

				for (var i = 0; i < servers.length; i++) {
					if (servers[i].playing <= 0) continue;

					var smallserver = document.createElement("li");
					smallserver.classList.add("stack-row");
					smallserver.classList.add("rbx-game-server-item");

					var smallserverdetails = document.createElement("div");
					smallserverdetails.classList.add("section-left");
					smallserverdetails.classList.add("rbx-game-server-details");
					//put 8 of 7 people max
					smallserverdetails.innerHTML = `<div class="text-info rbx-game-status rbx-game-server-status">${servers[i].maxPlayers} / ${servers[i].playing}</div>`;
					//if(servers[i].ShowSlowGameMessage) smallserverdetails.innerHTML += `<div class="rbx-game-server-alert"><span class="icon-remove"></span>${Rkis.language["slowServer"]}</div>`;
					if (Rkis.IsSettingEnabled("SmallServerLink", {
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
					})) smallserverdetails.innerHTML += `<a class="btn-control-xs rk-copy-link-btn" style="width: 18%;margin: 0 2% 0 0;" data-placeid="${PlaceId}" data-serverid="${servers[i].id}">🔗</a><a class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${PlaceId}, '${servers[i].id}', null);return false;" style="margin: 0;width: 80%;">${Rkis.language["joinButtons"]}</a>`;
					else smallserverdetails.innerHTML += `<a style="margin: 0;" class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${PlaceId}, '${servers[i].id}');">${Rkis.language["joinButtons"]}</a>`;
					smallserverdetails.$find(".rk-copy-link-btn", (e) => { e.addEventListener("click", () => { Rkis.CopyText(`https://${Rkis.SubDomain}.roblox.com/home?placeid=${e.dataset.placeid}&gameid=${e.dataset.serverid}`); }); });
					smallserver.append(smallserverdetails);

					var smallserverplayers = document.createElement("div");
					smallserverplayers.classList.add("section-right");
					smallserverplayers.classList.add("rbx-game-server-players");

					if (Rkis.wholeData.UseThemes != false) {
						var smallservercount = document.createElement("span");
						smallservercount.id = "rk-plr-counter";
						smallservercount.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");
						smallservercount.innerText = servers[i].playing + (Rkis.IsSettingEnabled("ShowMaxPlayers") ? "/" + servers[i].maxPlayers : "");
						smallserverplayers.append(smallservercount);
					}

					for (var o = 0; o < servers[i].playerTokens.length; o++) {
						//{"requestId":"0:11EE4E2238B3D801907FBA48A12E4F0E:AvatarHeadshot:150x150:png:regular","type":"AvatarHeadShot","targetId":0,"token":"11EE4E2238B3D801907FBA48A12E4F0E","format":"png","size":"150x150"}
						var thumbnail = {
							requestId: "0:" + servers[i].playerTokens[o] + ":AvatarHeadshot:150x150:png:regular",
							type: "AvatarHeadShot",
							size: "150x150",
							format: "png",
							token: servers[i].playerTokens[o],
							targetId: 0
						};
						var smallserverplayer = document.createElement("span");
						smallserverplayer.setAttribute("class", "avatar avatar-headshot-sm player-avatar");
						smallserverplayer.innerHTML = `<a class="avatar-card-link"><img class="avatar-card-image" data-thumbnailrequestid="${thumbnail.requestId}"></a>`;
						smallserverplayers.append(smallserverplayer);

						thumbnailsToFetch.push(thumbnail);
					}

					smallserver.append(smallserverplayers);
					if (i < 10) smallservers.append(smallserver);
					else loadmorelists.push(smallserver);
				}

				for (var i = 0; i < loadmorelists.length; i += 10) {
					var serversToAdd = []
					for (var o = i; o < (i + 10) && o < loadmorelists.length; o++) { serversToAdd.push(loadmorelists[o]); }

					var loadmorebutton = document.createElement("button");
					loadmorebutton.setAttribute("class", "rbx-running-games-load-more btn-control-md btn-full-width");
					loadmorebutton.innerText = Rkis.language["loadMore"];
					if (i / 10 != 0) loadmorebutton.style.display = "none";
					if (i / 10 != 0) loadmorebutton.dataset.loadmore = (i / 10) - 1;
					loadmorebutton.dataset.loadnum = (i / 10);
					loadmorebutton.addEventListener("click", (event) => {
						if (event.target.tagName != "BUTTON" || event.target.dataset.loadnum == null || event.target.dataset.loadnum == "") return;
						var selector = `[data-loadmore="${event.target.dataset.loadnum}"]`;
						var list = smallrunninggames.querySelectorAll(selector);
						list.forEach((e) => {
							if (e.hidden == true) e.hidden = false;
							else e.style.display = "inline-block";
						});
						event.target.remove();
					});
					smallrunninggames.append(loadmorebutton);

					serversToAdd.forEach((e) => {
						e.dataset.loadmore = i / 10;
						e.hidden = true;
						smallservers.append(e);
					});
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
							list.data.forEach((e) => {
								var elem = document.querySelector(`img[data-thumbnailrequestid="${e.requestId}"]`);
								if (elem == null) return;

								elem.src = e.imageUrl;
							})
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
				<div id="rkpagenav" style="margin: 12px 20% 0;display: flex;height: 40px;" data-page="1" data-max="${pagecount}">
					<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">|&lt;</button>
					<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&lt;</button>
					<span class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;">
						<input type="textfield" style="border: none;width: 42%;text-align: right;" class="btn-control-sm rbx-running-games-load-more" id="rkpagenavnum" value="1" placeholder="Page">
						<span>/ ${pagecount}+</span></span>
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
					var result = await fetch(`https://games.roblox.com/v1/games/${Rkis.GameId}/servers/Public?limit=100&sortOrder=Desc&cursor=${Rkis.Scripts.PageNav.nextPage}&excludeFullGames=true`)
						.then((response) => response.json())
						.then((data) => {
							if (data.data == null) return null;
							return data;
						})
						.catch(() => { return null });
					if (result == null) return;
					Rkis.Scripts.PageNav.nextPage = result.nextPageCursor;

					result.data.forEach((e) => { Rkis.Scripts.PageNav.totalServers.push(e); });
				}

				pagecount = Math.floor((Rkis.Scripts.PageNav.totalServers.length || 0) / 10) + 1;
				if (pagenav) pagenav.dataset.max = pagecount;
				if (pagenav) pagenav.$find("span > span").innerText = `/ ${pagenav.dataset.max}+`

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

				let ROBLOX_ICON_LIMIT = 5;
				let useLimit = Rkis.IsSettingDisabled("UseThemes");

				for (var i = 0; i < data.length; i++) {
					var server = data[i];

					var fullcode = "";

					fullcode += `
					<li class="rbx-game-server-item col-md-3 col-sm-4 col-xs-6 pagenav" data-gameid="${server.id}">
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
								<img class="" data-thumbnailrequestid="${thumbnail.requestId}" alt="" title="">
							</span>
						</span>`;

						thumbnailsToFetch.push(thumbnail);
					}

					if (useLimit && server.playing > ROBLOX_ICON_LIMIT)
						fullcode += `<span class="avatar avatar-headshot-md player-avatar hidden-players-placeholder">+${server.playing - ROBLOX_ICON_LIMIT}</span>`;

					fullcode += `
							</div>
							<div class="rbx-game-server-details game-server-details">
								<div class="text-info rbx-game-status rbx-game-server-status text-overflow">${server.playing} / ${server.maxPlayers}</div>
								<div class="server-player-count-gauge border">
									<div class="gauge-inner-bar border" style="width: ${Math.floor((server.playing / server.maxPlayers) * 100)}%;"></div>
								</div>
								<span data-placeid="${Rkis.GameId}">
									<button type="button" class="btn-full-width btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width" onclick="Roblox.GameLauncher.joinGameInstance(${Rkis.GameId}, '${server.id}');">${Rkis.language["joinButtons"]}</button>
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

			document.$watchLoop("li.rbx-game-server-item[data-gameid]", (server) => {
				var serverid = server.dataset.gameid;
				if (serverid != '' && serverid != null) {
					var joinbtn = server.querySelector('.rbx-game-server-join');
					if (joinbtn == null) {
						if (Rkis.IS_DEV) console.error(`join button not found`, server);
						return;
					}
					var parent = joinbtn.parentElement;
					Rkis.Scripts.PublicServersLink.secondone(joinbtn, parent, serverid);
				}
			});

			Rkis.Scripts.PublicServersLink.secondone = function (sver, prent, serverid) {
				var newbtnexist = document.getElementById(`linkbtnid${serverid}`);
				if (newbtnexist) return;

				var newbtn = document.createElement("a");
				newbtn.setAttribute("class", "btn-control-xs");
				newbtn.id = `linkbtnid${serverid}`;
				newbtn.innerText = "🔗";

				sver.setAttribute("style", "width: 80%;margin: 0 0 0 0;");
				newbtn.setAttribute("style", "width: 18%;margin: 0 2% 0 0;");

				var link = `https://${Rkis.SubDomain}.roblox.com/home?placeid=${Rkis.GameId}&gameid=${serverid}`;

				newbtn.addEventListener("click", () => { Rkis.CopyText(link) });
				prent.insertBefore(newbtn, sver);
			}
		})();
	}


	//should or shouldn't show the max players count (7 => 7/8)
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

			document.$watch("div.remove-panel > ul.game-stats-container > li:nth-child(6) > p.text-lead.font-caption-body:not(.invisible)", (playercount) => {
				if (!(playercount != null && isNaN(parseInt(playercount.innerText)) != true && parseInt(playercount.innerText) < 10)) {
					e.classList.add("max-players-text");
				}
			})

		})
	}

	if (Rkis.IsSettingEnabled("Badges", {
		id: "Badges",
		type: "switch",
		value: { switch: true },
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

				var badgessection = await document.$watch("#game-badges-container > game-badges-list > div > ul").$promise();
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

						if (badgeimg && badgeimg.imageUrl) mainelement.innerHTML = `<div class="badge-image"> <a href="${window.location.origin}/badges/${badge.id}/${badge.name}"> <img src="${badgeimg.imageUrl}"></a> </div>`;
						mainelement.innerHTML += `<div class="badge-content"> <div class="badge-data-container">
						<div class="font-header-2 badge-name">${badge.displayName || Rkis.language["badgeNoName"]}</div>
						<p class="para-overflow">${badge.displayDescription || Rkis.language["badgeNoDescription"]}</p> </div> <ul class="badge-stats-container"> <li> <div class="text-label">${Rkis.language["badgeRare"]}</div>
						<div class="font-header-2 badge-stats-info">${Math.floor(badge.statistics.winRatePercentage * 1000) / 10}%</div> </li> <li> <div class="text-label">${Rkis.language["badgeLastWon"]}</div>
						<div class="font-header-2 badge-stats-info">${badge.statistics.pastDayAwardedCount}</div> </li> <li> <div class="text-label">${Rkis.language["badgeWon"]}</div> 
						<div class="font-header-2 badge-stats-info">${badge.statistics.awardedCount}</div> </li>
						${thecut == true ? `<li class="thecut"></li>` : ""} ${creat != null ? `<li
						title="${Rkis.language.get("badgeCreatedLong", creat.$format("MMM D, YYYY | hh:mm A (T)"))}"> <div class="text-label">${Rkis.language["badgeCreatedShort"]}</div> 
						<div class="font-header-2 badge-stats-info">${creat.$since()}</div> </li>` : ""} ${updat != null ? `<li
						title="${Rkis.language.get("badgeUpdatedLong", updat.$format("MMM D, YYYY | hh:mm A (T)"))}"> <div class="text-label">${Rkis.language["badgeUpdatedShort"]}</div> 
						<div class="font-header-2 badge-stats-info">${updat.$since()}</div> </li>` : ""}` + badgeawrd + `</ul> </div>`;

						badgessection.append(mainelement);
					}

					if (Rkis.IsSettingEnabled("BadgesHidden", {
						id: "BadgesHidden",
						type: "switch",
						value: { switch: true },
						details: {
							default: "en",
							translate: {
								name: "sectionCBH",
								description: "sectionCBH1"
							},
							"en": {
								name: "Show Hidden Badges",
								description: "Shows the Hidden/Disabled Badges! (Load All Option is Required)"
							}
						}
					})) secondloop = true;
					else x = 2;

				}
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

		document.$watchLoop("#rbx-private-running-games > div.rbx-private-running-games-footer > button", async (loadmoreBTN) => {
			while (document.contains(loadmoreBTN)) {
				if (loadmoreBTN.getAttribute("disabled") == null) {
					loadmoreBTN.click();
				}
				await Rkis.delay(200);
			}
		})

	}

	if (Rkis.wholeData.UseThemes != false) {

		Rkis.Scripts.ServerPlayerCounterLoader = function (serversitm) {
			var rightsection = serversitm.$find("div.player-thumbnails-container");
			if (!rightsection) return;
			if (rightsection.$find("span#rk-plr-counter")) return;

			var players = serversitm.$findAll("div.player-thumbnails-container > span:not(.hidden-players-placeholder)");
			if (players.length < 1) return;

			let hiddenPlayers = serversitm.$find("div.player-thumbnails-container > span.hidden-players-placeholder");
			let totalPlayerCount = players.length;
			if (hiddenPlayers != null) totalPlayerCount += Number(hiddenPlayers.innerText);

			var counter = document.createElement("span");
			counter.setAttribute("class", "avatar avatar-headshot-md player-avatar avatar-card-link avatar-card-image");

			var stylee = "";

			var playercount = document.$find("#about > div.section.game-about-container > div.section-content.remove-panel > ul > li:nth-child(6) > p.text-lead.font-caption-body");
			if (playercount == null) playercount = $r("#game-detail-page > div.btr-game-main-container.section-content > div.remove-panel.btr-description > ul > li:nth-child(6) > p.text-lead.font-caption-body");

			if (playercount && parseInt(playercount.innerText) <= totalPlayerCount) stylee += "background-color: darkred;color: white;";
			else if (playercount && (parseInt(playercount.innerText) / 2) <= totalPlayerCount) stylee += "background-color: orangered;color: white;";
			else stylee += "background-color: lightgray;color: black;";

			counter.setAttribute("style", stylee);
			counter.innerText = totalPlayerCount + (Rkis.IsSettingEnabled("ShowMaxPlayers") ? "/" + (playercount.innerText || "?") : "");
			counter.id = "rk-plr-counter";

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
			if (serverNameElement != null) serverNameElement.setAttribute("title", serverNameElement.innerText);

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

			leftsection.$find("div.rbx-friends-game-server-status").setAttribute("title", leftsection.$find("div.rbx-friends-game-server-status").innerText);
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