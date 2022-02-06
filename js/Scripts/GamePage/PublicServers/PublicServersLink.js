var Rkis = Rkis || {};

if(Rkis.wholeData.PublicServersLink != false) {

  Rkis.Scripts = Rkis.Scripts || {};
  Rkis.Scripts.PublicServersLink = Rkis.Scripts.PublicServersLink || {};

  Rkis.Scripts.PublicServersLink.firstone = function() {

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
    newbtn.innerText = "🔗";

    sver.setAttribute("style", "width: 80%;margin: 0 0 0 0;");
    newbtn.setAttribute("style", "width: 18%;margin: 0 2% 0 0;");

    var link = `https://${Rkis.SubDomain}.roblox.com/home?placeid=${Rkis.GameId}&gameid=${serverid}`;

    newbtn.addEventListener("click", () => {Rkis.CopyText(link)});
    prent.insertBefore(newbtn, sver);
  }

  document.addEventListener("rkrequested-public", Rkis.Scripts.PublicServersLink.firstone);

}