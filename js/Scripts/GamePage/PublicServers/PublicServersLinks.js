var Rkis = Rkis || {};
Rkis.SSL = Rkis.SSL || {};

Rkis.SSL.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SSL.firstone);
  }
}

Rkis.SSL.firstone = function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getgameinstancesjson") == false) return;

  var servers = document.getElementsByClassName("rbx-game-server-join");

  for (var i = 0; i < servers.length; i++) {
    if (servers[i].getAttribute("onclick")) {
      var parent = servers[i].parentElement;
      Rkis.SSL.secondone(servers[i], parent);
    }
  }
}

Rkis.SSL.secondone = function (sver, prent) {
  var serveronclick = sver.getAttribute("onclick");
  var serverid = serveronclick.split('"')[1];
  if(!serverid) return;

  var newbtnexist = document.getElementById(`linkbtnid${serverid}`);
  if (newbtnexist) return;

  var newbtn = document.createElement("a");
  newbtn.setAttribute("class", "btn-control-xs");
  newbtn.id = `linkbtnid${serverid}`;
  newbtn.innerHTML = "🔗";

  sver.setAttribute("style", "width: 80%;margin: 0 0 0 0;");
  newbtn.setAttribute("style", "width: 18%;margin: 0 2% 0 0;");

  var link = `https://${Rkis.SubDomain}.roblox.com/home?placeid=${Roblox.GamePassJSData.PlaceID}&gameid=${serverid}`;

  newbtn.setAttribute("onclick", `Rkis.CopyTextToClip("${link}")`);
  prent.insertBefore(newbtn, sver);
}

Rkis.SSL.setup();