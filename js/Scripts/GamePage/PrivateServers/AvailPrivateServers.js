var Rkis = Rkis || {};

if(Rkis.wholeData != null && Rkis.wholeData.AvailPrivateServers != false) {

  document.$watchLoop("#rbx-private-running-games > ul > li", (server) => {
    var jionBtn = server.querySelector('div.rbx-private-game-server-details > span > button.rbx-private-game-server-join');

    if (jionBtn == null) {
      server.style = "display: none !important;";
    }

  })

}