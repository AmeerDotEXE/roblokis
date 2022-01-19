var Rkis = Rkis || {};
Rkis.Scripts = Rkis.Scripts || {};

if(Rkis.wholeData.Badges != false && Rkis.pageName == "game") {

  Rkis.Scripts.BadgesView = Rkis.Scripts.BadgesView || {};

  Rkis.AddRunListener(function() {
    document.addEventListener("rkrequested", Rkis.Scripts.BadgesView.firstone);
  })

  Rkis.Scripts.BadgesView.firstone = async function(darequest) {

    if (darequest && darequest.detail && darequest.detail.responseURL.startsWith("https://badges.roblox.com/v1/universes") == false) return;

    var results = JSON.parse(darequest.detail.response);
    if(results == null) return;
    
    var secondloop = false;

    var requestsforimges = [];
    var idsforbadges = [];
    var awardedBadges = null;

      for (var i = 0; i < results.data.length; i++) {
        var badge = results.data[i];
        idsforbadges.push(badge.id);

        requestsforimges.push({"requestId":`${badge.id}:undefined:BadgeIcon:150x150:null:regular`,"type":"BadgeIcon","targetId":badge.id,"format":null,"size":"150x150"});
      }

    if(Rkis.wholeData.Designer == null || Rkis.wholeData.Designer.wholeData == null || Rkis.wholeData.Designer.wholeData["BadgesAwarded"] != false) {
      awardedBadges = await fetch(`https://badges.roblox.com/v1/users/${window.Roblox.CurrentUser.userId}/badges/awarded-dates?badgeIds=${idsforbadges}`)
      .then((response) => response.json())
      .catch(() => {return null;});
    }

    var badgeImg = await fetch(`https://thumbnails.roblox.com/v1/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestsforimges)
    })
    .then((response) => response.json())
    .catch(() => {return null;});

    var badgessection = await document.$watch("#game-badges-container > game-badges-list > div > ul").$promise();
    if(badgessection == null) return console.log("didn't find badge place");
    badgessection.innerHTML = "";
    badgessection.classList.add("roblokis-badges-loaded");

    for (var x = 0; x < 2; x++) {

      for (var i = 0; i < results.data.length; i++) {
        var badge = results.data[i];
        if(badge.enabled == false && secondloop == false) continue;
        else if(badge.enabled == true && secondloop == true) continue;

        var mainelement = document.createElement("li");
        mainelement.className = "stack-row badge-row";
        if(badge.enabled == false) mainelement.style.opacity = "0.6";

        var badgeimg = badgeImg.data.find(x => x.targetId == badge.id);
        var thecut = false;

        if(awardedBadges != null && awardedBadges.data != null) var badgeawr = awardedBadges.data.find(x => x.badgeId == badge.id);

        var creat = null;
        var updat = null;

        if(Rkis.wholeData.Designer == null || Rkis.wholeData.Designer.wholeData == null || Rkis.wholeData.Designer.wholeData["BadgesCreated"] != false) {creat = new Date(badge.created); thecut = true;}
        if(Rkis.wholeData.Designer == null || Rkis.wholeData.Designer.wholeData == null || Rkis.wholeData.Designer.wholeData["BadgesUpdated"] != false) {updat = new Date(badge.updated); thecut = true;}

        var badgeawrd = "";
        if(badgeawr != null) {
          var award = new Date(badgeawr.awardedDate);

          badgeawrd = `<li title="Achieved on ${award.$format("MMM D, YYYY | hh:mm A (T)")}"> <div class="text-label">Achieved</div> 
          <div class="font-header-2 badge-stats-info">${award.$since()}</div> </li>`;
          thecut = true;
        }

        if(badgeimg && badgeimg.imageUrl) mainelement.innerHTML = `<div class="badge-image"> <a href="${window.location.origin}/badges/${badge.id}/${badge.name}"> <img src="${badgeimg.imageUrl}"></a> </div>`;
        mainelement.innerHTML += `<div class="badge-content"> <div class="badge-data-container">
          <div class="font-header-2 badge-name">${badge.displayName.match(/^[\s0-9a-zA-Z]+$/g) ? badge.displayName.match(/^[\s0-9a-zA-Z]+$/g)[0] : "No Badge Name"}</div>
          <p class="para-overflow">${badge.displayDescription.match(/^[\s0-9a-zA-Z]+$/g) ? badge.displayDescription.match(/^[\s0-9a-zA-Z]+$/g)[0] : "No Description."}</p> </div> <ul class="badge-stats-container"> <li> <div class="text-label">Rarity</div>
          <div class="font-header-2 badge-stats-info">${Math.floor(badge.statistics.winRatePercentage * 1000) / 10}%</div> </li> <li> <div class="text-label">Won Yesterday</div>
          <div class="font-header-2 badge-stats-info">${badge.statistics.pastDayAwardedCount}</div> </li> <li> <div class="text-label">Won Ever</div> 
          <div class="font-header-2 badge-stats-info">${badge.statistics.awardedCount}</div> </li>
          ${thecut == true ? `<li class="thecut"></li>` : ""} ${creat != null ? `<li
          title="Created on ${creat.$format("MMM D, YYYY | hh:mm A (T)")}"> <div class="text-label">Created</div> 
          <div class="font-header-2 badge-stats-info">${creat.$since()}</div> </li>` : ""} ${updat != null ? `<li
          title="Updated on ${updat.$format("MMM D, YYYY | hh:mm A (T)")}"> <div class="text-label">Updated</div> 
          <div class="font-header-2 badge-stats-info">${updat.$since()}</div> </li>` : ""}` + badgeawrd + `</ul> </div>`;

        badgessection.append(mainelement);
      }

      if(Rkis.wholeData["BadgesHidden"] != false) secondloop = true;
      else x = 2;

    }
  }

}

if(Rkis.wholeData.UseThemes != false && Rkis.pageName == "game") {

  Rkis.Scripts.PrivateServersView = Rkis.Scripts.PrivateServersView || {};

  Rkis.Scripts.PrivateServersView.setup = function() {
      document.addEventListener("rkrequested", Rkis.Scripts.PrivateServersView.firstone);
  }

  Rkis.Scripts.PrivateServersView.firstone = function(darequest) {

    if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/private-server/instance-list-json") == false) return;

    var serverslistitm = document.$find("#rbx-private-servers > div.section.tab-server-only > ul");
    if (serverslistitm == null) return;

    var serverslist = document.$findAll("#rbx-private-servers > div.section.tab-server-only > ul > li");
    if (serverslist.length <= 0) return;

    serverslist.forEach(Rkis.Scripts.PrivateServersView.secondone);
  }

  Rkis.Scripts.PrivateServersView.secondone = function(serversitm, itmnumber, wholeListofitm) {
    serversitm.$find("div.stack-header > span").setAttribute("title", serversitm.$find("div.stack-header > span").innerText);

    var rightsection = serversitm.$find("div.section-right");
    if (!rightsection) return;
    if(rightsection.$find("span#rk-plr-counter")) return;

    var players = rightsection.$findAll("span");
    if(players.length >= 1) {
      var counter = document.createElement("span");
      counter.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");

      var stylee = "";

      var playercount = document.$find("#about > div.section.game-about-container > div.section-content.remove-panel > ul > li:nth-child(6) > p.text-lead.font-caption-body");
      if(playercount == null) playercount = $r("#game-detail-page > div.btr-game-main-container.section-content > div.remove-panel.btr-description > ul > li:nth-child(6) > p.text-lead.font-caption-body");

      if (playercount && parseInt(playercount.innerText) <= players.length) stylee = "background-color: darkred;color: white;";
      else if (playercount && (parseInt(playercount.innerText) / 2) <= players.length) stylee = "background-color: orangered;color: white;";
      else stylee = "background-color: lightgray;color: black;";

      counter.setAttribute("style", stylee);
      counter.innerText = players.length;
      counter.id = "rk-plr-counter";

      rightsection.insertBefore(counter, rightsection.firstChild);
    }
  }

  Rkis.Scripts.PrivateServersView.setup();

}

if(Rkis.wholeData.UseThemes != false && Rkis.pageName == "game") {

  Rkis.Scripts.FriendsServersView = Rkis.Scripts.FriendsServersView || {};

  Rkis.Scripts.FriendsServersView.setup = function() {
      document.addEventListener("rkrequested", Rkis.Scripts.FriendsServersView.firstone);
  }

  Rkis.Scripts.FriendsServersView.firstone = function(darequest) {

    if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getfriendsgameinstances") == false) return;

    var serverslist = document.$findAll("#rbx-friends-game-server-item-container > li");
    if (serverslist.length <= 0) return;

    serverslist.forEach(Rkis.Scripts.FriendsServersView.secondone);
  }

  Rkis.Scripts.FriendsServersView.secondone = function(serversitm, itmnumber, wholeListofitm) {
    var rightsection = serversitm.$find("div.section-right");
    if (!rightsection) return;
    if(rightsection.$find("span#rk-plr-counter")) return;

    var players = rightsection.$findAll("span");
    if(players.length >= 1) {
      var counter = document.createElement("span");
      counter.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");

      var stylee = "";

      var playercount = document.$find("#about > div.section.game-about-container > div.section-content.remove-panel > ul > li:nth-child(6) > p.text-lead.font-caption-body");
      if(playercount == null) playercount = $r("#game-detail-page > div.btr-game-main-container.section-content > div.remove-panel.btr-description > ul > li:nth-child(6) > p.text-lead.font-caption-body");

      if (playercount && parseInt(playercount.innerText) <= players.length) stylee += "background-color: darkred;color: white;";
      else if (playercount && (parseInt(playercount.innerText) / 2) <= players.length) stylee += "background-color: orangered;color: white;";
      else stylee += "background-color: lightgray;color: black;";

      counter.setAttribute("style", stylee);
      counter.innerText = players.length;
      counter.id = "rk-plr-counter";

      rightsection.insertBefore(counter, rightsection.firstChild);
    }

    var leftsection = serversitm.$find("div.section-left");

    var playersinserver = leftsection.$find("div.rbx-friends-game-server-status > div").title;
    leftsection.$find("div.rbx-friends-game-server-status").innerHTML = playersinserver;
    leftsection.$find("div.rbx-friends-game-server-status").setAttribute("title", leftsection.$find("div.rbx-friends-game-server-status").innerText);
  }

  Rkis.Scripts.FriendsServersView.setup();

}

if(Rkis.wholeData.UseThemes != false && Rkis.pageName == "game") {

  Rkis.Scripts.PublicServersView = Rkis.Scripts.PublicServersView || {};

  Rkis.Scripts.PublicServersView.setup = function() {
      document.addEventListener("rkrequested", Rkis.Scripts.PublicServersView.firstone);
  }

  Rkis.Scripts.PublicServersView.firstone = function(darequest) {

    if (darequest && darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getgameinstancesjson") == false) return;

    var serverslist = document.$findAll("#rbx-game-server-item-container > li");
    if (serverslist.length <= 0) return;

    serverslist.forEach(Rkis.Scripts.PublicServersView.secondone);
  }

  Rkis.Scripts.PublicServersView.secondone = function(serversitm, itmnumber, wholeListofitm) {
    var rightsection = serversitm.$find("div.section-right");
    if (!rightsection) return;
    if(rightsection.$find("span#rk-plr-counter")) return;

    var players = rightsection.$findAll("span");
    if(players.length >= 1) {
      var counter = document.createElement("span");
      counter.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");

      var stylee = "";

      var playercount = document.$find("#about > div.section.game-about-container > div.section-content.remove-panel > ul > li:nth-child(6) > p.text-lead.font-caption-body");
      if(playercount == null) playercount = $r("#game-detail-page > div.btr-game-main-container.section-content > div.remove-panel.btr-description > ul > li:nth-child(6) > p.text-lead.font-caption-body");

      if (playercount && parseInt(playercount.innerText) <= players.length) stylee += "background-color: darkred;color: white;";
      else if (playercount && (parseInt(playercount.innerText) / 2) <= players.length) stylee += "background-color: orangered;color: white;";
      else stylee += "background-color: lightgray;color: black;";

      counter.setAttribute("style", stylee);
      counter.innerText = players.length;
      counter.id = "rk-plr-counter";

      rightsection.insertBefore(counter, rightsection.firstChild);
    }
  }

  Rkis.Scripts.PublicServersView.setup();

}

//show public servers count on servers section button

function isWholeNumber(num) {
  num = num * 1000000;
  num = num.toString();

  if (num.endsWith("000000")) return true;
  return false;
}