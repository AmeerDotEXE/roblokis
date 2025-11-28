/* global Roblox */

// open public roblox game
(function () {
	document.addEventListener("readystatechange", () => {
		if (document.readyState !== "complete")
			return;

		const weburl = window.location.href;
		if (weburl.includes("placeid=") && weburl.includes("gameid=")) {
			const placeid = weburl.split("placeid=")[1].split("&")[0];
			const gameid = weburl.split("gameid=")[1].split("&")[0];

			if (placeid && gameid)
				Roblox.GameLauncher.joinGameInstance(Number.parseInt(placeid), gameid);
		}
	});
})();

// listen for requests
// will be replaced!!!
(function () {
	const origOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function () {
		this.addEventListener("load", () => {
			const requestevent = new CustomEvent("rkrequested", {
				detail: this,
			});
			document.dispatchEvent(requestevent);

			if (this.responseURL.includes("servers/VIP")) {
				document.dispatchEvent(new CustomEvent("rkrequested-private"));
			}
			if (this.responseURL.includes("servers/Friend")) {
				document.dispatchEvent(new CustomEvent("rkrequested-friends"));
			}
			if (this.responseURL.includes("servers/Public")) {
				document.dispatchEvent(new CustomEvent("rkrequested-public"));
			}
			if (this.responseURL.includes("badges.roblox.com/v1/universes")) {
				document.dispatchEvent(new CustomEvent("rkrequested-badge"));
			}
		});

		// eslint-disable-next-line prefer-rest-params
		origOpen.apply(this, arguments);
	};
})();

// don't redirect when clicked on Quick Join Button
if (false) {
	(function () {
		document.addEventListener("rk-quickgamejoin", (event) => {
			const id = event.detail.buttonid;
			if (id == null || id === "")
				return;

			const button = document.querySelector(`a.game-card-link[data-id="${id}"`);
			if (button == null)
				return;
			const joinbtn = button.querySelector("a.rk-quickgamejoin");

			button.addEventListener("click", (e) => {
				if (e.target !== joinbtn)
					return true;

				Roblox.GameLauncher.joinMultiplayerGame(joinbtn.dataset.placeid);
				e.preventDefault();
				return false;
			});
		});

		// backup of old method
		/* document.$watchLoop(`a.game-card-link[data-addedjoin="true"`, (button) => {
			var joinbtn = button.querySelector("a.rk-quickgamejoin");

			button.addEventListener("click", (e) => {
					if(e.target == joinbtn) { e.preventDefault(); return false; }
					return true;
			})
		}); */
	})();
}
