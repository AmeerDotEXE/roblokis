var Rkis = Rkis || {};
Rkis.SSPS = Rkis.SSPS || {};

Rkis.SSPS.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/games/")) {
    document.addEventListener("rkrequested", Rkis.SSPS.firstone);
  }
}

Rkis.SSPS.firstone = function(darequest) {

  if (darequest.detail && darequest.detail.responseURL.includes("roblox.com/private-server/instance-list-json") == false) return;

  var loadmoreBTN = document.querySelector("#rbx-private-servers > div.section.tab-server-only > div.rbx-private-servers-footer > button");
  if (loadmoreBTN) {
    if (loadmoreBTN.getAttribute("class").includes("hidden") == false) {
      loadmoreBTN.click();
    }
    else return;
  }
}

Rkis.SSPS.setup();