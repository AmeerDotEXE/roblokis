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
          sendResponse(await getPublicServersPage(request.GameId, request.PageNum, request.ServerNum));
        }
        getPublicServerPageCache();
        break;
      case "getSmallServerCache":
        async function getSmallServerCache() {
          sendResponse(await getSmallServersPage(request.GameId, request.PageNum, request.ServerNum));
        }
        getSmallServerCache();
        break;
      case "getLowPingServerCache":
        async function getLowPingServerCache() {
          sendResponse(await getLowPingServersPage(request.GameId, request.PageNum, request.ServerNum));
        }
        getLowPingServerCache();
        break;
    }
  }
  else {
    switch(request.about) {
      case "getURLRequest":
        if(request.url != null) {
          $.ajax({
            url: request.url,
            type: "GET",
            success: function(data) {
              sendResponse(data);
            }
          })//thanks stackoverflow xD
        } else {sendResponse(null);}
        break;
      case "postURLRequest":
        if(request.url != null && request.jsonData != null) {
          $.ajax({
            url: request.url,
            type: "POST",
            data: request.jsonData,
            success: function(data) {
              sendResponse(data);
            }
          })//thanks stackoverflow xD
        } else {sendResponse(null);}
        break;
    }
  }

  return true;
});


async function getPublicServersPage(GameId, PageNum = 1, serversInPage = 10) {
  var pagenum = ((PageNum || 1) - 1) * (serversInPage || 10);
  var servers = [];

  if(gamesCache[GameId] == null || gamesCache[GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(GameId);
  var game = gamesCache[GameId] || null;
  if(game == null) return sendResponse(null);

  var all_servers = [...game.servers.publicServers];

  for(var i = pagenum; i < all_servers.length && i < pagenum + (serversInPage || 10); i++) {
    servers.push(all_servers[i]);
  }

  return {servers: servers, pages: game.servers.publicServers.length, currentPage: PageNum, serversPerPage: serversInPage};
}

async function getSmallServersPage(GameId, PageNum = 1, serversInPage = 10) {
  var pagenum = ((PageNum || 1) - 1) * (serversInPage || 10);
  var servers = [];

  if(gamesCache[GameId] == null || gamesCache[GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(GameId);
  var game = gamesCache[GameId] || null;
  if(game == null) return sendResponse(null);

  var all_servers = [...game.servers.publicServers];
  all_servers = all_servers.reverse();

  for(var i = pagenum; i < all_servers.length && i < pagenum + (serversInPage || 10); i++) {
    servers.push(all_servers[i]);
  }

  //for(var i = (all_servers.length - 1) - pagenum; i >= 0 && i > ((all_servers.length - 1) - pagenum) - (serversInPage || 10); i--) {
  //  servers.push(all_servers[i]);
  //}

  return {servers: servers, pages: game.servers.publicServers.length, currentPage: PageNum, serversPerPage: serversInPage};
}

async function getLowPingServersPage(GameId, PageNum = 1, serversInPage = 10) {
  var pagenum = ((PageNum || 1) - 1) * (serversInPage || 10);
  var servers = [];

  if(gamesCache[GameId] == null || gamesCache[GameId].servers.publicServers.length <= 0 || reploadingpublicservers == true) await refreshPublicServersCache(GameId);
  var game = gamesCache[GameId] || null;
  if(game == null) return sendResponse(null);

  var all_servers = [...game.servers.publicServers];
  all_servers = all_servers.sort(function(a, b){return a.Ping-b.Ping});

  for(var i = pagenum; i < all_servers.length && i < pagenum + (serversInPage || 10); i++) {
    servers.push(all_servers[i]);
  }

  return {servers: servers, pages: game.servers.publicServers.length, currentPage: PageNum, serversPerPage: serversInPage};
}


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
            return foundpage();
          }).fail(function(){
            if(retry <= 0) return foundpage();

            console.log(`page ${PageIndex / 10} failed`);
            getPageServers(PageIndex, retry - 1)
            .then(() => {foundpage()})
            .catch(() => {foundpage()})
          });
        });
      }

      for(var i = 0; i < data.TotalCollectionSize; i += 10) {
        waitinglist.push(getPageServers(i, 3));
      }

      Promise.all(waitinglist).then(() => {
        var beforeemptyservers = gamesCache[GameId].servers.publicServers.length;
        gamesCache[GameId].servers.publicServers = gamesCache[GameId].servers.publicServers.filter((svr, svri, svrs) => svr != null && svri == svrs.findIndex((t) => (t != null && t.Guid == svr.Guid)));
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