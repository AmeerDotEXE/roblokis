var Rkis = window.Rkis || {};

(function() {
  var mainholder = document.createElement("div");
  mainholder.id = 'roblokis-script-holder';
  document.firstElementChild.append(mainholder);

  Rkis.id = chrome.runtime.id;
  Rkis.fileLocation = `chrome-extension://${Rkis.id}/`;

  var scrpt0 = document.createElement("script")
  scrpt0.innerHTML = `var Rkis = window.Rkis || {};

Rkis.id = "${Rkis.id}";
Rkis.fileLocation = "chrome-extension://${Rkis.id}/";`;
  document.querySelector("#roblokis-script-holder").append(scrpt0);

  var scrpt = document.createElement("script")
  scrpt.src = Rkis.fileLocation + "js/Main/Loader.js";
  document.querySelector("#roblokis-script-holder").append(scrpt);
}())