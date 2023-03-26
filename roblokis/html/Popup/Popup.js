var Rkis = Rkis || {};

document.querySelector(".stngs").innerText = chrome.i18n.getMessage("openSettingsMenu");

document.querySelector(".newupdt").innerText = chrome.i18n.getMessage("extUpdate");
document.querySelector(".newupdt1").innerText = chrome.i18n.getMessage("extUpdate1");

chrome.runtime.onUpdateAvailable.addListener(() => {
	document.querySelector("#update-text").style.display = "block";
});