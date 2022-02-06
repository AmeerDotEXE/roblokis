var Rkis = Rkis || {};

if(Rkis.wholeData.SmallServer != false) {

  Rkis.Scripts = Rkis.Scripts || {};
  Rkis.Scripts.SmallServer = Rkis.Scripts.SmallServer || {};

  Rkis.Scripts.SmallServer.firstone = function() {

    var smallrunninggames = document.querySelector("#rbx-small-running-games");
    if (smallrunninggames) {
      smallrunninggames.innerHTML = `<div class="container-header"><h3>Some Small Servers</h3></div><ul id="rbx-small-game-server-item-container" class="section stack-list"><span class="spinner spinner-default"></span></ul>`;

      chrome.runtime.sendMessage({about: "getSmallServerCache", GameId: Rkis.GameId}, (svrs) => {
        Rkis.Scripts.SmallServer.showservers(svrs);
      });
    }
    else {
      smallrunninggames = document.createElement("div");
      smallrunninggames.id = "rbx-small-running-games";
      smallrunninggames.setAttribute("class", "stack");
      smallrunninggames.innerHTML = `<div class="container-header"><h3>Some Small Servers</h3></div><ul id="rbx-small-game-server-item-container" class="section stack-list"><span class="spinner spinner-default"></span></ul>`;
      document.$watch("#game-instances", (e) => {
        e.insertBefore(smallrunninggames, document.querySelector("#rbx-running-games"));

        chrome.runtime.sendMessage({about: "getSmallServerCache", GameId: Rkis.GameId}, (svrs) => {
          Rkis.Scripts.SmallServer.showservers(svrs);
        });
      })
    }
  }

  Rkis.Scripts.SmallServer.showservers = async function(servers = []) {

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
      if(servers[i] == null || servers[i].CurrentPlayers.length <= 0) continue;

      var smallserver = document.createElement("li");
      smallserver.setAttribute("class", "stack-row rbx-game-server-item");

      var smallserverdetails = document.createElement("div");
      smallserverdetails.setAttribute("class", "section-left rbx-game-server-details");
      smallserverdetails.innerHTML = `<div class="text-info rbx-game-status rbx-game-server-status">${servers[i].PlayersCapacity}</div>`;
      if(servers[i].ShowSlowGameMessage) smallserverdetails.innerHTML += '<div class="rbx-game-server-alert"><span class="icon-remove"></span>Slow Server</div>';
      if(Rkis.wholeData.SmallServerLink != false) smallserverdetails.innerHTML += `<a class="btn-control-xs" style="width: 18%;margin: 0 2% 0 0;" onclick="Rkis.CopyText('https://${Rkis.SubDomain}.roblox.com/home?placeid=${servers[i].PlaceId}&amp;gameid=${servers[i].Guid}')">🔗</a><a class="btn-full-width btn-control-xs rbx-game-server-join" onclick="Roblox.GameLauncher.joinGameInstance(${servers[i].PlaceId}, '${servers[i].Guid}', null);return false;" style="margin: 0;width: 80%;">Join</a>`;
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

  }

  Rkis.Scripts.SmallServer.firstone();
  document.addEventListener("rk-publicrefresh", () => { Rkis.Scripts.SmallServer.firstone() });

}