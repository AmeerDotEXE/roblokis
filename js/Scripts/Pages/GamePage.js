var Rkis = Rkis || {};



if(Rkis.pageName == "game") {

	/* Coming Soon
	//refresh public servers cache
	document.$watch("#rbx-private-servers > div.container-header > span.btn-min-width.btn-control-xs.btn-more.rbx-refresh.refresh-link-icon", (btn) => {
		chrome.runtime.sendMessage({about: "refreshGameServersCache", GameId: Rkis.GameId});
		btn.addEventListener("click", () => { chrome.runtime.sendMessage({about: "refreshGameServersCache", GameId: Rkis.GameId}); document.$triggerCustom("rk-publicrefresh", {}); });
	})
	*/

	Rkis.Scripts = Rkis.Scripts || {};

	document.$watchLoop(`[class$="'"]`, (e) => {
		var broken_class = e.classList[e.classList.length - 1];
		var fixed_class = broken_class.slice(0, -1);

		e.classList.remove(broken_class);
		e.classList.add(fixed_class);
	})

	if(Rkis.wholeData.ShowMaxPlayers != false) {
		document.$watch("#game-instances", (e) => {

			document.$watch("div.remove-panel > ul.game-stats-container > li:nth-child(6) > p.text-lead.font-caption-body:not(.invisible)", (playercount) => {
				if(!(playercount != null && isNaN(parseInt(playercount.innerText)) != true && parseInt(playercount.innerText) < 10)) {
					e.classList.add("max-players-text");
		        }
			})

    })
	}

	if(Rkis.wholeData.Badges != false) {

	  Rkis.Scripts.BadgesView = Rkis.Scripts.BadgesView || {};

	  Rkis.Scripts.BadgesView.firstone = async function() {

	  	var universe = document.$find("#game-detail-meta-data", (e) => { return e.dataset.universeId; });
	  	if(universe == null) return;

	    var results = await fetch(`https://badges.roblox.com/v1/universes/${universe}/badges?cursor=&limit=100&sortOrder=Asc`)
	    	.then(res => res.json());
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
	      awardedBadges = await fetch(`https://badges.roblox.com/v1/users/${document.$find("head > meta[data-userid]", (e) => { return e.dataset.userid; })}/badges/awarded-dates?badgeIds=${idsforbadges}`)
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
	    if(badgessection == null) return console.error("didn't find badge place");
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

	          badgeawrd = `<li title="${Rkis.language.get("badgeAchievedLong", award.$format("MMM D, YYYY | hh:mm A (T)"))}"> <div class="text-label">${Rkis.language["badgeAchievedShort"]}</div> 
	          <div class="font-header-2 badge-stats-info">${award.$since()}</div> </li>`;
	          thecut = true;
	        }

	        if(badgeimg && badgeimg.imageUrl) mainelement.innerHTML = `<div class="badge-image"> <a href="${window.location.origin}/badges/${badge.id}/${badge.name}"> <img src="${badgeimg.imageUrl}"></a> </div>`;
	        mainelement.innerHTML += `<div class="badge-content"> <div class="badge-data-container">
	          <div class="font-header-2 badge-name">${badge.displayName || Rkis.language["badgeNoName"]}</div>
	          <p class="para-overflow">${badge.displayDescription || Rkis.language["badgeNoDescription"]}</p> </div> <ul class="badge-stats-container"> <li> <div class="text-label">${Rkis.language["badgeRare"]}</div>
	          <div class="font-header-2 badge-stats-info">${Math.floor(badge.statistics.winRatePercentage * 1000) / 10}%</div> </li> <li> <div class="text-label">${Rkis.language["badgeLastWon"]}</div>
	          <div class="font-header-2 badge-stats-info">${badge.statistics.pastDayAwardedCount}</div> </li> <li> <div class="text-label">${Rkis.language["badgeWon"]}</div> 
	          <div class="font-header-2 badge-stats-info">${badge.statistics.awardedCount}</div> </li>
	          ${thecut == true ? `<li class="thecut"></li>` : ""} ${creat != null ? `<li
	          title="${Rkis.language.get("badgeCreatedLong", creat.$format("MMM D, YYYY | hh:mm A (T)"))}"> <div class="text-label">${Rkis.language["badgeCreatedShort"]}</div> 
	          <div class="font-header-2 badge-stats-info">${creat.$since()}</div> </li>` : ""} ${updat != null ? `<li
	          title="${Rkis.language.get("badgeUpdatedLong", updat.$format("MMM D, YYYY | hh:mm A (T)"))}"> <div class="text-label">${Rkis.language["badgeUpdatedShort"]}</div> 
	          <div class="font-header-2 badge-stats-info">${updat.$since()}</div> </li>` : ""}` + badgeawrd + `</ul> </div>`;

	        badgessection.append(mainelement);
	      }

	      if(Rkis.wholeData["BadgesHidden"] != false) secondloop = true;
	      else x = 2;

	    }
	  }

	  document.addEventListener("rkrequested-badge", Rkis.Scripts.BadgesView.firstone);

	}

	if(Rkis.wholeData.UseThemes != false) {

	  Rkis.Scripts.PrivateServersView = Rkis.Scripts.PrivateServersView || {};


    document.$watch("#rbx-private-game-server-item-container", () => {
	    document.$watchLoop("#rbx-private-game-server-item-container > li", (serverslist) => {
		    Rkis.Scripts.PrivateServersView.secondone(serverslist);
			})
	  })

	  Rkis.Scripts.PrivateServersView.secondone = function(serversitm) {
	  	var serverNameElement = serversitm.$find("div.section-header > span");
	    if(serverNameElement != null) serverNameElement.setAttribute("title", serverNameElement.innerText);

	    var rightsection = serversitm.$find("div.section-right");
	    if (!rightsection) return;
	    if(rightsection.$find("span#rk-plr-counter")) return;

	    var players = serversitm.$findAll("div.section-right > span");
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
	      counter.innerText = players.length + (Rkis.wholeData.ShowMaxPlayers != false ? "/"+(playercount.innerText || "?") : "");
	      counter.id = "rk-plr-counter";

	      rightsection.insertBefore(counter, rightsection.firstChild);
	    }
	  }

	  ////////////

	  Rkis.Scripts.FriendsServersView = Rkis.Scripts.FriendsServersView || {};


	  document.$watch("#rbx-friends-game-server-item-container", () => {
	    document.$watchLoop("#rbx-friends-game-server-item-container > li", (serverslist) => {
		    Rkis.Scripts.FriendsServersView.secondone(serverslist);
			})
	  })

	  Rkis.Scripts.FriendsServersView.secondone = function(serversitm) {
	    var rightsection = serversitm.$find("div.section-right");
	    if (!rightsection) return;
	    if(rightsection.$find("span#rk-plr-counter")) return;

	    var players = serversitm.$findAll("div.section-right > span");
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
	      counter.innerText = players.length + (Rkis.wholeData.ShowMaxPlayers != false ? "/"+(playercount.innerText || "?") : "");
	      counter.id = "rk-plr-counter";

	      rightsection.insertBefore(counter, rightsection.firstChild);
	    }

	    var leftsection = serversitm.$find("div.section-left");

	    var playersinserver = leftsection.$find("div.rbx-friends-game-server-status > div").title;
	    leftsection.$find("div.rbx-friends-game-server-status").innerText = playersinserver;
	    leftsection.$find("div.rbx-friends-game-server-status").setAttribute("title", leftsection.$find("div.rbx-friends-game-server-status").innerText);
	  }

	  ////////////

	  Rkis.Scripts.PublicServersView = Rkis.Scripts.PublicServersView || {};


	  document.$watch("#rbx-game-server-item-container", () => {
	    document.$watchLoop("#rbx-game-server-item-container > li", (serverslist) => {
		    Rkis.Scripts.PublicServersView.secondone(serverslist);
			})
	  })

	  Rkis.Scripts.PublicServersView.secondone = function(serversitm) {
	    var rightsection = serversitm.$find("div.section-right");
	    if (!rightsection) return;
	    if(rightsection.$find("span#rk-plr-counter")) return;

	    var players = serversitm.$findAll("div.section-right > span");
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
	      counter.innerText = players.length + (Rkis.wholeData.ShowMaxPlayers != false ? "/"+(playercount.innerText || "?") : "");
	      counter.id = "rk-plr-counter";

	      rightsection.insertBefore(counter, rightsection.firstChild);
	    }
	  }

	}



	function isWholeNumber(num) {
	 	num = num * 1000000;
	 	num = num.toString();

	 	if (num.endsWith("000000")) return true;
	 	return false;
	}
}