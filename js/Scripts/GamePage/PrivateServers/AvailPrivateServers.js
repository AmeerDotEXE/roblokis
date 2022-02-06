var Rkis = Rkis || {};

if(Rkis.wholeData != null && Rkis.wholeData.AvailPrivateServers != false) {

  Rkis.Scripts = Rkis.Scripts || {};
  Rkis.Scripts.AvailPrivateServers = Rkis.Scripts.AvailPrivateServers || {};

  Rkis.Scripts.AvailPrivateServers.firstone = function() {

    var servers = document.querySelectorAll("#rbx-private-servers > div.section.tab-server-only > ul > li");

    for (var i = 0; i < servers.length; i++) {
      var jionBtn = servers[i].querySelector('div.rbx-private-server-details > a.rbx-private-server-join');

      if (jionBtn == null || jionBtn.getAttribute("onclick") == null) {
        servers[i].remove();
      }

    }
  }

  document.addEventListener("rkrequested-private", Rkis.Scripts.AvailPrivateServers.firstone);

}