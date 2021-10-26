var Rkis = Rkis || {};
Rkis.QGJ = Rkis.QGJ || {};

Rkis.QGJ.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/discover")) {
    document.addEventListener("rkrequested", Rkis.QGJ.firstone);
  }
  else if (weburl.includes("/home")) {
    document.addEventListener("rkrequested", Rkis.QGJ.firsttwo);
  }
  else if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.QGJ.firstthird);
  }
  else if (weburl.includes("/users/")) {
    Rkis.QGJ.firstthird();
  }
}

Rkis.QGJ.firstone = async function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.startsWith("https://games.roblox.com/v1/games/list") == false) return;
  await Rkis.delay(1000);

  var games = await document.waitSelectorAll("li.game-card");
  games.forEach((e) => {
    var idholder = e.querySelector("div > a");
    if(idholder == null || idholder.href == null || e.dataset.addedjoin == "true") return;

    e.dataset.addedjoin = "true";

    var id = idholder.href.split("PlaceId=")[1].split("&")[0];

    var elmnt = document.createElement("a");
    elmnt.className = "btn-full-width btn-control-xs rbx-game-server-join";
    elmnt.dataset.placeid = id;
    elmnt.setAttribute("onclick", `Roblox.GameLauncher.joinMultiplayerGame(${elmnt.dataset.placeid});return false;`);
    elmnt.setAttribute("style", `margin: 0 0 0 0;`);
    elmnt.innerHTML = "Join";

    var namethingy = e.querySelector("div > a > div.game-card-name.game-name-title");
    e.querySelector("div > a").insertBefore(elmnt, namethingy);
  })
}

Rkis.QGJ.firsttwo = async function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.startsWith("https://games.roblox.com/v1/games/omni-recommendations") == false) return;

  var games = await document.waitSelectorAll("div.game-card-container");
  games.forEach((e) => {
    var idholder = e.querySelector("a");
    if(idholder == null || idholder.href == null || e.dataset.addedjoin == "true") return;

    e.dataset.addedjoin = "true";

    var id = idholder.href.split("games/")[1].split("/")[0];

    var elmnt = document.createElement("a");
    elmnt.className = "btn-full-width btn-control-xs rbx-game-server-join";
    elmnt.dataset.placeid = id;
    elmnt.setAttribute("onclick", `Roblox.GameLauncher.joinMultiplayerGame(${elmnt.dataset.placeid});return false;`);
    elmnt.setAttribute("style", `margin: 0 0 0 0;`);
    elmnt.innerHTML = "Join";

    var namethingy = e.querySelector("div > a > div.game-card-name.game-name-title");
    e.querySelector("div > a").insertBefore(elmnt, namethingy);
  })
}

Rkis.QGJ.firstthird = async function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.startsWith("https://games.roblox.com/v1/games/recommendations") == false) return;

  var games = await document.waitSelectorAll("li.game-card");
  games.forEach((e) => {
    var idholder = e.querySelector("div > a");
    if(idholder == null || idholder.href == null || e.dataset.addedjoin == "true") return;

    e.dataset.addedjoin = "true";

    var id = idholder.href.split("PlaceId=")[1].split("&")[0];

    var elmnt = document.createElement("a");
    elmnt.className = "btn-full-width btn-control-xs rbx-game-server-join";
    elmnt.dataset.placeid = id;
    elmnt.setAttribute("onclick", `Roblox.GameLauncher.joinMultiplayerGame(${elmnt.dataset.placeid});return false;`);
    elmnt.setAttribute("style", `margin: 0 0 0 0;`);
    elmnt.innerHTML = "Join";

    var namethingy = e.querySelector("div > a > div.game-card-name.game-name-title");
    e.querySelector("div > a").insertBefore(elmnt, namethingy);
  })
}

Rkis.QGJ.setup();