//open public roblox game
(function () {
	document.addEventListener("readystatechange", function () {
		if (document.readyState != "complete") return;

		var weburl = window.location.href;
		if (weburl.includes("placeid=") && weburl.includes("gameid=")) {

			var placeid = weburl.split("placeid=")[1].split("&")[0];
			var gameid = weburl.split("gameid=")[1].split("&")[0];

			if (placeid && gameid) Roblox.GameLauncher.joinGameInstance(parseInt(placeid), gameid);

		}
	});
})();

//listen for requests
//will be replaced!!!
(function () {
	var origOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function () {
		this.addEventListener('load', () => {
			var requestevent = new CustomEvent('rkrequested', {
				detail: this
			});
			document.dispatchEvent(requestevent);

			if (this.responseURL.includes("servers/VIP")) { document.dispatchEvent(new CustomEvent('rkrequested-private')); }
			if (this.responseURL.includes("servers/Friend")) { document.dispatchEvent(new CustomEvent('rkrequested-friends')); }
			if (this.responseURL.includes("servers/Public")) { document.dispatchEvent(new CustomEvent('rkrequested-public')); }
			if (this.responseURL.includes("badges.roblox.com/v1/universes")) { document.dispatchEvent(new CustomEvent('rkrequested-badge')); }
		});
		origOpen.apply(this, arguments);
	};
})();

//don't redirect when clicked on Quick Join Button
(function () {
	return;
	document.addEventListener("rk-quickgamejoin", (event) => {
		var id = event.detail.buttonid;
		if (id == null || id == "") return;

		var button = document.querySelector(`a.game-card-link[data-id="${id}"`);
		if (button == null) return;
		var joinbtn = button.querySelector("a.rk-quickgamejoin");

		button.addEventListener("click", (e) => {
			if (e.target != joinbtn) return true;

			Roblox.GameLauncher.joinMultiplayerGame(joinbtn.dataset.placeid);
			e.preventDefault();
			return false;
		})
	});

	//backup of old method
	/*document.$watchLoop(`a.game-card-link[data-addedjoin="true"`, (button) => {
		var joinbtn = button.querySelector("a.rk-quickgamejoin");

		button.addEventListener("click", (e) => {
				if(e.target == joinbtn) { e.preventDefault(); return false; }
				return true;
		})
	});*/
})();