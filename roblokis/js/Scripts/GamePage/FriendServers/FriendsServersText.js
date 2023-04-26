var Rkis = Rkis || {};

if (Rkis.wholeData.FriendsServersText != false && false) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.FriendsServersText = Rkis.Scripts.FriendsServersText || {};

	Rkis.Scripts.FriendsServersText.firstone = function () {

		var serverslist = document.querySelectorAll("#rbx-friends-game-server-item-container > li");
		if (serverslist.length <= 0) return;

		serverslist.forEach(Rkis.Scripts.FriendsServersText.secondone);
	}

	Rkis.Scripts.FriendsServersText.secondone = function (serversitm, itmnumber, wholeListofitm) {
		if (serversitm == null) return;

		var jionBtn = serversitm.querySelector("div.rbx-friends-game-server-details > span > button.rbx-friends-game-server-join");
		if (jionBtn.getAttribute("onclick").includes("joinPrivateGame")) jionBtn.textContent = Rkis.language["joinPrivateServer"];
		else if (jionBtn.getAttribute("onclick").includes("joinGameInstance")) jionBtn.textContent = Rkis.language["JoinPublicServer"];
	}

	//document.addEventListener("rkrequested-friends", Rkis.Scripts.FriendsServersText.firstone);

}