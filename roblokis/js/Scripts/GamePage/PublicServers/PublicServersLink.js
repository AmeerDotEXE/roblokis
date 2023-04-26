var Rkis = Rkis || {};

if (Rkis.wholeData.PublicServersLink != false) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.PublicServersLink = Rkis.Scripts.PublicServersLink || {};

	Rkis.Scripts.PublicServersLink.firstone = function () {

		var servers = document.querySelectorAll("li.rbx-game-server-join[data-gameid]");

		for (var i = 0; i < servers.length; i++) {
			var serverid = servers[i].dataset.gameid;
			if (serverid != '' && serverid != null) {
				var joinbtn = servers[i].querySelector('rbx-game-server-join');
				var parent = joinbtn.parentElement;
				Rkis.Scripts.PublicServersLink.secondone(joinbtn, parent, serverid);
			}
		}
	}

	Rkis.Scripts.PublicServersLink.secondone = function (sver, prent, serverid) {
		var newbtnexist = document.getElementById(`linkbtnid${serverid}`);
		if (newbtnexist) return;

		var newbtn = document.createElement("a");
		newbtn.setAttribute("class", "btn-control-xs");
		newbtn.id = `linkbtnid${serverid}`;
		newbtn.textContent = "🔗";

		sver.setAttribute("style", "width: 80%;margin: 0 0 0 0;");
		newbtn.setAttribute("style", "width: 18%;margin: 0 2% 0 0;");

		var link = `https://${Rkis.SubDomain}.roblox.com/home?placeid=${Rkis.GameId}&gameid=${serverid}`;

		newbtn.addEventListener("click", () => { Rkis.CopyText(link) });
		prent.insertBefore(newbtn, sver);
	}

	document.addEventListener("rkrequested-public", Rkis.Scripts.PublicServersLink.firstone);

}