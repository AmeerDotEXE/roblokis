var Rkis = Rkis || {};
Rkis.SPN = Rkis.SPN || {};

Rkis.SPN.running = false;

Rkis.SPN.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    Rkis.SPN.firstone();
  }
}

Rkis.SPN.firstone = async function() {
  await document.waitSelectorAll("#rbx-game-server-item-container > li");

  var buttonplace = await document.waitSelector("#rbx-running-games > div.rbx-running-games-footer");
  if(buttonplace == null) return;

  buttonplace.remove();
  document.querySelector("#rbx-running-games").innerHTML += `<div class="rbx-running-games-footer"><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more">Load More</button></div>`;
  buttonplace = document.querySelector("#rbx-running-games > div.rbx-running-games-footer");

  var PlaceID = Number(window.location.href.substring(window.location.href.indexOf("/games/") + 7).split("/")[0]);

  var result = await Rkis.fetch("GET", `https://${Rkis.SubDomain}.roblox.com/games/getgameinstancesjson?placeId=${PlaceID}&startIndex=1`, true);
  if(result == null) return;

  buttonplace.innerHTML += `<div id="rkpagenav" style="margin: 12px 20% 0;display: flex;height: 40px;" data-page="1" data-max="${Math.round(result.TotalCollectionSize / 10)}"><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.SPN.getpage(1)">|&lt;</button><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.SPN.back()">&lt;</button><span class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;"><input type="textfield" style="border: none;width: 42%;text-align: right;" class="btn-control-sm rbx-running-games-load-more" id="rkpagenavnum" value="1" placeholder="Page" onchange="Rkis.SPN.getpage(this.value)">Of ${Math.round(result.TotalCollectionSize / 10)}</span><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.SPN.next()">&gt;</button><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;" onclick="Rkis.SPN.last()">&gt;|</button></div>`;

  var mainbtn = await document.waitSelector("#rbx-running-games > div.rbx-running-games-footer > button");
  if(mainbtn) mainbtn.addEventListener("click", () => {Rkis.SPN.next(true);});
}



Rkis.SPN.getpage = async function(pagenum, more) {
  if(isNaN(Number(pagenum))) return;

  if(Rkis.SPN.running == true) return;
  Rkis.SPN.running = true;

  var pagenav = document.querySelector("#rkpagenav");
  if(pagenav) pagenav.dataset.page = pagenum;

  var pagenavnum = document.querySelector("#rkpagenavnum");
  if(pagenavnum) pagenavnum.value = pagenum;

  var result = await fetch(`https://${Rkis.SubDomain}.roblox.com/games/getgameinstancesjson?placeId=${Roblox.GamePassJSData.PlaceID}&startIndex=${((pagenum - 1) * 10) + 1}`)
  .then((response) => response.json())
  .catch(() => {return null});
  if(result == null) return;

  if(pagenav) pagenav.dataset.max = Math.round(result.TotalCollectionSize / 10);

  Rkis.SPN.setpage(result, more);
}

Rkis.SPN.next = function(more) {
  var pagenav = document.querySelector("#rkpagenav");
  if(pagenav == null || pagenav.dataset.page == null) return;

  var num = Number(pagenav.dataset.page) + 1;
  if(num < 1) num = 1;
  if(num > pagenav.dataset.max) num = pagenav.dataset.max;

  Rkis.SPN.getpage(num, more);
}

Rkis.SPN.back = function() {
  var pagenav = document.querySelector("#rkpagenav");
  if(pagenav == null || pagenav.dataset.page == null) return;

  var num = Number(pagenav.dataset.page) - 1;
  if(num < 1) num = 1;
  if(num > pagenav.dataset.max) num = pagenav.dataset.max;

  Rkis.SPN.getpage(num);
}

Rkis.SPN.last = function() {
  var pagenav = document.querySelector("#rkpagenav");
  if(pagenav == null || pagenav.dataset.page == null) return;

  var num = Number(pagenav.dataset.max);

  Rkis.SPN.getpage(num);
}



Rkis.SPN.setpage = function(data, more) {
  var holder = document.querySelector("#rbx-game-server-item-container");
  if(holder == null || data == null) return;

  if(more != true) holder.innerHTML = "";

  for (var i = 0; i < data.Collection.length; i++) {
    var server = data.Collection[i];

    var slowserver = " hidden";
    if(server.ShowSlowGameMessage == true) slowserver = "";

    var fullcode = "";

    fullcode += `<li class="stack-row rbx-game-server-item" data-gameid="${server.Guid}"><div class="section-header"><div class="link-menu rbx-game-server-menu"></div></div><div class="section-left rbx-game-server-details"><div class="text-info rbx-game-status rbx-game-server-status">${server.PlayersCapacity}</div><div class="rbx-game-server-alert${slowserver}"><span class="icon-remove"></span>Slow Server</div><a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="${server.PlaceId}" onclick="${server.JoinScript.split("\"").join("&quot;")}">Join</a></div><div class="section-right rbx-game-server-players">`;

    for (var o = 0; o < server.CurrentPlayers.length; o++) {
      fullcode += `<span class="avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image" src="${server.CurrentPlayers[o].Thumbnail.Url}"></a></span>`;
    }

    fullcode += `</div></li>`;
    holder.innerHTML += fullcode;
  }

  Rkis.SPN.running = false;
  if(Rkis.SSV != null) Rkis.SSV.firstone(null);
  if(Rkis.SSL != null) Rkis.SSL.firstone(null);

}

Rkis.SPN.setup();