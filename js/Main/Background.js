///// Tamplates /////

/* Retreaving Data Tamplate
function name() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({about: ""}, 
      function(data) {
          resolve(data)
      })
  })
}
*/



///// Varables /////

let gamesCache = {}; //saves game data for faster server loading
let reploadingpublicservers = false;
let publicserversloaded = [];



///// Functions /////

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if(request.GameId != null) {
    switch(request.about) {
      case "refreshGameServersCache":
        async function refreshGameServersCache() {
          sendResponse(await refreshPublicServersCache(request.GameId));
        }
        refreshGameServersCache();
        break;
      case "getPublicServerCountCache":
        async function getPublicServerCountCache() {
          if(gamesCache[request.GameId] == null || gamesCache[request.GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(request.GameId);
          var game = gamesCache[request.GameId] || null;

          if(game != null) sendResponse(game.servers.publicServers.length);
        }
        getPublicServerCountCache();
        break;
      case "getPublicServerPageCache":
        async function getPublicServerPageCache() {
          var pagenum = ((request.PageNum || 1) - 1) * (request.ServerNum || 10);
          var servers = [];

          if(gamesCache[request.GameId] == null || gamesCache[request.GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(request.GameId);
          var game = gamesCache[request.GameId] || null;
          if(game == null) return sendResponse(null);

          for(var i = pagenum; i < game.servers.publicServers.length && i < pagenum + (request.ServerNum || 10); i++) {
            servers.push(game.servers.publicServers[i]);
          }

          sendResponse({servers: servers, pages: game.servers.publicServers.length});
        }
        getPublicServerPageCache();
        break;
      case "getSmallServerCache":
        async function getSmallServerCache() {
          var servers = [];

          if(gamesCache[request.GameId] == null || gamesCache[request.GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(request.GameId);
          var game = gamesCache[request.GameId] || null;
          if(game == null) return sendResponse(null);

          for(var i = game.servers.publicServers.length - 1; i >= 0 && i > (game.servers.publicServers.length - 1) - (request.ServerNum || 10); i--) {
            servers.push(game.servers.publicServers[i]);
          }

          sendResponse(servers);
        }
        getSmallServerCache();
        break;
    }
  }

  return true;
});


async function refreshPublicServersCache(GameId) {
  if(GameId == null) return null;
  gamesCache[GameId] = gamesCache[GameId] || {servers: {publicServers: []}};

  if(reploadingpublicservers == true) {
    return new Promise(resolve => {
      publicserversloaded.push(function() { return resolve(gamesCache[GameId].servers.publicServers); });
    });
  }
  reploadingpublicservers = true;

  return new Promise((resolve) => {
    $.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + GameId + "&startIndex=0", async function(data){

      var waitinglist = [];

      function getPageServers(PageIndex, retry) {
        return new Promise(foundpage => {
          $.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + GameId + "&startIndex=" + PageIndex, function(data){
            for (j = 0; j < data.Collection.length; j++) {
              if(data.Collection[j].CurrentPlayers.length > 0 && data.Collection[j].Ping > 0) gamesCache[GameId].servers.publicServers[PageIndex + j] = data.Collection[j];
            }
            foundpage();
          }).fail(function(){
            if(retry <= 0) return foundpage();

            getPageServers(PageIndex, retry - 1);
            console.log(`page ${PageIndex / 10} failed`);
          });
        });
      }

      for(var i = 0; i < data.TotalCollectionSize; i += 10) {
        waitinglist.push(getPageServers(i, 3));
      }

      Promise.all(waitinglist).then(() => {
        var beforeemptyservers = gamesCache[GameId].servers.publicServers.length;
        gamesCache[GameId].servers.publicServers = gamesCache[GameId].servers.publicServers.filter(svr => svr != null);
        console.log("Got "+gamesCache[GameId].servers.publicServers.length+" + "+(beforeemptyservers-gamesCache[GameId].servers.publicServers.length)+" Public Servers for "+GameId);
        reploadingpublicservers = false;
        publicserversloaded.forEach((e) => {e()})
        publicserversloaded = [];

        resolve(gamesCache[GameId].servers.publicServers);
      })
    }).fail(function(){
      reploadingpublicservers = false;
      publicserversloaded.forEach((e) => {e()})
      publicserversloaded = [];

      resolve(null);
    });
  });
}