var Rkis = Rkis || {};
Rkis.SSV = Rkis.SSV || {};

Rkis.SSV.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SSV.firstone);
  }
}

Rkis.SSV.firstone = function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getgameinstancesjson") == false) return;

  var serverslistitm = document.querySelector("#rbx-game-server-item-container");
  if (serverslistitm == null) return;

  var serverslist = document.querySelectorAll("#rbx-game-server-item-container > li");
  if (serverslist.length <= 0) return;

  serverslistitm.setAttribute("style", "display: flex;flex-wrap: wrap;");

  serverslist.forEach(Rkis.SSV.secondone);
}

Rkis.SSV.secondone = function(serversitm, itmnumber, wholeListofitm) {
  serversitm.setAttribute("style", "width: 188px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;border-radius: 20px;margin: 0 6px 6px 0px;");

  var jionBtn = serversitm.querySelector("div.rbx-game-server-details > a.rbx-game-server-join");
  if(!jionBtn.getAttribute("style")) jionBtn.setAttribute("style", "margin: 0 0 0 0;");

  var rightsection = serversitm.querySelector("div.section-right");
  if (!rightsection) return;
  rightsection.setAttribute("class", "rbx-game-server-players");

  var players = rightsection.querySelectorAll("span");
  players.forEach((e) => {e.setAttribute("style", "margin: 0px -10px 6px 0px;top: 8px;width: 34px;height: 34px;");});

  if(players.length >= 1) {
    var counter = document.createElement("span");
    counter.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");

    var stylee = "margin: 0px -8px 6px 0px;top: 8px;width: 34px;height: 34px;display: inline-grid;align-content: center;font-weight: bold;font-size: unset;text-align: center;";

    var playercount = document.querySelector("#about > div.section.game-about-container > div.section-content.remove-panel > ul > li:nth-child(6) > p.text-lead.font-caption-body.wait-for-i18n-format-render");
    if (playercount && parseInt(playercount.innerText) <= players.length) stylee += "background-color: darkred;color: white;";
    else if (playercount && (parseInt(playercount.innerText) / 2) <= players.length) stylee += "background-color: orangered;color: white;";
    else stylee += "background-color: lightgray;color: black;";

    counter.setAttribute("style", stylee);
    counter.innerText = players.length;

    rightsection.insertBefore(counter, rightsection.firstChild);
  }

  //serversitm.querySelector("div.section-right").remove();

  var leftsection = serversitm.querySelector("div.section-left");
  leftsection.setAttribute("class", "rbx-game-server-details");

  leftsection.querySelector("div.rbx-game-server-status").remove();
}

function isWholeNumber(num) {
  num = num * 1000000;
  num = num.toString();

  if (num.endsWith("000000")) return true;
  return false;
}

Rkis.SSV.setup();