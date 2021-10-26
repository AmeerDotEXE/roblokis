var Rkis = Rkis || {};
Rkis.SUAPS = Rkis.SUAPS || {};

Rkis.SUAPS.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SUAPS.firstone);
  }
}

Rkis.SUAPS.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/private-server/instance-list-json") == false) return;

  var servers = document.querySelectorAll("#rbx-private-servers > div.section.tab-server-only > ul > li");

  for (var i = 0; i < servers.length; i++) {
    var jionBtn = servers[i].querySelector('div.rbx-private-server-details > a.rbx-private-server-join');

    if (jionBtn == null || jionBtn.onclick == null) {
      servers[i].remove();
    }

  }
}

Rkis.SUAPS.setup();