var Rkis = Rkis || {};

if(Rkis.wholeData.ShowPrivateServers != false) {

  document.$watchLoop("#rbx-private-running-games > div.rbx-private-running-games-footer > button", async (loadmoreBTN) => {
    while(document.contains(loadmoreBTN)) {
      if (loadmoreBTN.getAttribute("disabled") == null) {
        loadmoreBTN.click();
      }
      await Rkis.delay(200);
    }
  })

}