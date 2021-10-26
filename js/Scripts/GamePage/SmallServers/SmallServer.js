var Rkis = Rkis || {};
Rkis.SSS = Rkis.SSS || {};

Rkis.SSS.running = false;

Rkis.SSS.setup = function () {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SSS.firstone);
  }
}

Rkis.SSS.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getfriendsgameinstances") == false) return;

  if (Rkis.SSS.running == false) {
    Rkis.SSS.running = true;

    var smallrunninggames = document.querySelector("#rbx-small-running-games");
    if (smallrunninggames) smallrunninggames.innerHTML = `<div class="container-header"><h3>Some Small Servers</h3></div><ul id="rbx-small-game-server-item-container" class="section stack-list" style="display: flex;flex-wrap: wrap;"><span class="spinner spinner-default"></span></ul>`;
    else {
      smallrunninggames = document.createElement("div");
      smallrunninggames.id = "rbx-small-running-games";
      smallrunninggames.setAttribute("class", "stack");
      smallrunninggames.innerHTML = `<div class="container-header"><h3>Some Small Servers</h3></div><ul id="rbx-small-game-server-item-container" class="section stack-list" style="display: flex;flex-wrap: wrap;"><span class="spinner spinner-default"></span></ul>`;
      document.querySelector("#game-instances").insertBefore(smallrunninggames, document.querySelector("#rbx-running-games"));
    }

    var placeId = Roblox.GamePassJSData.PlaceID;
    Rkis.SSS.b(placeId);
  }
}

Rkis.SSS.b = function(placeId) {
  fetch(`https://${Rkis.SubDomain}.roblox.com/games/getgameinstancesjson?placeId=${placeId}&startIndex=0`)
    .then((Aresponse) => Aresponse.json())
    .then((Adata) => {
      var max = Adata.TotalCollectionSize;
      Rkis.SSS.c(placeId, 0, max);
    });
}

Rkis.SSS.c = function(GameID, min, max) {
  var Index = Math.round((max + min) / 2);
  console.log(max,min,index)
  fetch('https://' + Rkis.SubDomain + '.roblox.com/games/getgameinstancesjson?placeId=' + GameID + '&startindex=' + Index)
  .then((resp) => resp.json())
  .then(function(data) {
    if (data.TotalCollectionSize <= 0) {
      return;
    }
    if (data['Collection'].length < 10 && data['Collection'].length > 0) {
      var server = data['Collection'][data['Collection'].length - 1];
      for (var i = data['Collection'].length - 1; i >= 0 && server.CurrentPlayers.length <= 0; i--) {
        server = data['Collection'][i];
      }
      if (server.CurrentPlayers.length <= 0) {
        max = Index;
        Rkis.SSS.c(GameID, min, max);
      }
      else {
        Rkis.SSS.d(data['Collection'], GameID, Index);
      }
    } else if (data['Collection'].length == 0) {
      max = Index;
      Rkis.SSS.c(GameID, min, max);
    } else {
      min = Index;
      Rkis.SSS.c(GameID, min, max);
    }
  })
}

Rkis.SSS.d = async function(servers) {

  servers = servers.reverse();

  var gameinstances = document.querySelector("#game-instances");
  if(!gameinstances) return;

  var smallrunninggames = document.querySelector("#rbx-small-running-games");
  if (smallrunninggames) smallrunninggames.innerHTML = ``;
  else {
    smallrunninggames = document.createElement("div");
    smallrunninggames.id = "rbx-small-running-games";
    smallrunninggames.setAttribute("class", "stack");
    document.querySelector("#game-instances").insertBefore(smallrunninggames, document.querySelector("#rbx-running-games"));
  }

  var smalltitle = document.createElement("div");
  smalltitle.innerHTML = "<h3>Some Small Servers</h3>";
  smalltitle.setAttribute("class", "container-header");
  smallrunninggames.append(smalltitle);

  var smallservers = document.createElement("ul");
  smallservers.id = "rbx-small-game-server-item-container";
  smallservers.setAttribute("class", "section stack-list");
  smallservers.setAttribute("style", "display: flex;flex-wrap: wrap;");
  smallrunninggames.append(smallservers);

  for (var i = 0; i < servers.length; i++) {
    if(servers[i].CurrentPlayers.length <= 0) continue;

    var smallserver = document.createElement("li");
    smallserver.setAttribute("class", "stack-row rbx-game-server-item");
    smallserver.setAttribute("style", "width: 188px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;border-radius: 20px;margin: 0 6px 6px 0px;");

    var smallserverdetails = document.createElement("div");
    smallserverdetails.setAttribute("class", "rbx-game-server-details");
    smallserverdetails.innerHTML = "";
    if(servers[i].ShowSlowGameMessage) smallserverdetails.innerHTM += '<div class="rbx-game-server-alert"><span class="icon-remove"></span>Slow Server</div>';
    if(Rkis.wholeData.SSSL) smallserverdetails.innerHTML += `<a class="btn-control-xs" style="width: 18%;margin: 0 2% 0 0;" onclick="Rkis.CopyTextToClip('https://${Rkis.SubDomain}.roblox.com/home?placeid=${servers[i].PlaceId}&amp;gameid=${servers[i].Guid}')">🔗</a><a class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${servers[i].PlaceId}, '${servers[i].Guid}', null);return false;" style="width: 80%;margin: 0 0 0 0;">Join</a>`;
    else smallserverdetails.innerHTML += `<a class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${servers[i].PlaceId}, '${servers[i].Guid}');" style="margin: 0 0 0 0;">Join</a>`;
    smallserver.append(smallserverdetails);

    var smallserverplayers = document.createElement("div");
    smallserverplayers.setAttribute("class", "rbx-game-server-players");

    var smallservercount = document.createElement("span");
    smallservercount.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");
    smallservercount.setAttribute("style", "margin: 0px -8px 6px 0px;top: 8px;width: 34px;height: 34px;display: inline-grid;align-content: center;font-weight: bold;font-size: unset;text-align: center;background-color: lightgray;color: black;");
    smallservercount.innerHTML = servers[i].CurrentPlayers.length;
    smallserverplayers.append(smallservercount);

    for (var o = 0; o < servers[i].CurrentPlayers.length; o++) {
      var smallserverplayer = document.createElement("span");
      smallserverplayer.setAttribute("class", "avatar avatar-headshot-sm player-avatar");
      smallserverplayer.setAttribute("style", "margin: 0px -10px 6px 0px;top: 8px;width: 34px;height: 34px;");
      smallserverplayer.innerHTML = `<a class="avatar-card-link"><img class="avatar-card-image" src="${servers[i].CurrentPlayers[o].Thumbnail.Url}"></a>`;
      smallserverplayers.append(smallserverplayer);
    }

    smallserver.append(smallserverplayers);
    smallservers.append(smallserver);
  }

  Rkis.SSS.running = false;
}

Rkis.SSS.setup();