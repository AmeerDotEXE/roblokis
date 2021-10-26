var Rkis = Rkis || {};
Rkis.SFST = Rkis.SFST || {};

Rkis.SFST.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SFST.firstone);
  }
}

Rkis.SFST.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getfriendsgameinstances") == false) return;

  var serverslist = document.querySelectorAll("#rbx-friends-game-server-item-container > li");
  if (serverslist.length <= 0) return;

  serverslist.forEach(Rkis.SFST.secondone);
}

Rkis.SFST.secondone = function(serversitm, itmnumber, wholeListofitm) {
  if(serversitm == null) return;

  var jionBtn = serversitm.querySelector("div.rbx-friends-game-server-details > a.rbx-friends-game-server-join");
  if(jionBtn.onclick.toString().includes("joinPrivateGame")) jionBtn.innerHTML = "Join Private Server";
  else if(jionBtn.onclick.toString().includes("joinGameInstance")) jionBtn.innerHTML = "Join Public Server";
}

Rkis.SFST.setup();