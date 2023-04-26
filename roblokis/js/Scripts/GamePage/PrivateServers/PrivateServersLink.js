var Rkis = Rkis || {};

if (Rkis.wholeData.PrivateServersLink != false && false) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.PrivateServersLink = Rkis.Scripts.PrivateServersLink || {};

	Rkis.Scripts.PrivateServersLink.running = false;

	Rkis.Scripts.PrivateServersLink.firstone = async function (darequest) {

		if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/private-server/instance-list-json") == false) return;//make it so it use the requested page

		if (Rkis.Scripts.PrivateServersLink.running == true) return;
		Rkis.Scripts.PrivateServersLink.running = true;

		var firstscan = await Rkis.Scripts.PrivateServersLink.secondone(Roblox.GameDetail.UniverseId, 1);
		if (firstscan == null) return Rkis.Scripts.PrivateServersLink.running = false;

		var svers = firstscan.Instances;
		for (var i = 1; i < firstscan.TotalPages; i++) {
			var scan = await Rkis.Scripts.PrivateServersLink.secondone(Roblox.GameDetail.UniverseId, i + 1);
			if (scan == null) continue;

			svers = svers.concat(scan.Instances);
		}

		var servers = document.querySelectorAll("#rbx-private-running-games > ul > li");

		for (var i = 0; i < servers.length; i++) {
			var svrId = servers[i].dataset.serverId;
			var uniId = servers[i].dataset.universeid;
			var jionBtn = servers[i].querySelector('div.rbx-private-game-server-details > span > button.rbx-private-game-server-join');

			if (jionBtn != null && !jionBtn.getAttribute("style")) jionBtn.setAttribute("style", "margin: 0 0 0 0;");

			if (svrId && (jionBtn && jionBtn.onclick) && document.getElementById("privateid" + svrId) === null) {
				jionBtn.setAttribute("id", "privateid" + svrId);
				Rkis.Scripts.PrivateServersLink.thirdone(svrId, svers);
			}

		}

		Rkis.Scripts.PrivateServersLink.running = false;

	}

	Rkis.Scripts.PrivateServersLink.secondone = async function (uniId, pnum) {
		return await fetch(`https://${Rkis.SubDomain}.roblox.com/private-server/instance-list-json?universeId=${uniId}&page=${pnum}`)
			.then((Aresponse) => Aresponse.json())
			.catch((err) => null)
	}

	Rkis.Scripts.PrivateServersLink.thirdone = function (serverid, svers) {
		var sver = document.getElementById("privateid" + serverid);
		if (!sver) return;
		var prent = sver.parentElement;

		var svr = svers.find(x => x.PrivateServer.Id.toString() == serverid);
		if (svr == null) return;

		var newbtnexist = document.getElementById(`linkbtnid${serverid}`);
		if (newbtnexist) return;

		var theLinkCode = svr.PrivateServer.LinkCode;
		if (theLinkCode == null) return;

		var link = window.location.href;
		if (link.includes("?")) {
			link = link.split("?")[0];
		}
		if (link.includes("#")) {
			link = link.split("#")[0];
		}
		link += "?privateServerLinkCode=" + theLinkCode; //Rkis.CopyTextToClip('${theLink}')

		var newbtn = document.createElement("a");
		newbtn.setAttribute("class", "btn-control-xs");
		newbtn.id = `linkbtnid${serverid}`;
		newbtn.textContent = "🔗";

		sver.setAttribute("style", "width: 80%;margin: 0 0 0 0;");
		newbtn.setAttribute("style", "width: 18%;margin: 0 2% 0 0;");

		newbtn.setAttribute("onclick", `Rkis.CopyText("${link}")`);
		prent.insertBefore(newbtn, sver);
	}

	document.addEventListener("rkrequested", Rkis.Scripts.PrivateServersLink.firstone);

}