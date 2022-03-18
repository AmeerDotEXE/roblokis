var page = page || {};

(function() {
  var smallserver = document.querySelector("#rkpage > div.serversselector > select");
  smallserver.value = "";

  smallserver.addEventListener("change", async () => {
    try {
      await $("#pageloadplace").load(Rkis.fileLocation + `html/SettingsPage/Pages/GamePage/Servers/${smallserver.value}.html`);
      await $.getScript(Rkis.fileLocation + `html/SettingsPage/Pages/GamePage/Servers/${smallserver.value}.js`);
    }catch{}
    page.setup();
  });

}())