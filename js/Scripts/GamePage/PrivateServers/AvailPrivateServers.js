var Rkis = Rkis || {};
Rkis.Scripts = Rkis.Scripts || {};
Rkis.Scripts.AvailPrivateServers = Rkis.Scripts.AvailPrivateServers || {};

Rkis.Scripts.AvailPrivateServers.setup = function() {
  if(Rkis.wholeData != null && Rkis.wholeData.AvailPrivateServers == false) return;
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.Scripts.AvailPrivateServers.firstone);
  }
}

Rkis.Scripts.AvailPrivateServers.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/private-server/instance-list-json") == false) return;

  var servers = document.querySelectorAll("#rbx-private-servers > div.section.tab-server-only > ul > li");

  for (var i = 0; i < servers.length; i++) {
    var jionBtn = servers[i].querySelector('div.rbx-private-server-details > a.rbx-private-server-join');

    if (jionBtn == null || jionBtn.getAttribute("onclick") == null) {
      servers[i].remove();
    }

  }
}

Rkis.Scripts.AvailPrivateServers.setup();