var Rkis = Rkis || {};

Rkis.AddRunListener(function() {
  if (window.location.pathname.toLowerCase().startsWith("/roblokis") == false) return;

  document.$watch("#container-main > div.content", async (mainplace) => {
    mainplace.innerHTML = "";

    var scrpt1 = document.createElement("style");
    scrpt1.innerHTML = await Rkis.GetTextFromLocalFile("html/SettingsPage/SettingsPage.css");
    
    mainplace.innerHTML = await Rkis.GetTextFromLocalFile("html/SettingsPage/SettingsPage.html");

    mainplace.append(scrpt1);

    var scrpt0 = document.createElement("script");
    scrpt0.src = Rkis.fileLocation + "html/SettingsPage/SettingsPage.js";
    mainplace.append(scrpt0);

    document.firstElementChild.innerHTML = `<title>Roblokis Settings Page</title>` + document.firstElementChild.innerHTML;

    //eval(xmlhttp2.responseText);
    
  });
  
});