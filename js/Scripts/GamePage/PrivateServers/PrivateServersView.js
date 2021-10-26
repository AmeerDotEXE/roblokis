var Rkis = Rkis || {};
Rkis.SPSV = Rkis.SPSV || {};

Rkis.SPSV.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SPSV.firstone);
  }
}

Rkis.SPSV.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/private-server/instance-list-json") == false) return;

  var serverslistitm = document.querySelector("#rbx-private-servers > div.section.tab-server-only > ul");
  if (serverslistitm == null) return;

  var serverslist = document.querySelectorAll("#rbx-private-servers > div.section.tab-server-only > ul > li");
  if (serverslist.length <= 0) return;

  serverslistitm.setAttribute("style", "display: flex;flex-wrap: wrap;");

  serverslist.forEach(Rkis.SPSV.secondone);
}

Rkis.SPSV.secondone = function(serversitm, itmnumber, wholeListofitm) {
  serversitm.setAttribute("style", "width: 188px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;border-radius: 20px;margin: 0 6px 6px 0px;");

  var jionBtn = serversitm.querySelector("div.rbx-private-server-details > a.rbx-private-server-join");
  if(!jionBtn.getAttribute("style")) jionBtn.setAttribute("style", "margin: 0 0 0 0;");

  var renBtn = serversitm.querySelector("div.rbx-private-server-details > a.rbx-private-server-renew");
  if(!renBtn.getAttribute("style")) renBtn.setAttribute("style", "margin: 0 0 0 0;");

  serversitm.querySelector("div.stack-header > span").setAttribute("style", "font-size: 14px;display: inline-block;text-overflow: ellipsis;overflow: hidden;width: 100%;");
  serversitm.querySelector("div.stack-header > span").setAttribute("title", serversitm.querySelector("div.stack-header > span").innerText);

  var rightsection = serversitm.querySelector("div.section-right");
  if (!rightsection) return;
  rightsection.setAttribute("class", "rbx-private-server-players");

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

//rightsection.remove();

  var leftsection = serversitm.querySelector("div.section-left");
  leftsection.setAttribute("class", "rbx-private-server-details");

  leftsection.querySelector("div.rbx-private-server-status").remove();
  leftsection.querySelector("div.rbx-private-owner > a.text-name").remove();
  leftsection.querySelector("div.rbx-private-server-subscription-alert").remove();
}

function isWholeNumber(num) {
  num = num * 1000000;
  num = num.toString();

  if (num.endsWith("000000")) return true;
  return false;
}

Rkis.SPSV.setup();