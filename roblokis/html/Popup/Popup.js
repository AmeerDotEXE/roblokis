var Rkis = Rkis || {};

document.querySelector(".stngs").textContent = chrome.i18n.getMessage("openSettingsMenu");

document.querySelector(".newupdt").textContent = chrome.i18n.getMessage("extUpdate");
document.querySelector(".newupdt1").textContent = chrome.i18n.getMessage("extUpdate1");

chrome.runtime.onUpdateAvailable.addListener(() => {
	document.querySelector("#update-text").style.display = "block";
});