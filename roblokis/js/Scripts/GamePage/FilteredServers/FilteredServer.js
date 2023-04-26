var Rkis = Rkis || {};

if (Rkis.wholeData.FilteredServer == true) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.FilteredServer = Rkis.Scripts.FilteredServer || {};

	Rkis.Scripts.FilteredServer.firstone = function () {

		var filteredrunninggames = document.querySelector("#rbx-filtered-running-games");
		if (filteredrunninggames) {
			filteredrunninggames.innerHTML = `<div class="container-header"><h3 data-translate="serversFiltered">Filtered Servers</h3><button id="rk-refreshfilteredservers" class="filtered-servers-buttons" data-translate="refresh">Refresh</button><button id="rk-smallfilteredservers" class="filtered-servers-buttons" data-translate="serversSmall">Small Servers</button><button id="rk-lowpingfilteredservers" class="filtered-servers-buttons" data-translate="LowPingSvrs">Low Ping Servers</button></div><ul id="rbx-filtered-game-server-item-container" class="section stack-list"><span class="spinner spinner-default"></span></ul>`;

			chrome.runtime.sendMessage({ about: "getPublicServerPageCache", GameId: Rkis.GameId }, (svrs) => {
				Rkis.Scripts.FilteredServer.showservers(((svrs != null || svrs != undefined) ? svrs.servers : []));
			});
		}
		else {
			filteredrunninggames = document.createElement("div");
			filteredrunninggames.id = "rbx-filtered-running-games";
			filteredrunninggames.setAttribute("class", "stack");
			filteredrunninggames.dataset.filter = "normal";
			filteredrunninggames.innerHTML = `<div class="container-header"><h3 data-translate="serversFiltered">Filtered Servers</h3><button id="rk-refreshfilteredservers" class="filtered-servers-buttons" data-translate="refresh">Refresh</button><button id="rk-smallfilteredservers" class="filtered-servers-buttons" data-translate="serversSmall">Small Servers</button><button id="rk-lowpingfilteredservers" class="filtered-servers-buttons" data-translate="LowPingSvrs">Low Ping Servers</button></div><ul id="rbx-filtered-game-server-item-container" class="section stack-list"><span class="spinner spinner-default"></span></ul>`;
			document.$watch("#rbx-running-games", (e) => {
				e.parentElement.append(filteredrunninggames);

				chrome.runtime.sendMessage({ about: "getPublicServerPageCache", GameId: Rkis.GameId }, (svrs) => {
					Rkis.Scripts.FilteredServer.showservers(((svrs != null && svrs != undefined) ? svrs.servers : []));
				});
			})
		}
	}

	Rkis.Scripts.FilteredServer.refresh = function (btn) {
		var filteredrunninggames = document.querySelector("#rbx-filtered-running-games");
		if (filteredrunninggames) filteredrunninggames.dataset.filter = "normal";
		if (Rkis.Scripts.FilteredPageNav) Rkis.Scripts.FilteredPageNav.filter = "normal";

		btn.disabled = true;

		function refreshGameServersCache() {
			return new Promise(resolve => {
				chrome.runtime.sendMessage({ about: "refreshGameServersCache", GameId: Rkis.GameId },
					function (data) {
						resolve(data)
					})
			})
		}

		refreshGameServersCache().then(() => {
			chrome.runtime.sendMessage({ about: "getPublicServerPageCache", GameId: Rkis.GameId }, (svrs) => {
				Rkis.Scripts.FilteredServer.showservers(((svrs != null && svrs != undefined) ? svrs.servers : []));
			});
		})
	}

	Rkis.Scripts.FilteredServer.smallservers = function (btn) {
		var filteredrunninggames = document.querySelector("#rbx-filtered-running-games");
		if (filteredrunninggames) filteredrunninggames.dataset.filter = "small";
		if (Rkis.Scripts.FilteredPageNav) Rkis.Scripts.FilteredPageNav.filter = "small";

		btn.disabled = true;

		chrome.runtime.sendMessage({ about: "getSmallServerCache", GameId: Rkis.GameId }, (svrs) => {
			Rkis.Scripts.FilteredServer.showservers(((svrs != null && svrs != undefined) ? svrs.servers : []));
		});
	}

	Rkis.Scripts.FilteredServer.lowpingservers = function (btn) {
		var filteredrunninggames = document.querySelector("#rbx-filtered-running-games");
		if (filteredrunninggames) filteredrunninggames.dataset.filter = "lowping";
		if (Rkis.Scripts.FilteredPageNav) Rkis.Scripts.FilteredPageNav.filter = "lowping";

		btn.disabled = true;

		chrome.runtime.sendMessage({ about: "getLowPingServerCache", GameId: Rkis.GameId }, (svrs) => {
			Rkis.Scripts.FilteredServer.showservers(((svrs != null && svrs != undefined) ? svrs.servers : []));
		});
	}

	Rkis.Scripts.FilteredServer.showservers = async function (servers = []) {

		var refbtn = document.querySelector("#rk-refreshfilteredservers");
		if (refbtn != null && refbtn.dataset.listening == null) {
			refbtn.dataset.listening = "true";
			refbtn.addEventListener("click", () => { Rkis.Scripts.FilteredServer.refresh(refbtn); })
		}

		var smlbtn = document.querySelector("#rk-smallfilteredservers");
		if (smlbtn != null && smlbtn.dataset.listening == null) {
			smlbtn.dataset.listening = "true";
			smlbtn.addEventListener("click", () => { Rkis.Scripts.FilteredServer.smallservers(smlbtn); })
		}

		var lpnbtn = document.querySelector("#rk-lowpingfilteredservers");
		if (lpnbtn != null && lpnbtn.dataset.listening == null) {
			lpnbtn.dataset.listening = "true";
			lpnbtn.addEventListener("click", () => { Rkis.Scripts.FilteredServer.lowpingservers(lpnbtn); })
		}

		refbtn.disabled = false;
		smlbtn.disabled = false;
		lpnbtn.disabled = false;

		if (servers.length <= 0) return;
		//servers = servers.reverse();

		var gameinstances = document.querySelector("#rbx-filtered-running-games");
		if (!gameinstances) return;

		var FilteredServers = document.querySelector("#rbx-filtered-game-server-item-container");
		if (FilteredServers) FilteredServers.innerHTML = ``;
		else {
			FilteredServers = document.createElement("ul");
			FilteredServers.id = "rbx-filtered-game-server-item-container";
			FilteredServers.setAttribute("class", "section stack-list");
			gameinstances.append(FilteredServers);

			FilteredServers = document.querySelector("#rbx-filtered-game-server-item-container");
		}

		for (var i = 0; i < servers.length; i++) {
			if (servers[i] == null || servers[i].CurrentPlayers.length <= 0) continue;

			var FilteredServer = document.createElement("li");
			FilteredServer.setAttribute("class", "stack-row rbx-game-server-item");

			var FilteredServerdetails = document.createElement("div");
			FilteredServerdetails.setAttribute("class", "section-left rbx-game-server-details");
			FilteredServerdetails.innerHTML = `<div class="text-info rbx-game-status rbx-game-server-status">${servers[i].PlayersCapacity}</div>`;
			if (servers[i].ShowSlowGameMessage) FilteredServerdetails.innerHTML += `<div class="rbx-game-server-alert"><span class="icon-remove"></span>${Rkis.language["slowServer"]}</div>`;
			if (Rkis.wholeData.FilteredServerLink != false) FilteredServerdetails.innerHTML += `<a class="btn-control-xs" style="width: 18%;margin: 0 2% 0 0;" onclick="Rkis.CopyText('https://${Rkis.SubDomain}.roblox.com/home?placeid=${servers[i].PlaceId}&amp;gameid=${servers[i].Guid}')">🔗</a><a class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${servers[i].PlaceId}, '${servers[i].Guid}', null);return false;" style="margin: 0;width: 80%;">${Rkis.language["joinButtons"]}</a>`;
			else FilteredServerdetails.innerHTML += `<a style="margin: 0;" class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${servers[i].PlaceId}, '${servers[i].Guid}');">${Rkis.language["joinButtons"]}</a>`;
			FilteredServer.append(FilteredServerdetails);

			var FilteredServerplayers = document.createElement("div");
			FilteredServerplayers.setAttribute("class", "section-right rbx-game-server-players");

			if (Rkis.wholeData.UseThemes != false) {
				var FilteredServercount = document.createElement("span");
				FilteredServercount.id = "rk-plr-counter";
				FilteredServercount.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");
				FilteredServercount.textContent = servers[i].CurrentPlayers.length + (Rkis.IsSettingEnabled("ShowMaxPlayers") ? "/" + servers[i].Capacity : "");
				if (servers[i].Capacity <= servers[i].CurrentPlayers.length) FilteredServercount.style = "background-color: darkred;color: white;";
				else if ((servers[i].Capacity / 2) <= servers[i].CurrentPlayers.length) FilteredServercount.style = "background-color: orangered;color: white;";
				else FilteredServercount.style = "background-color: lightgray;color: black;";
				FilteredServerplayers.append(FilteredServercount);
			}

			for (var o = 0; o < servers[i].CurrentPlayers.length; o++) {
				var FilteredServerplayer = document.createElement("span");
				FilteredServerplayer.setAttribute("class", "avatar avatar-headshot-sm player-avatar");
				FilteredServerplayer.innerHTML = `<a class="avatar-card-link"><img class="avatar-card-image" src="${servers[i].CurrentPlayers[o].Thumbnail.Url}"></a>`;
				FilteredServerplayers.append(FilteredServerplayer);
			}

			FilteredServer.append(FilteredServerplayers);
			FilteredServers.append(FilteredServer);
		}

	}

	Rkis.Scripts.FilteredServer.firstone();
	//document.addEventListener("rk-publicrefresh", () => { Rkis.Scripts.FilteredServer.firstone() });

}