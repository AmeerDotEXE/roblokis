var Rkis = Rkis || {};

if (Rkis.wholeData.FilteredServer != false && Rkis.wholeData.FilteredPageNav != false) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.FilteredPageNav = Rkis.Scripts.FilteredPageNav || {};

	Rkis.Scripts.FilteredPageNav.running = false;
	Rkis.Scripts.FilteredPageNav.filter = "normal";

	Rkis.Scripts.FilteredPageNav.firstone = async function (firsttime) {

		function getserverscount() {
			return new Promise(resolve => {
				chrome.runtime.sendMessage({ about: "getPublicServerCountCache", GameId: Rkis.GameId },
					function (data) {
						resolve(data)
					})
			})
		}

		var buttonplace = await document.$watch("#rbx-filtered-running-games").$promise();
		if (buttonplace == null) return;

		buttonplace.innerHTML += `<div class="rbx-running-games-footer"><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" data-translate="loadMore">Load More</button></div>`;
		buttonplace = buttonplace.$find("div.rbx-running-games-footer");

		var pagecount = (await getserverscount() || 0);
		pagecount = Math.floor(pagecount / 10) + 1;

		buttonplace.innerHTML += `
	<div id="rkFilteredPageNav" style="margin: 12px 20% 0;display: flex;height: 40px;" data-page="1" data-max="${pagecount}">
		<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">|&lt;</button>
		<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&lt;</button>
		<span class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;">
		<input type="textfield" style="border: none;width: 42%;text-align: right;" class="btn-control-sm rbx-running-games-load-more" id="rkFilteredPageNavnum" value="1" placeholder="Page">
		<span>/ ${pagecount}</span></span>
		<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&gt;</button>
		<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&gt;|</button>
	</div>`;

		buttonplace.$find("button").addEventListener("click", () => { Rkis.Scripts.FilteredPageNav.next(true) })

		$r("#rkFilteredPageNav > button:nth-child(1)").addEventListener("click", () => { Rkis.Scripts.FilteredPageNav.getpage(1) })
		$r("#rkFilteredPageNav > button:nth-child(2)").addEventListener("click", () => { Rkis.Scripts.FilteredPageNav.back() })

		$r("#rkFilteredPageNavnum").addEventListener("change", () => { Rkis.Scripts.FilteredPageNav.getpage($r("#rkFilteredPageNavnum").value) })

		$r("#rkFilteredPageNav > button:nth-child(4)").addEventListener("click", () => { Rkis.Scripts.FilteredPageNav.next() })
		$r("#rkFilteredPageNav > button:nth-child(5)").addEventListener("click", () => { Rkis.Scripts.FilteredPageNav.last() })

		if (firsttime) Rkis.Scripts.FilteredPageNav.getpage(1);
	}



	Rkis.Scripts.FilteredPageNav.getpage = async function (pagenum, more) {
		if (isNaN(Number(pagenum))) return; //check if number
		if (Number(pagenum) <= 0) pagenum = "1"; //minimum is 1

		if (Rkis.Scripts.FilteredPageNav.running == true) return; //check timer
		Rkis.Scripts.FilteredPageNav.running = true; //toggle timer

		var FilteredPageNav = document.$find("#rkFilteredPageNav");
		if (FilteredPageNav && Number(FilteredPageNav.dataset.max) < Number(pagenum)) pagenum = Number(FilteredPageNav.dataset.max); //check max number

		if (FilteredPageNav) FilteredPageNav.dataset.page = pagenum;

		var FilteredPageNavnum = document.$find("#rkFilteredPageNavnum");
		if (FilteredPageNavnum) FilteredPageNavnum.value = pagenum;

		var filteredresult = {
			normal: "getPublicServerPageCache",
			small: "getSmallServerCache",
			lowping: "getLowPingServerCache"
		};

		function getservers(num) {
			return new Promise(resolve => {
				chrome.runtime.sendMessage({ about: (filteredresult[Rkis.Scripts.FilteredPageNav.filter] || "getPublicServerPageCache"), GameId: Rkis.GameId, PageNum: num },
					function (data) {
						resolve(data)
					})
			})
		}

		var result = (await getservers(pagenum) || { servers: [] });
		if (result == null || result.servers.length <= 0) return;

		if (FilteredPageNav) FilteredPageNav.dataset.max = Math.floor(result.pages / 10) + 1;
		if (FilteredPageNav) FilteredPageNav.$find("span > span").textContent = `/ ${FilteredPageNav.dataset.max}`;

		Rkis.Scripts.FilteredPageNav.setpage(result.servers, more);
	}

	Rkis.Scripts.FilteredPageNav.next = function (more) {
		var FilteredPageNav = document.$find("#rkFilteredPageNav");
		if (FilteredPageNav == null || FilteredPageNav.dataset.page == null) return;

		var num = Number(FilteredPageNav.dataset.page) + 1;
		if (num < 1) num = 1;
		if (num > FilteredPageNav.dataset.max) return;

		Rkis.Scripts.FilteredPageNav.getpage(num, more);
	}

	Rkis.Scripts.FilteredPageNav.back = function () {
		var FilteredPageNav = document.$find("#rkFilteredPageNav");
		if (FilteredPageNav == null || FilteredPageNav.dataset.page == null) return;

		var num = Number(FilteredPageNav.dataset.page) - 1;
		if (num < 1) num = 1;
		if (num > FilteredPageNav.dataset.max) num = FilteredPageNav.dataset.max;

		Rkis.Scripts.FilteredPageNav.getpage(num);
	}

	Rkis.Scripts.FilteredPageNav.last = function () {
		var FilteredPageNav = document.$find("#rkFilteredPageNav");
		if (FilteredPageNav == null || FilteredPageNav.dataset.page == null) return;

		var num = Number(FilteredPageNav.dataset.max);

		Rkis.Scripts.FilteredPageNav.getpage(num);
	}



	Rkis.Scripts.FilteredPageNav.setpage = function (servers, more) {
		var holder = document.$find("#rbx-filtered-game-server-item-container");
		if (holder == null || servers == null || servers.length <= 0) return;

		if (more != true) holder.innerHTML = "";

		for (var i = 0; i < servers.length; i++) {
			var server = servers[i];
			if (server == null) continue;

			var fullcode = "";

			fullcode += `
		<li class="stack-row rbx-game-server-item" data-gameid="${server.Guid}">
		<div class="section-header"><div class="link-menu rbx-game-server-menu"></div></div>
		<div class="section-left rbx-game-server-details">
			<div class="text-info rbx-game-status rbx-game-server-status">${server.PlayersCapacity}</div>
			<div class="rbx-game-server-alert${server.ShowSlowGameMessage == true ? "" : " hidden"}"><span class="icon-remove"></span>${Rkis.language["slowServer"]}</div>
			<a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="${server.PlaceId}" onclick="${server.JoinScript.split("\"").join("&quot;")}">${Rkis.language["joinButtons"]}</a>
		</div>
		<div class="section-right rbx-game-server-players">`;

			if (Rkis.wholeData.UseThemes != false) {
				var FilteredServercount = document.createElement("span");
				FilteredServercount.id = "rk-plr-counter";
				FilteredServercount.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");
				FilteredServercount.textContent = servers[i].CurrentPlayers.length + (Rkis.IsSettingEnabled("ShowMaxPlayers") ? "/" + servers[i].Capacity : "");

				var stylee = "";
				if (servers[i].Capacity <= servers[i].CurrentPlayers.length) stylee = "background-color: darkred;color: white;";
				else if ((servers[i].Capacity / 2) <= servers[i].CurrentPlayers.length) Fstylee = "background-color: orangered;color: white;";
				else stylee = "background-color: lightgray;color: black;";
				fullcode += `<span id="rk-plr-counter" class="avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image" style="${stylee}">${FilteredServercount.innerHTML}</span>`;
			}

			for (var o = 0; o < server.CurrentPlayers.length; o++) {
				fullcode += `
		<span class="avatar avatar-headshot-sm player-avatar">
			<a class="avatar-card-link">
			<img class="avatar-card-image" src="${server.CurrentPlayers[o].Thumbnail.Url}">
			</a>
		</span>`;
			}

			fullcode += `</div></li>`;
			holder.innerHTML += fullcode;
		}

		Rkis.Scripts.FilteredPageNav.running = false;

	}

	Rkis.Scripts.FilteredPageNav.firstone(true);
	//document.$watch("#tab-game-instances", (e) => { e.addEventListener("click", () => { Rkis.Scripts.FilteredPageNav.setpage(1) }) })
	//document.addEventListener("rk-publicrefresh", () => { Rkis.Scripts.FilteredPageNav.firstone(true) });

}