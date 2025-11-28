"use strict";

// eslint-disable-next-line no-var, no-use-before-define
var Rkis = Rkis || {};

// eslint-disable-next-line no-var, no-use-before-define
var page = page || {};

page.serversDropDown = function () {
	if (Rkis == null || Rkis.generalLoaded !== true) {
		document.addEventListener("rk-general-loaded", () => {
			page.serversDropDown();
		}, { once: true });
		return;
	}

	document.$watch("#rkpage .gamepage .servers", (e) => {
		e.$on("script", () => {
			const selection = e.querySelector(".serversselector select");
			if (selection == null)
				return;

			const holder = e.querySelector("#pageloadplace");
			if (holder == null)
				return;

			if (selection.dataset.listening === "true")
				return;
			selection.dataset.listening = "true";

			selection.value = "";
			selection.$on("change", async () => {
				holder.$findAll(".serversection", e => e.classList.remove("active"));
				holder.$find(`.serversection.${selection.value}`, e => e.classList.add("active"));
			});
		});
	});
};

page.serversDropDown();
