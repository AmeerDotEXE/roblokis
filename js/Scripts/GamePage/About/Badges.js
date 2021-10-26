var Rkis = Rkis || {};
Rkis.SBV = Rkis.SBV || {};

Rkis.SBV.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SBV.firstone);
  }
}

Rkis.SBV.firstone = async function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.startsWith("https://badges.roblox.com/v1/universes") == false) return;

  var results = JSON.parse(darequest.detail.response);

  if(results == null) return;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  var badgessection = await document.waitSelector("#game-badges-container > game-badges-list > div > ul");
  if(badgessection == null) return console.log("didn't find badge place");
  badgessection.innerHTML = "";
  badgessection.style = "display: flex;flex-wrap: wrap;";

  var disabledbadges = [];
  var secondloop = false;

  var requestsforimges = [];
  var idsforbadges = [];
  var awardedBadges = null;

    for (var i = 0; i < results.data.length; i++) {
      var badge = results.data[i];
      idsforbadges.push(badge.id);

      requestsforimges.push({"requestId":`${badge.id}:undefined:BadgeIcon:150x150:null:regular`,"type":"BadgeIcon","targetId":badge.id,"format":null,"size":"150x150"});
    }

  awardedBadges = await fetch(`https://badges.roblox.com/v1/users/${Roblox.CurrentUser.userId}/badges/awarded-dates?badgeIds=${idsforbadges}`)
  .then((response) => response.json())
  .catch(() => {return null;});

  var badgeImg = await fetch(`https://thumbnails.roblox.com/v1/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestsforimges)
  })
  .then((response) => response.json())
  .catch(() => {return null;});

  for (var x = 0; x < 2; x++) {

    for (var i = 0; i < results.data.length; i++) {
      var badge = results.data[i];
      if(badge.enabled == false && secondloop == false) {
        disabledbadges.push(badge);
        continue;
      }
      else if(badge.enabled == true && secondloop == true)
        continue;

      var mainelement = document.createElement("li");
      mainelement.className = "stack-row badge-row";
      mainelement.style = "width: 32%;display: flex;flex-direction: column;align-items: center;border-radius: 20px;border-right: 1px solid;border-bottom: 1px solid;margin: 6px;";
      if(badge.enabled == false) mainelement.style.opacity = "0.5";

      var badgeimg = badgeImg.data.find(x => x.targetId == badge.id);
      if(awardedBadges != null) var badgeawr = awardedBadges.data.find(x => x.badgeId == badge.id);

      var creat = new Date(badge.created);
      var updat = new Date(badge.updated);

      var badgeawrd = "";
      if(badgeawr != null) {
        var award = new Date(badgeawr.awardedDate);

        badgeawrd = `<li style="display: flex;align-items: center;width: 100%;justify-content: center;"
        title="Achieved on ${award.getMonth() + 1}/${award.getDate()}/${award.getFullYear()}, ${award.getHours()}:${award.getMinutes()}:${award.getSeconds()}"> <div class="text-label" style="padding: 0 10px 0 0;">Achieved</div> 
        <div class="font-header-2 badge-stats-info">${monthNames[award.getMonth()]}, ${award.getDate()} ${award.getFullYear()}</div> </li>`;
      }

      if(badgeimg && badgeimg.imageUrl) mainelement.innerHTML = `<div class="badge-image"> <a href="${window.location.origin}/badges/${badge.id}/${badge.name}"> <img src="${badgeimg.imageUrl}"></a> </div>`;
      mainelement.innerHTML += `<div class="badge-content" style="width: 100%;margin-top: 9px;display: flex;flex-direction: column;"> <div class="badge-data-container">
        <div class="font-header-2 badge-name">${badge.displayName || "No Badge Name"}</div>
        <p class="para-overflow">${badge.displayDescription || "No Description."}</p> </div> <ul style="display: flex;flex-direction: column;"> <li style="display: flex;align-items: center;width: 100%;justify-content: center;"> <div class="text-label" style="padding: 0 10px 0 0;">Rarity</div>
        <div class="font-header-2 badge-stats-info">${Math.floor(badge.statistics.winRatePercentage * 1000) / 10}%</div> </li> <li style="display: flex;align-items: center;width: 100%;justify-content: center;"> <div class="text-label" style="padding: 0 10px 0 0;">Won Yesterday</div>
        <div class="font-header-2 badge-stats-info">${badge.statistics.pastDayAwardedCount}</div> </li> <li style="display: flex;align-items: center;width: 100%;justify-content: center;"> <div class="text-label" style="padding: 0 10px 0 0;">Won Ever</div> 
        <div class="font-header-2 badge-stats-info">${badge.statistics.awardedCount}</div> </li>
        <li style="padding: 6px;"></li> <li style="display: flex;align-items: center;width: 100%;justify-content: center;"
        title="Created on ${creat.getMonth() + 1}/${creat.getDate()}/${creat.getFullYear()}, ${creat.getHours()}:${creat.getMinutes()}:${creat.getSeconds()}"> <div class="text-label" style="padding: 0 10px 0 0;">Created</div> 
        <div class="font-header-2 badge-stats-info">${monthNames[creat.getMonth()]}, ${creat.getDate()} ${creat.getFullYear()}</div> </li> <li style="display: flex;align-items: center;width: 100%;justify-content: center;"
        title="Updated on ${updat.getMonth() + 1}/${updat.getDate()}/${updat.getFullYear()}, ${updat.getHours()}:${updat.getMinutes()}:${updat.getSeconds()}"> <div class="text-label" style="padding: 0 10px 0 0;">Updated</div> 
        <div class="font-header-2 badge-stats-info">${monthNames[updat.getMonth()]}, ${updat.getDate()} ${updat.getFullYear()}</div> </li>` + badgeawrd + `</ul> </div>`;

      var statsholder = mainelement.querySelector("div.badge-content > ul");

      badgessection.append(mainelement);
    }

    if(Rkis.wholeData.SBVH) secondloop = true;
    else x = 2;

  }
}

Rkis.SBV.setup();
