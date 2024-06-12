"use strict";
var Rkis = Rkis || {};
var page = page || {};

//would you look at that, its very similar to the designer code :O
let featureCustomizations = {
	"Badges": {
		html: /*html*/`
			<div style="width: 100%;">
				<span class="text-lead" translate="sectionCBH">Show Hidden Badges</span>
				<span data-location="showHiddenBadges" class="rk-button receiver-destination-type-toggle on">
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
				if (input == null) return;

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
	},
	"GameNameFilter": {
		html: /*html*/`
			<div style="width: 100%;">
				<span class="text-lead">Remove Emojis</span>
				<span data-location="removeEmojis" class="rk-button receiver-destination-type-toggle off">
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
				if (input == null) return;

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
	},
	"CustomNavMenuButtons": {
		html: /*html*/`
			<div class="menubtns-wrapper" style="width: 100%;">
				<style>
					.menubtns-wrapper {
						display: flex;
						gap: 0.5rem;
					}
					.menubtns-container {
						/* width: 100%; */
						flex-grow: 1;
						max-height: 20rem;
						overflow: auto;
					}
					.menubtn-element {
						cursor: move;
						margin-bottom: 0.25rem;
						margin-right: 0.25rem;
						padding-left: 2px;
						background-color: #393b3d;
						border-radius: 8px 20px 20px 8px;
						height: 22.4px;
					}
					.menubtn-element .receiver-destination-type-toggle {
						cursor: pointer;
					}
					.menubtn-delete-element {
						float: right;
						height: 22.4px;
						width: 22.4px;
						border-radius: 50%;
						background-color: rgba(255,0,0,0.3);
						text-align: center;
						cursor: pointer;
					}
					.menubtns-form {
						margin-top: 4px;
						display: flex;
						flex-direction: column;
						gap: 4px;
					}
					#rk-menubtns-icon-popup > .rk-popup > div > span {
						cursor: pointer;
					}
					.menubtns-form input:invalid {
						color: red;
						border: 1px solid red;
					}
				</style>
				<div class="menubtns-container">Loading...</div>
				<div class="menubtns-form">
					<span class="text-lead">Create Button</span>
					<input id="menubtns-icon-selector" class="form-control input-field" type="button" value="Button Icon">
					<input id="menubtns-button-text" class="form-control input-field" placeholder="Button Text" maxlength="200" required>
					<input id="menubtns-button-url" class="form-control input-field" placeholder="Button URL" pattern="https://.+\\..+" required>
					<button id="menubtns-button-add" class="btn-control-sm">Add</button>
					<div style="flex-grow: 1;"></div>
					<button id="menubtns-reset-list" class="btn-control-sm">Reset</button>
					<div id="rk-menubtns-icon-popup" class="rk-popup-holder" style="z-index: 10000;">
						<div class="rk-popup" style="padding: 1rem;">
							<input id="menubtns-icon-url" class="form-control input-field" placeholder="Icon URL" pattern="https://.+\\..+">
							<div id="menubtns-icon-list" style="margin-top: 16px;">
								<span class="icon-nav-menu"></span>
								<span class="icon-nav-notification-stream"></span>
								<span class="icon-nav-blog"></span>
								<span class="icon-nav-giftcards"></span>
								<span class="icon-nav-message"></span>
								<span class="icon-nav-home"></span>
								<span class="icon-nav-profile"></span>
								<span class="icon-nav-friends"></span>
								<span class="icon-nav-group"></span>
								<span class="icon-nav-charactercustomizer"></span>
								<span class="icon-nav-inventory"></span>
								<span class="icon-nav-my-feed"></span>
								<span class="icon-nav-search-white"></span>
								<span class="icon-nav-shop"></span>
								<span class="icon-nav-trade"></span>
								<span class="icon-nav-robux"></span>
								<span class="icon-nav-settings"></span>
							</div>
						</div>
					</div>
				</div>
			</div>`,
		js: null,
		load: function (theme_object, idCard) {
			let element = idCard.element;

			let menubtnsContainer = element.querySelector('.menubtns-container');
			let iconPopup = element.querySelector('#rk-menubtns-icon-popup');
			let iconUrlField = element.querySelector('#menubtns-icon-url');
			let iconList = element.querySelector('#menubtns-icon-list');
			let btnIconSelector = element.querySelector('#menubtns-icon-selector');
			let btnTextField = element.querySelector('#menubtns-button-text');
			let btnUrlField = element.querySelector('#menubtns-button-url');
			let buttonAdd = element.querySelector('#menubtns-button-add');
			let btnIcon = null;

			//make draggable & sorable
			menubtnsContainer.addEventListener('dragover', e => {
				e.preventDefault();
				const afterElement = getDragAfterElement(menubtnsContainer, e.clientY);
				const draggable = document.querySelector('.dragging');
				if (afterElement == null) {
					menubtnsContainer.appendChild(draggable);
				} else {
					menubtnsContainer.insertBefore(draggable, afterElement);
				}
			});

			//get buttons from left menu
			let allButtonsIds = [];
			let createButtonElement = (btnData) => {
				let container = document.createElement('div');
				let buttonNameElement = document.createElement('span');
				let buttonToggleElement = document.createElement('span');

				container.btnData = btnData;

				container.classList.add('menubtn-element');
				container.style.cursor = 'move';
				container.draggable = true;
				buttonNameElement.textContent = btnData.text;

				if (btnData.type === 'system') {
					buttonToggleElement.classList.add("rk-button","receiver-destination-type-toggle");
					buttonToggleElement.innerHTML = `
						<span class="toggle-flip"></span>
						<span class="toggle-on"></span>
						<span class="toggle-off"></span>
					`;

					let toggle = "on";
					if (btnData.hidden === true) toggle = "off";
					buttonToggleElement.classList.add(toggle);
					buttonToggleElement.addEventListener('click', () => {
						if (page.getSwich(buttonToggleElement)) {
							//switch is now off
							container.btnData.hidden = true;
						} else {
							//switch is now on
							container.btnData.hidden = false;
						}
					});
				} else {
					buttonToggleElement.classList.add("menubtn-delete-element");
					buttonToggleElement.textContent = "-";
					buttonToggleElement.addEventListener("click", () => {
						container.remove();
					});
				}

				container.appendChild(buttonNameElement);
				container.appendChild(buttonToggleElement);
				return container;
			};
			let updateList = (resetData) => {
				let featureSetting = Rkis.wholeData["CustomNavMenuButtons"];
				if (featureSetting == null || (featureSetting.options && featureSetting.options.disabled == true)) return;
				if (featureSetting.value[featureSetting.type] === false) resetData = true;

				//update for a correctly sorted list
				let availableButtons = [];
				allButtonsIds = Array.from(document.querySelectorAll(".left-col-list > * > *[id]"));
				allButtonsIds.forEach(btn => {
					let text = btn.textContent || "Unknown";
					if (btn.id === 'btr-blogfeed') text = "Blog Content";
					else text = text.trim().split(/\d/g)[0];
					availableButtons.push({type: 'system', id: btn.id, text});
				});
				//get button data
				let allButtons = [];
				if (resetData !== true) {
					//get user made buttons...
					allButtons = theme_object.SortedMenuButtonsList;
					let newButtons = availableButtons
					.filter(btnData => allButtons.find(x => x.id === btnData.id && x.text === btnData.text) == null)
					.map(btnData => {
						btnData.hidden = false;
						return btnData;
					});
					allButtons = allButtons.concat(newButtons);
				} else {
					allButtons = availableButtons.map(btnData => {
						btnData.hidden = false;
						return btnData;
					});
				}
				//list buttons & hide enable button for unavailable non-custom buttons
				menubtnsContainer.innerHTML = '';
				allButtons.forEach(btn => {
					let buttonElement = createButtonElement(btn);
					menubtnsContainer.appendChild(buttonElement);

					buttonElement.classList.add('draggable');
					buttonElement.addEventListener('dragstart', () => {
						buttonElement.classList.add('dragging');
					});
					buttonElement.addEventListener('dragend', () => {
						buttonElement.classList.remove('dragging');
					});
				});
			};
			document.$watch('.rbx-left-col .left-col-list', updateList);
			document.$watchLoop(".left-col-list > * > *[id]", (btn) => {
				if (allButtonsIds.includes(btn)) return;
				updateList();
			});

			//listerners
			btnIconSelector.addEventListener("click", () => {
				iconPopup.style.display = 'flex';
			});
			iconUrlField.addEventListener('keypress', function(event) {
				if (event.key !== "Enter") return;

				// Cancel the default action, if needed
				if (event.defaultPrevented !== true) event.preventDefault();
				// Trigger the button element with a click
				iconUrlField.dispatchEvent(new Event('change'));
			});
			iconUrlField.addEventListener('change', () => {
				if (iconUrlField.checkValidity() === false) {
					return alert("Please Enter a valid icon url.");
				}
				iconPopup.style.display = '';
				btnIcon = {
					type: 'url-icon',
					value: iconUrlField.value,
				};
			});
			Array.from(iconList.children).forEach(icon => {
				icon.addEventListener("click", () => {
					iconPopup.style.display = '';
					btnIcon = {
						type: 'navbar-icon',
						value: icon.className,
					};
				});
			});
			buttonAdd.addEventListener("click", () => {
				btnTextField.style.borderColor = "";
				btnUrlField.style.borderColor = "";
				btnIconSelector.style.borderColor = "";
				if (btnIcon === null) {
					btnIconSelector.style.borderColor = "red";
					return alert("Please Select an Icon.");
				}
				if (btnTextField.value === '') {
					btnTextField.style.borderColor = "red";
					return alert("Please Enter Button Text.");
				}
				if (btnUrlField.checkValidity() === false) {
					btnUrlField.style.borderColor = "red";
					return alert("Please Enter a valid button url.");
				}

				let createdBtn = {
					type: 'custom',
					icon: btnIcon,
					text: btnTextField.value,
					url: btnUrlField.value,
				};
				// console.log({createdBtn});
				let buttonElement = createButtonElement(createdBtn);
				menubtnsContainer.appendChild(buttonElement);

				buttonElement.classList.add('draggable');
				buttonElement.addEventListener('dragstart', () => {
					buttonElement.classList.add('dragging');
				});
				buttonElement.addEventListener('dragend', () => {
					buttonElement.classList.remove('dragging');
				});
			});
			element.querySelector('#menubtns-reset-list').addEventListener("click", () => {
				updateList(true);
			});

			for (let key in theme_object) {
				if (theme_object[key] == null) continue;
				let value = theme_object[key];

				let input = element.querySelector(`[data-location="${key}"]`);
				if (input == null) return;

				if (input.classList.contains("rk-button")) {
					page.toggleSwich(input, value);
				} else if (input.classList.contains("input-field")) {
					input.value = value;
				}
			}

			function getDragAfterElement(container, y) {
				const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

				return draggableElements.reduce((closest, child) => {
					const box = child.getBoundingClientRect();
					const offset = y - box.top - box.height / 2;
					if (offset < 0 && offset > closest.offset) {
						return { offset: offset, element: child };
					} else {
						return closest;
					}
				}, { offset: Number.NEGATIVE_INFINITY }).element;
			}
		},
		save: function (idCard) {
			let element = idCard.element;
			let component_object = {};

			//when saving, use the html list so you get it sorted
			let sortedMenuElements = Array.from(element.querySelectorAll('.menubtns-container > .menubtn-element'));
			let sortedMenu = sortedMenuElements.map(x => x.btnData);
			// console.log({sortedMenuElements, sortedMenu});
			component_object.SortedMenuButtonsList = sortedMenu;

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
	},
	"StatusRing": {
		html: /*html*/`
			<div class="rkis-editable-section section-content" id="status_ring-glow">
				<div data-preview data-translate="themePreview"
				style="width: min(10rem, 20%);display: flex;border: 1px solid rgba(128,128,128,0.5);margin-right: 1rem;justify-content: center;align-items: center;border-radius: 20px 0;">
					Preview
				</div>
				<div style="flex-grow: 1;">
					<div class="rk-flex rk-space-between rk-center-x">
						<h4 style="width: fit-content;">Glow</h4>
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
				</div>
			</div>`,
		js: function (idCard, parentElement) {
			let element = idCard.element.querySelector("#status_ring-glow");

			element.style.display = 'flex';

			element.update = function() {
				let settings = element.parentElement.save(idCard).shadow;
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
			let element = idCard.element.querySelector("#status_ring-glow");
			
			if (theme_object && theme_object.shadow != null) {
				// if (theme_object.startsWith('inset ') != true) theme_object = ' ' + theme_object;
				let [type, x, y, blur, spread] = theme_object.shadow.split(' ');

				//load rest
				let inputsValue = {type,x,y,blur,spread};
				element.querySelectorAll(`[data-location]`).forEach((input) => {
					let value = inputsValue[input.dataset.location];

					input.value = value.split('px')[0];
				});
			}
			
			if (typeof element.update == 'function') element.update();
		},
		save: function (idCard) {
			let element = idCard.element.querySelector("#status_ring-glow");
			let inputsValue = {};

			//save inputs
			element.querySelectorAll(`[data-location]`).forEach((input) => {
				let value = input.value;
				if (input.dataset.location != 'type') value += 'px';

				inputsValue[input.dataset.location] = value;
			});

			return {
				shadow: `${inputsValue.type} ${inputsValue.x} ${inputsValue.y} ${inputsValue.blur} ${inputsValue.spread}`
			};
		}
	}
};



page.setup = function () {
	document.querySelectorAll("button.main-save-button").forEach((e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		e.addEventListener("click", () => { page.save(e); });
	});
}

page.open = async function (pagetoopen, bypass) {
	if (document.querySelector(`[data-file="${pagetoopen}"]`) == null) return "404";

	var currentactivetab = document.querySelector("#vertical-menu > li.menu-option.active");
	if (bypass != true && currentactivetab.dataset.file == pagetoopen) {
		if (pagetoopen === "Experiment Styles") {
			enableExperimentsPage();
		}
		return; //already on the page
	}

	window.location.replace(window.location.href.split("#")[0] + "#!/" + pagetoopen); //change link
	currentactivetab.classList.remove("active"); //change tab

	document.querySelector(`[data-file="${pagetoopen}"]`).classList.add("active"); //make tab active

	var daplacetoload = $r("#rkpage ." + pagetoopen.toLowerCase().split(" ").join("-").split("/").join(" ."));
	if (daplacetoload == null) return console.error("SP42");
	try {
		document.$findAll(".tabcontent").forEach((e) => {
			e.classList.remove("active")
		})
		daplacetoload.classList.add("active");
		daplacetoload.$triggerCustom("script");
		//daplacetoload.inner HTML = await Rkis.GetTextFromLocalFile(`html/SettingsPage/Pages/${pagetoopen}.html`);
		//var scrpt0 = document.createElement("script");
		//scrpt0.src = Rkis.fileLocation + `html/SettingsPage/Pages/${pagetoopen}.js`;
		//daplacetoload.append(scrpt0);
		//eval(`(function() {`+await Rkis.GetTextFromLocalFile(`html/SettingsPage/Pages/${pagetoopen}.js`)+`})()`);
	} catch { }
	page.setup();
}

page.toggleSwich = function (swich, stat) {
	if (!swich) return null;

	if (stat == null) {
		stat = page.getSwich(swich) == false;
	}

	if (stat != null) {
		swich.classList.remove("on");
		swich.classList.remove("off");
		swich.classList.add(stat ? "on" : "off");

		swich.dispatchEvent(new Event('switched'));
		return stat;
	}

	return null;
}

page.getSwich = function (swich) {
	if (!swich) return null;

	if (swich.classList.contains("on")) return true;
	else if (swich.classList.contains("off")) return false;

	return null;
}

page.save = function (button) {
	document.dispatchEvent(new Event("rk-page-save"));

	document.querySelectorAll(".rk-button:not(.rk-input-bool)")
	.forEach((e) => {
		if (e.dataset.file == null) return;
		Rkis.wholeData[e.dataset.file] = page.getSwich(e);
	});

	document.querySelectorAll(".rk-textfield:not(.rk-input-string)")
	.forEach((e) => {
		if (e.dataset.file == null) return;
		Rkis.wholeData[e.dataset.file] = e.value.slice(0, 500);
	});
	
	document.querySelectorAll(".rk-input-string[data-file]")
	.forEach((e) => {
		if (e.dataset.file == '') return;

		var setting = Rkis.wholeData[e.dataset.file];
		if (setting && setting.options && setting.options.disabled == true) return;
		Rkis.wholeData[e.dataset.file].value[setting.type] = e.value.slice(0, 500);
	});

	document.querySelectorAll(".rk-input-bool[data-file]")
	.forEach((e) => {
		if (e.dataset.file == '') return;

		var setting = Rkis.wholeData[e.dataset.file];
		if (setting && setting.options && setting.options.disabled == true) return;
		Rkis.wholeData[e.dataset.file].value[setting.type] = page.getSwich(e);
	});

	Rkis.database.save().then(() => {
		button.textContent = Rkis.language["btnSaved"];
		setTimeout((btn) => { btn.textContent = Rkis.language["btnSave"]; }, 1000, button);
	});
}

page.E = "A";
page.Sports = "It's in the Game";

page.start = async function () {
	await document.$watch("#rkmainpage").$promise();

	//slider value
	document.$watchLoop(`input[type="range"]`, (inputElement) => {
		const parentElement = inputElement.parentElement;
		let isContainer = parentElement.classList.contains("text-lead") || parentElement.children.length == 2;
		let textElement = parentElement.querySelector("span,div");
		if (textElement == null) isContainer = false;
		if (isContainer == false) return;

		let originalText = textElement.textContent;
		let textTimeout = null;
		let maxValue = inputElement.max || "100";
		inputElement.addEventListener("input", () => {
			if (textTimeout !== null) {
				clearTimeout(textTimeout);
			} else originalText = textElement.textContent;
			textTimeout = setTimeout(() => {
				textElement.textContent = originalText;
				textTimeout = null;
			}, 3000);

			textElement.textContent = inputElement.value+" / "+maxValue;
		});
	});

	//Accordion
	document.$watchLoop(`label > .accordion__input`, (inputElement) => {
		const container = inputElement.parentElement.parentElement;
		let contentElement = container.querySelector(".accordion__content");
		if (contentElement == null) return;

		inputElement.addEventListener("change", () => {
			contentElement.classList.toggle("accordion__show", inputElement.checked);
		});
	});

	if (await page.open(decodeURIComponent(window.location.hash.split("#!/")[1]?.split("?")[0]), true) == "404") {
		if (await page.open(document.querySelector("#vertical-menu > li.menu-option.active").dataset.file, true) == "404") {
			page.open(document.querySelector("#vertical-menu > li.menu-option").dataset.file, true);
		}
	}

	document.querySelectorAll("#vertical-menu > li.menu-option").forEach((e) => {
		e.addEventListener("click", () => { page.open(e.dataset.file); });
	});
	
	var wholedata = Rkis.wholeData || {};

	document.$watchLoop(".rk-button:not(.rk-input-bool)", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		e.addEventListener("click", () => { page.toggleSwich(e); });
		if (e.dataset.file == null || wholedata[e.dataset.file] == null) return;
		//console.error(e.dataset.file+"is still using old load");
		page.toggleSwich(e, wholedata[e.dataset.file]);
	});

	document.$watchLoop(".rk-textfield:not(.rk-input-string)", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		if (e.dataset.file == null || wholedata[e.dataset.file] == null) return;
		//console.error(e.dataset.file+"is still using old load");
		e.value = wholedata[e.dataset.file];
	});

	document.$watchLoop(".rk-input-string", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";

		var setting = wholedata[e.dataset.file];

		if (e.dataset.file == null || setting == null || (setting.options && setting.options.disabled == true)) return;
		e.value = setting.value[setting.type];
	});

	document.$watchLoop(".rk-input-bool", (e) => {
		if (e.dataset.listening != null) return;
		e.dataset.listening = "true";
		
		var setting = wholedata[e.dataset.file];

		e.addEventListener("click", () => { page.toggleSwich(e); });
		if (e.dataset.file == null || setting == null || (setting.options && setting.options.disabled == true)) return;
		page.toggleSwich(e, setting.value[setting.type]);
	});
};

page.settingsWaitingForGeneral = function() {
	if (Rkis == null || Rkis.generalLoaded != true) {
		document.addEventListener("rk-general-loaded", () => {
			page.settingsWaitingForGeneral();
		}, {once: true});
		return;
	}
	
	//auto load feature names and description in about tab
	document.$watchLoop("loadcode", (element) => {
		var name = element.getAttribute("code");
		if (name == null || name == "") return console.error("SP127");

		switch (name.toLowerCase()) {
			default:
				return console.error(`Rkis | loadcode error` + name);
			case "settingload":
				var settingId = element.dataset.id;

				//get settings
				var settingRaw = Rkis.wholeData[settingId];
				var setting = escapeJSON(settingRaw);
				if (setting == null || typeof setting.type != "string") return;

				let canEdit = true;
				if (setting.options) {
					if (setting.options.hidden == true) return;
					setting.options.disabled == true && (canEdit = false);
				}

				var details = Rkis.GetSettingDetails(setting.details) || {};
				var trDetails = setting.details?.translate || {};

				let featureCustomization = featureCustomizations[settingId];

				//get structer depending on type
				var getStructureByType = {
					"text": 
						`<div class="section-content">
							<span class="text-lead" data-translate="${trDetails.name || ""}">${details.name || "Error: SP146"}</span>
							<input class="rk-input-string rk-textfield form-control input-field" placeholder="Leave empty for default" data-file="${setting.id}"${setting.options && setting.options.disabled == true ? " hidden" : ""}>
							<div class="rbx-divider" style="margin: 12px;"></div>
							<span class="text-description" data-translate="${trDetails.description || ""}">${details.description || "Error: SP149"}</span>
							<div style="color: red;" class="text-description" data-translate="${trDetails.note || ""}">${details.note || ""}</div>
							${featureCustomization != null ?
								`<div class="rbx-divider" style="margin: 12px;"></div>
								<div class="text-lead">
									<label>
										<input type="checkbox" class="accordion__input" hidden>
										<span class="accordion__label" style="font-weight: 400;">Customize</span>
									</label>
									<div class="accordion__content">
										<div data-feature-options class="component-holder"></div>
									</div>
								</div>` : ''
							}
						</div>`,
					"switch": 
						`<div class="section-content">
							<span class="text-lead" data-translate="${trDetails.name || ""}">${details.name || "Error: SP154"}</span>
							<span class="rk-input-bool rk-button receiver-destination-type-toggle on" data-file="${setting.id}"${setting.options && setting.options.disabled == true ? " hidden" : ""}>
								<span class="toggle-flip"></span>
								<span class="toggle-on"></span>
								<span class="toggle-off"></span>
							</span>
							<div class="rbx-divider" style="margin: 12px;"></div>
							<span class="text-description" data-translate="${trDetails.description || ""}">${details.description || "Error: SP161"}</span>
							<div style="color: red;" class="text-description" data-translate="${trDetails.note || ""}">${details.note || ""}</div>
							${featureCustomization != null ?
								`<div class="rbx-divider" style="margin: 12px;"></div>
								<div class="text-lead">
									<label>
										<input type="checkbox" class="accordion__input" hidden>
										<span class="accordion__label" style="font-weight: 400;">Customize</span>
									</label>
									<div class="accordion__content">
										<div data-feature-options class="component-holder"></div>
									</div>
								</div>` : ''
							}
						</div>`
				};

				//console.log(setting, getStructureByType);

				//apply structer info from setting
				element.innerHTML = getStructureByType[setting.type];

				if (featureCustomization == null) return;
				
				let componentElement = element.querySelector("[data-feature-options]");
				element.selectedOption = null;

				element.loadOptionComponent = (component, featureOptions) => {
					if (component == null || component.element == null) {
						element.selectedOption = null;
						return;
					}
					componentElement.innerHTML = component.element.html;

					//setup element
					for (let key in component.element) {
						if (key == "html" || key == "js") continue;


						componentElement[key] = component.element[key];
					}

					let idCard = {
						id: component.id,
						element: componentElement,
						component,
					};
					element.selectedOption = idCard;

					let run = component.element.js;
					if (typeof run == 'function') run(idCard, element);

					if (typeof componentElement.load == 'function') componentElement.load(featureOptions, idCard);
				};
				element.saveOptionComponent = (component) => {
					if (component == null) component = element.selectedOption;
					if (component == null) return null;

					//run save_object
					let save_component = componentElement.save;
					// console.log({save_component})
					if (typeof save_component != 'function') return null;

					//put object in page_object with key of component id
					return save_component(component);
				};

				element.loadOptionComponent({
					id: settingId,
					element: featureCustomization,
					feature: settingRaw,
				}, (settingRaw.data && settingRaw.data.customization) || null);
				document.addEventListener("rk-page-save", () => {
					if (settingRaw.data == null) settingRaw.data = {};
					settingRaw.data.customization = element.saveOptionComponent();
				});
				break;
		}
	});

	document.$watch("#container-main > div.content > div.request-error-page-content", (err404) => err404.remove());

	document.$watch("#container-main > div.content", async (mainplace) => {

		mainplace.innerHTML = /*html*/`
		<div id="rkmainpage">
			<div id="rkmaintitle" style="text-align: center;font-weight: 800;font-size: 32px;margin: 1%;" data-translate="settingsPageTitle">Roblokis Settings Page</div>
			<div style="display: flex;justify-content: center;">
				<div class="left-navigation">

					<div data-translate="categoryMain">Main</div>
					<ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
						<li class="menu-option active" data-file="Main/About"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAbout">About</span> </a> </li>
						<li class="menu-option" data-file="Main/Changelog"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabChangelog">Changelog</span> </a> </li>
						<li class="menu-option" data-file="Main/All"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAll">All</span> </a> </li>
						<li class="menu-option" data-file="Main/Design"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabDesign">Design</span> </a> </li>
						<li class="menu-option" data-file="Main/Themes"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabThemes">Themes</span> </a> </li>
					</ul>

					<div data-translate="categoryGamePage">Game Page</div>
					<ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
						<li class="menu-option" data-file="GamePage/Badges"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabBadges">Badges</span> </a> </li>
						<li class="menu-option" data-file="GamePage/Servers"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabServers">Servers</span> </a> </li>
					</ul>

					<div data-translate="categoryProfiles">Profiles</div>
					<ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
						<li class="menu-option" data-file="Profiles/ProfilePage"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabProfilePage">Profile Page</span> </a> </li>
						<li class="menu-option" data-file="Profiles/FriendsPage"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabFriendsPage">Friends Page</span> </a> </li>
					</ul>
					<ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
						<li class="menu-option" data-file="Search Features"> <a class="menu-option-content"> <span class="font-caption-header">Search Features</span> </a> </li>
						<li class="menu-option" data-file="Experiment Styles"> <a class="menu-option-content"> <span class="font-caption-header">Experiments</span> </a> </li>
					</ul>
				
				</div>
				<div id="rkpage" style="margin: 0 0 0 1%;width: 60%;">
					<div class="main">
						<div class="tabcontent about">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabAbout">About</span></h3>

							<div class="section-content">
								<h4 data-translate="sectionWhatRkis">What is Roblokis?</h4>
								<div>
									<div data-translate="sectionWhatRkis1">Roblokis is a broswer extenstion made by Ameer! to make roblox easier to use and more accessable.</div><br>
									<a href="https://ameerdotexe.github.io/roblokis/" style="text-decoration: underline;" data-translate="sectionWhatRkis2">Click here for roblokis site and privacy policy.</a>
								</div>
							</div>

							<div class="section-content">
								<h4 data-translate="sectionHelpNeed">Help!</h4>
								<div>
									<div data-translate="sectionHelpNeed1">if the extension have problems you can contact me on discord:</div>
									<a href="https://discord.gg/uH47YYKEex">https://discord.gg/uH47YYKEex</a><br><br>
									<div data-translate="sectionHelpNeed2">or message me on Roblox (Ameer_Khalid):</div>
									<a href="https://www.roblox.com/messages/compose?recipientId=678363483">https://www.roblox.com/messages/compose?recipientId=678363483</a>
								</div>
							</div>

							<div class="section-content">
								<h4 data-translate="credits">Credits</h4>
								<div>
									<div data-translate="creditsTranslate">Translation By Ameer!</div>
								</div>
							</div>

							<div class="section-content">
								<h4 data-translate="sectionFeatures">Features:</h4>
								<span class="text-description" data-translate="sectionFeatures1">Stuff Roblokis Can do</span>
								<div class="rbx-divider" style="margin: 12px;"></div>
								<table class="table table-striped features-table" style="border-radius: 12px;">
									<thead>
										<tr style="color: white;font-size: 120%;display: contents;align-items: center;">
											<th style="padding: 23px 10px;"></th>
											<th style="color: #0ff;text-align: center;">Feature</th>
											<th style="color: #fc0;text-align: center;">Description</th>
										</tr>
									</thead>
									<tbody>
										${Object.values(Rkis.wholeData)
										.filter((setting) => setting != null && typeof setting == "object" && setting.id != null)
										.filter((setting) => setting.options && !setting.options.disabled && !setting.options.hidden && setting.options.main == true)
										.map((setting) => (`
										<tr>
											<td></td>
											<td class="text-lead" data-translate="${escapeHTML(setting.details?.translate?.name || "")}">${escapeHTML(setting.details?.[setting.details?.default]?.name || "")}</td>
											<td class="text-description" data-translate="${escapeHTML(setting.details?.translate?.description || "")}">${escapeHTML(setting.details?.[setting.details?.default]?.description || "")}</td>
										</tr>`)).join("")}
									</tbody>
								</table>
								<div class="rbx-divider" style="margin: 12px 0 0 0;"></div>
							</div>

							<div class="section-content">
								<h4>Roblokis Data</h4>
								<div>
									<button class="btn-control-sm" id="download-roblokis-data">Export</button>
									<button class="btn-control-sm" data-translate="btnDelete" id="delete-roblokis-data">Delete</button>
									<label class="btn-control-sm">Import<input type="file" accept=".json" id="import-roblokis-data" hidden></label>
								</div>
							</div>
						</div>
						<div class="tabcontent all">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabAll">All</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="CustomRobux"></loadcode>
							<loadcode code="settingload" data-id="CustomName"></loadcode>

							<loadcode code="settingload" data-id="SiteLanguage"></loadcode>
							<loadcode code="settingload" data-id="QuickGameJoin"></loadcode>
							<loadcode code="settingload" data-id="GameNameFilter"></loadcode>
							<loadcode code="settingload" data-id="CustomNavMenuButtons"></loadcode>
							<loadcode code="settingload" data-id="DesktopApp"></loadcode>

							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="InfiniteGameScrolling"></loadcode>
						</div>
						<div class="tabcontent changelog">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabChangelog">Changelog</span></h3>
							
							<div class="section-content">
								<h4 data-translate="changelogGithubTitle">Moved to Github</h4>
								<div>
									<div data-translate="changelogGithubDescription">All changes are listed on our open source github repository.</div><br>
									<a href="https://github.com/AmeerDotEXE/roblokis/commits/release" style="text-decoration: underline;" data-translate="changelogGithubRedirection">Click here to view full changelog.</a>
								</div>	
							</div>
						</div>
						<div class="tabcontent design">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabDesign">Design</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<loadcode code="settingload" data-id="UseThemes"></loadcode>

							<div class="section-content">
								<span class="text-lead" data-translate="sectionAAnim">Allow animations?</span>
								<span class="rk-button receiver-destination-type-toggle off" data-file="BasicAnim">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</span>
								<div class="rbx-divider" style="margin: 12px;"></div>
								<span class="text-description" data-translate="sectionAAnim1">Some pages might have some animation effects. (Requires Themes Option)</span>
							</div>

							<loadcode code="settingload" data-id="ExtraShadows"></loadcode>

							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="StatusRing"></loadcode>
						</div>
						<div class="tabcontent themes">
							<h3><span data-translate="categoryMain">Main</span> &gt; <span data-translate="tabThemes">Themes</span></h3>

							<div id="rk-themesection">

								<div style="display: flex;flex-direction: column;text-align: center;background-color: rgb(114, 118, 122, 0.4);border-radius: 20px;padding: 1% 4%;box-shadow: 0 0 8px rgb(114, 118, 122, 0.4);margin: 9px 0;"><span style="color: white;" data-translate="themeSelected">Selected Theme</span><span id="currentthemeplace" class="text-description" data-translate="themeNotLoad">Not Loaded</span></div>

								<div class="section-content">
										<span style="font-weight: 700;" data-translate="themeDefaultSection">Default Themes:</span>
										<span class="text-description" data-translate="themeDefaultSection1">Comes with the extension...</span>
										<div class="rbx-divider" style="margin: 12px;"></div>

										<div class="default-theme-template">
											<div>
													<div>Simple Gradient</div>
													<span>Simple Red-Blue gradient theme</span>
											</div>
											<div style="margin-left: auto;"></div>
											<button class="designer-btn select" data-theme="Simple Gradient" data-themeid="2" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
										</div>

										<div class="default-theme-template">
											<div>
													<div>Dark Shadow Theme</div>
													<span></span>
											</div>
											<div style="margin-left: auto;"></div>
											<button class="designer-btn select" data-theme="Dark Shadow Theme" data-themeid="3" data-isdefaulttheme="true" data-translate="btnSelect">Select</button>
										</div>

										<button class="default-theme-template" style="border: 0;width: 100%;justify-content: center;" data-designer-func="show-more-themes">View More Themes</button>

										<div class="rbx-divider" style="margin: 12px 0 0 0;"></div>
								</div>



								<div class="section-content">
										<span style="font-weight: 700;" data-translate="themeCustomSection">Custom Themes:</span>
										<span class="text-description" data-translate="themeCustomSection1">You use or create your own themes...</span>
										<div class="rbx-divider" style="margin: 12px;"></div>

										<div id="customthemesholder">
										</div>

										<div class="rbx-divider" style="margin: 12px 0 0 0;"></div>
								</div>

							</div>

							
							<div id="rk-viewmore-themesection" class="rk-popup-holder" style="z-index: 10000;">
								<div class="rk-popup" style="width: min(100%, 60rem);min-height: 40%;max-height: 90%;">
										<h3>Official Themes</h3>
										<div class="rk-page-tab" style="display: flex;flex-direction: column;overflow: hidden;">
											<div class="rk-tabs">
												<div class="rk-tab" page="defaultthemes">Default</div>
												<div class="rk-tab is-active" page="browsethemes">Browse</div>
											</div>
											<div class="rk-tab-pages" style="overflow: auto;">
												<div class="rk-tab-page" tab="defaultthemes">
													<div id="rk-default-theme-list" style="width: 100%;">
														<div style="text-align: center;">Not Loaded</div>
													</div>
												</div>
												<div class="rk-tab-page is-active" tab="browsethemes">
													<div id="rk-browse-theme-list" style="width: 100%;">
														<div style="text-align: center;">Not Loaded</div>
													</div>
												</div>
											</div>
										</div>
										<button style="margin-top: 10px;" onclick="document.querySelector('#rk-viewmore-themesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
								</div>
							</div>

							<div id="rk-createthemesection" class="rk-popup-holder" style="z-index: 10000;">
								<div class="rk-popup">
										<h3 data-translate="themeNewTitle">New Theme</h3>
										<div class="rk-page-tab">
											<div class="rk-tabs">
												<div class="rk-tab" page="emptytheme">Empty</div>
												<div class="rk-tab is-active" page="imagetheme">Image</div>
												<div class="rk-tab" page="importtheme">Import</div>
												<a class="rk-tab" href="https://ameerdotexe.github.io/roblokis/themes/top/" target="_blank">Browse</a>
											</div>
											<div class="rk-tab-pages">
												<div class="rk-tab-page" tab="emptytheme">
													<input id="newtheme-name" placeholder="Name" data-translate="themeName">
													<input id="newtheme-desc" placeholder="Description (Optional)" style="margin-bottom: 20px;" data-translate="themeDescription">
													<div id="newtheme-error" class="info" style="font-size: 12px;"></div>
													<div>
														<button onclick="document.querySelector('#rk-createthemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
														<button class="designer-btn createthetheme rk-createbtn" data-translate="btnCreate">Create</button>
													</div>
												</div>
												<div class="rk-tab-page is-active" tab="imagetheme">
													<input id="newtheme-name" placeholder="Name" data-translate="themeName">
													<input id="newtheme-desc" placeholder="Description (Optional)" style="margin-bottom: 20px;" data-translate="themeDescription">
													<input type="url" id="newtheme-image" placeholder="Image URL">
													<div id="newtheme-error" class="info" style="font-size: 12px;"></div>
													<div>
														<button onclick="document.querySelector('#rk-createthemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
														<button class="designer-btn createthetheme rk-createbtn" data-translate="btnCreate">Create</button>
													</div>
												</div>
												<div class="rk-tab-page" tab="importtheme">
													<input type="file" id="newtheme-file" accept=".roblokis" oninput="if(this.files.length > 0) this.parentElement.querySelector('label').textContent = this.files[0].name; else this.parentElement.querySelector('label').textContent = '${Rkis.language['themeImport']}'" hidden>
													<label id="newtheme-filename" for="newtheme-file" data-translate="themeImport">Import Theme</label>
													<div id="newtheme-error" class="info" style="font-size: 12px;">NOTE: Only "Pre-made" Roblokis themes are accepted.<br>For Images: Upload image online and use it's link instead!</div>
													<div>
														<button onclick="document.querySelector('#rk-createthemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
														<button class="designer-btn createthetheme rk-createbtn" data-translate="btnCreate">Create</button>
													</div>
												</div>
											</div>
										</div>
								</div>
							</div>


							<div id="rk-deletethemesection" class="rk-popup-holder" style="z-index: 5000;">
								<div class="rk-popup">
										<h3 data-translate="themeDeleteTitle">Delete Theme</h3>
										<div class="info">
											<span data-translate="themeDeleteText">Are You Sure on Deleting </span>
											<span id="deletetheme-themename"></span>
										</div>
										<div>
											<button onclick="document.querySelector('#rk-deletethemesection').style.display = 'none';" data-translate="btnCancel">Cancel</button>
											<button class="designer-btn deletethetheme" id="deletetheme-button" data-themeid="" data-translate="btnDelete">Delete</button>
										</div>
								</div>
							</div>

							<div id="rk-editthemesection" class="rk-popup-holder" style="z-index: 1050;">
								<div class="rk-popup rk-scroll rk-flex-top rk-flex-row rk-has-navbar" style="align-items: unset;width: min(100%, 70rem);min-height: 18rem;">
									<div class="rk-popup-navbar">
										<!--name & description-->

										<!--style manager-->

										<!--page list-->
										<div class="rk-flex rk-center-y">

											<ul class="menu-vertical submenus" role="tablist" style="border-radius: 10px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;">
											
												<li data-nav-page="details" class="designer-btn editortab menu-option" style="border-radius: 10px 0 0 0;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="editorInfoTab">Info</span> </a> </li>

												<li data-nav-page="pages" class="designer-btn editortab menu-option active" style="border-radius: 0 0 0 0px;"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabDesign">Design</span> </a> </li>
												<li data-nav-page="styles" class="designer-btn editortab menu-option" style="border-radius: 0 0 0 10px;"> <a class="menu-option-content"> <span class="font-caption-header" data-trenslate="editorStylesTab">Styles</span> </a> </li>

											</ul>

										</div>

										<div class="rk-gap" style="min-height: 1rem;"></div>

										<div>
											<span class="text-lead" data-translate="editorlivepages">Live Pages.</span>
											<span class="rk-input-bool rk-button receiver-destination-type-toggle off" data-designer-func='livepreview'>
												<span class="toggle-flip"></span>
												<span class="toggle-on"></span>
												<span class="toggle-off"></span>
											</span>
											<div class="text-lead" style="font-size: 0.75em;color: red;" data-translate="experimental">(EXPERIMENTAL)</div>
										</div>

										<!--save button-->
										<div class="rk-flex rk-center-y" style="margin-top: 1rem;">

											<button onclick="document.querySelector('#rk-editthemesection').style.display = 'none';" class="rk-btn" data-translate="btnCancel">Close</button>

											<button class="rk-btn rk-green" data-designer-func="editorsave" data-translate="btnSave">Save</button>

										</div>
									</div>
									<div class="rk-popup-content" style="--editor-size-percent: 0.5;overflow: auto;">
										<style>

												/*Preview*/
												.group:hover > *:not(loadcode):not(.inner-group) {
													background-color: rgba(0, 255, 0, 0.2);
												}

												.group:hover > .dark {
													background-color: rgba(0, 128, 0, 0.4);
												}

												.group:hover > .inner-group > *:not(loadcode) {
													background-color: rgba(0, 255, 0, 0.2);
												}

												.group:hover > .inner-group > .dark {
													background-color: rgba(0, 128, 0, 0.4);
												}

												.selectable:hover {
													background-color: rgba(0, 255, 0, 0.2);
												}

												.selectable.dark:hover {
													background-color: rgba(0, 128, 0, 0.4);
												}

												*:has(> .selectable:hover) > .selectable:not(:hover),
												*:has(> .selectable:hover) > .group > *:not(:hover),
												*:has(> .group > *:hover) > .selectable:not(:hover),
												*:has(> .group > *:hover) > .group:not(:hover) > *:not(:hover) {
													filter: saturate(0.5) grayscale(1);
												}

												.recreate-background {
													width: 100%;
													height: 100%;
													position: absolute;
												}

												.recreate-content {
													background-color: rgba(0, 0, 0, 0.4);
													top: calc(60px * var(--editor-size-percent));
													left: 10%;
													height: calc(100% - calc(263px * var(--editor-size-percent)));
													width: 80%;
													position: absolute;
													border-radius: calc(20px * var(--editor-size-percent));
												}

												.recreate-menus {
													width: 100%;
													height: 100%;
												}

												.recreate-menus > *:not(loadcode) {
													background-color: rgba(0,0,0,0.4);
													position: absolute;
												}

												.recreate-topmenu {
													width: 100%;
													height: calc(40px * var(--editor-size-percent));
													border-radius: 0 0 calc(16px * var(--editor-size-percent)) calc(16px * var(--editor-size-percent));
												}

												.recreate-rightmenu {
													width: calc(175px * var(--editor-size-percent));
													height: 80%;
													border-radius: calc(20px * var(--editor-size-percent));
													margin: 1%;
													top: calc(40px * var(--editor-size-percent));
												}

												.recreate-bottommenu {
													border-radius: calc(60px * var(--editor-size-percent)) calc(60px * var(--editor-size-percent)) 0px 0px;
													width: 100%;
													height: calc(173px * var(--editor-size-percent));
													bottom: 0px;
												}

												.recreate-badge {
													background-color: rgba(0, 0, 0, 0.4);
													width: 80%;
													left: 10%;
													height: fit-content;
													position: relative;
													margin-bottom: 20px;
													border-radius: calc(20px * 2 * var(--editor-size-percent));

													display: flex;
													flex-direction: column;
													align-items: center;
													padding: calc(12px * 2 * var(--editor-size-percent));
												}

												.badge-content-data > li {
													display: flex;
													gap: 4%;
													justify-content: center;
												}

												.recreate-servers {
													background-color: rgba(0, 0, 0, 0.4);
													width: 80%;
													left: 10%;
													position: relative;
													margin-bottom: 20px;
													border-radius: calc(20px * 2 * var(--editor-size-percent));
													padding: calc(12px * 2 * var(--editor-size-percent));
												}

												.recreate-servers .section-right .avatar {
													top: 8px;
													width: calc(34px * 2 * var(--editor-size-percent));
													height: calc(34px * 2 * var(--editor-size-percent));
													display: inline-block;
													margin: 0px -10px 6px 0px;
												}

												.recreate-servers .section-right #rk-plr-counter.avatar {
													display: inline-grid;
													align-content: center;
													font-weight: bold;
													text-align: center;
													margin: 0px -8px 6px 0px;
												}

												.recreate-loadmore {
													padding: 2%;
													position: relative;
												}

												.recreate-profile {
													padding: 2%;
													position: relative;
													margin: 0 4% 4%;
													display: grid;
												}

												#profile-header-more {
													position: absolute;
													top: 0;
													right: 6px;
												}

												div.recreate-profile > div.profile-header-top > div.profile-avatar-image {
													position: relative;
													margin-right: calc(12px * 2 * var(--editor-size-percent));
													width: calc(128px * 2 * var(--editor-size-percent));
													height: calc(128px * 2 * var(--editor-size-percent));
													float: left;
												}

												div.recreate-profile > div.profile-header-top > div.header-caption {
													width: calc(100% - 128px - 24px * 2 * var(--editor-size-percent));
													height: calc(128px * 2 * var(--editor-size-percent));
													position: relative;
													float: left;
													display: flex;
													justify-content: space-between;
													flex-direction: column;
												}

												div.recreate-profile > div.profile-header-top > div.header-caption > div.header-details {
													position: relative;
													float: left;
													display: flex;
													align-items: center;
													justify-content: space-between;
													min-height: 35px;
												}

												div.recreate-profile > div.profile-header-top > div.header-caption > div.header-details > ul.details-info > li {
													float: left;
													display: flex;
													align-items: center;
													flex-direction: row-reverse;
													padding-right: 15px;
												}

												.recreate-group {
													padding: 2%;
													position: relative;
													margin: 0 4% 4%;
													display: grid;
												}

												div.group-header .group-caption {
													width: calc(100% - 156px * 2 * var(--editor-size-percent));
													position: relative;
													float: left;
													height: calc(128px * 2 * var(--editor-size-percent));
													display: flex;
													justify-content: space-between;
													flex-direction: column;
												}

												div.group-header .group-caption .group-name {
													max-width: 100%;
													padding: 0;
												}

												div.group-header .group-caption .group-info {
													width: 100%;
													position: relative;
													float: left;
													display: flex;
													align-items: center;
													justify-content: space-between;
													min-height: calc(35px * 2 * var(--editor-size-percent));
												}

												.group-header .group-caption .group-info .group-stats li {
													float: left;
													display: flex;
													align-items: center;
													padding-right: calc(15px * 2 * var(--editor-size-percent));
												}

												.group-header .group-caption .group-info .group-stats li .font-header-2 {
													margin-right: calc(6px * 2 * var(--editor-size-percent));
												}

												.text-overflow {
													overflow: hidden;
													text-overflow: ellipsis;
													white-space: nowrap;
												}

												.group-menu {
													position: absolute;
													top: 0;
													right: calc(6px * 2 * var(--editor-size-percent));
												}

												p.recreate-text-size,
												div.recreate-text-size,
												.recreate-profile .recreate-text-size,
												.recreate-text-size {
													font-size: calc(16px * 2 * var(--editor-size-percent));
												}

												p.recreate-12px-text-size,
												div.recreate-12px-text-size,
												.recreate-profile	.recreate-12px-text-size,
												.recreate-12px-text-size {
													font-size: calc(12px * 2 * var(--editor-size-percent));
												}

												.stack-header span.recreate-14px-text-size,
												div.recreate-14px-text-size,
												.recreate-14px-text-size {
													font-size: calc(175% * var(--editor-size-percent));
												}

												p.recreate-90p-text-size,
												div.recreate-90p-text-size,
												.recreate-90p-text-size {
													font-size: calc(90% * 2 * var(--editor-size-percent));
												}

												[data-editthemetabs] input:not([type="radio"]),
												[data-editthemetabs] select,
												.rkis-editable-section input:not([type="radio"]),
												.rkis-editable-section select {
													margin: 0 3px 0 3px;
													border-radius: 8px;
													width: calc(100% - 10ch);
													border-style: solid;
												}
												[data-editthemetabs] input[type="range"],
												.rkis-editable-section input[type="range"] {
													border: 0;
												}

												[data-editthemetabs] div > label.rk-label-input,
												[data-editthemetabs] button,
												.rkis-editable-section div > label.rk-label-input,
												.rkis-editable-section button {
													border-radius: 8px;
													border-width: 1px;
													border-style: solid;
												}

												[data-editthemetabs] input:not([type="color"]),
												[data-editthemetabs] select,
												.rkis-editable-section input:not([type="color"]),
												.rkis-editable-section select {
													height: auto;
												}

												[data-editthemetabs] select,
												[data-editthemetabs] div > label.rk-label-input,
												[data-editthemetabs] button,
												.rkis-editable-section select,
												.rkis-editable-section div > label.rk-label-input,
												.rkis-editable-section button {
													background-color: rgba(0,0,0,.7);
													border-color: hsla(0,0%,100%,.2);
													color: #bdbebe;
													padding: 5px 12px;
												}

												.light-theme [data-editthemetabs] select,
												.light-theme .rkis-editable-section select {
													background-color: white;
													border-color: rgb(96 97 98 / 20%);
													color: rgb(96 97 98);
												}

												#themeedit-percent {
													border-radius: 8px;
													background-color: rgba(0,0,0,.7);
													border-color: hsla(0,0%,100%,.2);
													color: #bdbebe;
													padding: 5px 12px;
												}

												.light-theme #themeedit-percent {
													background-color: white;
													border-color: rgb(96 97 98 / 20%);
													color: rgb(96 97 98);
												}

												/*Tab Selection*/

												#rk-editthemesection .menu-option-content {
													padding: 9px;
												}

												.light-theme .rk-popup {
													background-color: rgb(242, 244, 245);
													box-shadow: 0 0 20px 2px white;
												}

												.designer-section {
													background-color: rgb(70 74 78);
												}

												.light-theme .designer-section {
													background-color: rgb(212 212 212);
												}

												/*test*/
												[data-editthemetabs],
												[data-component-holder] {
													display: flex;
													flex-direction: column;
													align-items: center;
												}

												/*Section Selection*/
												.accordion__input:checked ~ .accordion__label {
													color: rgba(255, 255, 255, 0.8);
												}

												.accordion__content {
													animation: fadeout 400ms ease-in;
													opacity: 0;
													display: none;
													background-color: rgb(35, 37, 39);
													border-radius: 10px;
													padding: 10px;
													margin-top: 10px;
												}

												.accordion__content.accordion__show {
													animation: fadein 400ms ease-in;
													opacity: 1;
													display: block;
												}

												@keyframes fadein {
													from {
															opacity: 0;
													}
													to {
															opacity: 1;
													}
												}

												@keyframes fadeout {
													from {
															opacity: 1;
													}
													to {
															opacity: 0;
													}
												}
										</style>
										
										<div data-nav-tab="details" data-editthemetabs="details">

											<div class="section-content" style="width: 100%;">
												<input class="form-control input-field" style="width: 100%;margin-bottom: 0.25rem;" placeholder="Name" id="rk-editor-name">
												<input class="form-control input-field" style="width: 100%;" placeholder="Description" id="rk-editor-desc">
												<div class="rbx-divider" style="margin: 12px;"></div>
												<div>
													<button style="width: calc(50% - 0.4rem);margin: auto;" class="rk-btn" id="rk-editor-theme-dark" data-translate="themeDark">Dark theme</button>
													<button style="width: calc(50% - 0.4rem);" class="rk-btn" id="rk-editor-theme-light" data-translate="themeLight">Light theme</button>
												</div>
											</div>

										</div>
										
										<div data-nav-tab="pages" data-editthemetabs="pages" data-head-component-id="pages" class="active" data-designer-func="add-edits">

											<button class="section-content rk-btn" style="width: 100%;" data-designer-func="add-edits-btn">Add Component</button>

										</div>
										
										<div data-nav-tab="styles" data-editthemetabs="styles" data-head-component-id="styles" data-designer-func="add-edits">

											<button class="section-content rk-btn" style="width: 100%;" data-designer-func="add-edits-btn">Add Component</button>

										</div>

									</div>
								</div>
							</div>
						
							<div id="rk-editthemesectionadding" class="rk-popup-holder" style="z-index: 1100;" data-designer-func="close-edit-adding">
								<div class="rk-popup" style="min-width: 25rem;">
										<h3 style="margin: 0;" data-translate="editorComponentAdding">Add Component</h3>
										<div class="rbx-divider" style="margin: 12px;width: 100%;"></div>
										<input class="form-control input-field" id="rk-search-component-list" placeholder="Search Components" data-translate="editorComponentSearching">
										<div class="rbx-divider" style="margin: 12px;width: 100%;"></div>
										<div class="rk-popup-content rk-scroll" id="rk-add-edits-list" style="padding: 1rem;width: calc(100% + 2rem);max-height: 40vh;">
										
										</div>
								</div>
							</div>

						</div>
					</div>
					<div class="gamepage">
						<div class="tabcontent badges">
							<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabBadges">Badges</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="Badges"></loadcode>
							<loadcode code="settingload" data-id="BadgesHidden"></loadcode>
						</div>
						<div class="tabcontent servers">
							<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="GameBannerToBackground"></loadcode>
							<loadcode code="settingload" data-id="ShowMaxPlayers"></loadcode>

							<div class="serversselector" style="margin: 6px;border-radius: 20px;border: 1px solid grey;padding: 6px 12px;display: flex;align-items: center;">
								<span style="width: 35%;" data-translate="chooseSection">Choose Section:</span>
								<select selected="" style="width: 100%;background-color: rgb(128 128 128 / 40%);padding: 6px;border-radius: 10px;border-right: 1px solid;border-bottom: 1px solid;">
										<option disabled value="" data-translate="chooseSelect">Click to Select</option>
										<option value="privateservers" data-translate="serversPrivate">Private Servers</option>
										<option hidden value="friendservers" data-translate="serversFriends">Friends Servers</option>
										<option value="smallservers" data-translate="serversSmall">Small Servers</option>
										<option value="publicservers" data-translate="serversPublic">Public Servers</option>
										<option hidden value="filteredservers" data-translate="serversFiltered">Filtered Servers</option>
								</select>
							</div>
							<div id="pageloadplace">
								<div class="serversection privateservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversPrivate">Private Servers</span></h3>

									<div class="section-content" hidden>
										<span class="text-lead" data-translate="sectionSLB">Server Link Button.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="PrivateServersLink"><span class="toggle-flip"></span><span class="toggle-on"></span><span class="toggle-off"></span></span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionSLB1">Shows a link button next to the join button and gives server's join link.</span>
									</div>

									<loadcode code="settingload" data-id="AvailPrivateServers"></loadcode>
									<loadcode code="settingload" data-id="ShowPrivateServers"></loadcode>
								</div>
								<div class="serversection friendservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversFriends">Friend Servers</span></h3>

									<div class="section-content">
										<span class="text-lead" data-translate="sectionRJB">Rename Join Button.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="FriendsServersText"><span class="toggle-flip"></span><span class="toggle-on"></span><span class="toggle-off"></span></span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionRJB1">Renames the join button to "Join Private Server" or "Join Public Server" according to the server.</span>
									</div>

									<div class="section-content" hidden>
										<span class="text-lead" data-translate="sectionSLB">Server Link Button.</span>
										<span class="rk-button rk-button receiver-destination-type-toggle on" data-file="FriendsServersLink"><span class="toggle-flip"></span><span class="toggle-on"></span><span class="toggle-off"></span></span>
										<div class="rbx-divider" style="margin: 12px;"></div>
										<span class="text-description" data-translate="sectionSLB1">Shows a link button next to the join button and gives server's join link.</span>
										<div class="text-description" style="color: red;" data-translate="sectionSLink">NOTE: Sharing the link won't work unless the person also have this extension!</div>
									</div>
								</div>
								<div class="serversection smallservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversSmall">Small Servers</span></h3>

									<loadcode code="settingload" data-id="SmallServer"></loadcode>
									<loadcode code="settingload" data-id="SmallServerLink"></loadcode>
								</div>
								<div class="serversection publicservers">
									<h3><span data-translate="categoryGamePage">Game Page</span> &gt; <span data-translate="tabServers">Servers</span> &gt; <span data-translate="serversPublic">Public Servers</span></h3>

									
									<loadcode code="settingload" data-id="PublicServersLink"></loadcode>
									<loadcode code="settingload" data-id="PageNav"></loadcode>
								</div>
							</div>
						</div>
					</div>
					<div class="profiles">
						<div class="tabcontent profilepage">
							<h3><span data-translate="categoryProfiles">Profiles</span> &gt; <span data-translate="tabProfilePage">Profile Page</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>
							
							<loadcode code="settingload" data-id="LastStats"></loadcode>
							<loadcode code="settingload" data-id="CancelPending"></loadcode>
						</div>
						<div class="tabcontent friendspage">
							<h3><span data-translate="categoryProfiles">Profiles</span> &gt; <span data-translate="tabFriendsPage">Friends Page</span></h3>
							<button class="main-save-button" data-translate="btnSave">Save</button>

							<span class="text-description" data-translate="NoSettingReason">No Settings? Visit the page mentioned in this Tab's name</span>
							<div class="rbx-divider" style="margin: 12px;"></div>

							<loadcode code="settingload" data-id="QuickRemove"></loadcode>
						</div>
					</div>
					<div class="tabcontent search-features">
						<span class="text-description">Make sure to save after editing!</span>
						<div class="rbx-divider" style="margin: 12px;"></div>
						<button class="main-save-button" data-translate="btnSave">Save</button>
						<input class="form-control input-field" placeholder="Search" id="rk-search-features">
						<div class="rbx-divider" style="margin: 12px;"></div>
					</div>
					<div class="tabcontent experiment-styles">
						<div class="experiments-passgame">
							<span class="text-description">Warning: Enabling experiments might break the site design!<br>To access experiments you must solve the puzzle below:</span>
							<div class="rbx-divider" style="margin: 12px;"></div>
							<div style="text-align: center;"><h2 id="experiments-puzzle">Puzzle not loaded yet.</h2></div>
							<input class="form-control input-field" placeholder="Passcode" id="experiments-puzzle-solution">
							<div class="rbx-divider" style="margin: 12px;"></div>
						</div>
						<div class="experiments-page" style="display: none;">
							<input class="form-control input-field" placeholder="Search" id="rk-search-experiments">
							<div class="rbx-divider" style="margin: 12px;"></div>
							<div class="experiments-list"></div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		var ttle = document.createElement("title");
		ttle.textContent = Rkis.language["settingsPageTitle"];

		document.firstElementChild.insertBefore(ttle, document.firstElementChild.firstElementChild);

		page.start();

		mainplace.querySelector(`#download-roblokis-data`).addEventListener('click', () => {
			let rawText = JSON.stringify(Rkis.wholeData);
			makeTextFile(rawText, 'Raw Roblokis Data.json');
		});
		mainplace.querySelector(`#delete-roblokis-data`).addEventListener('click', () => {
			let confirmation = confirm("WARNING: This can not be undone!\nContinuing will remove all your Roblokis information;\n-settings\n-themes\nare included, Continue?");
			if (confirmation === true) {
				Rkis.database.clearDatabase(confirmation);
				location.reload();
			}
		});
		mainplace.querySelector(`#import-roblokis-data`).addEventListener('change', async () => {
			let fileInput = mainplace.querySelector(`#import-roblokis-data`);
			let filedata = null;
			try{
				if(fileInput.files.length > 0) {
					filedata = JSON.parse(await fileInput.files[0].text())
				}
			}catch{}
			if (filedata == null) {
				alert("Corrupt file!!! Couldn't load.")
				return;
			}
			Rkis.wholeData = filedata;
			await Rkis.database.save();
			window.location.reload();
		});

		mainplace.querySelector(`#rk-search-component-list`).addEventListener('input', (e) => {
			let componentList = mainplace.querySelectorAll(`#rk-add-edits-list > .add-components-card`);

			let input = e.target;
			let text = input.value.toLowerCase();

			componentList.forEach(x => {
				let title = x.querySelector(`div > div`).textContent.toLowerCase();
				let description = x.querySelector(`div > span`).textContent.toLowerCase();

				if (!(title.includes(text) || description.includes(text))) {
					x.style.display = 'none';
					return;
				}
				
				x.style.display = '';
			});
		});
		
		mainplace.querySelector(`#rk-search-features`).addEventListener('input', (e) => {
			let page = mainplace.querySelector(`.search-features`);
			page.querySelectorAll(`loadcode`).forEach(x => x.remove());

			let input = e.target;
			let text = input.value;
			if (text === '') return;

			let spesificFeature = Rkis.wholeData[text];
			if (spesificFeature != null && spesificFeature.id != null) {
				let featureElement = document.createElement('loadcode');
				featureElement.setAttribute('code', 'settingload');
				featureElement.dataset.id = spesificFeature.id;
				page.appendChild(featureElement);
				return;
			}
			
			text = text.toLowerCase();

			let featuresList = Object.values(Rkis.wholeData)
			.filter(setting => {
				if (setting == null || typeof setting != "object" || setting.id == null) return false;

				return true;
			})
			.filter((setting, i, all) => {
				if (setting.details == null) return false;
				if (setting.details.default == null) return false;
				let detail = setting.details[setting.details.default];
				if (detail == null) return false;
				if (detail.name == null) return false;
				if (all.filter(x => x.details[x.details.default].name.toLowerCase().includes(detail.name.toLowerCase())).length > 1) return false;
				if (detail.name?.toLowerCase().includes(text)) return true;
				if (detail.description?.toLowerCase().includes(text)) return true;

				return false;
			});

			featuresList.forEach(feature => {
				let featureElement = document.createElement('loadcode');
				featureElement.setAttribute('code', 'settingload');
				featureElement.dataset.id = feature.id;
				page.appendChild(featureElement);
			});
		});

		window.location.href.split("search=").forEach((query, i) => {
			if (i !== 1) return;

			let text = decodeURIComponent(query.split("&")[0]);
			let input = mainplace.querySelector(`#rk-search-features`);
			input.value = text;
			input.dispatchEvent(new InputEvent('input'), {});
		});

		let experimentsPasscode = getRndInteger(10001,99999);
		let puzzleDisplay = mainplace.querySelector(`#experiments-puzzle`);
		if (puzzleDisplay) puzzleDisplay.textContent = experimentsPasscode.toString(2);
		mainplace.querySelector(`#experiments-puzzle-solution`).addEventListener('input', (e) => {
			let input = e.target;
			let text = input.value;
			if (text === '') return;
			if (parseInt(text) !== experimentsPasscode) return;
			input.remove();

			enableExperimentsPage();
		});
	});
}

try {
	page.settingsWaitingForGeneral();
} catch (err) {
	if (err != null) {
		if (Rkis != null && Rkis.Toast != null) {
			Rkis.Toast('Error: '+ new String(err));
		} else {
			prompt(`A problem occured with Roblokis, Please report to the developers\nError Code:`, err.stack || new String(err));
		}
	}

	page.settingsWaitingForGeneral();
}



async function enableExperimentsPage() {
	let tabPage = document.querySelector("#container-main > div.content .experiment-styles");
	let experimentsPassgame = tabPage.querySelector('.experiments-passgame');
	if (experimentsPassgame.style.display === 'none') return;
	let experimentsPage = tabPage.querySelector('.experiments-page');
	if (experimentsPassgame) experimentsPassgame.style.display = 'none';
	if (experimentsPage) experimentsPage.style.display = '';
	let experimentslist = tabPage.querySelector('.experiments-list');

	Rkis.wholeData.ExperimentsCSS = Rkis.wholeData.ExperimentsCSS || [];
	let experimentsCSS = await BROWSER.runtime.sendMessage({about: 'getURLRequest', url: 'https://ameerdotexe.github.io/roblokis/data/experiments/css.json'}).catch(() => null);
	if (experimentsCSS == null || experimentsCSS.experimentsCSS == null) return;
	let experimentsList = experimentsCSS.experimentsCSS;
	let saveTimeout = null;
	let saveTimeoutFunc = function() {
		if (saveTimeout !== null) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			saveTimeout = null;
			Rkis.database.save();
		}, 1000);
	};

	Object.keys(experimentsList).forEach(experimentId => {
		const experiment = experimentsList[experimentId];
		let experimentElement = document.createElement('div');
		experimentElement.classList.add('rk-experiment', 'section-content');
		experimentElement.dataset.id = experimentId;

		let experimentHTML = `
			<span class="text-lead">${escapeHTML(experiment.name)}</span>
			<span class="rk-button receiver-destination-type-toggle off">
				<span class="toggle-flip"></span>
				<span class="toggle-on"></span>
				<span class="toggle-off"></span>
			</span>
			<div class="rbx-divider" style="margin: 12px;"></div>
			<span class="text-description">${escapeHTML(experiment.description || '')}</span>
		`;

		experimentElement.innerHTML = experimentHTML;

		let experimentSwitch = experimentElement.querySelector('.receiver-destination-type-toggle');
		page.toggleSwich(experimentSwitch, Rkis.wholeData.ExperimentsCSS.includes(experimentId));
		experimentSwitch.addEventListener('click', () => {
			if (page.toggleSwich(experimentSwitch)) {
				experimentSwitch.classList.remove('on');
				experimentSwitch.classList.add('off');

				// enabledExperiments = enabledExperiments.filter(x => x !== experimentId);
				Rkis.wholeData.ExperimentsCSS.push(experimentId);
			} else {
				experimentSwitch.classList.remove('off');
				experimentSwitch.classList.add('on');
				
				// enabledExperiments.push(experimentId);
				Rkis.wholeData.ExperimentsCSS = Rkis.wholeData.ExperimentsCSS.filter(x => x !== experimentId);
			}

			saveTimeoutFunc();
		});

		experimentslist.appendChild(experimentElement);
	});

	experimentsPage.querySelector(`#rk-search-experiments`).addEventListener('input', (e) => {
		let input = e.target;
		let text = input.value;
		// if (text === '') return;

		let experimentsElements = experimentslist.querySelectorAll(`.rk-experiment`);
		experimentsElements.forEach(experimentElement => {
			if (experimentElement.textContent.toLowerCase().includes(text.toLowerCase())) {
				experimentElement.style.display = '';
			} else {
				experimentElement.style.display = 'none';
			}
		});
	});
}