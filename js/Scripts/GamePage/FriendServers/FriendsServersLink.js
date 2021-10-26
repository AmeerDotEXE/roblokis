var Rkis = Rkis || {};
Rkis.SFSL = Rkis.SFSL || {};

Rkis.SFSL.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SFSL.firstone);
  }
}

Rkis.SFSL.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getfriendsgameinstances") == false) return;

  var serverslist = document.querySelectorAll("#rbx-friends-game-server-item-container > li");
  if (serverslist.length <= 0) return;

  serverslist.forEach(Rkis.SFSL.secondone);
}

Rkis.SFSL.secondone = function(serversitm, itmnumber, wholeListofitm) {
  if(serversitm == null) return;

  var jionBtn = serversitm.querySelector("div.rbx-friends-game-server-details > a.rbx-friends-game-server-join");
  if(jionBtn.onclick.toString().includes("joinGameInstance")) Rkis.SFSL.thirdone(jionBtn, jionBtn.parentElement);
}

Rkis.SFSL.thirdone = function (sver, prent) {
  var serveronclick = sver.getAttribute("onclick");
  var serverid = serveronclick.split('"')[1];
  if(!serverid) return;

  var newbtnexist = document.getElementById(`flinkbtnid${serverid}`);
  if (newbtnexist) return;

  var newbtn = document.createElement("a");
  newbtn.setAttribute("class", "btn-control-xs");
  newbtn.id = `flinkbtnid${serverid}`;
  newbtn.innerHTML = "🔗";

  sver.setAttribute("style", "width: 80%;margin: 0 0 0 0;");
  newbtn.setAttribute("style", "width: 18%;margin: 0 2% 0 0;");

  var link = `https://${Rkis.SubDomain}.roblox.com/home?placeid=${sver.dataset.placeid}&gameid=${serverid}`;

  newbtn.setAttribute("onclick", `Rkis.CopyTextToClip("${link}")`);
  prent.insertBefore(newbtn, sver);
}

Rkis.SFSL.setup();