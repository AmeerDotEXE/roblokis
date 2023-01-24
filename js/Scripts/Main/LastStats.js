var Rkis = Rkis || {};

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
				chrome.runtime.sendMessage({ about: "postURLRequest", url: url, jsonData: json },
					function (data) {
						resolve(data)
					})
			})
		}

		function getData(url) {
			return new Promise(resolve => {
				chrome.runtime.sendMessage({ about: "getURLRequest", url: url },
					function (data) {
						resolve(data)
					})
			})
		}

		var result = await getData(`https://api.roblox.com/users/${id}/onlinestatus/`);/*fetch("https://presence.roblox.com/v1/presence/users", {
		method: 'POST',
		credentials: 'include',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({ "userIds": [ id ] })
	})
	.then((response) => response.json())
	.catch(() => {return null;});
	if(result != null && result.userPresences != null) result = result.userPresences;
	if(result != null && result.length > 0) result = result[0];*/

		var statusholder = await document.$watch("#profile-statistics-container > .section.profile-statistics").$promise();
		if (statusholder == null) return;

		var oldthingytodelete = document.querySelector("#lastseentheprofileis");
		if (oldthingytodelete != null) oldthingytodelete.remove();

		var onlinestats = null;
		var onlineseen = null;
		var onlinegame = null;

		if (result != null) {
			var award = new Date(result.LastOnline);//small start letters

			if (result.PlaceId != null) onlinestats = `<a class="text-lead" href="${window.location.origin}/games/refer?PlaceId=${result.PlaceId}" style="text-decoration: underline;">${result.LastLocation}</a>`;
			else onlinestats = `<p class="text-lead">${result.LastLocation}</p>`;

			if (result.PlaceId != null && result.gameId != null) onlinegame = `<li class="profile-stat" style="display: grid;justify-items: center;"><p class="text-label">${Rkis.language["lastGame"]}</p> <p class="text-lead" onclick="Roblox.GameLauncher.joinGameInstance(${result.PlaceId}, '${result.GameId}')" style="width: fit-content;background-color: #00b06f;border-radius: 10px;padding: 0 20%;cursor: pointer;align-self: center;">${Rkis.language["joinButtons"]}</p> </li>`;

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