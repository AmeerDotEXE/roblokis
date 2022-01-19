var Rkis = Rkis || {};
Rkis.Scripts = Rkis.Scripts || {};
Rkis.Scripts.SmallServer = Rkis.Scripts.SmallServer || {};

Rkis.Scripts.SmallServer.running = false;
Rkis.Scripts.SmallServer.serversfound = [];

Rkis.Scripts.SmallServer.setup = function () {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.Scripts.SmallServer.firstone);
  }
}

Rkis.Scripts.SmallServer.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/games/getfriendsgameinstances") == false) return;

  if (Rkis.Scripts.SmallServer.running == false) {
    Rkis.Scripts.SmallServer.running = true;

    var smallrunninggames = document.querySelector("#rbx-small-running-games");
    if (smallrunninggames) smallrunninggames.innerHTML = `<div class="container-header"><h3>Some Small Servers</h3></div><ul id="rbx-small-game-server-item-container" class="section stack-list"><span class="spinner spinner-default"></span></ul>`;
    else {
      smallrunninggames = document.createElement("div");
      smallrunninggames.id = "rbx-small-running-games";
      smallrunninggames.setAttribute("class", "stack");
      smallrunninggames.innerHTML = `<div class="container-header"><h3>Some Small Servers</h3></div><ul id="rbx-small-game-server-item-container" class="section stack-list"><span class="spinner spinner-default"></span></ul>`;
      document.querySelector("#game-instances").insertBefore(smallrunninggames, document.querySelector("#rbx-running-games"));
    }

    var placeId = Rkis.GameId;
    Rkis.Scripts.SmallServer.b(placeId);
  }
}

Rkis.Scripts.SmallServer.b = function(placeId) {
  fetch(`https://${Rkis.SubDomain}.roblox.com/games/getgameinstancesjson?placeId=${placeId}&startIndex=0`)
    .then((Aresponse) => Aresponse.json())
    .then((Adata) => {
      //if empty then quit
      if(Adata.TotalCollectionSize < 0)
        return Rkis.Scripts.SmallServer.running = false;

      Rkis.Scripts.SmallServer.serversfound = [];
      //devide by 10 and remove dot
      var maxpages = Math.floor(Adata.TotalCollectionSize / 10) + 1;

      setTimeout(() => {Rkis.Scripts.SmallServer.c(placeId, maxpages * (3/4), maxpages * (4/4), -1)});
      setTimeout(() => {Rkis.Scripts.SmallServer.c(placeId, maxpages * (2/4), maxpages * (3/4), -1)});
      setTimeout(() => {Rkis.Scripts.SmallServer.c(placeId, maxpages * (1/4), maxpages * (2/4), -1)});
      setTimeout(() => {Rkis.Scripts.SmallServer.c(placeId, maxpages * (0/4), maxpages * (1/4), -1)});

      //setTimeout(() => {Rkis.Scripts.SmallServer.c(placeId, maxpages * (1/2), maxpages * (2/2), -1)});
      //setTimeout(() => {Rkis.Scripts.SmallServer.c(placeId, maxpages * (0/2), maxpages * (1/2), -1)});

      //setTimeout(() => {Rkis.Scripts.SmallServer.c(placeId, 1, maxpages, -1)});
    });
}

Rkis.Scripts.SmallServer.c = function(GameID, minpages, maxpages, lastnumber) {
  if(Rkis.Scripts.SmallServer.running == false) return;

  var Index = Math.floor((maxpages + minpages) / 2);
  if(Index == lastnumber) return Rkis.Scripts.SmallServer.c_back(GameID, Index + 1); //console.log("Reapeating");
  //console.log(minpages,maxpages,Index,lastnumber)
  lastnumber = Index;


  fetch('https://' + Rkis.SubDomain + '.roblox.com/games/getgameinstancesjson?placeId=' + GameID + '&startindex=' + Index * 10)
  .then((resp) => resp.json())
  .then(function(data) {
    if (data.TotalCollectionSize <= 0) return;

    if (data['Collection'].length < 10 && data['Collection'].length > 0) {
      Rkis.Scripts.SmallServer.c_back(GameID, Index + 1);
    } else if (data['Collection'].length == 0) {
      maxpages = Index;
      Rkis.Scripts.SmallServer.c(GameID, minpages, maxpages, Index);
    } else {
      minpages = Index;
      Rkis.Scripts.SmallServer.c(GameID, minpages, maxpages, Index);
    }

    /*if (data['Collection'].length > 0) {
      var skip = false;
      for (var i = data['Collection'].length - 1; i >= 0 && Rkis.Scripts.SmallServer.serversfound.length < 10; i--) {
        var server = data['Collection'][i];
        if(server.CurrentPlayers.length > 2 || server.CurrentPlayers.length < 1) continue;

        skip = true;

        Rkis.Scripts.SmallServer.serversfound.push(server);
      }

      if (Rkis.Scripts.SmallServer.serversfound.length < 10) {
        if(skip) {
          minpages += 2;
          Rkis.Scripts.SmallServer.c(GameID, minpages, maxpages, Index);
          return;
        }

        minpages = Index;
        Rkis.Scripts.SmallServer.c(GameID, minpages, maxpages, Index);
      }
      else {
        Rkis.Scripts.SmallServer.d(GameID, Index);
      }

    } else {
      maxpages = Index;
      Rkis.Scripts.SmallServer.c(GameID, minpages, maxpages, Index);
    }*/
  })
}

//Collect servers from gived page number
Rkis.Scripts.SmallServer.c_back = function(GameID, pagenumber) {
  Rkis.Scripts.SmallServer.running = false;
  pagenumber -= 1;
  //console.log("Reapeating");

  if(Rkis.Scripts.SmallServer.serversfound.length >= 10 || pagenumber <= 0) return Rkis.Scripts.SmallServer.d();

  fetch('https://' + Rkis.SubDomain + '.roblox.com/games/getgameinstancesjson?placeId=' + GameID + '&startindex=' + pagenumber * 10)
  .then((resp) => resp.json())
  .then(function(data) {
    if (data.TotalCollectionSize <= 0) return;

    if (data['Collection'].length > 0) {
      for (var i = data['Collection'].length - 1; i >= 0 && Rkis.Scripts.SmallServer.serversfound.length < 10; i--) {
        var server = data['Collection'][i];
        if(server.CurrentPlayers.length < 1) continue;

        Rkis.Scripts.SmallServer.serversfound.push(server);
      }

      if (Rkis.Scripts.SmallServer.serversfound.length >= 10)
        return Rkis.Scripts.SmallServer.d();

      Rkis.Scripts.SmallServer.c_back(GameID, pagenumber);
    }
    else Rkis.Scripts.SmallServer.c_back(GameID, pagenumber);

  })
}

Rkis.Scripts.SmallServer.d = async function() {

  Rkis.Scripts.SmallServer.running = false;
  var servers = Rkis.Scripts.SmallServer.serversfound;

  if(servers.length <= 0) return;
  //servers = servers.reverse();

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
  smallrunninggames.append(smallservers);

  for (var i = 0; i < servers.length; i++) {
    if(servers[i].CurrentPlayers.length <= 0) continue;

    var smallserver = document.createElement("li");
    smallserver.setAttribute("class", "stack-row rbx-game-server-item");

    var smallserverdetails = document.createElement("div");
    smallserverdetails.setAttribute("class", "section-left rbx-game-server-details");
    smallserverdetails.innerHTML = `<div class="text-info rbx-game-status rbx-game-server-status">${servers[i].PlayersCapacity}</div>`;
    if(servers[i].ShowSlowGameMessage) smallserverdetails.innerHTML += '<div class="rbx-game-server-alert"><span class="icon-remove"></span>Slow Server</div>';
    if(Rkis.wholeData.SmallServerLink != false) smallserverdetails.innerHTML += `<a class="btn-control-xs" style="width: 18%;margin: 0 2% 0 0;" onclick="Rkis.CopyTextToClip('https://${Rkis.SubDomain}.roblox.com/home?placeid=${servers[i].PlaceId}&amp;gameid=${servers[i].Guid}')">🔗</a><a class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${servers[i].PlaceId}, '${servers[i].Guid}', null);return false;" style="margin: 0;width: 80%;">Join</a>`;
    else smallserverdetails.innerHTML += `<a style="margin: 0;" class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${servers[i].PlaceId}, '${servers[i].Guid}');">Join</a>`;
    smallserver.append(smallserverdetails);

    var smallserverplayers = document.createElement("div");
    smallserverplayers.setAttribute("class", "section-right rbx-game-server-players");

    if(Rkis.wholeData.UseThemes != false) {
      var smallservercount = document.createElement("span");
      smallservercount.id = "rk-plr-counter";
      smallservercount.setAttribute("class", "avatar avatar-headshot-sm player-avatar avatar-card-link avatar-card-image");
      smallservercount.innerHTML = servers[i].CurrentPlayers.length;
      smallserverplayers.append(smallservercount);
    }

    for (var o = 0; o < servers[i].CurrentPlayers.length; o++) {
      var smallserverplayer = document.createElement("span");
      smallserverplayer.setAttribute("class", "avatar avatar-headshot-sm player-avatar");
      smallserverplayer.innerHTML = `<a class="avatar-card-link"><img class="avatar-card-image" src="${servers[i].CurrentPlayers[o].Thumbnail.Url}"></a>`;
      smallserverplayers.append(smallserverplayer);
    }

    smallserver.append(smallserverplayers);
    smallservers.append(smallserver);
  }

  Rkis.Scripts.SmallServer.running = false;
}

Rkis.AddRunListener(Rkis.Scripts.SmallServer.setup);