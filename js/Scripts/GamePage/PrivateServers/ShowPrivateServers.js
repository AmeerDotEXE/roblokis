var Rkis = Rkis || {};
Rkis.Scripts = Rkis.Scripts || {};
Rkis.Scripts.ShowPrivateServers = Rkis.Scripts.ShowPrivateServers || {};

Rkis.Scripts.ShowPrivateServers.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.Scripts.ShowPrivateServers.firstone);
  }
}

Rkis.Scripts.ShowPrivateServers.firstone = function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.includes("roblox.com/private-server/instance-list-json") == false) return;

  var loadmoreBTN = document.querySelector("#rbx-private-servers > div.section.tab-server-only > div.rbx-private-servers-footer > button");
  if (loadmoreBTN) {
    if (loadmoreBTN.getAttribute("class").includes("hidden") == false) {
      loadmoreBTN.click();
    }
    else return;
  }
}

Rkis.AddRunListener(Rkis.Scripts.ShowPrivateServers.setup);