var Rkis = Rkis || {};

if(Rkis.wholeData.PageNav != false && false) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.PageNav = Rkis.Scripts.PageNav || {};

	Rkis.Scripts.PageNav.running = false;

	Rkis.Scripts.PageNav.firstone = async function() {

		var result = await Rkis.fetch("GET", `https://${Rkis.SubDomain}.roblox.com/games/getgameinstancesjson?placeId=${Rkis.GameId}&startIndex=1`, true);
		if(result == null) return;

		var buttonplace = await document.$watch("#rbx-running-games > div.rbx-running-games-footer").$promise();
		if(buttonplace == null) return;
		buttonplace.remove();
		
		document.$find("#rbx-running-games").innerHTML += `<div class="rbx-running-games-footer"><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more">${Rkis.language["loadMore"]}</button></div>`;
		buttonplace = document.$find("#rbx-running-games > div.rbx-running-games-footer");


		buttonplace.innerHTML += `
		<div id="rkpagenav" style="margin: 12px 20% 0;display: flex;height: 40px;" data-page="1" data-max="${Math.round(result.TotalCollectionSize / 10)}">
			<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.Scripts.PageNav.getpage(1)">|&lt;</button>
			<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.Scripts.PageNav.back()">&lt;</button>
			<span class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;">
				<input type="textfield" style="border: none;width: 42%;text-align: right;" class="btn-control-sm rbx-running-games-load-more" id="rkpagenavnum" value="1" placeholder="Page" onchange="Rkis.Scripts.PageNav.getpage(this.value)">
				/ ${Math.round(result.TotalCollectionSize / 10)}</span>
			<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.Scripts.PageNav.next()">&gt;</button>
			<button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.Scripts.PageNav.last()">&gt;|</button>
		</div>`;

		document.$watch("#rbx-running-games > div.rbx-running-games-footer > button", (mainbtn) => {
			mainbtn.addEventListener("click", () => {Rkis.Scripts.PageNav.next(true);})
		})

		document.$watch("#rbx-game-server-item-container", (publicsection) => {
			publicsection.classList.add("pagenav");
			Rkis.Scripts.PageNav.getpage(1);
		})

		document.$watch("#rbx-game-server-item-container > li", () => {
			Rkis.Scripts.PageNav.getpage(1);
		})

	}



	Rkis.Scripts.PageNav.getpage = async function(pagenum, more) {
		if(isNaN(Number(pagenum))) return;
		if(Number(pagenum) <= 0) pagenum = "1";

		if(Rkis.Scripts.PageNav.running == true) return;
		Rkis.Scripts.PageNav.running = true;

		var pagenav = document.$find("#rkpagenav");
		if(pagenav) pagenav.dataset.page = pagenum;

		var pagenavnum = document.$find("#rkpagenavnum");
		if(pagenavnum) pagenavnum.value = pagenum;

		var result = await fetch(`https://${Rkis.SubDomain}.roblox.com/games/getgameinstancesjson?placeId=${Rkis.GameId}&startIndex=${((pagenum - 1) * 10) + 1}`)
		.then((response) => response.json())
		.catch(() => {return null});
		if(result == null) return;

		if(pagenav) pagenav.dataset.max = Math.round(result.TotalCollectionSize / 10);

		Rkis.Scripts.PageNav.setpage(result, more);
	}

	Rkis.Scripts.PageNav.next = function(more) {
		var pagenav = document.$find("#rkpagenav");
		if(pagenav == null || pagenav.dataset.page == null) return;

		var num = Number(pagenav.dataset.page) + 1;
		if(num < 1) num = 1;
		if(num > pagenav.dataset.max) num = pagenav.dataset.max;

		Rkis.Scripts.PageNav.getpage(num, more);
	}

	Rkis.Scripts.PageNav.back = function() {
		var pagenav = document.$find("#rkpagenav");
		if(pagenav == null || pagenav.dataset.page == null) return;

		var num = Number(pagenav.dataset.page) - 1;
		if(num < 1) num = 1;
		if(num > pagenav.dataset.max) num = pagenav.dataset.max;

		Rkis.Scripts.PageNav.getpage(num);
	}

	Rkis.Scripts.PageNav.last = function() {
		var pagenav = document.$find("#rkpagenav");
		if(pagenav == null || pagenav.dataset.page == null) return;

		var num = Number(pagenav.dataset.max);

		Rkis.Scripts.PageNav.getpage(num);
	}



	Rkis.Scripts.PageNav.setpage = function(data, more) {
		var holder = document.$find("#rbx-game-server-item-container");
		if(holder == null || data == null) return;

		if(more != true) holder.innerHTML = "";

		for (var i = 0; i < data.Collection.length; i++) {
			var server = data.Collection[i];

			var fullcode = "";

			fullcode += `
			<li class="stack-row rbx-game-server-item pagenav" data-gameid="${server.Guid}">
				<div class="section-header"><div class="link-menu rbx-game-server-menu"></div></div>
				<div class="section-left rbx-game-server-details">
					<div class="text-info rbx-game-status rbx-game-server-status">${server.PlayersCapacity}</div>
					<div class="rbx-game-server-alert${server.ShowSlowGameMessage == true ? "" : " hidden"}"><span class="icon-remove"></span>${Rkis.language["slowServer"]}</div>
					<a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="${server.PlaceId}" onclick="${server.JoinScript.split("\"").join("&quot;")}">${Rkis.language["joinButtons"]}</a>
				</div>
				<div class="section-right rbx-game-server-players">`;

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

		Rkis.Scripts.PageNav.running = false;
		//if(Rkis.Scripts.PublicServersView != null) Rkis.Scripts.PublicServersView.firstone(null);
		//if(Rkis.Scripts.PublicServersLink != null) Rkis.Scripts.PublicServersLink.firstone(null);

	}

	Rkis.Scripts.PageNav.firstone();

}