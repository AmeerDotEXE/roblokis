var Rkis = Rkis || {};
Rkis.SFSV = Rkis.SFSV || {};

Rkis.SFSV.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SFSV.firstone);
  }
}

Rkis.SFSV.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getfriendsgameinstances") == false) return;

  var serverslistitm = document.querySelector("#rbx-friends-game-server-item-container");
  if (serverslistitm == null) return;

  var serverslist = document.querySelectorAll("#rbx-friends-game-server-item-container > li");
  if (serverslist.length <= 0) return;

  serverslistitm.setAttribute("style", "display: flex;flex-wrap: wrap;");

  serverslist.forEach(Rkis.SFSV.secondone);
}

Rkis.SFSV.secondone = function(serversitm, itmnumber, wholeListofitm) {
  serversitm.setAttribute("style", "width: 188px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;border-radius: 20px;margin: 0 6px 6px 0px;");

  var jionBtn = serversitm.querySelector("div.rbx-friends-game-server-details > a.rbx-friends-game-server-join");
  if(!jionBtn.getAttribute("style")) jionBtn.setAttribute("style", "margin: 0 0 0 0;");

  var rightsection = serversitm.querySelector("div.section-right");
  if (!rightsection) return;
  rightsection.setAttribute("class", "rbx-friends-game-server-players");

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
  leftsection.setAttribute("class", "rbx-friends-game-server-details");

  var playersinserver = leftsection.querySelector("div.rbx-friends-game-server-status > div").title;
  leftsection.querySelector("div.rbx-friends-game-server-status").innerHTML = playersinserver;
  leftsection.querySelector("div.rbx-friends-game-server-status").setAttribute("style", "font-size: 90%;text-overflow: ellipsis;overflow: hidden;");
  leftsection.querySelector("div.rbx-friends-game-server-status").setAttribute("title", leftsection.querySelector("div.rbx-friends-game-server-status").innerText);
}

function isWholeNumber(num) {
  num = num * 1000000;
  num = num.toString();

  if (num.endsWith("000000")) return true;
  return false;
}

Rkis.SFSV.setup();