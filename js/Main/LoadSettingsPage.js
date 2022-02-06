var Rkis = Rkis || {};

Rkis.AllRunListeners = Rkis.AllRunListeners || [];
Rkis.AllRunListeners.push(() =>{
  document.$watch("#container-main > div.content", async (mainplace) => {
    mainplace.innerHTML = "";

    var scrpt1 = document.createElement("style");
    scrpt1.innerHTML = await Rkis.GetTextFromLocalFile("html/SettingsPage/SettingsPage.css");
    
    mainplace.innerHTML = await Rkis.GetTextFromLocalFile("html/SettingsPage/SettingsPage.html");
    mainplace.append(scrpt1);

    var scrpt0 = document.createElement("script");
    scrpt0.src = Rkis.fileLocation + "html/SettingsPage/SettingsPage.js";
    mainplace.append(scrpt0);

    var ttle = document.createElement("title");
    ttle.innerText = Rkis.language["settingsPageTitle"];

    document.firstElementChild.insertBefore(ttle, document.firstElementChild.firstElementChild);

    //eval(xmlhttp2.responseText);
    
  });
});