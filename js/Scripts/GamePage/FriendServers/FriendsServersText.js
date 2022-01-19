var Rkis = Rkis || {};
Rkis.Scripts = Rkis.Scripts || {};
Rkis.Scripts.FriendsServersText = Rkis.Scripts.FriendsServersText || {};

Rkis.Scripts.FriendsServersText.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.Scripts.FriendsServersText.firstone);
  }
}

Rkis.Scripts.FriendsServersText.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getfriendsgameinstances") == false) return;

  var serverslist = document.querySelectorAll("#rbx-friends-game-server-item-container > li");
  if (serverslist.length <= 0) return;

  serverslist.forEach(Rkis.Scripts.FriendsServersText.secondone);
}

Rkis.Scripts.FriendsServersText.secondone = function(serversitm, itmnumber, wholeListofitm) {
  if(serversitm == null) return;

  var jionBtn = serversitm.querySelector("div.rbx-friends-game-server-details > a.rbx-friends-game-server-join");
  if(jionBtn.getAttribute("onclick").includes("joinPrivateGame")) jionBtn.innerText = "Join Private Server";
  else if(jionBtn.getAttribute("onclick").includes("joinGameInstance")) jionBtn.innerText = "Join Public Server";
}

Rkis.Scripts.FriendsServersText.setup();