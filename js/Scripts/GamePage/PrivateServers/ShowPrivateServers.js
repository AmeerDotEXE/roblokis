var Rkis = Rkis || {};

if(Rkis.wholeData.ShowPrivateServers != false) {

  Rkis.Scripts = Rkis.Scripts || {};
  Rkis.Scripts.ShowPrivateServers = Rkis.Scripts.ShowPrivateServers || {};

  Rkis.Scripts.ShowPrivateServers.firstone = function() {

    var loadmoreBTN = document.querySelector("#rbx-private-servers > div.section.tab-server-only > div.rbx-private-servers-footer > button");
    if (loadmoreBTN) {
      if (loadmoreBTN.getAttribute("class").includes("hidden") == false) {
        loadmoreBTN.click();
      }
      else return;
    }
  }

  document.addEventListener("rkrequested-private", Rkis.Scripts.ShowPrivateServers.firstone);

}