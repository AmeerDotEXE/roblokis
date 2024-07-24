"use strict";
var Rkis = Rkis || {};
var Designer = Designer || {};

Designer.Selected = {};
Designer.MaxCustomThemes = 5; //browser can store max of 5mb of data
//so don't higher it too much, it might corrupt your Roblokis data

//in designer tab, adding menu can add elements
//in element tab, both elements (limited) and edits available.
const nullComponent = {
	id: "null",
	//tags: ["page"],
	details: {
		name: "Unknown",
		//description: "",
	},
	parent: {
		all: false, //optional
		//headId: 'experimental',
		ids: { //optional
			test: true
		},
		tags: { //optional
			experimental: true
		}
	},
	element: {
		html: ``,
		//[properties on html]: [property value],
		//js: function(element) {}, //Runs after element is set
	},
};
const defaultcomponentElements = {
	horizantalGroup: {
		html: /*html*/`
		<div class="section-content" style="cursor: pointer;">
			<!--span class="text-lead" data-component-get="name">Unnamed Component</span>
			<button class="rk-btn" data-remove-component style="float: right;margin-top: -.5ch;">-</button-->
			<div class="rk-flex rk-space-between rk-center-x">
				<button class="rk-btn"><span class="text-lead" data-component-get="name">Unnamed Component</span></button>
				<button class="rk-btn" data-remove-component>-</button>
			</div>
			<div class="rbx-divider" style="margin: 12px;"></div>
			<span class="text-description" data-component-get="description"></span>
			<div style="color: red;" class="text-description" data-component-get="note"></div>
		</div>
		<div class="rk-popup-holder" style="z-index:999;">
			<div class="rk-popup" style="width: min(100%, 55rem);min-height: 25%;max-height: 100%;padding: 0;overflow: hidden;"><!--data-designer-func="add-edits"-->
				<div data-component-holder style="width: 100%;height: 100%;overflow: auto;padding: 1rem;"> 
					<span data-component-path style="width: 100%;"></span>
					<button class="section-content rk-btn" style="width: 100%;" data-designer-func="add-edits-btn" data-translate="editorComponentAdding">Add Component</button>
				</div>
			</div>
		</div>`,
		js: function(data, parentElement) {
			let element = data.element;
			let component = data.component;

			//setup remove component btn
			element.querySelector(`[data-remove-component]`)
			.addEventListener("click", () => {
				//console.log("Not Implemented");
				parentElement.removeComponent(data.component);
			});

			//setup component info
			let hasDetails = false;
			element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
				let infoType = infoElement.dataset.componentGet;
				let hasLanguageTag = component.details.translate != null;

				let detail = component.details;
				let translate = component.details.translate;

				if (infoType == 'name') {
					infoElement.textContent = detail.name;
					if (hasLanguageTag)
						infoElement.dataset.translate = translate.name;
				} else if (infoType == 'description' && detail.description) {
					hasDetails = true;
					infoElement.textContent = detail.description;
					if (hasLanguageTag)
						infoElement.dataset.translate = translate.description;
				} else if (infoType == 'note' && detail.note) {
					hasDetails = true;
					infoElement.textContent = detail.note;
					if (hasLanguageTag)
						infoElement.dataset.translate = translate.note;
				}
			});

			if (hasDetails == false) {
				element.querySelector(".rbx-divider").style.display = "none";
			}

			let componentPath = element.querySelector(`[data-component-path]`);
			if (componentPath != null && element.path != null && element.path.join != null) {
				componentPath.textContent = element.path.join(" > ");
				componentPath.style.marginBottom = "0.5rem";
			}

			//setup component manager
			let componentHolder = element.querySelector(`[data-component-holder]`);
			
			componentHolder.dataset.componentId = component.id;
			componentHolder.dataset.headId = element.dataset.headId;
			componentHolder.componentTags = component.tags || [];
			componentHolder.path = element.path || [component.details?.name || component.id];

			Designer.ThemeEditor.setupComponentsManager(componentHolder);
			if (typeof element.load != 'function') element.load = componentHolder.load;
			if (typeof element.save != 'function') element.save = componentHolder.save;
			
			//setup popup
			let popup = element.querySelector(`.rk-popup-holder`);
			
			element.addEventListener("click", (e) => {
				if (e.target == popup) return;
				if (e.target.closest(`.rk-popup-holder`) == popup) return;

				//setup/load edits
				popup.style.display = "flex";
			});

			popup.addEventListener("click", function (e) {
				if (e.target != popup) return;

				//apply edits
				popup.style.display = "none";

				element.update?.();
			});
		}
	},
	styleDropdown: {
		html: /*html*/`
		<div class="section-content">

			<div class="rk-flex rk-space-between rk-center-x">
				<h4 style="width: fit-content;" data-component-get="name">Loading...</h4>
				<button class="rk-btn" data-remove-component>-</button>
			</div>


			<div class="rk-flex rk-space-between rk-center-x">
				<span data-translate="themeStyle">Style:</span>
				<select selected="" data-location="style"></select>
			</div>


			<div class="rbx-divider" style="margin: 12px;"></div>

			<span class="text-description" data-location="description"></span>
			<div data-location="image" style="width: 100%;display: flex;justify-content: center;"></div>

			<div data-desc-divider="" class="rbx-divider" style="margin: 12px;"></div>
			<div data-location="styleOptions" class="component-holder"></div>
		</div>`,
		js: function (idCard, parentElement) {
			let element = idCard.element;
			let component = idCard.component;

			//setup remove component btn
			element.querySelector(`[data-remove-component]`)
			.addEventListener("click", () => {
				//console.log("Not Implemented");
				parentElement.removeComponent(idCard.component);
			});

			
			//setup component info
			element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
				let infoType = infoElement.dataset.componentGet;
				let hasLanguageTag = component.details.translate != null;

				let detail = component.details;
				let translate = component.details.translate;

				if (infoType == 'name') {
					infoElement.textContent = detail.name;
					if (hasLanguageTag)
						infoElement.dataset.translate = translate.name;
				}
			});

			//setup data
			let options = component.data?.options;
			if (options == null) {
				console.error('no options, designer.js:172');
				Rkis.Toast('Error: d160')
				return;
			}

			let dropdown = element.querySelector(`[data-location="style"]`);
			let detailsDivider = element.querySelector(`[data-desc-divider]`);
			let imageHolder = element.querySelector(`[data-location="image"]`);
			let descriptionElem = element.querySelector(`[data-location="description"]`);
			let componentElement = element.querySelector(`[data-location="styleOptions"]`);

			dropdown.$clear();
			options.forEach(option => {
				let details = escapeJSON(option.details);
				dropdown.appendChild(
					HTMLParser(`<option value="${option.value}" data-translate="${details.translate?.name || ''}">`,
						details.name
					)
				);
			});

			element.selectedOption = null;

			element.loadOptionComponent = (style, styleOptions) => {
				if (style == null || style.element == null) {
					componentElement.innerHTML = "";
					element.selectedOption = null;
					return;
				}
				componentElement.innerHTML = style.element.html;

				//setup element
				for (let key in style.element) {
					if (key == "html" || key == "js") continue;


					componentElement[key] = style.element[key];
				}

				let idCard = {
					id: style.value,
					element: componentElement,
					component: style,
				};
				element.selectedOption = idCard;

				let run = style.element.js;
				if (typeof run == 'function') run(idCard, element);

				if (typeof componentElement.load == 'function') componentElement.load(styleOptions, idCard);
			};
			element.saveOptionComponent = (style) => {
				if (style == null) style = element.selectedOption;
				if (style == null) return null;

				//run save_object
				let save_component = componentElement.save;
				if (typeof save_component != 'function') return null;

				//put object in page_object with key of component id
				return save_component(style);
			};
			element.updateOption = (value, styleOptions) => {
				let option = options.find(x => x.value == value);
				if (option == null) option = options.find(x => x.value == "");
				element.querySelector(`[data-location="style"]`).value = option.value;
				let hasDetails = false;

				descriptionElem.textContent = option.details.description || '';
				descriptionElem.dataset.translate = option.details.translate?.description || '';
				if (descriptionElem.textContent.length > 0) hasDetails = true;
				
				if (option.image != null) {
					if (option.isPortrait == true) imageHolder.style.display = "block";
					imageHolder.innerHTML = `<img src="${escapeHTML(BROWSER.runtime.getURL(option.image))}" class="rk-style-image">`;

					let imageElement = imageHolder.querySelector('img');
					imageElement.addEventListener('click', () => {
						imageElement.classList.toggle("rk-focus-zoom-image");
					});

					hasDetails = true
				}
				else imageHolder.$clear();

				
				if (hasDetails == false) detailsDivider.style.display = "none";
				else detailsDivider.style.display = "";

				element.loadOptionComponent(option, styleOptions || null);
			};

			//setup functionality
			dropdown.addEventListener('input', () => {
				let value = dropdown.value;
				element.updateOption(value, null);
			});
			
			element.querySelector(`[data-location="style"]`).dispatchEvent(new Event('input'));
		},
		load: function (theme_object, idCard) {
			if (theme_object == null) return;
			let element = idCard.element;

			element.updateOption(theme_object.type || '', theme_object.options || null);
		},
		save: function (idCard) {
			let element = idCard.element;

			let style = element.querySelector(`[data-location="style"]`).value;

			let options = element.saveOptionComponent() || null;

			return {
				type: style,
				options
			};
		}
	},
	imageInputPopup: {
		html: /*html*/`
		<div class="rk-popup-holder" style="z-index:999;" data-image-popup="">
			<div class="rk-popup" style="width: min(100%, 55rem);min-height: 25%;max-height: 100%;overflow: hidden;">
				<div class="rk-page-tab">
					<div class="rk-tabs">
						<div class="rk-tab" bg-image-clear>Clear</div>
						<div class="rk-tab is-active" page="imageupload">Image</div>
						<div class="rk-tab" page="imagegradient">Gradient</div>
						<div class="rk-tab" page="imagelink">Link</div>
					</div>
					<div class="rk-tab-pages">
						<div class="rk-tab-page is-active" tab="imageupload" style="height: 100%;">
							<label class="rk-file-input" ondragover="event.preventDefault();">
								<input type="file" hidden data-image-upload>
								<span>
									Upload Image <span style="opacity: 0.6;">or</span><br>
									Drag and Drop Image <span style="opacity: 0.6;">or</span><br>
									Paste Image
								<span>
							</label>
						</div>
						<div class="rk-tab-page" tab="imagegradient">
							<div class="info" style="font-size: 20px;">Coming Soon!</div>
						</div>
						<div class="rk-tab-page is-active" tab="imagelink" style="height: 100%;">
							<div class="rk-flex rk-space-between rk-center-x" style="min-width: 65%;">
								<span style="min-width: fit-content;margin-right: 5px;" data-translate="themeLink">File:</span>
								<input type="url" value="" style="width: 100%;"
									data-image-link class="form-control input-field">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		`,
		js: function(element) {
			//setup popup
			let popup = element.querySelector(`.rk-popup-holder`);
			let popupClose = () => {
				//apply edits
				popup.style.display = "none";
				document.removeEventListener('paste', pasteImageEvent);

				element.update?.();
			};
			const triggerFileUpload = (file) => {
				// console.log("new file", file);
				element.imageData = file;

				popupClose();
			};
			let pasteImageEvent = (e) => {
				for (const clipboardItem of e.clipboardData.files) {
					if (!clipboardItem.type.startsWith('image/')) continue;
					e.preventDefault();

					// Do something with the image file.
					let blob = clipboardItem;
					let reader = new FileReader();
					reader.onload = function () { triggerFileUpload(this.result) };
					reader.readAsDataURL(blob);
					break;
				}
			};
			
			element.querySelector(`[data-image-button]`).addEventListener("click", (e) => {
				if (e.target == popup) return;
				if (e.target.closest(`.rk-popup-holder`) == popup) return;

				//setup/load edits
				popup.style.display = "flex";
				document.addEventListener('paste', pasteImageEvent);
			});

			popup.addEventListener("click", function (e) {
				if (e.target != popup) return;
				popupClose();
			});

			let imageUploader = element.querySelector("[data-image-upload]");
			let imageUploaderField = imageUploader.parentElement;
			let imageLinkField = element.querySelector("[data-image-link]");

			//clear
			element.querySelector("[bg-image-clear]").addEventListener("click", () => {
				triggerFileUpload("");
			});
			//image
			imageUploader.addEventListener("input", () => {
				for (const file of imageUploader.files) {
					if (!file.type.startsWith('image/')) continue;
					let blob = file;
					let reader = new FileReader();
					reader.onload = function () { triggerFileUpload(this.result) };
					reader.readAsDataURL(blob);
					break;
				}
			});
			imageUploaderField.addEventListener("drop", (ev) => {
				// Prevent default behavior (Prevent file from being opened)
				ev.preventDefault();

				let totalItems = [...ev.dataTransfer.items, ...ev.dataTransfer.files];
				for (const item of totalItems) {
					if (!item.type?.startsWith('image/')) continue;
					let blob = null;
					if (item.kind === "file") {
						blob = item.getAsFile();
					} else {
						blob = item;
					}
					if (blob === null) continue;
					let reader = new FileReader();
					reader.onload = function () { triggerFileUpload(this.result) };
					reader.readAsDataURL(blob);
					break;
				}
			});
			//link
			imageLinkField.addEventListener("blur", () => {
				if (imageLinkField.value != "") {
					triggerFileUpload(imageLinkField.value);
				}
			});
		},
		load: function(theme_object, idCard) {
			let element = idCard.element;
			let imageLinkField = element.querySelector("[data-image-link]");

			if (element.imageData?.startsWith("https://")) {
				imageLinkField.value = element.imageData || "";
				// element.linkModificationCheck = element.imageData || "";
			}
		}
	},
};
let designerComponents = [


	//styles
	{
		id: "all",
		tags: ["page"],
		parent: {
			headId: 'styles',
			ids: {
				styles: true
			}
		},
		details: {
			name: "All Pages",
			description: "Default components for all pages."
		},
		element: defaultcomponentElements.horizantalGroup
	},//all
	{
		id: "game",
		tags: ["page"],
		parent: {
			headId: 'styles',
			ids: {
				styles: true
			}
		},
		details: {
			name: "Game Page",
			translate: {
				name: 'categoryGamePage'
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//game
	{
		id: "users",
		tags: ["page"],
		parent: {
			headId: 'styles',
			ids: {
				styles: true
			}
		},
		details: {
			name: "User Page"
		},
		element: defaultcomponentElements.horizantalGroup
	},//users

	{
		id: "videobackground",
		details: {
			name: "Video Background",
			description: "Adds a video player over the background."
		},
		parent: {
			headId: 'styles',
			ids: {
				all: true
			}
		},
		data: {
			options: [
				{value: '',details:{name:'Disabled'}},
				{value: 'videoplayer',details:{name:'Video Link'},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;" class="rk-flex rk-space-between rk-center-x">
							<span style="min-width: fit-content;margin-right: 5px;">File:</span>
							<input type="url" value="" placeholder="URL"
								data-location="videolink" data-type="value" class="form-control input-field">
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Mute Video</span>
							<span data-location="mutevideo" class="rk-button receiver-destination-type-toggle on">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div class="rk-flex rk-space-between rk-center-x" style="width: 100%;margin-top: 0.5rem;">
							<span style="flex-shrink: 0;margin-right: 1ch;">Video Volume</span>
							<input data-location="videoVolume" type="range" class="form-control input-field"
								min="0" max="100" value="100" step="5">
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
				{value: 'youtubeplayer',details:{name:'Youtube Link'},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;" class="rk-flex rk-space-between rk-center-x">
							<span style="min-width: fit-content;margin-right: 5px;">Link:</span>
							<input type="url" value="" placeholder="URL"
								data-location="videolink" data-type="value" class="form-control input-field">
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//videobackground
	{
		id: "servers",
		details: {
			name: "Servers",
			translate: {
				name: "tabServers"
			}
		},
		parent: {
			headId: 'styles',
			ids: {
				game: true
			}
		},
		data: {
			options: [
				{value: '',image:'images/themes/styles/serversDefault.png',details:{name:'Default',description:"Roblox's default design"},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Hide Players</span>
							<span data-location="hidePlayers" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
				{value: 'card',image:'images/themes/styles/serversCard.png',details:{name:'Card',description:"Cards with Player icons on bottom"},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Hide Players</span>
							<span data-location="hidePlayers" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//servers
	{
		id: "badges",
		details: {
			name: "Badges",
			translate: {
				name: "tabBadges"
			}
		},
		parent: {
			headId: 'styles',
			ids: {
				game: true
			}
		},
		data: {
			options: [
				{value: '',image:'images/themes/styles/badgesDefault.png',details:{name:'Default',description:"Roblox's default design"}},
				{value: 'card',image:'images/themes/styles/badgesCard.png',details:{name:'Card'}},
				{value: 'simple',details:{name:'Simplified',description:"no stats and short description"}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//badges
	{
		id: "menu",
		details: {
			name: "Menu",
			translate: {
				name: "EditorStyleMenu"
			}
		},
		parent: {
			headId: 'styles',
			ids: {
				all: true
			}
		},
		data: {
			options: [
				{value: '',image:'images/themes/styles/menuDefault.png',isPortrait:true,details:{name:'Default',description:"Roblox's default design"}},
				{value: 'float',image:'images/themes/styles/menuFloat.png',isPortrait:true,details:{name:'Floating',description:"Floating phone looking design"}},
				{value: 'rod',details:{name:'Pole',description:"same as floating design but icons only"},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Extend the Design</span>
							<span data-location="extendedDesign" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Center Menu Items</span>
							<span data-location="centerMenuItems" class="rk-button receiver-destination-type-toggle on">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Move avatar to bottom</span>
							<span data-location="moveAvatarBottom" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
				{value: 'buttons',details:{name:'Buttons',description:"floating but saparated buttons"},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Icons only</span>
							<span data-location="iconsOnly" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//menu
	{
		id: "icons",
		details: {
			name: "Icons",
			description: "Changes menu icons pack",
		},
		parent: {
			headId: 'styles',
			ids: {
				all: true
			}
		},
		data: {
			options: [
				{value: '',details:{name:'Default',description:"Roblox's default icons"}},
				{value: '2018',details:{name:'2018',description:"Brings back 2018's icons"}},
				{value: 'custom',details:{name:'Custom',description:"Upload your own icon pack"},element:{
					html: /*html*/`
						<div>Use template from our discord server.</div>
						<div style="width: 100%;margin-top: 0.5rem;" class="rk-flex rk-space-between rk-center-x">
							<span style="min-width: fit-content;margin-right: 5px;">Template:</span>
							<button class="rk-btn" style="width: calc(100% - 10ch);" data-image-button="">Modify</button>
							${defaultcomponentElements.imageInputPopup.html}
						</div>
						`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}

						element.imageData = theme_object?.iconPackLink || "";

						defaultcomponentElements.imageInputPopup.js(element);
						element.querySelector('[page="imagegradient"]').remove();
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});

						component_object.iconPackLink = element.imageData;

						return component_object;
					}
				}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//icons
	{
		id: "navbar",
		details: {
			name: "Top Navigation Bar",
			translate: {
				name: "styletopnavbar"
			}
		},
		parent: {
			headId: 'styles',
			ids: {
				all: true
			}
		},
		data: {
			options: [
				{value: '',image:'images/themes/styles/navbarDefault.png',details:{name:'Default',description:"Roblox's default design"}},
				{value: 'float',image:'images/themes/styles/navbarFloat.png',details:{name:'Floating',description:"Floating design"},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">dont split design</span>
							<span data-location="connectedIslands" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Hide Roblox Logo</span>
							<span data-location="hideRobloxLogo" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Hide Navigation Buttons</span>
							<span data-location="hideNavBtns" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Make Search a Button</span>
							<span data-location="makeSearchBtn" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div class="rk-flex rk-space-between rk-center-x" style="width: 100%;margin-top: 0.5rem;">
							<span style="flex-shrink: 0;margin-right: 1ch;">Search Bar Length</span>
							<input data-location="searchbarLength" type="range" class="form-control input-field"
								min="25" max="50" value="25" step="5">
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//navbar
	{
		id: "gamecards",
		details: {
			name: "Game Cards",
			translate: {
				name: "stylegamecards"
			}
		},
		parent: {
			headId: 'styles',
			ids: {
				all: true
			}
		},
		data: {
			options: [
				{value: '',image:'images/themes/styles/gamecardsDefault.png',details:{name:'Default',description:"Roblox's default design"},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Center Text</span>
							<span data-location="centerText" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Show "Join" Text</span>
							<span data-location="showjointext" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
				{value: '1',image:'images/themes/styles/gamecards1.png',details:{name:'Style 1',description:"Cards game Style"},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Hide Text</span>
							<span data-location="hideText" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Show "Join" Text</span>
							<span data-location="showjointext" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});
		
						return component_object;
					}
				}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//gamecards
	{
		id: "chat",
		details: {
			name: "Chat"
		},
		parent: {
			headId: 'styles',
			ids: {
				all: true
			}
		},
		data: {
			options: [
				{value: '',details:{name:'Default',description:"Roblox's default design"}},
				{value: 'bubble',details:{name:'Bubble',description:"Bubble Header"}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//chat
	{
		id: "userbanner",
		details: {
			name: "User Banner",
			description: "this applies to all users."
		},
		parent: {
			headId: 'styles',
			ids: {
				users: true
			}
		},
		data: {
			options: [
				{value: '',details:{name:'Disabled'}},
				{value: 'imglink',details:{name:'Custom'},element:{
					html: /*html*/`
						<div style="width: 100%;margin-top: 0.5rem;" class="rk-flex rk-space-between rk-center-x">
							<span style="min-width: fit-content;margin-right: 5px;">Banner Image:</span>
							<button class="rk-btn" style="width: calc(100% - 10ch);" data-image-button="">Modify</button>
							${defaultcomponentElements.imageInputPopup.html}
						</div>
						<div style="width: 100%;margin-top: 0.5rem;">
							<span class="text-lead">Combine with profile header</span>
							<span data-location="combineprofileheader" class="rk-button receiver-destination-type-toggle off">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</div>
						`,
					js: null,
					load: function (theme_object, idCard) {
						let element = idCard.element;
		
						for (let key in theme_object) {
							if (theme_object[key] == null) continue;
							let value = theme_object[key];
		
							let input = element.querySelector(`[data-location="${key}"]`);
							if (input == null) continue;

							if (input.classList.contains("rk-button")) {
								page.toggleSwich(input, value);
							} else if (input.classList.contains("input-field")) {
								input.value = value;
							}
						}

						element.imageData = theme_object?.bannerImage || "";

						defaultcomponentElements.imageInputPopup.js(element);
					},
					save: function (idCard) {
						let element = idCard.element;
						let component_object = {};
		
						element.querySelectorAll(`[data-location]`).forEach((input) => {
							let edge = input.dataset.location;
							let value = null;
							if (input.classList.contains("rk-button")) {
								value = page.getSwich(input);
							} else if (input.classList.contains("input-field")) {
								value = input.value;
							}
		
							component_object[edge] = value;
						});

						component_object.bannerImage = element.imageData;

						return component_object;
					}
				}},
			]
		},
		element: defaultcomponentElements.styleDropdown
	},//userbanner



	//pages
	{
		id: "background",
		parent: {
			all: false,
			headId: 'pages',
			tags: {
				page: true,
				blockElement: true,
				hasBackground: true
			}
		},
		details: {
			name: "Background",
			translate: {
				name: 'themeBackground'
			}
		},
		element: {
			html: /*html*/`
				<div data-preview data-translate="themePreview"
				style="width: min(10rem, 20%);display: flex;border: 1px solid rgba(128,128,128,0.5);margin-right: 1rem;justify-content: center;align-items: center;border-radius: 20px 0;">
					Preview
				</div>
				<div style="flex-grow: 1;">
					<div class="rk-flex rk-space-between rk-center-x">
						<h4 style="width: fit-content;" data-translate="themeBackground">Background</h4>
						<button class="rk-btn" data-remove-component>-</button>
					</div>


					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;" data-translate="themeColor">Color:</span>
						<input type="color" value="#232527"
							data-location="color" data-type="color" class="form-control input-field">
					</div>

					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;" data-translate="themeAlpha">Alpha:</span>
						<input type="range" value="100" step="10"
							data-location="color" data-type="color-alpha" class="form-control input-field">
					</div>


					<div class="rbx-divider" style="margin: 12px;"></div>


					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;">Image:</span>
						<button class="rk-btn" style="width: calc(100% - 10ch);" data-image-button="">Modify</button>
						${defaultcomponentElements.imageInputPopup.html}
					</div>

					<div class="rk-flex rk-space-between rk-center-x">
						<span data-translate="themeSize">Size:</span>
						<select selected="contain" data-location="image.size" data-type="value">
							<option value="contain" data-translate="themeFillX">Fill X</option>
							<option value="cover" data-translate="themeFillY">Fill Y</option>
							<option value="auto" data-translate="themeAuto">Auto</option>
						</select>
					</div>

					<div class="rk-flex rk-space-between rk-center-x">
						<span data-translate="themeRepeatT">Repeat:</span>
						<select selected="round" data-location="image.repeat" data-type="value">
							<option value="round" data-translate="themeRound">Round</option>
							<option value="repeat" data-translate="themeRepeat">Repeat</option>
							<option value="space" data-translate="themeSpace">Space</option>
							<option value="no-repeat" data-translate="themeNoRepeat">No Repeat</option>
						</select>
					</div>

					<div class="rk-flex rk-space-between rk-center-x">
						<span data-translate="themeScroll">Scroll:</span>
						<select selected="fixed" data-location="image.attachment" data-type="value">
							<option value="fixed" data-translate="themeEnabled">Enabled</option>
							<option value="scroll" data-translate="themeDisabled">Disabled</option>
						</select>
					</div>
				</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				
				element.classList.add("section-content");
				element.style.display = 'flex';

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//TODO remove later
				function FetchImage(url) {
					return new Promise(resolve => {
						BROWSER.runtime.sendMessage({about: "getImageRequest", url: url}, 
						function(data) {
							resolve(data)
						})
					})
				}

				//setup popup
				defaultcomponentElements.imageInputPopup.js(element);


				element.update = function() {
					let settings = element.save(idCard);
					if (settings == null) return;

					//background: color image("repeat","position","attachment")
					//background-image: image.url
					//background-image-size: image.size
					previewElement.style.background = `${settings.color} ${settings.image.repeat}`;
					previewElement.style.backgroundSize = settings.image.size;
					
					element.style.background = `${settings.color} ${settings.image.repeat} ${settings.image.attachment}`;
					element.style.backgroundSize = settings.image.size;

					if (settings.image.link === "") return;
					let url = settings.image.link;
					let fill = null;
					if (url === "") {
						fill = "";
					} else if (url.startsWith("linear-gradient")) {
						fill = url.split(')')[0]+')';
					} else if (url.startsWith("data:image/")) {
						fill = 'url('+url.split(')')[0]+')';
					} else {
						FetchImage(url).then((encoded) => {
							previewElement.style.backgroundImage = encoded;
							element.style.backgroundImage = encoded;
							// element.imageData = encoded;
						});
					}

					if (fill !== null) {
						previewElement.style.backgroundImage = fill;
						element.style.backgroundImage = fill;
					}
				}

				let previewElement = element.querySelector('[data-preview]');
				if (previewElement != null) {
					element.querySelectorAll('[data-location]')
					.forEach((input) => {
						if (input.dataset.location == "image.link") return;
						input.addEventListener('input', () => element.update());
					});
					// element.querySelector('[data-location="image.link"]')
					// .addEventListener('change', () => element.update());
				}
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				//load color
				let rawColor = theme_object.color;
				let splittenColor = rawColor.slice(5).slice(0, -1).split(',');

				element.querySelectorAll(`[data-location="color"]`).forEach((input) => {
					if (input.dataset.type == "color") {
						input.value = rgbToHex(splittenColor[0], splittenColor[1], splittenColor[2]);
					}
					if (input.dataset.type == "color-alpha") {
						let alpha = splittenColor[3];
						if (alpha.endsWith('%')) alpha = alpha.slice(0, -1);

						if (parseInt(alpha) <= 0) alpha = parseInt(alpha) * 100;
						else alpha = parseInt(alpha);

						input.value = alpha;
					}
				});

				//load image
				let image = theme_object.image;

				element.querySelectorAll(`[data-location]`).forEach((input) => {
					if (input.dataset.location.startsWith('image.') == false) return;

					let type = input.dataset.location.split('.')[1];

					input.value = image[type];
				});

				element.imageData = theme_object.image.link || "";

				defaultcomponentElements.imageInputPopup.load(theme_object, idCard);
				if (typeof element.update == 'function') element.update();
			},
			save: function (idCard) {
				let element = idCard.element;

				let component_object = {};

				//save color
				let hexColor = element.querySelector(`[data-location="color"][data-type="color"]`).value;
				let alphaColor = element.querySelector(`[data-location="color"][data-type="color-alpha"]`).value;

				component_object.color = rgbTorgba(hexToRgb(hexColor), alphaColor);

				//save image
				let image = {};

				element.querySelectorAll(`[data-location]`).forEach((input) => {
					if (input.dataset.location.startsWith('image.') == false) return;

					let type = input.dataset.location.split('.')[1];

					image[type] = input.value;
				});

				component_object.image = image;
				component_object.image.link = element.imageData || "";

				return component_object;
			}
		}
	},//background
	{
		id: "box-shadow",
		parent: {
			all: false,
			headId: 'pages',
			tags: {
				blockElement: true,
			}
		},
		details: {
			name: "Border Shadow",
			translate: {
				name: 'themeBorderShadow'
			}
		},
		element: {
			...defaultcomponentElements.horizantalGroup,
			...{
				load: function (theme_object, idCard) {
					let element = idCard.element;
					let componentHolder = element.querySelector(`[data-component-holder]`);

					//clear currentComponents
					componentHolder.clearComponents();

					//for all objects in theme_object
					if (theme_object === '') return;
					let shadows = theme_object.split(',');
					for (let shadow of shadows) {
						if (shadow == '') continue;

						let component = componentHolder.availableComponents.find(x => x.id == 'shadows');

						//check if path/object key exist in components as id
						if (component == null) continue;

						//add component
						let componentIdCard = componentHolder.addComponent(component);

						//after setup do load and pass the same object's value
						if (typeof componentIdCard.element.load == 'function') componentIdCard.element.load(shadow, componentIdCard);
					}
				},
				save: function (idCard) {
					let element = idCard.element;
					let componentHolder = element.querySelector(`[data-component-holder]`);

					//create shadows
					let shadows = [];
					let currentComponents = componentHolder.getComponents();

					//for each current Components
					for (let componentIdCard of currentComponents) {
						//run save_object
						let saveComponent = componentIdCard.element.save;
						if (typeof saveComponent != 'function') continue;

						//put object in shadows with key of component id
						shadows.push(
							saveComponent(componentIdCard)
						);
					}
					
					return shadows.join(',');
				}
			}
		}
	},//box-shadow
	{
		id: "shadows",
		parent: {
			all: false,
			ids: {
				'box-shadow': true,
			}
		},
		options: {
			isMulti: true,
			maxMulti: 5,
		},
		details: {
			name: "Shadow",
			translate: {
				name: 'themeShadowComponent'
			}
		},
		element: {
			html: /*html*/`
				<div data-preview data-translate="themePreview"
				style="width: min(10rem, 20%);display: flex;border: 1px solid rgba(128,128,128,0.5);margin-right: 1rem;justify-content: center;align-items: center;border-radius: 20px 0;">
					Preview
				</div>
				<div style="flex-grow: 1;">
					<div class="rk-flex rk-space-between rk-center-x">
						<h4 style="width: fit-content;">Shadow</h4>
						<button class="rk-btn" data-remove-component>-</button>
					</div>


					<div class="rk-flex rk-space-between rk-center-x">
						<span>Type:</span>
						<select selected="" data-location="type">
							<option value="" selected>Outset</option>
							<option value="inset">Inset</option>
						</select>
					</div>


					<div class="rbx-divider" style="margin: 12px;"></div>


					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;">X:</span>
						<input type="range" value="0" step="1" min="-20" max="20"
							data-location="x" class="form-control input-field">
					</div>

					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;">Y:</span>
						<input type="range" value="0" step="1" min="-20" max="20"
							data-location="y" class="form-control input-field">
					</div>


					<div class="rbx-divider" style="margin: 12px;"></div>


					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;">Blur:</span>
						<input type="range" value="0" step="1" min="0" max="20"
							data-location="blur" class="form-control input-field">
					</div>

					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;">Spread:</span>
						<input type="range" value="0" step="1" min="0" max="20"
							data-location="spread" class="form-control input-field">
					</div>


					<div class="rbx-divider" style="margin: 12px;"></div>


					<div class="rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;" data-translate="themeColor">Color:</span>
						<input type="color" value="#000000"
							data-location="color" data-type="color" class="form-control input-field">
					</div>
				</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				
				element.classList.add("section-content");
				element.style.display = 'flex';

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component, idCard);
				});

				element.update = function() {
					let settings = element.save(idCard);
					if (settings == '') return;

					previewElement.style.boxShadow = settings;
					element.style.boxShadow = settings;
				}

				let previewElement = element.querySelector('[data-preview]');
				if (previewElement != null) {
					element.querySelectorAll('[data-location]')
					.forEach((input) => {
						input.addEventListener('input', () => element.update());
					});
				}
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;
				
				// if (theme_object.startsWith('inset ') != true) theme_object = ' ' + theme_object;
				let [type, x, y, blur, spread, rawColor] = theme_object.split(' ');

				//load rest
				let inputsValue = {type,x,y,blur,spread,color: rawColor};
				element.querySelectorAll(`[data-location]`).forEach((input) => {
					let value = inputsValue[input.dataset.location];

					input.value = value.split('px')[0];
				});
				
				if (typeof element.update == 'function') element.update();
			},
			save: function (idCard) {
				let element = idCard.element;
				let inputsValue = {};

				//save inputs
				element.querySelectorAll(`[data-location]`).forEach((input) => {
					let value = input.value;
					if (input.dataset.location != 'type' &&
						input.dataset.location != 'color') value += 'px';

					inputsValue[input.dataset.location] = value;
				});

				return `${inputsValue.type} ${inputsValue.x} ${inputsValue.y} ${inputsValue.blur} ${inputsValue.spread} ${inputsValue.color}`;
			}
		}
	},//shadows
	{
		id: "backgroundfilter",
		parent: {
			all: false,
			headId: 'pages',
			tags: {
				page: false,
				blockElement: true
			}
		},
		details: {
			name: "Backdrop Filter",
			description: "adds filters behind the background of the element",
			translate: {
				name: 'themeBackdropFilter',
				description: 'themeBackdropFilter1'
			}
		},
		// element: {
		// 	html: /*html*/`
		// 	<div class="section-content" style="cursor: pointer;">
		// 		<!--span class="text-lead" data-component-get="name">Unnamed Component</span>
		// 		<button class="rk-btn" data-remove-component style="float: right;margin-top: -.5ch;">-</button-->
		// 		<div class="rk-flex rk-space-between rk-center-x">
		// 			<button class="rk-btn"><span class="text-lead" data-component-get="name">Unnamed Component</span></button>
		// 			<button class="rk-btn" data-remove-component>-</button>
		// 		</div>
		// 		<div class="rbx-divider" style="margin: 12px;"></div>
		// 		<span class="text-description" data-component-get="description"></span>
		// 		<div style="color: red;" class="text-description" data-component-get="note"></div>
		// 	</div>
		// 	<div class="rk-popup-holder" style="z-index:999;">
		// 		<div class="rk-popup" style="width: min(100%, 55rem);min-height: 25%;max-height: 100%;padding: 0;overflow: hidden;"><!--data-designer-func="add-edits"-->
		// 			<div data-component-holder style="width: 100%;height: 100%;overflow: auto;padding: 1rem;"> 
		// 				<button class="section-content rk-btn" style="width: 100%;" data-designer-func="add-edits-btn" data-translate="editorComponentAdding">Add Component</button>
		// 			</div>
		// 		</div>
		// 	</div>`,
		// 	js: function(idCard, parentElement) {
		// 		let element = idCard.element;
		// 		let component = idCard.component;

		// 		//setup remove component btn
		// 		element.querySelector(`[data-remove-component]`)
		// 		.addEventListener("click", () => {
		// 			//console.log("Not Implemented");
		// 			parentElement.removeComponent(idCard.component);
		// 		});

		// 		//setup component info
		// 		element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
		// 			let infoType = infoElement.dataset.componentGet;
		// 			let hasLanguageTag = component.details.translate != null;

		// 			let detail = component.details;
		// 			let translate = component.details.translate;

		// 			if (infoType == 'name') {
		// 				infoElement.textContent = detail.name;
		// 				if (hasLanguageTag)
		// 					infoElement.dataset.translate = translate.name;
		// 			} else if (infoType == 'description' && detail.description) {
		// 				infoElement.textContent = detail.description;
		// 				if (hasLanguageTag)
		// 					infoElement.dataset.translate = translate.description;
		// 			} else if (infoType == 'note' && detail.note) {
		// 				infoElement.textContent = detail.note;
		// 				if (hasLanguageTag)
		// 					infoElement.dataset.translate = translate.note;
		// 			}
		// 		});

		// 		//setup component manager
		// 		let componentHolder = element.querySelector(`[data-component-holder]`);
				
		// 		componentHolder.dataset.componentId = component.id;
		// 		componentHolder.dataset.headId = element.dataset.headId;
		// 		componentHolder.componentTags = component.tags || [];

		// 		Designer.ThemeEditor.setupComponentsManager(componentHolder);
		// 		element.getComponents = componentHolder.getComponents;
		// 		element.clearComponents = componentHolder.clearComponents;
		// 		element.addComponent = componentHolder.addComponent;
				
		// 		//setup popup
		// 		let popup = element.querySelector(`.rk-popup-holder`);
				
		// 		element.addEventListener("click", (e) => {
		// 			if (e.target == popup) return;
		// 			if (e.target.closest(`.rk-popup-holder`) == popup) return;

		// 			//setup/load edits
		// 			popup.style.display = "flex";
		// 		});

		// 		popup.addEventListener("click", function (e) {
		// 			if (e.target != popup) return;

		// 			//apply edits
		// 			popup.style.display = "none";

		// 			//update ui
		// 			// console.log('update ui');
		// 		});
		// 	},
		// 	load: function (theme_object, idCard) {
		// 		let element = idCard.element;

		// 		//clear currentComponents
		// 		element.clearComponents();

		// 		//for all objects in theme_object
		// 		if (theme_object === '') return;
		// 		let filters = theme_object.split(' ');
		// 		for (let filter of filters) {
		// 			if (filter == '') continue;

		// 			let filterName = filter.split('(')[0];

		// 			//check if path/object key exist in components as id
		// 			if (filterName == null || filterName == '') continue;

		// 			//add component
		// 			let componentIdCard = element.addComponent(component);
		// 			let value = filter.split('(')[1].split(')')[0];

		// 			//after setup do load and pass the same object's value
		// 			if (typeof componentIdCard.element.load == 'function') componentIdCard.element.load(value, componentIdCard);
		// 		}
		// 	},
		// 	save: function (idCard) {
		// 		let element = idCard.element;

		// 		//create filters
		// 		let filters = [];
		// 		let currentComponents = element.getComponents();

		// 		//for each current Components
		// 		for (let componentIdCard of currentComponents) {
		// 			//run save_object
		// 			let save_component = componentIdCard.element.save;
		// 			if (typeof save_component != 'function') continue;

		// 			//put object in filters with key of component id
		// 			filters.push(
		// 				save_component(componentIdCard)
		// 			);
		// 		}
				
		// 		return filters.join(' ');
		// 	}
		// }
		element: {
			...defaultcomponentElements.horizantalGroup,
			...{
				load: function (theme_object, idCard) {
					let element = idCard.element;
					let componentHolder = element.querySelector(`[data-component-holder]`);

					//clear currentComponents
					componentHolder.clearComponents();

					//for all objects in theme_object
					if (theme_object === '') return;
					let filters = theme_object.split(' ');
					for (let filter of filters) {
						if (filter == '') continue;

						let filterName = filter.split('(')[0];

						//check if path/object key exist in components as id
						if (filterName == null || filterName == '') continue;

						let component = componentHolder.availableComponents.find(x => x.id == 'filter'+filterName);
						if (component == null) continue;

						//add component
						let componentIdCard = componentHolder.addComponent(component);
						let value = filter.split('(')[1].split(')')[0];

						//after setup do load and pass the same object's value
						if (typeof componentIdCard.element.load == 'function') componentIdCard.element.load(value, componentIdCard);
					}
				},
				save: function (idCard) {
					let element = idCard.element;
					let componentHolder = element.querySelector(`[data-component-holder]`);

					//create filters
					let filters = [];
					let currentComponents = componentHolder.getComponents();

					//for each current Components
					for (let componentIdCard of currentComponents) {
						//run save_object
						let saveComponent = componentIdCard.element.save;
						if (typeof saveComponent != 'function') continue;

						//put object in filters with key of component id
						filters.push(
							saveComponent(componentIdCard)
						);
					}
					
					return filters.join(' ');
				}
			}
		}
	},//backgroundfilter
	{
		id: "filterbrightness",
		parent: {
			all: false,
			ids: {
				backgroundfilter: true
			}
		},
		details: {
			name: "Brightness",
			translate: {
				name: 'themeFilterBrightness'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="display: flex;">

				<button class="rk-btn" data-remove-component>-</button>

				<div class="rk-flex rk-space-between rk-center-x" style="flex-grow: 1;">
					<span data-component-get="name">loading</span>
					<input data-location="value" type="range" class="form-control input-field"
						min="0" max="2" value="1" step="0.1">
				</div>
	
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				let component = idCard.component;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//setup component info
				element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
					let infoType = infoElement.dataset.componentGet;
					let hasLanguageTag = component.details.translate != null;

					let detail = component.details;
					let translate = component.details.translate;

					if (infoType == 'name') {
						infoElement.textContent = detail.name;
						if (hasLanguageTag)
							infoElement.dataset.translate = translate.name;
					}
				});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);
				if (inputElement) inputElement.value = theme_object;
			},
			save: function (idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);

				return `brightness(${inputElement.value})`;
			}
		}
	},//filterbrightness
	{
		id: "filterblur",
		parent: {
			all: false,
			ids: {
				backgroundfilter: true
			}
		},
		details: {
			name: "Blur",
			translate: {
				name: 'themeFilterBlur'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="display: flex;">

				<button class="rk-btn" data-remove-component>-</button>

				<div class="rk-flex rk-space-between rk-center-x" style="flex-grow: 1;">
					<span data-component-get="name">loading</span>
					<input data-location="value" type="range" class="form-control input-field"
						min="0" max="50" value="0" step="5">
				</div>
	
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				let component = idCard.component;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//setup component info
				element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
					let infoType = infoElement.dataset.componentGet;
					let hasLanguageTag = component.details.translate != null;

					let detail = component.details;
					let translate = component.details.translate;

					if (infoType == 'name') {
						infoElement.textContent = detail.name;
						if (hasLanguageTag)
							infoElement.dataset.translate = translate.name;
					}
				});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);
				if (inputElement) inputElement.value = theme_object.split('px')[0];
			},
			save: function (idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);

				return `blur(${inputElement.value}px)`;
			}
		}
	},//filterblur
	{
		id: "filtercontrast",
		parent: {
			all: false,
			ids: {
				backgroundfilter: true
			}
		},
		details: {
			name: "Contrast",
			translate: {
				name: 'themeFilterContrast'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="display: flex;">

				<button class="rk-btn" data-remove-component>-</button>

				<div class="rk-flex rk-space-between rk-center-x" style="flex-grow: 1;">
					<span data-component-get="name">loading</span>
					<input data-location="value" type="range" class="form-control input-field"
						min="0" max="2" value="1" step="0.1">
				</div>
	
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				let component = idCard.component;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//setup component info
				element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
					let infoType = infoElement.dataset.componentGet;
					let hasLanguageTag = component.details.translate != null;

					let detail = component.details;
					let translate = component.details.translate;

					if (infoType == 'name') {
						infoElement.textContent = detail.name;
						if (hasLanguageTag)
							infoElement.dataset.translate = translate.name;
					}
				});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);
				if (inputElement) inputElement.value = theme_object;
			},
			save: function (idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);

				return `contrast(${inputElement.value})`;
			}
		}
	},//filtercontrast
	{
		id: "filtergrayscale",
		parent: {
			all: false,
			ids: {
				backgroundfilter: true
			}
		},
		details: {
			name: "Grayscale",
			translate: {
				name: 'themeFilterGrayscale'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="display: flex;">

				<button class="rk-btn" data-remove-component>-</button>

				<div class="rk-flex rk-space-between rk-center-x" style="flex-grow: 1;">
					<span data-component-get="name">loading</span>
					<input data-location="value" type="range" class="form-control input-field"
						min="0" max="1" value="0" step="0.1">
				</div>
	
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				let component = idCard.component;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//setup component info
				element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
					let infoType = infoElement.dataset.componentGet;
					let hasLanguageTag = component.details.translate != null;

					let detail = component.details;
					let translate = component.details.translate;

					if (infoType == 'name') {
						infoElement.textContent = detail.name;
						if (hasLanguageTag)
							infoElement.dataset.translate = translate.name;
					}
				});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);
				if (inputElement) inputElement.value = theme_object;
			},
			save: function (idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);

				return `grayscale(${inputElement.value})`;
			}
		}
	},//filtergrayscale
	{
		id: "filterhue-rotate",
		parent: {
			all: false,
			ids: {
				backgroundfilter: true
			}
		},
		details: {
			name: "Hue Rotate",
			translate: {
				name: 'themeFilterHueRotate'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="display: flex;">

				<button class="rk-btn" data-remove-component>-</button>

				<div class="rk-flex rk-space-between rk-center-x" style="flex-grow: 1;">
					<span data-component-get="name">loading</span>
					<input data-location="value" type="range" class="form-control input-field"
						min="0" max="360" value="0" step="10">
				</div>
	
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				let component = idCard.component;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//setup component info
				element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
					let infoType = infoElement.dataset.componentGet;
					let hasLanguageTag = component.details.translate != null;

					let detail = component.details;
					let translate = component.details.translate;

					if (infoType == 'name') {
						infoElement.textContent = detail.name;
						if (hasLanguageTag)
							infoElement.dataset.translate = translate.name;
					}
				});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);
				if (inputElement) inputElement.value = theme_object.split('deg')[0];
			},
			save: function (idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);

				return `hue-rotate(${inputElement.value}deg)`;
			}
		}
	},//filterhue-rotate
	{
		id: "filterinvert",
		parent: {
			all: false,
			ids: {
				backgroundfilter: true
			}
		},
		details: {
			name: "Invert",
			translate: {
				name: 'themeFilterInvert'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="display: flex;">

				<button class="rk-btn" data-remove-component>-</button>

				<div class="rk-flex rk-space-between rk-center-x" style="flex-grow: 1;">
					<span data-component-get="name">loading</span>
				</div>
	
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				let component = idCard.component;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//setup component info
				element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
					let infoType = infoElement.dataset.componentGet;
					let hasLanguageTag = component.details.translate != null;

					let detail = component.details;
					let translate = component.details.translate;

					if (infoType == 'name') {
						infoElement.textContent = detail.name;
						if (hasLanguageTag)
							infoElement.dataset.translate = translate.name;
					}
				});
			},
			save: function (idCard) {
				return `invert(1)`;
			}
		}
	},//filterinvert
	{
		id: "filtersaturate",
		parent: {
			all: false,
			ids: {
				backgroundfilter: true
			}
		},
		details: {
			name: "Saturate",
			translate: {
				name: 'themeFilterSaturate'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="display: flex;">

				<button class="rk-btn" data-remove-component>-</button>

				<div class="rk-flex rk-space-between rk-center-x" style="flex-grow: 1;">
					<span data-component-get="name">loading</span>
					<input data-location="value" type="range" class="form-control input-field"
						min="0" max="2" value="1" step="0.1">
				</div>
	
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;
				let component = idCard.component;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					//console.log("Not Implemented");
					parentElement.removeComponent(idCard.component);
				});

				//setup component info
				element.querySelectorAll(`[data-component-get]`).forEach((infoElement) => {
					let infoType = infoElement.dataset.componentGet;
					let hasLanguageTag = component.details.translate != null;

					let detail = component.details;
					let translate = component.details.translate;

					if (infoType == 'name') {
						infoElement.textContent = detail.name;
						if (hasLanguageTag)
							infoElement.dataset.translate = translate.name;
					}
				});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);
				if (inputElement) inputElement.value = theme_object;
			},
			save: function (idCard) {
				let element = idCard.element;

				let inputElement = element.querySelector(`[data-location="value"]`);

				return `saturate(${inputElement.value})`;
			}
		}
	},//filtersaturate
	{
		id: "corners",
		parent: {
			all: false,
			headId: 'pages',
			tags: {
				blockElement: true,
				hasCorners: true
			}
		},
		details: {
			name: "Corners Radius",
			translate: {
				name: "themeCornerRadius"
			}
		},
		element: {
			html: /*html*/`
				<div data-preview data-translate="themePreview"
					style="width: min(10rem, 20%);display: flex;margin-right: 1rem;background-color: rgba(128,128,128,0.5);justify-content: center;align-items: center;">
					Preview
				</div>
				<div style="flex-grow: 1;">
					<div class="rk-flex rk-space-between rk-center-x">
						<h4 style="width: fit-content;margin-right: 10px;" data-translate="themeCorners">Corners Radius</h4>
						<button class="rk-btn" data-remove-component>-</button>
					</div>

					<div class="text-lead rk-flex rk-space-between rk-center-x">
						<span style="min-width: fit-content;margin-right: 5px;" data-translate="themeAllCorners">All Corners:</span>
						<input type="range" value="0"
							data-location="corners.all.radius" data-type="corner" class="form-control input-field" max="20" min="0" style="width: calc(100% - 20ch);margin: 10px;">
					</div>

					<div class="rbx-divider" style="margin: 12px;"></div>

					<div class="text-lead rk-flex rk-space-between rk-center-x">
						<div style="text-align: center;" data-translate="themeTLCorner">Top-Left Corner</div>
						<input type="range" value="-1"
							data-location="corners.top-left.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20ch);margin: 10px;">
					</div>

					<div class="text-lead rk-flex rk-space-between rk-center-x">
						<div style="text-align: center;" data-translate="themeTRCorner">Top-Right Corner</div>
						<input type="range" value="-1"
							data-location="corners.top-right.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20ch);margin: 10px;">
					</div>

					<div class="text-lead rk-flex rk-space-between rk-center-x">
						<div style="text-align: center;" data-translate="themeBRCorner">Bottom-Right Corner</div>
						<input type="range" value="-1"
							data-location="corners.bottom-right.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20ch);margin: 10px;">
					</div>

					<div class="text-lead rk-flex rk-space-between rk-center-x">
						<div style="text-align: center;" data-translate="themeBLCorner">Bottom-Left Corner</div>
						<input type="range" value="-1"
							data-location="corners.bottom-left.radius" data-type="corner" class="form-control input-field" max="20" min="-1" style="width: calc(100% - 20ch);margin: 10px;">
					</div>
				</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;

				element.classList.add("section-content");
				element.style.display = 'flex';

				//setup remove component btn
				element.querySelector('[data-remove-component]')
					.addEventListener("click", () => {
						parentElement.removeComponent(idCard.component);
					});

				element.update = function() {
					let settings = element.save(idCard);
					if (settings == null) return;
					let finishedStyle = [];
					
					// "top-left","top-right","bottom-right","bottom-left"
					finishedStyle.push(settings["top-left"]?.radius || settings.all.radius);
					finishedStyle.push(settings["top-right"]?.radius || settings.all.radius);
					finishedStyle.push(settings["bottom-right"]?.radius || settings.all.radius);
					finishedStyle.push(settings["bottom-left"]?.radius || settings.all.radius);

					previewElement.style.borderRadius = finishedStyle.join(' ');
					element.style.borderRadius = finishedStyle.join(' ');
				}

				let previewElement = element.querySelector('[data-preview]');
				if (previewElement != null) {
					element.querySelectorAll('[data-location]')
					.forEach((input) => {
						input.addEventListener('input', () => element.update());
					});
				}
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				for (let corner in theme_object) {
					if (theme_object[corner].radius == null) continue;

					let value = theme_object[corner].radius.slice(0, -2);
					element.querySelector(`[data-location="corners.${corner}.radius"]`).value = value;
				}
				
				if (typeof element.update == 'function') element.update();
			},
			save: function (idCard) {
				let element = idCard.element;
				let component_object = {};

				element.querySelectorAll('[data-location]').forEach((input) => {
					let corner = input.dataset.location.split(".")[1];

					let value = input.value + "px";
					if (input.value == -1) value = null;

					component_object[corner] = {
						radius: value
					};
				});

				return component_object;
			}
		}
	},//corners
	{
		id: "borders",
		parent: {
			all: false,
			headId: 'pages',
			tags: {
				blockElement: true,
				hasBorders: true,
			}
		},
		details: {
			name: "Borders",
			translate: {
				name: 'themeBorders'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content" style="min-width: 260px;display: flex;">
				<div data-preview data-translate="themePreview"
					style="width: min(10rem, 20%);display: flex;background-color: rgba(128,128,128,0.1);margin-right: 1rem;justify-content: center;align-items: center;border-radius: 20px 0;">
					Preview
				</div>
				<div style="flex-grow: 1;">
					<div class="rk-flex rk-space-between rk-center-x">
						<h4 style="width: fit-content;" data-translate="themeBorders">Borders</h4>
						<button class="rk-btn" data-remove-component>-</button>
					</div>
					<div>
						<div class="text-lead rk-flex rk-space-between rk-center-x">
							<span data-translate="themeWidth">Width:</span>
							<input type="range" value="0"
								data-location="borders.all.size" data-type="px" class="form-control input-field" max="10">
						</div>
						<div class="rk-flex rk-space-between rk-center-x">
							<span data-translate="themeStyle">Style:</span>
							<select selected="solid" data-location="borders.all.style" data-type="value">
								<option value="solid" data-translate="themeSolid">Solid</option>
								<option value="double" data-translate="themeDouble">Double</option>
								<option value="dashed" data-translate="themeDashed">Dashed</option>
								<option value="dotted" data-translate="themeDotted">Dotted</option>
								<option value="inset" data-translate="themeInset">Inset</option>
								<option value="outset" data-translate="themeOutset">Outset</option>
								<option value="groove" data-translate="themeGroove">Groove</option>
								<option value="ridge" data-translate="themeRidge">Ridge</option>
							</select>
						</div>
						<div class="text-lead rk-flex rk-space-between rk-center-x">
							<span data-translate="themeColor">Color:</span>
							<input type="color" value="#ffffff"
								data-location="borders.all.color" data-type="color" class="form-control input-field">
						</div>
						<div class="text-lead rk-flex rk-space-between rk-center-x">
							<span data-translate="themeAlpha">Alpha:</span>
							<input type="range" value="100" step="10"
								data-location="borders.all.color" data-type="color-alpha" class="form-control input-field">
						</div>
					</div>
					<div class="rbx-divider" style="margin: 12px;"></div>

					<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
						<label>
							<input type="checkbox" class="accordion__input" style="margin: 5px 10px;float: left;width: auto;" name="contentborders">
							<span class="accordion__label" style="font-weight: 400;" data-translate="themeTBorder">Top Border</span>

							<span data-location="borders.top" class="rk-button receiver-destination-type-toggle off" style="float: right;">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</label>
						<div class="accordion__content">
							<div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeWidth">Width:</span>
									<input type="range" value="0"
										data-location="borders.top.size" data-type="px" class="form-control input-field" max="10">
								</div>
								<div class="rk-flex rk-space-between rk-center-x">
									<span data-translate="themeStyle">Style:</span>
									<select selected="solid" data-location="borders.top.style" data-type="value">
										<option value="solid" data-translate="themeSolid">Solid</option>
										<option value="double" data-translate="themeDouble">Double</option>
										<option value="dashed" data-translate="themeDashed">Dashed</option>
										<option value="dotted" data-translate="themeDotted">Dotted</option>
										<option value="inset" data-translate="themeInset">Inset</option>
										<option value="outset" data-translate="themeOutset">Outset</option>
										<option value="groove" data-translate="themeGroove">Groove</option>
										<option value="ridge" data-translate="themeRidge">Ridge</option>
									</select>
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeColor">Color:</span>
									<input type="color" value="#ffffff"
										data-location="borders.top.color" data-type="color" class="form-control input-field">
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeAlpha">Alpha:</span>
									<input type="range" value="100" step="10"
										data-location="borders.top.color" data-type="color-alpha" class="form-control input-field">
								</div>
							</div>
						</div>
					</div>

					<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
						<label>
							<input type="checkbox" class="accordion__input" style="margin: 5px 10px;float: left;width: auto;" name="contentborders">
							<span class="accordion__label" style="font-weight: 400;" data-translate="themeLBorder">Left Border</span>

							<span data-location="borders.left" class="rk-button receiver-destination-type-toggle off" style="float: right;">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</label>
						<div class="accordion__content">
							<div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeWidth">Width:</span>
									<input type="range" value="0"
										data-location="borders.left.size" data-type="px" class="form-control input-field" max="10">
								</div>
								<div class="rk-flex rk-space-between rk-center-x">
									<span data-translate="themeStyle">Style:</span>
									<select selected="solid" data-location="borders.left.style" data-type="value">
										<option value="solid" data-translate="themeSolid">Solid</option>
										<option value="double" data-translate="themeDouble">Double</option>
										<option value="dashed" data-translate="themeDashed">Dashed</option>
										<option value="dotted" data-translate="themeDotted">Dotted</option>
										<option value="inset" data-translate="themeInset">Inset</option>
										<option value="outset" data-translate="themeOutset">Outset</option>
										<option value="groove" data-translate="themeGroove">Groove</option>
										<option value="ridge" data-translate="themeRidge">Ridge</option>
									</select>
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeColor">Color:</span>
									<input type="color" value="#ffffff"
										data-location="borders.left.color" data-type="color" class="form-control input-field">
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeAlpha">Alpha:</span>
									<input type="range" value="100" step="10"
										data-location="borders.left.color" data-type="color-alpha" class="form-control input-field">
								</div>
							</div>
						</div>
					</div>

					<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
						<label>
							<input type="checkbox" class="accordion__input" style="margin: 5px 10px;float: left;width: auto;" name="contentborders">
							<span class="accordion__label" style="font-weight: 400;" data-translate="themeBBorder">Bottom Border</span>

							<span data-location="borders.bottom" class="rk-button receiver-destination-type-toggle off" style="float: right;">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</label>
						<div class="accordion__content">
							<div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeWidth">Width:</span>
									<input type="range" value="0"
										data-location="borders.bottom.size" data-type="px" class="form-control input-field" max="10">
								</div>
								<div class="rk-flex rk-space-between rk-center-x">
									<span data-translate="themeStyle">Style:</span>
									<select selected="solid" data-location="borders.bottom.style" data-type="value">
										<option value="solid" data-translate="themeSolid">Solid</option>
										<option value="double" data-translate="themeDouble">Double</option>
										<option value="dashed" data-translate="themeDashed">Dashed</option>
										<option value="dotted" data-translate="themeDotted">Dotted</option>
										<option value="inset" data-translate="themeInset">Inset</option>
										<option value="outset" data-translate="themeOutset">Outset</option>
										<option value="groove" data-translate="themeGroove">Groove</option>
										<option value="ridge" data-translate="themeRidge">Ridge</option>
									</select>
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeColor">Color:</span>
									<input type="color" value="#ffffff"
										data-location="borders.bottom.color" data-type="color" class="form-control input-field">
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeAlpha">Alpha:</span>
									<input type="range" value="100" step="10"
										data-location="borders.bottom.color" data-type="color-alpha" class="form-control input-field">
								</div>
							</div>
						</div>
					</div>

					<div style="border-radius: 10px;margin-bottom: 6px;" class="text-lead">
						<label>
							<input type="checkbox" class="accordion__input" style="margin: 5px 10px;float: left;width: auto;" name="contentborders">
							<span class="accordion__label" style="font-weight: 400;" data-translate="themeRBorder">Right Border</span>

							<span data-location="borders.right" class="rk-button receiver-destination-type-toggle off" style="float: right;">
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
						</label>
						<div class="accordion__content">
							<div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeWidth">Width:</span>
									<input type="range" value="0"
										data-location="borders.right.size" data-type="px" class="form-control input-field" max="10">
								</div>
								<div class="rk-flex rk-space-between rk-center-x">
										<span data-translate="themeStyle">Style:</span>
										<select selected="solid" data-location="borders.right.style" data-type="value">
											<option value="solid" data-translate="themeSolid">Solid</option>
											<option value="double" data-translate="themeDouble">Double</option>
											<option value="dashed" data-translate="themeDashed">Dashed</option>
											<option value="dotted" data-translate="themeDotted">Dotted</option>
											<option value="inset" data-translate="themeInset">Inset</option>
											<option value="outset" data-translate="themeOutset">Outset</option>
											<option value="groove" data-translate="themeGroove">Groove</option>
											<option value="ridge" data-translate="themeRidge">Ridge</option>
										</select>
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeColor">Color:</span>
									<input type="color" value="#ffffff"
										data-location="borders.right.color" data-type="color" class="form-control input-field">
								</div>
								<div class="text-lead rk-flex rk-space-between rk-center-x">
									<span data-translate="themeAlpha">Alpha:</span>
									<input type="range" value="100" step="10"
										data-location="borders.right.color" data-type="color-alpha" class="form-control input-field">
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
				.addEventListener("click", () => {
					parentElement.removeComponent(idCard.component);
				});

				let holder = element.querySelector('.section-content');
				element.update = function() {
					let settings = element.save(idCard);
					if (settings == null) return;
					let finishedStyle = [];
					
					// "top","right","bottom","left"
					finishedStyle.push({...settings.all, ...settings["top"]});
					finishedStyle.push({...settings.all, ...settings["right"]});
					finishedStyle.push({...settings.all, ...settings["bottom"]});
					finishedStyle.push({...settings.all, ...settings["left"]});

					previewElement.style.borderWidth = finishedStyle.map(x => x.size).join(" ");
					previewElement.style.borderStyle = finishedStyle.map(x => x.style).join(' ');
					previewElement.style.borderColor = finishedStyle.map(x => x.color).join(' ');

					holder.style.borderWidth = finishedStyle.map(x => x.size).join(" ");
					holder.style.borderStyle = finishedStyle.map(x => x.style).join(' ');
					holder.style.borderColor = finishedStyle.map(x => x.color).join(' ');
				}
					
				let previewElement = element.querySelector('[data-preview]');
				if (previewElement != null) {
					element.querySelectorAll('[data-location]')
					.forEach((input) => {
						if (input.classList.contains('rk-button')) input.addEventListener('switched', () => element.update());
						else input.addEventListener('input', () => element.update());
					});
				}
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				for (let corner in theme_object) {
					if (theme_object[corner] == null) continue;

					let enableSwitch = element.querySelector(`[data-location="borders.${corner}"]`);
					if (enableSwitch != null) {
						page.toggleSwich(enableSwitch, true);
					}

					let edge = theme_object[corner];

					let size = edge.size.slice(0, -2);
					element.querySelector(`[data-location="borders.${corner}.size"]`).value = size;

					element.querySelector(`[data-location="borders.${corner}.style"]`).value = edge.style;

					//load color
					let rawColor = edge.color;
					let splittenColor = rawColor.slice(5).slice(0, -1).split(',');

					element.querySelectorAll(`[data-location="borders.${corner}.color"]`).forEach((input) => {
						if (input.dataset.type == "color") {
							input.value = rgbToHex(splittenColor[0], splittenColor[1], splittenColor[2]);
						}
						if (input.dataset.type == "color-alpha") {
							let alpha = splittenColor[3];
							if (alpha.endsWith('%')) alpha.slice(0, -1);

							if (parseInt(alpha) <= 0) alpha = Number(alpha) * 100;
							else alpha = parseInt(alpha);

							input.value = alpha;
						}
					});
				}
				
				if (typeof element.update == 'function') element.update();
			},
			save: function (idCard) {
				let element = idCard.element;
				let component_object = {};

				let colorCollection = {};

				element.querySelectorAll(`[data-location]`).forEach((input) => {
					let splittenLocation = input.dataset.location.split(".");
					if (splittenLocation.length <= 2) return;

					let edge = splittenLocation[1];
					let part = splittenLocation[2];

					component_object[edge] = component_object[edge] || {};
					colorCollection[edge] = colorCollection[edge] || {};

					//save color
					if (part == 'color') {
						let type = input.dataset.type;

						colorCollection[edge][type] = input.value;

						let edgeColor = colorCollection[edge].color;
						let edgeAlpha = colorCollection[edge]["color-alpha"];

						if (edgeColor && edgeAlpha != null) {
							component_object[edge].color = rgbTorgba(hexToRgb(edgeColor), edgeAlpha);
						}

						return;
					}

					//save style
					else if (part == 'style') {
						component_object[edge][part] = input.value;
						return;
					}

					//save style
					else if (part == 'size') {
						component_object[edge][part] = input.value + "px";
						return;
					}
				});

				element.querySelectorAll(`[data-location]`).forEach((input) => {
					let splittenLocation = input.dataset.location.split(".");
					if (splittenLocation.length >= 3) return;

					let edge = splittenLocation[1];
					let isEnabled = page.getSwich(input);

					if (isEnabled == false) component_object[edge] = null;
				});

				return component_object;
			},
			isEmpty: function (theme_object) {
				let currentlyEmpty = true;

				for (let edgeName in theme_object) {
					const edge = theme_object[edgeName];
					if (edge == null) continue;

					currentlyEmpty = false;
					break;
				}

				return currentlyEmpty;
			}
		}
	},//borders

	{
		id: "all",
		tags: ["page"],
		parent: {
			ids: {
				pages: true
			}
		},
		details: {
			name: "All Pages",
			description: "Default components for all pages."
		},
		element: defaultcomponentElements.horizantalGroup
	},//all
	{
		id: "home",
		tags: ["page"],
		parent: {
			ids: {
				pages: true
			}
		},
		details: {
			name: "Home Page"
		},
		element: defaultcomponentElements.horizantalGroup
	},//home
	{
		id: "game",
		tags: ["page"],
		parent: {
			ids: {
				pages: true
			}
		},
		details: {
			name: "Game Page",
			translate: {
				name: 'categoryGamePage'
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//game
	{
		id: "users",
		tags: ["page"],
		parent: {
			ids: {
				pages: true
			}
		},
		details: {
			name: "User Page"
		},
		element: defaultcomponentElements.horizantalGroup
	},//users
	{
		id: "groups",
		tags: ["page"],
		parent: {
			ids: {
				pages: true
			}
		},
		details: {
			name: "Group Page"
		},
		element: defaultcomponentElements.horizantalGroup
	},//groups
	{
		id: "avatarpage",
		tags: ["page","no-gamecards"],
		parent: {
			ids: {
				pages: true
			}
		},
		details: {
			name: "Avatar Page"
		},
		element: defaultcomponentElements.horizantalGroup
	},//avatarpage
	{
		id: "catalog",
		tags: ["page","no-gamecards"],
		parent: {
			ids: {
				pages: true
			}
		},
		details: {
			name: "Catalog Page"
		},
		element: defaultcomponentElements.horizantalGroup
	},//catalog
	{
		id: "content",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "Page's Content",
			description: "Edits the middle block that holds page content.",
			translate: {
				name: "themePageContent",
				description: "themePageContentDesc"
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//content
	{
		id: "menu",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "Page's Menu",
			description: "Edits the top, left and bottom navigation bars all togeather."
		},
		element: defaultcomponentElements.horizantalGroup
	},//menu
	{
		id: "icon",
		tags: ["hasBackground"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "Header Wide Logo",
			description: "Edits the 'ROBLOX' logo on top right of site.",
			translate: {
				name: "componmentIcon",
				description: "componmentIconDesc"
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//icon
	{
		id: "iconr",
		tags: ["hasBackground"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "Header Short Logo",
			description: "Edits the 'O' logo on top right of site.",
			translate: {
				name: "componmentIconR",
				description: "componmentIconRDesc"
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//iconr
	{
		id: "popup",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "Popups",
			description: "Edits any modal or popup.",
		},
		element: defaultcomponentElements.horizantalGroup
	},//popup
	{
		id: "gamesection",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "Game Section",
			description: "Edits around a group of game cards.",
		},
		element: defaultcomponentElements.horizantalGroup
	},//gamesection
	{
		id: "peoplesection",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "Profiles Section",
			description: "Edits around a group of profile cards.",
		},
		element: defaultcomponentElements.horizantalGroup
	},//peoplesection
	{
		id: "group",
		tags: ["blockElement"],
		parent: {
			ids: {
				groups: true
			}
		},
		details: {
			name: "Group Header",
			description: "Edits group header, groups list and group buttons all togeather."
		},
		element: defaultcomponentElements.horizantalGroup
	},//group
	{
		id: "profile",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			ids: {
				users: true
			}
		},
		details: {
			name: "Profile Header",
			description: "Edits profile header, profile blocks of information (avatar, badges, etc.), profile buttons and friend list all togeather."
		},
		element: defaultcomponentElements.horizantalGroup
	},//profile
	{
		id: "avatar",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			tags: {
				page: true
			}
		},
		details: {
			name: "User Avatars",
			description: "Edits all circular user avatars."
		},
		element: defaultcomponentElements.horizantalGroup
	},//avatar
	{
		id: "avatareditor",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			ids: {
				avatarpage: true
			}
		},
		details: {
			name: "Avatar Preview"
		},
		element: defaultcomponentElements.horizantalGroup
	},//avatareditor
	{
		id: "quickgamejoin",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			tags: {
				page: true,
				"no-gamecards": false
			}
		},
		details: {
			name: "Quick Join Button",
			description: "Edits the join button created by 'Quick Join Button' feature which is shown on game cards."
		},
		element: defaultcomponentElements.horizantalGroup
	},//quickgamejoin
	{
		id: "gameplay",
		tags: ["blockElement"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Play Game Button"
		},
		element: defaultcomponentElements.horizantalGroup
	},//gameplay
	{
		id: "badge",
		tags: ["blockElement", "hasBrightnDarkColors"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Badge"
		},
		element: defaultcomponentElements.horizantalGroup
	},//badge
	{
		id: "colors",
		parent: {
			headId: 'pages',
			ids: {
				badge: true,
				menu: true,
			},
			tags: {
				hasBrightnDarkColors: true
			}
		},
		details: {
			name: "Text Color",
			translate: {
				name: 'themeTxtColor'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content">
				<div class="rk-flex rk-space-between rk-center-x">
					<h4 style="width: fit-content;" data-translate="themeTxtColor">Text Color</h4>
					<button class="rk-btn" data-remove-component>-</button>
				</div>

				<div class="text-lead rk-flex rk-space-between rk-center-x">
					<span style="min-width: fit-content;" data-translate="themeBrtColor">Bright Color:</span>
					<input type="color" value="#ffffff"
						data-location="colors.bright" data-type="value" class="form-control input-field">
				</div>
				
				<div class="text-lead rk-flex rk-space-between rk-center-x">
					<span style="min-width: fit-content;" data-translate="themeDrkColor">Dark Color:</span>
					<input type="color" value="#bdbebe"
						data-location="colors.dark" data-type="value" class="form-control input-field">
				</div>

			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
					.addEventListener("click", () => {
						parentElement.removeComponent(idCard.component);
					});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				element.querySelector(`[data-location="colors.bright"]`).value = theme_object.bright;
				element.querySelector(`[data-location="colors.dark"]`).value = theme_object.dark;
			},
			save: function (idCard) {
				let element = idCard.element;

				return {
					bright: element.querySelector(`[data-location="colors.bright"]`).value,
					dark: element.querySelector(`[data-location="colors.dark"]`).value
				};
			}
		}
	},//colors - 2
	{
		id: "colors2",
		parent: {
			headId: 'pages',
			ids: {
				content: true
			},
		},
		details: {
			name: "Text Color",
			translate: {
				name: 'themeTxtColor'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content">
				<div class="rk-flex rk-space-between rk-center-x">
					<h4 style="width: fit-content;" data-translate="themeTxtColor">Text Color</h4>
					<button class="rk-btn" data-remove-component>-</button>
				</div>

				<div class="text-lead rk-flex rk-space-between rk-center-x">
					<span style="min-width: fit-content;">Header Color:</span>
					<input type="color" value="#ffffff"
						data-location="colors.bright" data-type="value" class="form-control input-field">
				</div>
				<div class="text-lead rk-flex rk-space-between rk-center-x">
					<span style="min-width: fit-content;">Title Color:</span>
					<input type="color" value="#ffffff"
						data-location="colors.bright2" data-type="value" class="form-control input-field">
				</div>
				
				<div class="text-lead rk-flex rk-space-between rk-center-x">
					<span style="min-width: fit-content;">Content Color:</span>
					<input type="color" value="#bdbebe"
						data-location="colors.dark" data-type="value" class="form-control input-field">
				</div>

			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
					.addEventListener("click", () => {
						parentElement.removeComponent(idCard.component);
					});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				element.querySelector(`[data-location="colors.bright"]`).value = theme_object.primary;
				element.querySelector(`[data-location="colors.bright2"]`).value = theme_object.primary2;
				element.querySelector(`[data-location="colors.dark"]`).value = theme_object.secondary;
			},
			save: function (idCard) {
				let element = idCard.element;

				return {
					primary: element.querySelector(`[data-location="colors.bright"]`).value,
					primary2: element.querySelector(`[data-location="colors.bright2"]`).value,
					secondary: element.querySelector(`[data-location="colors.dark"]`).value
				};
			}
		}
	},//colors2 - 2 primary 1 secondary
	{
		id: "pagenav",
		tags: ["blockElement", "hasColor"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Game Page Navigator",
			description: "Edits the navigation button under servers list"
		},
		element: defaultcomponentElements.horizantalGroup
	},//pagenav
	{
		id: "color",
		parent: {
			headId: 'pages',
			ids: {
				pagenav: true
			},
			tags: {
				hasColor: true
			}
		},
		details: {
			name: "Text Color",
			translate: {
				name: 'themeTxtColor'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content">
				<div class="rk-flex rk-space-between rk-center-x">
					<h4 style="width: fit-content;" data-translate="themeTxtColor">Text Color</h4>
					<button class="rk-btn" data-remove-component>-</button>
				</div>

				<input type="color" value="#ffffff"
						data-location="color" data-type="value" class="form-control input-field"
						style="width: 100%;margin: 0;">
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
					.addEventListener("click", () => {
						parentElement.removeComponent(idCard.component);
					});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				if (theme_object.startsWith("#")) element.querySelector(`[data-location="color"]`).value = theme_object;
				else element.querySelector(`[data-location="color"]`).value = rgbToHex(...Object.values(rgbaTovar(theme_object)));
			},
			save: function (idCard) {
				let element = idCard.element;

				return hexToRgb(element.querySelector(`[data-location="color"]`).value);
			}
		}
	},//color
	{
		id: "button",
		tags: ["blockElement"],
		parent: {
			tags: {
				hasButton: true
			}
		},
		details: {
			name: "Button"
		},
		element: defaultcomponentElements.horizantalGroup
	},//button
	{
		id: "defaultserver",
		tags: ["blockElement", "hasButton"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Default Server",
			description: "Default Components for Servers."
		},
		element: defaultcomponentElements.horizantalGroup
	},//defaultserver
	{
		id: "column",
		parent: {
			headId: 'pages',
			tags: {
				server: true
			}
		},
		details: {
			name: "Column Count",
		},
		element: {
			html: /*html*/`
			<div class="section-content">
				<div class="rk-flex rk-space-between rk-center-x">
					<span style="min-width: fit-content;margin: 0 5px 5px 0px;" data-translate="themeSvrPerRow">Servers Per Row:</span>
					<button class="rk-btn" data-remove-component>-</button>
				</div>
				
				<input type="range" value="5"
					data-location="column" data-type="value" class="form-control input-field" max="8" style="width: 100%;margin: 0;">
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
					.addEventListener("click", () => {
						parentElement.removeComponent(idCard.component);
					});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				element.querySelector(`[data-location="column"]`).value = theme_object;
			},
			save: function (idCard) {
				let element = idCard.element;

				return element.querySelector(`[data-location="column"]`).value;
			}
		}
	},//column
	{
		id: "gap",
		parent: {
			headId: 'pages',
			tags: {
				server: true
			}
		},
		details: {
			name: "Gap Between Servers",
		},
		element: {
			html: /*html*/`
			<div class="section-content">
				<div class="rk-flex rk-space-between rk-center-x">
					<span style="min-width: fit-content;margin: 0 5px 0px 0px;" data-translate="themeSvrGap">Servers Gap:</span>
					<button class="rk-btn" data-remove-component>-</button>
				</div>
				
				<input type="range" value="0.3" step="0.1"
					data-location="gap" data-type="percent" class="form-control input-field" max="2"
					style="width: 100%;margin: 0;">
			</div>`,
			js: function (idCard, parentElement) {
				let element = idCard.element;

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
					.addEventListener("click", () => {
						parentElement.removeComponent(idCard.component);
					});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				element.querySelector(`[data-location="gap"]`).value = theme_object.slice(0, -1);
			},
			save: function (idCard) {
				let element = idCard.element;

				return element.querySelector(`[data-location="gap"]`).value + '%';
			}
		}
	},//gap
	{
		id: "publicserver",
		tags: ["blockElement", "hasButton", "server"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Public Server",
			translate: {
				name: 'serversPublic'
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//publicserver
	{
		id: "smallserver",
		tags: ["blockElement", "hasButton", "server"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Small Server",
			translate: {
				name: 'serversSmall'
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//smallserver
	{
		id: "friendsserver",
		tags: ["blockElement", "hasButton", "hasColor", "server"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Friends Server",
			translate: {
				name: 'serversFriends'
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//friendsserver
	{
		id: "privateserver",
		tags: ["blockElement", "hasButton", "hasColor", "server"],
		parent: {
			headId: 'pages',
			ids: {
				game: true
			}
		},
		details: {
			name: "Private Server",
			translate: {
				name: 'serversPrivate'
			}
		},
		element: defaultcomponentElements.horizantalGroup
	},//privateserver
]; //list of editable elements


function FetchImage(url, quick) {
	return new Promise(resolve => {
		BROWSER.runtime.sendMessage({about: "getImageRequest", url: url, quick: quick}, 
		function(data) {
			resolve(data)
		})
	})
}



//SECTION - ThemeManager

Designer.LoadThemesData = async function() {
	// update selected theme text
	let themeType = 
	document.querySelector("#currentthemeplace").textContent = Rkis.Designer.GetPageTheme()?.name || "Default Theme";

	Designer.LoadCustomThemesData();
	Designer.LoadDefaultThemesData();
	Designer.LoadBrowseThemesData();
}

Designer.LoadCustomThemesData = async function() {
	var customthemesholder = await document.$watch("#customthemesholder").$promise();
	customthemesholder.innerHTML = "";

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Theme = wholedata.Designer.Theme || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	const loadedTheme = Rkis.Designer.GetPageTheme();
	let loadedCustomThemeId = -1;
	if (loadedTheme && loadedTheme.type == "saved") {
		loadedCustomThemeId = parseInt(loadedTheme.themeId);
	}

	var letterNumber = /^[\s0-9a-zA-Z-_]+$/g;

	for(var i = 0; i < Designer.MaxCustomThemes; i++) {
		var theme = wholedata.Designer.Themes[i];
		//name.match(letterNumber), desc.match(letterNumber)
		if(theme != null) {
			var daname = theme.name.match(letterNumber);
			var dadesc = theme.description.match(letterNumber);
			if(theme.description == "") dadesc = [""];

			var fileSize = JSON.stringify(theme).length;
			var fileSizeText = 'b';

			if(fileSize > 1024) {
				fileSize /= 1024;
				fileSizeText = 'Kb';
			}
			if(fileSize > 1024) {
				fileSize /= 1024;
				fileSizeText = 'Mb';
			}
			if(fileSize > 1024) {
				fileSize /= 1024;
				fileSizeText = 'Gb';
			}
			fileSize = Math.floor(fileSize);

			customthemesholder.innerHTML += `
				<div class="theme-template" style="${loadedCustomThemeId == i ? "outline: 2px solid rgb(57 184 61);": ""}">
					<div>
						<div>${daname ? daname[0] : Rkis.language["error"]}</div>
						<span>${dadesc ? dadesc[0] : Rkis.language["error"]}</span>
					</div>
					<div style="margin-left: auto;"></div>
					<span style="font-size: 12px;font-weight: 100;margin-right: 1%;">(${fileSize} ${fileSizeText})</span>
					<button class="designer-btn export" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 59 184);color: rgb(35 37 39);font-size: 20px;">⤓</button>
					<button class="designer-btn delete" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(184 59 61);color: rgb(35 37 39);font-weight: 600;">X</button>
					<button class="designer-btn edit" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 184 61);color: rgb(35 37 39);" data-translate="btnEdit">Edit</button>
					<button class="designer-btn select" data-theme="${daname ? daname[0] : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" style="background-color: rgb(57 59 61);color: white;${theme.all == null && theme.pages?.all == null ? "display: none;" : ""}" data-translate="btnSelect">Select</button>
				</div>`;
		}
		else {
			if (i != 0) continue;
			customthemesholder.innerHTML += `
				<div class="theme-template">
					<div>
						<div>${Rkis.language.get("themeSlotNumber", i + 1)}</div>
						<span></span>
					</div>
					<div style="margin-left: auto;"></div>
					<button class="designer-btn create" style="background-color: rgb(57 184 61);color: rgb(35 37 39);" data-translate="btnCreate">Create</button>
				</div>`;
		}
	}

	if (wholedata.Designer.Themes.length < 5) {
		const createButton = HTMLParser('<button class="theme-template-button" data-designer-func="create" style="background-color: rgb(57 184 61);color: rgb(35 37 39);border-radius: 2rem;position: absolute;top: .5rem;right: 1rem;"  data-translate="btnCreate">', "Create");
		customthemesholder.prepend(createButton);
	}
}

Designer.LoadDefaultThemesData = async function() {
	var defaultthemesholder = await document.$watch("#rk-default-theme-list").$promise();
	defaultthemesholder.innerHTML = "";

	for(var i = 0; i < Rkis.Designer.DefaultThemes.length; i++) {
		var theme = Rkis.Designer.DefaultThemes[i];

		var daname = escapeHTML(theme.name);
		var dadesc = escapeHTML(theme.description);

		defaultthemesholder.innerHTML += `
			<div class="default-theme-template">
				<div>
					<div>${daname ? daname : Rkis.language["error"]}</div>
					<span>${dadesc ? dadesc : ""}</span>
				</div>
				<div style="margin-left: auto;"></div>
				<button class="designer-btn select" data-theme="${daname ? daname : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
			</div>`;
	}
}

Designer.BrowseThemeList = [];
Designer.LoadBrowseThemesData = async function() {
	var browsethemesholder = await document.$watch("#rk-browse-theme-list").$promise();
	if (Designer.BrowseThemeList.length != 0) return;

	let themes = await fetch("https://ameerdotexe.github.io/roblokis/data/themes/top.json")
	.then(res => res.json())
	.catch(() => []);

	if (themes == null || themes.length == 0) return;

	browsethemesholder.innerHTML = "";
	Designer.BrowseThemeList = themes;

	for(var i = 0; i < themes.length; i++) {
		var theme = themes[i];

		let themeUrl = theme.link.file || theme.link.dark;
		if (themeUrl == null) continue;

		var daname = escapeHTML(theme.name);
		var dadesc = escapeHTML(`Author: ${theme.author}`);

		browsethemesholder.innerHTML += `
			<div class="default-theme-template">
				<div>
					<div>${daname ? daname : Rkis.language["error"]}${theme.animated ? ` <span style="border: 1px solid;border-radius: 4px;padding: 1px 3px;color: cornflowerblue;">Animated</span>` : ''}</div>
					<span>${dadesc ? dadesc : Rkis.language["error"]}</span>
				</div>
				<div style="margin-left: auto;"></div>
				<button class="designer-btn select" data-theme="${daname ? daname : Rkis.language["error"]}" data-themeid="${i}" data-isdefaulttheme="false" data-type="remote" data-extra="${escapeHTML(themeUrl)}">Try</button>
				<button data-designer-func="add-remote-theme" data-themenum="${i}">Import</button>
			</div>`;
	}
}

Designer.SaveNewTheme = async function(name, desc, themedata, options = {}) {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	if(wholedata.Designer.Themes.length >= Designer.MaxCustomThemes) return {error: Rkis.language["errorMaxSlots"]};

	var existingtheme = wholedata.Designer.Themes.find(x => x.name == name);
	if(existingtheme != null) return {error: Rkis.language["errorNameExist"]};

	var themetemplate = await fetch(Rkis.fileLocation + "js/Theme/Tamplate.Roblokis")
	.then(response => response.json())
	.catch(err => {console.error(err); return {};})

	var thenewtheme = {
		name: name,
		description: desc,
		start_version: Rkis.version,
		current_version: Rkis.version
	};

	let isOlderThenTemplate = Rkis.versionCompare("4.0.0.23", themedata.current_version) === 1;
	themedata.pages = themedata.pages || {};
	for (let page in themedata) {
		if (themedata[page].css == null) continue;

		themedata.pages[page] = themedata[page].css;
		delete themedata[page];
	}

	if(themedata != null) thenewtheme = jsonConcat(themedata, thenewtheme);
	let finalFile = thenewtheme; //compare with latest template edit version
	if (options.skipTemplate !== true || isOlderThenTemplate === true) finalFile = jsonConcat(themetemplate, thenewtheme);

	wholedata.Designer.Themes.push(finalFile);

	Rkis.wholeData = wholedata;
	Rkis.database.save();

	return {};
	
}

Designer.SelectThemeButton = function(button) {
	if(button == null) return;

	Designer.Selected.name = button.dataset.theme;
	Designer.Selected.id = button.dataset.themeid;
	Designer.Selected.type = button.dataset.type;
	Designer.Selected.extra = button.dataset.extra;
	Designer.Selected.isDefaultTheme = button.dataset.isdefaulttheme != "false";

	Rkis.wholeData.Designer = Rkis.wholeData.Designer || {};
	Rkis.wholeData.Designer.Theme = {...Designer.Selected};

	Rkis.database.save();

	Designer.LoadThemesData();

	localStorage.removeItem('rkis-temp-theme');
	Designer.ThemeEditor.liveThemeAutoReset = null;
	Designer.ThemeEditor.isLivePreview = false;
	page.toggleSwich(document.querySelector('#rkpage .main .themes [data-designer-func="livepreview"]'), false);
}

Designer.CreateNewTheme = async function(button) {
	button.disabled = true;
	button.style.opacity = "0.5";

	var tabPage = button.closest(".rk-tab-page");

	var newthemename = tabPage.querySelector("#newtheme-name");
	var newthemedesc = tabPage.querySelector("#newtheme-desc");
	var newthemeimage = tabPage.querySelector("#newtheme-image");
	var newthemefile = tabPage.querySelector("#newtheme-file");
	var errorplace = tabPage.querySelector("#newtheme-error");
	
	var themename = "";
	var	themedesc = "";
	var filetheme = null;
	var themeimage = null;

	//if has name/description then just put them
	if (newthemename != null) themename = newthemename.value;
	if (newthemedesc != null) themedesc = newthemedesc.value;
	if (newthemeimage != null) themeimage = newthemeimage.value;

	if (newthemefile != null) {
		try{
			if(newthemefile.files.length > 0) {
				filetheme = JSON.parse(await newthemefile.files[0].text())
			}
		}catch{}
	}

	if(filetheme != null) {
		if(themename == "") {
			themename = filetheme.name;
		}

		if(themedesc == "") {
			themedesc = filetheme.description;
		}
	}

	var safetycheck = await Designer.TestThemeDetails(themename, themedesc, themeimage);

	if (filetheme == null) {
		if (newthemeimage != null) filetheme = {"pages":{"all":{"background":{
			"color": "rgba(25,27,29,100%)",
			"image":{
				"link": themeimage,
				"attachment": "fixed",
				"repeat": "round",
				"size": "contain",
			}
		}}}};
		filetheme = filetheme || {};
		filetheme.isDark = document.body.classList.contains('dark-theme');
	}

	if (safetycheck.error == null) safetycheck = await Designer.SaveNewTheme(themename, themedesc, filetheme);
	if (safetycheck.error != null) {
		errorplace.textContent = safetycheck.error;

		button.disabled = false;
		button.style.opacity = "1";

		return;
	}

	Designer.LoadThemesData();

	document.querySelector("#rk-createthemesection").style.display = "none";
	errorplace.textContent = "";

	button.disabled = false;
	button.style.opacity = "1";
}

Designer.TestThemeDetails = async function(name, desc, imageUrl) {
	if(name == null) name = "";
	if(desc == null) desc = "";

	if(
		name.length > 24 ||
		name.length < 3
	) {
		return {error: Rkis.language["errorNameLength"]};
	}
	if( desc.length > 36 ) {
		return {error: Rkis.language["errorDescLength"]};
	}

	var letterNumber = /^[\s0-9a-zA-Z-_]+$/;
	//console.log(!letterNumber.test(name), (desc != "" ? !letterNumber.test(desc) : false));
	if(!letterNumber.test(name) || (desc != "" ? !letterNumber.test(desc) : false)) {
		return {error: Rkis.language["errorAtoZ"]};
	}

	if (imageUrl != null) {
		if (imageUrl == "" || imageUrl.toLowerCase().startsWith("https") == false) return {error: Rkis.language["errorNoImage"]};

		var result = await FetchImage(imageUrl, true);
		if (result == null || result == imageUrl) return {error: Rkis.language["cantImage"]};

		return {image: result};
	}
	
	return {};
}

Designer.ExportTheme = function(button, themename, themeId) {
	button.disabled = true;
	button.style.opacity = "0.5";

	if(isNaN(themeId)) {
		button.disabled = false;
		button.style.opacity = "1";
		return;
	}

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var theme = wholedata.Designer.Themes[themeId];

	if(theme == null) {
		button.disabled = false;
		button.style.opacity = "1";
		return;
	}

	makeTextFile(JSON.stringify(theme), themename + ".roblokis");

	button.disabled = false;
	button.style.opacity = "1";
}

Designer.DeleteTheme = function(themename, themeId) {
	document.querySelector("#deletetheme-button").dataset.themeid = themeId;
	document.querySelector("#deletetheme-themename").textContent = themename;
	document.querySelector("#rk-deletethemesection").style.display = "flex";
}

Designer.DeleteTheTheme = function(button) {
	button.disabled = true;
	button.style.opacity = "0.5";

	if(button.dataset.themeid == null || button.dataset.themeid == "") {
		document.querySelector("#rk-deletethemesection").style.display = "none";
		button.disabled = false;
		button.style.opacity = "1";
		return;
	}

	var themeId = Number(button.dataset.themeid);
	if(isNaN(themeId)) {
		document.querySelector("#rk-deletethemesection").style.display = "none";
		button.disabled = false;
		button.style.opacity = "1";
		return;
	}

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	if(wholedata.Designer.Themes[themeId] != null)
		wholedata.Designer.Themes.splice(themeId, 1);

	Rkis.wholeData = wholedata;
	Rkis.database.save();

	Designer.LoadThemesData();

	document.querySelector("#rk-deletethemesection").style.display = "none";
	button.disabled = false;
	button.style.opacity = "1";
}

Designer.EditTheme = function(themeId) {
	Designer.ThemeEditor.themeId = themeId;

	Designer.ThemeEditor.Load();
	document.querySelector("#rk-editthemesection").style.display = "flex";
}

//END SECTION ThemeManager



//SECTION - ThemeEditor

Designer.ThemeEditor = Designer.ThemeEditor || {};

Designer.ThemeEditor.Save = async function() {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var theme = wholedata.Designer.Themes[Designer.ThemeEditor.themeId];
	if(theme == null) return;

	var pagestab = document.querySelector(`[data-editthemetabs="pages"]`);
	theme.pages = pagestab.save();
	
	var stylestab = document.querySelector(`[data-editthemetabs="styles"]`);
	theme.styles = stylestab.save();

	theme.current_version = Rkis.version;

	let newName = document.querySelector(`#rk-editor-name`).value;
	let newDesc = document.querySelector(`#rk-editor-desc`).value;

	let detailsCheck = await Designer.TestThemeDetails(newName, newDesc);

	if (detailsCheck.error == null) {
		theme.name = newName;
		theme.description = newDesc;
	} else Rkis.Toast(detailsCheck.error);

	theme.isDark = document.querySelector(`#rk-editor-theme-dark`).classList.contains('rk-white');

	for (let page in theme) {
		if (theme[page].css == null) continue;

		delete theme[page];
	}
	
	//console.log(`Saving:`, theme);

	wholedata.Designer.Themes[Designer.ThemeEditor.themeId] = theme;

	Rkis.wholeData = wholedata;
	Rkis.database.save();

	Designer.LoadThemesData();
	document.querySelector("#rk-editthemesection").style.display = "none";
}

Designer.ThemeEditor.SaveOld = function() {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var theme = wholedata.Designer.Themes[Designer.ThemeEditor.themeId];
	if(theme == null) return;

	var allThemeTabs = document.querySelectorAll(`[data-editthemetabs]`);
	for(var tabindex = 0; tabindex < allThemeTabs.length; tabindex++) {
		var tab = allThemeTabs[tabindex];
		if(tab.dataset.editthemetabs == null || tab.dataset.editthemetabs == "") return;
		if(theme[tab.dataset.editthemetabs] == null || theme[tab.dataset.editthemetabs].css == null)
			theme[tab.dataset.editthemetabs] = {css: {}};

		var allInputs = tab.querySelectorAll(`[data-location][data-type]`);
		for(var inputindex = 0; inputindex < allInputs.length; inputindex++) {
			var input = allInputs[inputindex];
			if(input.dataset.location == null || input.dataset.location == "") continue;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;
			var newplace = theme[tab.dataset.editthemetabs].css;
			var stringplace = "null";

			for (var i = 0; i < placewithoutdots.length && newplace != null; i++) {
				newplace = newplace[placewithoutdots[i]];
			}

			for (var i = 0; i < placewithoutdots.length; i++) {
				stringplace = stringplace.replace("null" ,`{"${placewithoutdots[i]}":null}`);
			}

			var valueToInput = input.value;
			var valueData = Designer.ThemeEditor.GetTypeValue(input.dataset.type, valueToInput, newplace);

			stringplace = stringplace.replace("null", JSON.stringify(valueData));

			var jsonplace = null;

			try {
				jsonplace = JSON.parse(stringplace);
			}
			catch {}

			theme[tab.dataset.editthemetabs].css = jsonConcat(place, jsonplace);
		}


		if(theme[tab.dataset.editthemetabs] == null || theme[tab.dataset.editthemetabs].css == null) {
			theme[tab.dataset.editthemetabs] = {css: {}};
		}

		tab.querySelectorAll(`[data-location][data-enabled]`).forEach(input => {
			if(input.dataset.location == null) return;

			if(page.getSwich(input)) return;

			if(theme[tab.dataset.editthemetabs] == null) return;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;
			var stringplace = "null";

			for(var i = 0; i < placewithoutdots.length; i++) {
				stringplace = stringplace.replace("null" ,`{"${placewithoutdots[i]}":null}`);
			}

			var jsonplace = null;

			try {
				jsonplace = JSON.parse(stringplace);
			}
			catch {}

			theme[tab.dataset.editthemetabs].css = jsonConcat(place, jsonplace);
		})
	}

	theme.current_version = Rkis.version;

	wholedata.Designer.Themes[Designer.ThemeEditor.themeId] = theme;

	Rkis.wholeData = wholedata;
	Rkis.database.save();

	document.querySelector("#rk-editthemesection").style.display = "none";
}

Designer.ThemeEditor.Load = function() {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var theme = wholedata.Designer.Themes[Designer.ThemeEditor.themeId];
	if(theme == null) return;

	document.$triggerCustom("designer-edittheme-loading");

	//console.log(`Loading:`, theme);

	document.querySelector(`#rk-editor-name`).value = theme.name;
	document.querySelector(`#rk-editor-desc`).value = theme.description;

	let isDark = theme.isDark != false;
	let themeButtons = [
		document.querySelector(`#rk-editor-theme-dark`),
		document.querySelector(`#rk-editor-theme-light`)
	];
	
	themeButtons[0].classList.toggle('rk-white', isDark);
	themeButtons[1].classList.toggle('rk-white', !isDark);

	if (themeButtons[0].isListening != true) {
		themeButtons.forEach((x, i) => {
			x.isListening = true;
			x.addEventListener("click", () => {
				if (x.classList.contains('rk-white')) return;
				x.classList.add('rk-white');

				let otherIndex = (i+1) % 2;
				themeButtons[otherIndex].classList.remove('rk-white');
			});
		});
	}

	var pagestab = document.querySelector(`[data-editthemetabs="pages"]`);
	var stylestab = document.querySelector(`[data-editthemetabs="styles"]`);
	
	if (theme.pages != null) pagestab.load(theme.pages);
	else {
		let pages_object = {};

		for (let page in theme) {
			if (theme[page].css == null) continue;

			pages_object[page] = theme[page].css;
		}

		pagestab.load(pages_object);
	}

	if (theme.styles != null) {
		theme.styles = theme.styles || {};

		let changeOldFormat = function(styleLoc) {
			if (styleLoc == null) return null;
			if (typeof styleLoc.type != "undefined") return styleLoc;
			for (let style in styleLoc) {
				if (style == "type") return styleLoc;
				if (typeof styleLoc[style] == "string") {
					styleLoc[style] = {
						type: styleLoc[style],
						options: null
					};
					continue;
				}
				
				styleLoc[style] = changeOldFormat(styleLoc[style]);
			}
			return styleLoc
		}

		theme.styles = changeOldFormat(theme.styles);
	}
	
	if (theme.styles != null) stylestab.load(theme.styles);

	document.$triggerCustom("designer-edittheme-loaded");
}

Designer.ThemeEditor.LoadOld = function() {
	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var theme = wholedata.Designer.Themes[Designer.ThemeEditor.themeId];
	if(theme == null) return;

	document.$triggerCustom("designer-edittheme-loading");

	document.querySelectorAll('[data-editthemetabs]').forEach((tab, tabindex, tablist) => {
		if(tab.dataset.editthemetabs == null || tab.dataset.editthemetabs == "") return;
		if(theme[tab.dataset.editthemetabs] == null || theme[tab.dataset.editthemetabs].css == null) return;

		tab.querySelectorAll('[data-location][data-type]').forEach(input => {
			if(input.dataset.location == null || input.dataset.location == "") return;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;

			for(var i = 0; i < placewithoutdots.length && place != null; i++) {
				place = place[placewithoutdots[i]];
			}

			if(place == null && input.dataset.type != "corner") {
				if(input.getAttribute("value") != null) return input.value = input.getAttribute("value");
				if(input.getAttribute("selected") != null) return input.value = input.getAttribute("selected");
				return; //make this set value to default
			}

			input.value = Designer.ThemeEditor.GetValueToType(input.dataset.type, place);
			//input.$triggerCustom("input");
		})

		tab.querySelectorAll('[data-location][data-enabled]').forEach((input, theindex, thelist) => {
			if(input.dataset.location == null) return;

			var placewithoutdots = input.dataset.location.split(".");
			var place = theme[tab.dataset.editthemetabs].css;

			for(var i = 0; i < placewithoutdots.length && place != null; i++) {
				place = place[placewithoutdots[i]];
			}

			if(input.dataset.enabled == "switch") page.toggleSwich(input, place != null);
			//input.$triggerCustom("input");
		})
	})


	document.$triggerCustom("designer-edittheme-loaded");
}

Designer.ThemeEditor.GetTypeValue = function(type, value, place) {
	if(type == null || type == "" || type == "value") return value;

	if(type == "color") return hexToRgb(value);
	if(type == "color-alpha") return place != null ? rgbTorgba(place, value) : value;

	if(type == "corner" && value == "-1") return null;
	if(type == "corner") return value + "px";

	if(type == "px") return value + "px";
	if(type == "percent") return value + "%";
}

Designer.ThemeEditor.GetValueToType = function(type, value) {
	if(type == null || type == "" || type == "value") return value;

	if(type == "color") return rgbToHex(rgbaTovar(value).r, rgbaTovar(value).g, rgbaTovar(value).b);
	if(type == "color-alpha") return rgbaTovar(value).a;

	if(type == "corner" && value == null) return "-1";
	if(type == "corner") return value.replace("px", "");

	if(type == "px") return value.replace("px", "");
	if(type == "percent") return value.replace("%", "");
}

Designer.ThemeEditor.SelectTab = function(tab) {
	if(tab.dataset.editthemetab == null || tab.dataset.editthemetab == "") return;

	var tabdiv = document.querySelector(`[data-editthemetabs="${tab.dataset.editthemetab}"]`);
	if(tabdiv == null) return;

	document.querySelectorAll('[data-editthemetab]').forEach(tabs => {tabs.classList.remove("active");})
	document.querySelectorAll('[data-editthemetabs]').forEach(tabsdiv => {tabsdiv.style.display = "none";})

	tab.classList.add("active");
	tabdiv.style.display = "";
	Designer.ThemeEditor.ActiveTab = tabdiv;
}

Designer.ThemeEditor.setupComponentsManager = function(btn) {
	let isIdBtn = true;
	let isTagBtn = true;
	let hasHeadId = true;

	// Checks if the component has an id.
	let id = btn.dataset.componentId || btn.dataset.headComponentId;
	if (id == null || id == "") {
		isIdBtn = false;
	}

	// Checks if a component has any tags.
	let tags = btn.componentTags;
	if (tags == null || tags.length == 0) {
		isTagBtn = false;
	}

	// Exit if couldn't identify the element
	if (isIdBtn == false && isTagBtn == false) return;

	let headId = btn.dataset.headId || btn.dataset.headComponentId;
	if (headId == null || headId == "") {
		hasHeadId = false;
	}

	// Find usable components
	let components = designerComponents.filter(x => {
		let pass = x.parent.all ?? false;

		if (hasHeadId == true && x.parent.headId != null) {
			if (x.parent.headId != headId) return false;
		}

		if (isIdBtn == true && x.parent.ids != null) {
			if (x.parent.ids[id] === true) pass = true;
			else if (x.parent.ids[id] === false) return false;
		}

		if (isTagBtn == true && x.parent.tags != null) {
			for (let tag of tags) {
				if (x.parent.tags[tag] === true) pass = true;
				else if (x.parent.tags[tag] === false) return false;
			};
		}
		return pass;
	});
	btn.availableComponents = components;
	btn.path = btn.path || [btn.dataset.headComponentId];

	let componentsList = document.querySelector(`#rk-add-edits-list`);
	let currentComponents = [];

	// Displays the theme template add - components - card
	btn.showAddComponentMenu = function() {
		componentsList.innerHTML = "";
		components.forEach(component => {
			let similarComponents = currentComponents.filter(x => x.id == component.id);
			let isMulti = component.options?.isMulti == true;
			if (isMulti && similarComponents.length >= component.options.maxMulti) isMulti = false;
			if (isMulti != true && similarComponents[0] != null) return;

			let details = escapeJSON(component.details);

			let ComponentDiv = document.createElement(`div`);
			ComponentDiv.className = "theme-template add-components-card";
			ComponentDiv.innerHTML = /*html*/`<div>
			<div data-translate="${details.translate?.name || ""}">${details.name || "No Name"}</div>
				<span data-translate="${details.translate?.description || ""}">${details.description || ""}</span>
			</div>
			<div style="margin-left: auto;"></div>
			<button style="background-color: rgb(57 59 61);color: white;">+</button>`;

			ComponentDiv.querySelector('button').addEventListener('click', () => {
				btn.addComponent(component);

				let similarComponents = currentComponents.filter(x => x.id == component.id);
				if (isMulti && similarComponents.length >= component.options.maxMulti) isMulti = false;
				if (isMulti != true) ComponentDiv.remove();
			}, {once: isMulti != true});

			componentsList.appendChild(ComponentDiv);
		});
		document.querySelector("#rk-editthemesectionadding").style.display = "flex";
	}
	btn.addComponent = function(component) {
		if (!components.includes(component)) return;

		let addedComponents = currentComponents.filter(x => x.id == component.id);
		let isMulti = component.options?.isMulti == true;
		if (isMulti && addedComponents.length >= component.options.maxMulti) isMulti = false;
		if (isMulti != true && addedComponents[0] != null) return addedComponents[0];

		//add element
		let holder = document.createElement('div');
		holder.classList.add("component-holder");
		holder.innerHTML = component.element.html;
		holder.dataset.componentId = component.id;
		holder.dataset.headId = headId;
		holder.path = [...btn.path, ...[component.details?.name || component.id]];
		btn.appendChild(holder);

		//setup element
		for (let key in component.element) {
			if (key == "html" || key == "js") continue;


			holder[key] = component.element[key];
		}
		holder.componentTags = component.tags;

		let idCard = {
			id: component.id,
			element: holder,
			component,
		};
		if (isMulti) idCard.multiNum = addedComponents.length;

		let run = component.element.js;
		if (typeof run == 'function') run(idCard, btn);
		
		//add in currentComponents
		currentComponents.push(idCard);

		return idCard;
	}
	btn.removeComponent = function(component, idCard) {
		currentComponents = currentComponents.filter(x => {
			if (x.id != component.id) return true;
			if (idCard && x.multiNum != idCard.multiNum) return true;

			x.element.remove();
			return false;
		});
		return;
	}
	btn.getComponents = function() {
		return currentComponents;
	}
	btn.clearComponents = function() {
		currentComponents = [];
		btn.querySelectorAll('.component-holder').forEach((element) => {
			element.remove();
		});
	}
	btn.load = function(theme_object) {
		//if (id == 'pages') console.log(`loading theme`, theme_object);

		//clear currentComponents
		btn.clearComponents();

		//for all objects in theme_object
		for (let path in theme_object) {
			if (theme_object[path] == null) continue;
			if (JSON.stringify(theme_object[path]) === '{}') continue;

			let component = components.find(x => x.id == path);

			//check if path/object key exist in components as id
			if (component == null) continue;

			if (typeof component.element.isEmpty == 'function' && component.element.isEmpty(theme_object[path])) continue;

			//add component
			let idCard = btn.addComponent(component);

			//after setup do load and pass the same object's value
			if (typeof idCard.element.load == 'function') idCard.element.load(theme_object[path], idCard);
		}
	}
	btn.save = function() {
		//create an page_object
		let page_object = {};

		//for each current Components
		for (let idCard of currentComponents) {
			//run save_object
			let save_component = idCard.element.save;
			if (typeof save_component != 'function') continue;

			//put object in page_object with key of component id
			page_object[idCard.id] = save_component(idCard);
		}
		
		return page_object;
	}
}

Designer.ThemeEditor.UpdateLivePreview = function() {
	if (Designer.ThemeEditor.isLivePreview !== true) return;

	var theme = Rkis.wholeData.Designer.Themes[Designer.ThemeEditor.themeId];
	if(theme == null) return;

	let editorTheme = {};

	var pagestab = document.querySelector(`[data-editthemetabs="pages"]`);
	editorTheme.pages = pagestab.save();

	let themeStringified = JSON.stringify(editorTheme);

	localStorage.setItem('rkis-temp-theme', themeStringified);

	if (Designer.ThemeEditor.liveThemeAutoReset) clearTimeout(Designer.ThemeEditor.liveThemeAutoReset);
	Designer.ThemeEditor.liveThemeAutoReset = setTimeout(() => {
		localStorage.removeItem('rkis-temp-theme');
		Designer.ThemeEditor.liveThemeAutoReset = null;
		Designer.ThemeEditor.isLivePreview = false;
		page.toggleSwich(document.querySelector('#rkpage .main .themes [data-designer-func="livepreview"]'), false);
	}, 10*60*1000); // 10m
}

//END SECTION ThemeEditor



//SECTION - reused functions


//END SECTION reused functions



function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : null;
}

function rgbTorgba(rgb, alpha) {
	var result = rgb.replace("rgb(", "rgba(");
	if(result.split(",").length > 3) result = result.split(",").slice(0, -1).join(",") + ")";
	return result.replace(")", `,${alpha}%)`);
}

function rgbaTovar(rgba) {
	var vars = rgba.split("(")[1].split(")")[0].split("%")[0].split(",");
	return {r: Number(vars[0]), g: Number(vars[1]), b: Number(vars[2]), a: Number(vars[3])};
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + parseInt(b)).toString(16).slice(1);
}

function jsonConcat(o1, o2) {
	for (var key in o2) {
 		if(o1[key] == null) o1[key] = o2[key];
 		else {
 			if(o1[key].toString() == "[object Object]" && o2[key] != null && o2[key].toString() == "[object Object]")
 				jsonConcat(o1[key], o2[key]);
 			else o1[key] = o2[key];
 		}
	}
	return o1;
}

function makeTextFile(text, filename) {
	var textFile = null;
	var data = new Blob([text], {type: 'text/plain'});

	textFile = window.URL.createObjectURL(data);

	var link = document.createElement('a');
	link.setAttribute('download', filename);
	link.href = textFile;
	document.body.appendChild(link);

	window.requestAnimationFrame(function () {
		var event = new MouseEvent('click');
		link.dispatchEvent(event);
		document.body.removeChild(link);

		if(textFile !== null) {
			window.URL.revokeObjectURL(textFile);
		}
	});
};

function onclicked(target, code) {
	target.addEventListener("click", (e) => {
		if(e.target == target) code();
	})
}


Designer.waitingForGeneral = function() {
	if (Rkis == null || Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			Designer.waitingForGeneral();
		}, {once: true});
		return;
	}
	
	//Designer.LoadThemesData();
	document.$watch("#rkpage .main .themes", (e) => { e.$on("script", () => {Designer.LoadThemesData();}) });

	document.$watchLoop("#rkpage .main .themes .designer-btn", (e) => {
		var i = e.dataset.themeid;
		if(isNaN(Number(i)) == false) i = Number(i);
		var daname = e.dataset.theme;

		if(e.classList.contains("export")) {
			e.$on("click", () => {
				Designer.ExportTheme(e, daname, i);
			})
		} else if(e.classList.contains("delete")) {
			e.$on("click", () => {
				Designer.DeleteTheme(daname, i);
			})
		} else if(e.classList.contains("edit")) {
			e.$on("click", () => {
				Designer.EditTheme(i);
			})
		} else if(e.classList.contains("select")) {
			e.$on("click", () => {
				Designer.SelectThemeButton(e);
			})
		} else if(e.classList.contains("create")) {
			e.$on("click", () => {
				document.querySelector("#rk-createthemesection").style.display = "flex";
			})
		} else if(e.classList.contains("createthetheme")) {
			e.$on("click", () => {
				Designer.CreateNewTheme(e);
			})
		} else if(e.classList.contains("deletethetheme")) {
			e.$on("click", () => {
				Designer.DeleteTheTheme(e);
			})
		} else if(e.classList.contains("editorsave")) {
			e.$on("click", () => {
				Designer.ThemeEditor.Save();
			})
		} else if(e.classList.contains("editortab")) {
			e.$on("click", () => {
				Designer.ThemeEditor.SelectTab(e);
			})
		} else if(e.classList.contains("showthelem")) {
			e.$on("click", (a) => {
				//console.log(e,a)
				if(a.target.tagName != "LOADCODE") {
					document.$triggerCustom("openedit", e.firstElementChild)
					e.firstElementChild.style.display = "flex";
				}
			})
		}
	});

	document.$watchLoop("#rkpage .main .themes [data-designer-func]", (e) => {
		var i = e.dataset.themeid;
		if(isNaN(Number(i)) == false) i = Number(i);
		var daname = e.dataset.theme;

		switch (e.dataset.designerFunc.toLowerCase()) {
			default: return console.error("D618");
			case "editorsave":
				e.$on("click", () => {
					Designer.ThemeEditor.Save();
					localStorage.removeItem('rkis-temp-theme');
					Designer.ThemeEditor.liveThemeAutoReset = null;
					Designer.ThemeEditor.isLivePreview = false;
					page.toggleSwich(document.querySelector('#rkpage .main .themes [data-designer-func="livepreview"]'), false);
				})
				break;
			case "add-edits":
				Designer.ThemeEditor.setupComponentsManager(e);
				break;
			case "add-edits-btn":
				e.$on('click', () => {
					e.parentElement.showAddComponentMenu();
				});
				break;
			case "close-edit-adding":
				e.addEventListener("click", function (event) {
					if (event.target == e) {
						e.style.display = "none";
					}
				})
				break;
			case "show-more-themes":
				e.$on("click", () => {
					document.querySelector("#rk-viewmore-themesection").style.display = "flex";
				})
				break;
			case "add-remote-theme":
				e.$on("click", async () => {
					e.disabled = true;
					e.style.opacity = "0.5";

					let themeInfo = Designer.BrowseThemeList[e.dataset.themenum];
					if (themeInfo == null) {
						Rkis.Toast("Error D3887: 404 not found.");
						return;
					}

					
					let themeUrl = themeInfo.link.file || themeInfo.link.dark;
					if (themeUrl == null) {
						Rkis.Toast("Error D3894: 404 not found.");
						return;
					}

					let themeFile = await fetch(themeUrl)
					.then(response => response.json())
					.catch(err => {console.error(err);return null;});
					if (themeFile == null) {
						Rkis.Toast("Error D3902: 404 not found.");
						e.disabled = false;
						e.style.opacity = "1";
						return;
					}

					
					var antiLetterNumber = /[^\s0-9a-zA-Z-_]/g;
					var daname = themeInfo.name.replaceAll(antiLetterNumber, "");
					var dadesc = `By ${themeInfo.author}`.replaceAll(antiLetterNumber, "");

					let safetycheck = await Designer.SaveNewTheme(daname, dadesc, themeFile, {
						skipTemplate: true,
					});
					if (safetycheck.error != null) {
						Rkis.Toast("Error D3916: "+safetycheck.error);
						// console.error(safetycheck.error);
						return;
					}

					Designer.LoadThemesData();
					document.querySelector("#rk-viewmore-themesection").style.display = "none";

					e.disabled = false;
					e.style.opacity = "1";
				})
				break;
			case "livepreview":
				e.addEventListener("switched", () => {
					Designer.ThemeEditor.isLivePreview = page.getSwich(e);
					if (Designer.ThemeEditor.isLivePreview == false) {
						localStorage.removeItem('rkis-temp-theme');
					} else {
						Designer.ThemeEditor.UpdateLivePreview();
					}
				});
				break;
			case "create":
				e.$on("click", () => {
					document.querySelector("#rk-createthemesection").style.display = "flex";
				});
				break;
		}

		if(e.classList.contains("export")) {
			e.$on("click", () => {
				Designer.ExportTheme(e, daname, i);
			})
		} else if(e.classList.contains("delete")) {
			e.$on("click", () => {
				Designer.DeleteTheme(daname, i);
			})
		} else if(e.classList.contains("edit")) {
			e.$on("click", () => {
				Designer.EditTheme(i);
			})
		} else if(e.classList.contains("select")) {
			e.$on("click", () => {
				Designer.SelectThemeButton(e);
			})
		} else if(e.classList.contains("createthetheme")) {
			e.$on("click", () => {
				Designer.CreateNewTheme(e);
			})
		} else if(e.classList.contains("deletethetheme")) {
			e.$on("click", () => {
				Designer.DeleteTheTheme(e);
			})
		} else if(e.classList.contains("editortab")) {
			e.$on("click", () => {
				Designer.ThemeEditor.SelectTab(e);
			})
		} else if(e.classList.contains("showthelem")) {
			e.$on("click", (a) => {
				//console.log(e,a)
				if(a.target.tagName != "LOADCODE") {
					document.$triggerCustom("openedit", e.firstElementChild)
					e.firstElementChild.style.display = "flex";
				}
			})
		}
	});

	document.addEventListener("visibilitychange", function() {
		if (document.hidden){
			Designer.ThemeEditor.UpdateLivePreview();
		} else {
			return;
		}
	});
}

Designer.waitingForGeneral();