var Rkis = Rkis || {};

if(Rkis.wholeData.PageNav != false) {

  Rkis.Scripts = Rkis.Scripts || {};
  Rkis.Scripts.PageNav = Rkis.Scripts.PageNav || {};

  Rkis.Scripts.PageNav.running = false;

  Rkis.Scripts.PageNav.firstone = async function(firsttime) {

    function getserverscount() {
      return new Promise(resolve => {
        chrome.runtime.sendMessage({about: "getPublicServerCountCache", GameId: Rkis.GameId}, 
          function(data) {
              resolve(data)
          })
      })
    }

    var buttonplace = await document.$watch("#rbx-running-games > div.rbx-running-games-footer").$promise();
    if(buttonplace == null) return;
    buttonplace.remove();
    
    document.$find("#rbx-running-games").innerHTML += `<div class="rbx-running-games-footer"><button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more">Load More</button></div>`;
    buttonplace = document.$find("#rbx-running-games > div.rbx-running-games-footer");

    var pagecount = (await getserverscount() || 0);
    pagecount = Math.floor(pagecount / 10) + 1;

    buttonplace.innerHTML += `
    <div id="rkpagenav" style="margin: 12px 20% 0;display: flex;height: 40px;" data-page="1" data-max="${pagecount}">
      <button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">|&lt;</button>
      <button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&lt;</button>
      <span class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;width: 200%;display: flex;align-self: center;align-items: center;">
        <input type="textfield" style="border: none;width: 42%;text-align: right;" class="btn-control-sm rbx-running-games-load-more" id="rkpagenavnum" value="1" placeholder="Page">
        <span>Of ${pagecount}</span></span>
      <button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&gt;</button>
      <button type="button" class="btn-control-sm btn-full-width rbx-running-games-load-more" style="margin: 0 4px;">&gt;|</button>
    </div>`;

    document.$watch("#rbx-running-games > div.rbx-running-games-footer > button", (mainbtn) => {
      mainbtn.addEventListener("click", () => {Rkis.Scripts.PageNav.next(true);})
    })

    $r("#rkpagenav > button:nth-child(1)").addEventListener("click", () => { Rkis.Scripts.PageNav.getpage(1) })
    $r("#rkpagenav > button:nth-child(2)").addEventListener("click", () => { Rkis.Scripts.PageNav.back() })

    $r("#rkpagenavnum").addEventListener("change", () => { Rkis.Scripts.PageNav.getpage($r("#rkpagenavnum").value) })

    $r("#rkpagenav > button:nth-child(4)").addEventListener("click", () => { Rkis.Scripts.PageNav.next() })
    $r("#rkpagenav > button:nth-child(5)").addEventListener("click", () => { Rkis.Scripts.PageNav.last() })

    if(firsttime) Rkis.Scripts.PageNav.getpage(1);
  }



  Rkis.Scripts.PageNav.getpage = async function(pagenum, more) {
    if(isNaN(Number(pagenum))) return;
    if(Number(pagenum) <= 0) pagenum = "1";

    if(Rkis.Scripts.PageNav.running == true) return;
    Rkis.Scripts.PageNav.running = true;

    var pagenav = document.$find("#rkpagenav");
    if(pagenav) pagenav.dataset.page = pagenum;

    var pagenavnum = document.$find("#rkpagenavnum");
    if(pagenavnum) pagenavnum.value = pagenum;

    function getservers(num) {
      return new Promise(resolve => {
        chrome.runtime.sendMessage({about: "getPublicServerPageCache", GameId: Rkis.GameId, PageNum: num}, 
          function(data) {
              resolve(data)
          })
      })
    }

    var result = (await getservers(pagenum) || {servers: []});
    if(result == null || result.servers.length <= 0) return;

    if(pagenav) pagenav.dataset.max = Math.floor(result.pages / 10) + 1;
    if(pagenav) pagenav.$find("span > span").innerText = `Of ${pagenav.dataset.max}`;

    Rkis.Scripts.PageNav.setpage(result.servers, more);
  }

  Rkis.Scripts.PageNav.next = function(more) {
    var pagenav = document.$find("#rkpagenav");
    if(pagenav == null || pagenav.dataset.page == null) return;

    var num = Number(pagenav.dataset.page) + 1;
    if(num < 1) num = 1;
    if(num > pagenav.dataset.max) return;

    Rkis.Scripts.PageNav.getpage(num, more);
  }

  Rkis.Scripts.PageNav.back = function() {
    var pagenav = document.$find("#rkpagenav");
    if(pagenav == null || pagenav.dataset.page == null) return;

    var num = Number(pagenav.dataset.page) - 1;
    if(num < 1) num = 1;
    if(num > pagenav.dataset.max) num = pagenav.dataset.max;

    Rkis.Scripts.PageNav.getpage(num);
  }

  Rkis.Scripts.PageNav.last = function() {
    var pagenav = document.$find("#rkpagenav");
    if(pagenav == null || pagenav.dataset.page == null) return;

    var num = Number(pagenav.dataset.max);

    Rkis.Scripts.PageNav.getpage(num);
  }



  Rkis.Scripts.PageNav.setpage = function(servers, more) {
    var holder = document.$find("#rbx-game-server-item-container");
    if(holder == null || servers == null || servers.length <= 0) return;

    if(more != true) holder.innerHTML = "";

    for (var i = 0; i < servers.length; i++) {
      var server = servers[i];
      if(server == null) continue;

      var fullcode = "";

      fullcode += `
      <li class="stack-row rbx-game-server-item" data-gameid="${server.Guid}">
        <div class="section-header"><div class="link-menu rbx-game-server-menu"></div></div>
        <div class="section-left rbx-game-server-details">
          <div class="text-info rbx-game-status rbx-game-server-status">${server.PlayersCapacity}</div>
          <div class="rbx-game-server-alert${server.ShowSlowGameMessage == true ? "" : " hidden"}"><span class="icon-remove"></span>Slow Server</div>
          <a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="${server.PlaceId}" onclick="${server.JoinScript.split("\"").join("&quot;")}">Join</a>
        </div>
        <div class="section-right rbx-game-server-players">`;

      for (var o = 0; o < server.CurrentPlayers.length; o++) {
        fullcode += `
        <span class="avatar avatar-headshot-sm player-avatar">
          <a class="avatar-card-link">
            <img class="avatar-card-image" src="${server.CurrentPlayers[o].Thumbnail.Url}">
          </a>
        </span>`;
      }

      fullcode += `</div></li>`;
      holder.innerHTML += fullcode;
    }

    Rkis.Scripts.PageNav.running = false;
    if(Rkis.Scripts.PublicServersView != null) Rkis.Scripts.PublicServersView.firstone(null);
    if(Rkis.Scripts.PublicServersLink != null) Rkis.Scripts.PublicServersLink.firstone(null);

  }

  Rkis.Scripts.PageNav.firstone(true);
  document.$watch("#tab-game-instances", (e) => { e.addEventListener("click", () => { Rkis.Scripts.PageNav.setpage(1) }) })
  document.addEventListener("rk-publicrefresh", () => { Rkis.Scripts.PageNav.firstone(true) });

}