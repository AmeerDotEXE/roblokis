var Rkis = Rkis || {};

(async function() {
  if (window.location.pathname.toLowerCase().startsWith("/roblokis")) {
    var mainplace = await document.waitSelector("#container-main > div.content");
    if(mainplace) mainplace.children.forEach((e) => {e.remove();});

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", Rkis.fileLocation + "html/SettingsPage/SettingsPage.html", false);
    xmlhttp.send();

    var xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.open("GET", Rkis.fileLocation + "html/SettingsPage/SettingsPage.js", false);
    xmlhttp2.send();

    mainplace.innerHTML = xmlhttp.responseText;

    var scrpt0 = document.createElement("script")
    scrpt0.innerHTML = xmlhttp2.responseText;
    mainplace.append(scrpt0);

    //eval(xmlhttp2.responseText);
  }
}())