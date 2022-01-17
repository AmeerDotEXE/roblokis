var Rkis = Rkis || {};
Rkis.Scripts = Rkis.Scripts || {};
Rkis.Scripts.PublicServersLink = Rkis.Scripts.PublicServersLink || {};

Rkis.Scripts.PublicServersLink.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.Scripts.PublicServersLink.firstone);
  }
}

Rkis.Scripts.PublicServersLink.firstone = function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getgameinstancesjson") == false) return;

  var servers = document.getElementsByClassName("rbx-game-server-join");

  for (var i = 0; i < servers.length; i++) {
    if (servers[i].getAttribute("onclick")) {
      var parent = servers[i].parentElement;
      Rkis.Scripts.PublicServersLink.secondone(servers[i], parent);
    }
  }
}

Rkis.Scripts.PublicServersLink.secondone = function (sver, prent) {
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

  var link = `https://${Rkis.SubDomain}.roblox.com/home?placeid=${Rkis.GameId}&gameid=${serverid}`;

  newbtn.addEventListener("click", () => {Rkis.CopyTextToClip(link)});
  prent.insertBefore(newbtn, sver);
}

Rkis.AddRunListener(Rkis.Scripts.PublicServersLink.setup);