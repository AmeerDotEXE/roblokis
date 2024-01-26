"use strict";

//    Tamplates    //

/* Retreaving Data Tamplate
function name() {
	return new Promise(resolve => {
		BROWSER.runtime.sendMessage(
			{about: ""}, 
			function(data) {
				resolve(data)
			}
		);
	});
}
*/





//    Varables    //
var globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this;
const IS_CHROME_API = typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype;
const BROWSER = IS_CHROME_API ? chrome : globalThis.browser;




//    Listeners    //

BROWSER.runtime.onInstalled.addListener(({ reason, previousVersion } = {}) => {
	if (reason == "chrome_update" || reason == "shared_module_update") return; //console.log('Browser Updated');

	if (reason == "install") {
		console.log('Extension Installed');
		BROWSER.runtime.reload();
		return;
	}
	console.log(reason, `Extension Updated from ${previousVersion} to ${BROWSER.runtime.getManifest().version}`);
});

// BROWSER.runtime.onStartup.addListener(() => {
// 	console.log('Extension Started'); //isn't Fired in Incognito Mode
// });

//Not available on MacOS
BROWSER.runtime.onUpdateAvailable?.addListener(({version = ''} = {}) => {
	console.log('Extension Update Available!', version);
	BROWSER.runtime.reload();
});

BROWSER.runtime.onMessage.addListener((request, sender, sendResponse) => {

	switch (request.about) {

		case "getImageRequest":
			if (request.url == null) {
				sendResponse(null);
				break;
			}
			
			if (request.url.startsWith("linear-gradient")) {
				sendResponse(request.url.split(')')[0]+')');
				break;
			}

			var temp = async function () {
				let savedData = await BROWSER.storage.session.get("urls");
				if (typeof savedData[request.url] == "string") {
					sendResponse(`url(${savedData[request.url]})`);
					return;
				}

				var result = await fetch(request.url).then(response => response.blob())
					.then(blob => new Promise(callback => {
						let reader = new FileReader();
						reader.onload = function () { callback(this.result) };
						reader.readAsDataURL(blob);
					}))
					.catch(async (err) => {
						console.error(err);
						return (request.url);
					});
				
				if (result.startsWith("data:image")) {
					savedData[request.url] = result;
					BROWSER.storage.session.set({ urls: savedData }).catch(() => {});
					return sendResponse(`url(${result})`);
				}
				result = request.url.split(')')[0];
				savedData[request.url] = result;
				BROWSER.storage.session.set({ urls: savedData }).catch(() => {});
				sendResponse(`url(${result})`);
			}
			temp();
			break;

		case "getURLRequest":
			if (request.url == null) {
				sendResponse(null);
				break;
			}

			var temp = async function () {
				var result = await fetch(request.url).then(res => res.json())
					.catch(err => {
						var errorObj = { error: "Bg80", message: err };
						console.log(request.url, errorObj)
						return errorObj;
					})

				sendResponse(result);
			}
			temp();
			break;

		case "postURLRequest":
			if (request.url == null || request.jsonData == null) {
				sendResponse(null);
				break;
			}

			var temp = async function () {
				var result = await fetch(request.url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(request.jsonData)
				}).then(res => res.json())
					.catch(err => {
						var errorObj = { error: "Bg80", message: err };
						console.log(request.url, errorObj)
						return errorObj;
					})

				sendResponse(result);
			}
			temp();
			break;

		case "createContextMenu":
			BROWSER.contextMenus.removeAll(() => {
				sendResponse(BROWSER.contextMenus.create(request.info));
			});
			break;
		case "addContextMenu":
			sendResponse(BROWSER.contextMenus.create(request.info));
			break;
		case "clearContextMenu":
			BROWSER.contextMenus.removeAll(() => {
				sendResponse(true);
			});
			break;
		case "removeContextMenu":
			sendResponse(BROWSER.contextMenus.remove(request.id));
			break;
	}

	return true;
});

BROWSER.contextMenus.onClicked.addListener((data) => {
	if (data.menuItemId != "" && typeof data.menuItemId == "string") {
		BROWSER.tabs.query({
			active: true,
			currentWindow: true
		}, (tabs) => {
			BROWSER.tabs.sendMessage(tabs[0].id, {
				type: "clickedContextmenu",
				data: {
					menuItemId: data.menuItemId
				}
			})
		})
	}
})



//SECTION - Functions

//END SECTION