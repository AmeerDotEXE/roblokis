"use static";

var globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this;
const IS_CHROME_API = typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype;
const BROWSER = IS_CHROME_API ? chrome : globalThis.browser;

document.getElementById("settings-btn").textContent = getLocaleMessage("openSettingsMenu");

document.getElementById("newupdt").textContent = getLocaleMessage("extUpdate");
document.getElementById("newupdt1").textContent = getLocaleMessage("extUpdate1");


// Browser Support
//Chrome - Edge - Firefox - Opera - Safari | Firefox for Android - Safari for IOS
//25     - 79   - 51      - 15    - NO     | 51                  - NO
BROWSER.runtime.onUpdateAvailable?.addListener(({version = ''} = {}) => {
	document.querySelector("#update-text").style.display = "block";
});



//Ameer's custom made API wrappers
//(Copyright) AmeerDotEXE. All rights reserved.
function getLocaleMessage(messageName) {
	let message = "";

	//fixes - Edge returns exception instead of empty string
	try {
		message = BROWSER.i18n.getMessage(messageName);
	} catch {};

	// fixes - firefox 47- not returning empty string when not found
	if (message === "??") message = "";
	
	if (typeof message === 'undefined') message = "";
	
	return message;
}