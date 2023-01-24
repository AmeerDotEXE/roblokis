"use strict";

///// Tamplates /////

/* Retreaving Data Tamplate
function name() {
	return new Promise(resolve => {
	chrome.runtime.sendMessage({about: ""}, 
		function(data) {
			resolve(data)
		})
	})
}
*/





///// Varables /////

let gamesCache = {}; //saves game data for faster server loading
let reploadingpublicservers = false;
let publicserversloaded = [];





///// Listeners /////

chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
	if (reason == "chrome_update" || reason == "shared_module_update") return; //console.log('Browser Updated');

	if (reason == "install") {
		console.log('Extension Installed');
		chrome.runtime.reload();
		return;
	}
	console.log(`Extension Updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);
});

// chrome.runtime.onStartup.addListener(() => {
// 	//console.log('Extension Started'); //isn't Fired in Incognito Mode
// });

chrome.runtime.onUpdateAvailable.addListener(() => {
	console.log('Extension Update Available');
	chrome.runtime.reload();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	if (request.GameId != null) {
		switch (request.about) {
			case "refreshGameServersCache":
				var temp = async function () {
					sendResponse(await refreshPublicServersCache(request.GameId));
				}
				temp();
				break;
			case "getPublicServerCountCache":
				var temp = async function () {
					if (gamesCache[request.GameId] == null || gamesCache[request.GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(request.GameId);
					var game = gamesCache[request.GameId] || null;

					if (game != null) sendResponse(game.servers.publicServers.length);
				}
				temp();
				break;
			case "getPublicServerPageCache":
				var temp = async function () {
					sendResponse(await getPublicServersPage(request.GameId, request.PageNum, request.ServerNum));
				}
				temp();
				break;
			case "getSmallServerCache":
				var temp = async function () {
					sendResponse(await getSmallServersPage(request.GameId, request.PageNum, request.ServerNum));
				}
				temp();
				break;
			case "getLowPingServerCache":
				var temp = async function () {
					sendResponse(await getLowPingServersPage(request.GameId, request.PageNum, request.ServerNum));
				}
				temp();
				break;
		}
	}
	else {
		switch (request.about) {

			case "getImageRequest":
				if (request.url == null) {
					sendResponse(null);
					break;
				}

				var temp = async function () {
					var result = await fetch(request.url).then(response => response.blob())
						.then(blob => new Promise(callback => {
							let reader = new FileReader();
							reader.onload = function () { callback(this.result) };
							reader.readAsDataURL(blob);
						}))
						.catch(async (err) => {
							return (request.quick == true ? await fetch("https://api.allorigins.win/raw?url=" + request.url).then(response => response.blob())
								.then(blob => new Promise(callback => {
									let reader = new FileReader();
									reader.onload = function () { callback(this.result) };
									reader.readAsDataURL(blob);
								}))
								.catch(() => {
									return request.url;
								}) : request.url);
						});

					if (result.startsWith("data:image") == false) result = request.url;

					sendResponse(result);
				}
				temp();
				break;

			case "getURLRequest":
				if (request.url == null) {
					sendResponse(null);
					break;
				}

				var temp = async function () {
					var result = await fetch(request.url).then(res => res.json())
						.catch(err => {
							var errorObj = { error: "Bg80", message: err };
							console.log(request.url, errorObj)
							return errorObj;
						})

					sendResponse(result);
				}
				temp();
				break;

			case "postURLRequest":
				if (request.url == null || request.jsonData == null) {
					sendResponse(null);
					break;
				}

				var temp = async function () {
					var result = await fetch(request.url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(request.jsonData)
					}).then(res => res.json())
						.catch(err => {
							var errorObj = { error: "Bg80", message: err };
							console.log(request.url, errorObj)
							return errorObj;
						})

					sendResponse(result);
				}
				temp();
				break;
		}
	}

	return true;
});





///// Functions /////

async function getPublicServersPage(GameId, PageNum = 1, serversInPage = 10) {
	var pagenum = ((PageNum || 1) - 1) * (serversInPage || 10);
	var servers = [];

	if (gamesCache[GameId] == null || gamesCache[GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(GameId);
	var game = gamesCache[GameId] || null;
	if (game == null) return sendResponse(null);

	var all_servers = [...game.servers.publicServers];

	for (var i = pagenum; i < all_servers.length && i < pagenum + (serversInPage || 10); i++) {
		servers.push(all_servers[i]);
	}

	return { servers: servers, pages: game.servers.publicServers.length, currentPage: PageNum, serversPerPage: serversInPage };
}

async function getSmallServersPage(GameId, PageNum = 1, serversInPage = 10) {
	var pagenum = ((PageNum || 1) - 1) * (serversInPage || 10);
	var servers = [];

	if (gamesCache[GameId] == null || gamesCache[GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(GameId);
	var game = gamesCache[GameId] || null;
	if (game == null) return sendResponse(null);

	var all_servers = [...game.servers.publicServers];
	all_servers = all_servers.reverse();

	for (var i = pagenum; i < all_servers.length && i < pagenum + (serversInPage || 10); i++) {
		servers.push(all_servers[i]);
	}

	//for(var i = (all_servers.length - 1) - pagenum; i >= 0 && i > ((all_servers.length - 1) - pagenum) - (serversInPage || 10); i--) {
	//	servers.push(all_servers[i]);
	//}

	return { servers: servers, pages: game.servers.publicServers.length, currentPage: PageNum, serversPerPage: serversInPage };
}

async function getLowPingServersPage(GameId, PageNum = 1, serversInPage = 10) {
	var pagenum = ((PageNum || 1) - 1) * (serversInPage || 10);
	var servers = [];

	if (gamesCache[GameId] == null || gamesCache[GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(GameId);
	var game = gamesCache[GameId] || null;
	if (game == null) return sendResponse(null);

	var all_servers = [...game.servers.publicServers];
	all_servers = all_servers.sort(function (a, b) { return a.Ping - b.Ping });

	for (var i = pagenum; i < all_servers.length && i < pagenum + (serversInPage || 10); i++) {
		servers.push(all_servers[i]);
	}

	return { servers: servers, pages: game.servers.publicServers.length, currentPage: PageNum, serversPerPage: serversInPage };
}


async function refreshPublicServersCache(GameId) {
	if (GameId == null) return null;
	gamesCache[GameId] = gamesCache[GameId] || { servers: { publicServers: [] } };

	if (reploadingpublicservers == true) {
		return new Promise(resolve => {
			publicserversloaded.push(function () { return resolve(gamesCache[GameId].servers.publicServers); });
		});
	}
	reploadingpublicservers = true;

	return new Promise((resolve) => {
		$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + GameId + "&startIndex=0", async function (data) {

			var waitinglist = [];

			function getPageServers(PageIndex, retry) {
				return new Promise(foundpage => {
					$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + GameId + "&startIndex=" + PageIndex, function (data) {
						for (j = 0; j < data.Collection.length; j++) {
							if (data.Collection[j].CurrentPlayers.length > 0 && data.Collection[j].Ping > 0) gamesCache[GameId].servers.publicServers[PageIndex + j] = data.Collection[j];
						}
						return foundpage();
					}).fail(function () {
						if (retry <= 0) return foundpage();

						console.log(`page ${PageIndex / 10} failed`);
						getPageServers(PageIndex, retry - 1)
							.then(() => { foundpage() })
							.catch(() => { foundpage() })
					});
				});
			}

			for (var i = 0; i < data.TotalCollectionSize; i += 10) {
				waitinglist.push(getPageServers(i, 3));
			}

			Promise.all(waitinglist).then(() => {
				var beforeemptyservers = gamesCache[GameId].servers.publicServers.length;
				gamesCache[GameId].servers.publicServers = gamesCache[GameId].servers.publicServers.filter((svr, svri, svrs) => svr != null && svri == svrs.findIndex((t) => (t != null && t.Guid == svr.Guid)));
				console.log("Got " + gamesCache[GameId].servers.publicServers.length + " + " + (beforeemptyservers - gamesCache[GameId].servers.publicServers.length) + " Public Servers for " + GameId);
				reploadingpublicservers = false;
				publicserversloaded.forEach((e) => { e() })
				publicserversloaded = [];

				resolve(gamesCache[GameId].servers.publicServers);
			})
		}).fail(function () {
			reploadingpublicservers = false;
			publicserversloaded.forEach((e) => { e() })
			publicserversloaded = [];

			resolve(null);
		});
	});
}