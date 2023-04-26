var Rkis = Rkis || {};

if (Rkis.wholeData.FriendsServersLink != false && false) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.FriendsServersLink = Rkis.Scripts.FriendsServersLink || {};

	Rkis.Scripts.FriendsServersLink.firstone = function () {

		var serverslist = document.querySelectorAll("#rbx-friends-game-server-item-container > li");
		if (serverslist.length <= 0) return;

		serverslist.forEach(Rkis.Scripts.FriendsServersLink.secondone);
	}

	Rkis.Scripts.FriendsServersLink.secondone = function (serversitm, itmnumber, wholeListofitm) {
		if (serversitm == null) return;

		var jionBtn = serversitm.querySelector("div.rbx-friends-game-server-details > span > button.rbx-friends-game-server-join");
		if (jionBtn.getAttribute("onclick").includes("joinGameInstance")) Rkis.Scripts.FriendsServersLink.thirdone(jionBtn, jionBtn.parentElement);
	}

	Rkis.Scripts.FriendsServersLink.thirdone = function (sver, prent) {
		var serveronclick = sver.getAttribute("onclick");
		var serverid = serveronclick.split('"')[1];
		if (!serverid) return;

		var newbtnexist = document.getElementById(`flinkbtnid${serverid}`);
		if (newbtnexist) return;

		var newbtn = document.createElement("a");
		newbtn.setAttribute("class", "btn-control-xs");
		newbtn.id = `flinkbtnid${serverid}`;
		newbtn.textContent = "🔗";

		sver.setAttribute("style", "width: 80%;margin: 0 0 0 0;");
		newbtn.setAttribute("style", "width: 18%;margin: 0 2% 0 0;");

		var link = window.location.href.split("?")[0].split("#")[0] + `?placeid=${sver.dataset.placeid}&gameid=${serverid}`;

		newbtn.setAttribute("onclick", `Rkis.CopyText("${link}")`);
		prent.insertBefore(newbtn, sver);
	}

	//document.addEventListener("rkrequested-friends", Rkis.Scripts.FriendsServersLink.firstone);

}