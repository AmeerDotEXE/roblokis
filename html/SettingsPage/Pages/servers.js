var page = page || {};

(function() {
  var smallserver = document.querySelector("#rkgaemserverspage > div:nth-child(1) > select");
  smallserver.value = "";

  smallserver.addEventListener("change", () => {
    try {
      $("#pageloadplace").load(Rkis.fileLocation + `html/SettingsPage/Pages/${smallserver.value}.html`);
      $.getScript(Rkis.fileLocation + `html/SettingsPage/Pages/${smallserver.value}.js`);
    }catch{}
  });

}())