"use strict";

/* globals escapeJSON, HTMLParser, FetchImage, getLocaleMessage */

// eslint-disable-next-line no-var, no-use-before-define
var Rkis = Rkis || {};
Rkis.ThemeEdtior = Rkis.ThemeEdtior || {};

/*	Custom Gif Background Ugly Workaround	*/
const BackgroundImageToElements = {
	/* all.css */
	"": "#rbx-body",
	"menu": "#header,#navigation,#footer-container",
	"content": "#container-main > div.content",
	"icon": ":root .rbx-body .icon-logo",
	"iconr": ":root .rbx-body .icon-logo-r, :root .rbx-body .icon-logo-r-95",
	"avatar": ".avatar .avatar-card-image",
	"quickgamejoin": "#rbx-body.rbx-body .rk-quickgamejoin",
	"popup": "#rbx-body .modal-dialog .modal-content,#rbx-body > .popover,#rbx-body .rbx-header .rbx-navbar-right .popover-content",
	"gamesection": "div > .game-carousel, .game-grid, .game-cards",
	"peoplesection": ".rbx-body .content .friends-carousel-list-container",

	/* groups.css */
	"group": `#group-container > div > div > div.group-details > div > div.section-content,
	#horizontal-tabs > li > a,
	#configure-group > configure-group-page > div > div:nth-child(2) > div > configure-group-menu > div.menu-vertical-container > ul,
	#group-shout > div.section-content.shout-container,
	#group-container > div > div > div.group-details > div > div[group-about] > div > group-wall > div > div.section-content.group-wall.group-wall-no-margin,
	#group-container > div > div > div.group-details > div > div[group-about] > div > group-members-list > div > div.section-content.group-members-list,
	#group-container > div > div > groups-list > div.menu-vertical-container > ul.menu-vertical,
	#configure-group > configure-group-page > div > div:nth-child(2) > div > div > configure-group-settings > div > div > div.section-content,
	#configure-group > configure-group-page > div > div:nth-child(2) > div > div > revenue-summary > div.section > table,
	#configure-group > configure-group-page > div > div:nth-child(2) > div > div > configure-group-members > div > configure-group-members-list > ul > configure-group-member-card > li > div,
	#configure-group > configure-group-page > div > div:nth-child(2) > div > div > configure-group-roles > div > configure-group-role-settings > div > div > div.section-content,
	#configure-group > configure-group-page > div > div:nth-child(2) > div > div > configure-group-allies > div > configure-group-allies-list > div.group-affiliates > ul > configure-group-affiliate-card > li > div,
	#configure-group > configure-group-page > div > div:nth-child(2) > div > div > configure-group-allies > div > configure-group-ally-requests > div.group-affiliates > ul > configure-group-affiliate-request-card > li > div,
	#group-container > div > div > div.group-details > div > group-wall > div > div.section-content.group-wall.group-wall-no-margin`,

	/* profile.css */
	"profile": `#container-main > div.content > div.profile-container > div > div.btr-profile-container > div.btr-profile-left > div.btr-profile-about.profile-about > div.section-content,
	#roblox-badges-container > div.section-content,
	#container-main > div.content > div.profile-container > div > div.btr-profile-container > div.btr-profile-right > div.btr-profile-favorites > div.section-content,
	#container-main > div.content > div.profile-container > div > div.btr-profile-container > div.btr-profile-left > div.btr-profile-playerbadges > div.section-content,
	#container-main > div.content > div.profile-container > div > div.btr-profile-container > div.btr-profile-left > div.btr-profile-groups > div.section-content,
	#btr-injected-inventory,
	#profile-current-wearing-avatar > div.profile-avatar-right.visible`,

	/* games.css */
	"gameplay": "#game-details-play-button-container > button",
	"badge": `#game-badges-container > game-badges-list > div:not(.btr-badges-container) > ul > li.badge-row,
	.rbx-body .game-badges-list > ul.stack-list > li.badge-row`,
	"privateserver": "#game-instances #rbx-private-running-games > ul > li",
	"privateserver.button": "#rbx-private-running-games > ul > li > div.card-item > div.rbx-private-game-server-details > span > *",
	"friendsserver": "#game-instances #rbx-friends-game-server-item-container > li",
	"friendsserver.button": "#rbx-friends-game-server-item-container li div.rbx-friends-game-server-details > span > *",
	"smallserver": "#game-instances #rbx-small-game-server-item-container > li",
	"smallserver.button": "#rbx-small-game-server-item-container li div.game-server-details > span > *",
	"publicserver": "#game-instances #rbx-recent-server-box > li,#game-instances #rbx-public-game-server-item-container > li",
	"publicserver.button": "#rbx-public-game-server-item-container li div.game-server-details > span > *",
	"pagenav": `#rbx-public-running-games > div.rbx-public-running-games-footer > button,
	#rbx-public-running-games > div.ropro-running-games-footer > button,
	#rbx-public-running-games > div.btr-server-pager > ul.btr-pager > li > button,
	#rbx-small-running-games > button,
	#rbx-private-running-games > div > button,
	#rkpagenav > *`,

	/* avatar.css */
	"avatareditor": "#avatar-web-app div[avatar-back] > div.avatar-back",
};

class PopupPage {
	/** @type {ThemeEditorPopup} */
	themeEditorPopup;
	/** @type {HTMLDivElement} */
	html;
	/** @type {boolean} */
	_isHidden = true;

	initialHTML = ``;
	load() {}
	unload() {}
	show() {}
	hide() {}
}

const DefaultThemeEditorComponents = (() => {
	class PageChanger extends PopupPage {
		// filtered for the component
		themeData;

		initialHTML = `
			<h5 style="margin: 5px;padding-bottom: 5px;">Where to apply changes?</h5>
			<div class="rk-option-select rk-page-select" style="padding: 1.5rem 0.75rem;">
				<h3>Site-Wide</h3>
				<span>Make changes globally.</span>
			</div>
			<div class="rk-option-select rk-page-select" style="padding: 1.5rem 0.75rem;">
				<h3>This Page</h3>
				<span>Make changes only here.</span>
			</div>
		`;

		load = () => {
			this.themeData = this.themeEditorPopup.themeData.pages || {};
			console.log("theme", this.themeEditorPopup.themeData);

			const options = this.html.querySelectorAll(".rk-page-select");
			options[0].addEventListener("click", () => {
				const componentPage = new DefaultThemeEditorComponents.ComponentPage(this, "all");
				this.themeEditorPopup.updatePopupContent(componentPage);
			});

			if (Rkis.pageName === "all") {
				options[1].classList.add("disabled");
				return;
			}

			options[1].addEventListener("click", () => {
				const componentPage = new DefaultThemeEditorComponents.ComponentPage(this, Rkis.pageName);
				this.themeEditorPopup.updatePopupContent(componentPage);
			});
		};
	}

	class CustomComponent extends PopupPage {
		/** @type {string} */
		id;
		/** @type {ComponentInfo} */
		info;
		/** @type {string[]} */
		themePath = [];
		// filtered for the component
		themeData;
		/** @type {CustomComponent} */
		previousComponent;
		isBeingOverwritten = false;

		/** @param {PopupPage | CustomComponent} previousComponent */
		constructor(previousComponent, componentId, componentType = 1) {
			super();
			this.id = this.id || componentId;
			this.previousComponent = previousComponent;

			// get current path in theme data
			this.previousComponent.themePath?.forEach(p => this.themePath.push(p));
			this.themePath.push(this.id);

			// get component info
			// eslint-disable-next-line no-use-before-define
			this.info = ListOfThemeEditorComponents.find(x =>
				x.id === this.id
				&& getComponentType(x.Element) === componentType,
			);
			if (this.info?.isPageChild === true) {
				this.themePath = [this.themePath[0], this.themePath.at(-1)];
			}

			// get theme data filtered to our component
			if (
				previousComponent instanceof DefaultThemeEditorComponents.PageChanger
				|| this.info?.isPageChild !== true
			) {
				this.themeData = previousComponent.themeData?.[this.id];
				console.log(this.id, this.themeData, this);
			}
			else {
				const pageCompoennt = ThemeEditorPopup.instance.dynamicPagesHistory.at(1);
				this.themeData = pageCompoennt.themeData?.[this.id];
				console.log(this.id, this.themeData, this);
			}

			// check for overwriting
			if (this.themePath[0] === "all") {
				let spesificPageData = ThemeEditorPopup.instance.themeData?.pages?.[Rkis.pageName];
				if (spesificPageData != null) {
					for (let pathIndex = 1; pathIndex < this.themePath.length; pathIndex++) {
						const path = this.themePath[pathIndex];
						spesificPageData = spesificPageData?.[path];
					}
					if (spesificPageData != null)
						this.isBeingOverwritten = true;
				}
			}

			// set default
			// this.themeData = this.themeData || {};
		}

		initialHTML = `
			<h5 class="rk-name">Unknown Component?</h5>
			<span class="rk-description"></span>
		`;

		load = () => {
			const name = this.html.querySelector(".rk-name");
			const description = this.html.querySelector(".rk-description");
			if (this.info && this.info.details) {
				name.textContent = this.info.details.name;
				description.textContent = this.info.details.description || "";
			}
		};

		unload = () => {
			if (typeof this.save == "function")
				this.themeData = this.save();

			if (
				this.previousComponent instanceof DefaultThemeEditorComponents.PageChanger
				|| this.info?.isPageChild !== true
			) {
				this.previousComponent.themeData[this.id] = this.themeData;
				console.log(this.id, this.previousComponent.themeData);
			}
			else {
				const pageCompoennt = this.themeEditorPopup.dynamicPagesHistory.at(1);
				pageCompoennt.themeData[this.id] = this.themeData;
				console.log(this.id, pageCompoennt.themeData);
			}
		};

		getHighlightElements = () => {
			/** @type {HTMLElement[]} */
			const highlightableElements = [];
			if (this.info.highlightSelectors == null)
				return highlightableElements;

			this.info.highlightSelectors.forEach(({ highlight }) => {
				document.querySelectorAll(highlight).forEach((elementHighlight) => {
					highlightableElements.push(elementHighlight);
				});
			});

			return highlightableElements;
		};

		// helper functions for repetitve checks
		_GetDefaultValue = () => {
			if (this.themePath[0] === "all")
				return null;

			let allPageData = this.themeEditorPopup.themeData?.pages?.all;
			if (allPageData != null) {
				for (let pathIndex = 1; pathIndex < this.themePath.length; pathIndex++) {
					const path = this.themePath[pathIndex];
					allPageData = allPageData?.[path];
				}
			}
			console.log("live data", allPageData, this.themePath);
			return allPageData;
		};

		_AppendOverwritten = () => {
			if (this.isBeingOverwritten) {
				const element = HTMLParser("<div class=\"rk-option-select rk-red no-hover\">", HTMLParser("<span>", "This component is being overwritten."));
				this.html.prepend(element);
			}
		};

		_SetupClearButton = () => {
			this.html.querySelector("#rk-bg-clear-btn")
				?.addEventListener("click", () => {
					this.themeData = null;
					this.isBeingUsed = false;
					this.update();
				});
		};

		_TriggerLiveUpdate = () => {
			if (typeof this.applyLiveChanges != "function")
				return;

			if (!this.isBeingOverwritten) {
				if (this.lastAnimationFrame !== null)
					clearTimeout(this.lastAnimationFrame);
				else this.applyLiveChanges(this.themeData);
				this.lastAnimationFrame = setTimeout(this.applyLiveChanges, 450, this.themeData);
			}
		};
	}

	class ComponentPage extends CustomComponent {
		cssPropertyName;

		/** @param {PopupPage | CustomComponent} previousComponent */
		constructor(previousComponent, componentId) {
			super(previousComponent, componentId, 3);
			this.themeData = this.themeData || {};

			this.cssPropertyName = this.id;
			if (this.info.isPreviousDependant === true) {
				this.cssPropertyName = `${this.previousComponent.cssPropertyName}-${this.cssPropertyName}`;
			}
		}

		initialHTML = `
			<h5 class="rk-name">Unknown Component?</h5>
			<span class="rk-description"></span>
			<div class="rk-option-select">
				<span>Customize</span>
			</div>
			<div class="rk-option-select">
				<span>Style</span>
			</div>
			<div class="rk-option-select">
				<span>Components</span>
			</div>
		`;

		load = () => {
			this.handleHover();

			const name = this.html.querySelector(".rk-name");
			const description = this.html.querySelector(".rk-description");
			if (this.info && this.info.details) {
				name.textContent = this.info.details.name;
				description.textContent = this.info.details.description || "";
			}

			const options = this.html.querySelectorAll(".rk-option-select");
			const customizationsCount = this.themeEditorPopup.getAvailableComponents(1, this).length;
			if (customizationsCount > 0) {
				options[0].querySelector("span").textContent += ` (${customizationsCount})`;
				options[0].addEventListener("click", () => {
					const optionsPage = new DefaultThemeEditorComponents.CustomizeOptions(this, 1);
					this.themeEditorPopup.updatePopupContent(optionsPage);
				});
			}
			else {
				options[0].classList.add("disabled");
			}

			const stylesCount = this.themeEditorPopup.getAvailableComponents(2, this).length;
			if (stylesCount > 0) {
				options[1].querySelector("span").textContent += ` (${stylesCount})`;
				options[1].addEventListener("click", () => {
					const optionsPage = new DefaultThemeEditorComponents.CustomizeOptions(this, 2);
					this.themeEditorPopup.updatePopupContent(optionsPage);
				});
			}
			else {
				options[1].classList.add("disabled");
			}

			const componentsCount = this.themeEditorPopup.getAvailableComponents(3, this).length;
			if (componentsCount > 0) {
				options[2].querySelector("span").textContent += ` (${componentsCount})`;
				options[2].addEventListener("click", () => {
					const optionsPage = new DefaultThemeEditorComponents.ComponentOptions(this);
					this.themeEditorPopup.updatePopupContent(optionsPage);
				});
			}
			else {
				options[2].classList.add("disabled");
			}
		};

		save = () => {
			let isEmpty = true;

			for (const key in this.themeData) {
				const element = this.themeData[key];
				if (element == null)
					delete this.themeData[key];
				else isEmpty = false;
			}

			if (isEmpty)
				return null;
			return this.themeData;
		};

		handleHover = () => {
			this.html.addEventListener("pointerenter", () => {
				this.getHighlightElements().forEach((elementHighlight) => {
					elementHighlight.classList.add("rk-highlight-editable");
				});
			});
			this.html.addEventListener("pointerleave", () => {
				document.querySelectorAll(".rk-highlight-editable").forEach((elementHighlight) => {
					elementHighlight.classList.remove("rk-highlight-editable");
				});
			});
		};

		hide = () => {
			document.querySelectorAll(".rk-highlight-editable").forEach((elementHighlight) => {
				elementHighlight.classList.remove("rk-highlight-editable");
			});
		};
	}

	class StylePage extends CustomComponent {
		options = [];
		/** @type {StyleOptions} */
		selectedOption = null;

		/** @param {PopupPage | CustomComponent} previousComponent */
		constructor(previousComponent, componentId) {
			super(previousComponent, componentId, 2);

			let styleData = ThemeEditorPopup.instance.themeData?.styles;
			if (styleData != null) {
				for (let pathIndex = 0; pathIndex < this.themePath.length; pathIndex++) {
					const path = this.themePath[pathIndex];
					styleData = styleData?.[path];
				}
			}
			this.themeData = styleData || {};
		}

		initialHTML = `
			<h3 class="rk-name">Unknown Component?</h3>
			<span class="rk-description"></span>

			<label class="rk-line-option">
				<span data-translate="themeStyle">Style:</span>
				<select class="rk-option-select" selected="" id="style-dropdown">
					<option value="">Disabled</option>
				</select>
			</label>

			<div class="rbx-divider" style="margin: 12px;"></div>

			<div id="style-options">
				<span>No Details.</span>
			</div>

			<div class="rbx-divider" style="margin: 12px;"></div>
		`;

		load = () => {
			const element = this.html;
			const component = this.info;

			// setup component info
			element.querySelectorAll(`.rk-name, .rk-description`).forEach((infoElement) => {
				const infoType = infoElement.classList.contains("rk-name") ? "name" : "description";
				const hasLanguageTag = component.details.translate != null;

				const detail = component.details;
				const translate = component.details.translate;

				if (infoType === "name") {
					infoElement.textContent = detail.name;
					if (hasLanguageTag)
						infoElement.dataset.translate = translate.name;
				}
			});

			// setup data
			this.options = component.data?.options;
			if (this.options == null) {
				console.error("no options, ThemeEditor.js:410");
				Rkis.Toast("Error: TE411");
				return;
			}

			const dropdown = element.querySelector(`#style-dropdown`);
			dropdown.$clear();
			this.options.forEach((option) => {
				const details = escapeJSON(option.details);
				dropdown.appendChild(
					HTMLParser(`<option value="${option.value}" data-translate="${details.translate?.name || ""}">`, details.name,
					),
				);
			});

			// initilize listeners
			dropdown.addEventListener("input", () => {
				this.themeData.type = dropdown.value;
				this.themeData.options = null;
				this.update();
			});

			// load data
			if (this.themeData != null) {
				// element.updateOption(theme_object.type || '', theme_object.options || null);
			}

			// element.querySelector(`#style-dropdown`).dispatchEvent(new Event('input'));
			this.update();
		};

		unload = () => {
			if (typeof this.save == "function")
				this.themeData = this.save();

			if (this.selectedOption) {
				this.selectedOption._isHidden = true;
				this.selectedOption.hide();
				this.selectedOption.unload();
			}

			let styleData = ThemeEditorPopup.instance.themeData?.styles;
			for (let pathIndex = 0; pathIndex < this.themePath.length - 1; pathIndex++) {
				const path = this.themePath[pathIndex];
				styleData = styleData?.[path];
			}
			styleData[this.themePath.at(-1)] = this.themeData;
		};

		update = () => {
			// this.themeData

			const element = this.html;
			const value = this.themeData?.type || "";
			const styleOptions = this.themeData?.options || null;

			let option = this.options.find(x => x.value === value);
			if (option == null)
				option = this.options.find(x => x.value === "");
			this.themeData.type = value;
			element.querySelector(`#style-dropdown`).value = option.value;
			// const hasDetails = false;

			// descriptionElem.textContent = option.details.description || '';
			// descriptionElem.dataset.translate = option.details.translate?.description || '';
			// if (descriptionElem.textContent.length > 0) hasDetails = true;

			// if (option.image != null) {
			// 	if (option.isPortrait === true) imageHolder.style.display = "block";
			// 	imageHolder.innerHTML = `<img src="${escapeHTML(BROWSER.runtime.getURL(option.image))}" class="rk-style-image">`;

			// 	const imageElement = imageHolder.querySelector('img');
			// 	imageElement.addEventListener('click', () => {
			// 		imageElement.classList.toggle("rk-focus-zoom-image");
			// 	});

			// 	hasDetails = true
			// }
			// else imageHolder.$clear();

			// if (hasDetails === false) detailsDivider.style.display = "none";
			// else detailsDivider.style.display = "";

			// live update
			/* const styleLoader = Rkis.StylesList;
			if (styleLoader != null) {
				for (const pathIndex = 0; pathIndex < this.themePath.length; pathIndex++) {
					const path = this.themePath[pathIndex];
					styleLoader = styleLoader?.[path];
				}
			}
			if (styleLoader != null) {
				const activeStyle = styleLoader[styleLoader["Current Active"]];
				if (activeStyle != null) {
					if (activeStyle.css) Rkis.Designer.removeCSS(activeStyle.css);
					activeStyle.unload?.();
				}
				styleLoader["Current Active"] = null;
				const selectedStyle = styleLoader[value];
				console.log({selectedStyle, activeStyle: styleLoader["Current Active"]});
				if (selectedStyle != null) {
					if (selectedStyle.css) Rkis.Designer.addCSS(selectedStyle.css);
					selectedStyle.load?.({
						type: value,
						options: styleOptions,
					});
					styleLoader["Current Active"] = value;
				}
			} */

			this.loadOptionComponent(option, styleOptions || null);

			// live update
			Rkis.StylesList.updateStyle(this.themePath, this.save());
		};

		save = () => {
			const element = this.html;

			const style = element.querySelector(`#style-dropdown`).value;

			const options = this.saveOptionComponent() || null;

			return {
				type: style,
				options,
			};
		};

		loadOptionComponent = (style, styleOptions) => {
			const element = this.html;
			const componentElement = element.querySelector(`#style-options`);
			if (style == null || style.Element == null) {
				componentElement.innerHTML = "<span style=\"margin: 0 0.5rem;\">No Extra Options.</span>";
				this.selectedOption = null;
				return;
			}

			this.selectedOption = new style.Element(this);
			this.selectedOption.styleData = styleOptions;
			componentElement.innerHTML = this.selectedOption.initialHTML;
			this.selectedOption.show();
			this.selectedOption._isHidden = false;
			this.selectedOption.html = componentElement;

			this.selectedOption.load();
		};

		updateOptionComponent = () => {
			// console.log("stylopt", this.saveOptionComponent());

			// live update
			let styleLoader = Rkis.StylesList;
			if (styleLoader != null) {
				for (let pathIndex = 0; pathIndex < this.themePath.length; pathIndex++) {
					const path = this.themePath[pathIndex];
					styleLoader = styleLoader?.[path];
				}
			}
			if (styleLoader?.[this.themeData.type] != null) {
				styleLoader[this.themeData.type].update?.(this.save());
			}
		};

		saveOptionComponent = () => {
			if (this.selectedOption == null)
				return null;
			return this.selectedOption.save();
		};
	}

	class CustomizeOptions extends PopupPage {
		/** @type {ComponentPage} */
		mainComponent;
		type = 0;

		/** @param {ComponentPage} componentPage */
		constructor(componentPage, type) {
			super();
			this.mainComponent = componentPage;
			this.type = type;
		}

		initialHTML = `<h5>What to Customize?</h5>`;
		load = () => {
			/** @param {ComponentInfo} componentInfo */
			const createOption = (componentInfo) => {
				const element = HTMLParser("<div class=\"rk-option-select rk-customize-select\">", HTMLParser("<span>", componentInfo.details?.name || "Unknown Component"), HTMLParser("<span>", componentInfo.details?.description || ""));
				this.html.appendChild(element);
				element.addEventListener("click", () => {
					const componentPage = new componentInfo.Element(this.mainComponent, componentInfo.id);
					this.themeEditorPopup.updatePopupContent(componentPage);
					this.themeEditorPopup.removePageFromHistory(this);
				});
			};

			// Find usable components
			const components = this.themeEditorPopup.getAvailableComponents(this.type, this.mainComponent);

			components.forEach((comp) => {
				createOption(comp);
			});
		};
	}

	// Make it extend and overwrite CustomizeOptions
	class ComponentOptions extends PopupPage {
		/** @type {ComponentPage} */
		mainComponent;

		/** @param {ComponentPage} componentPage */
		constructor(componentPage) {
			super();
			this.mainComponent = componentPage;
		}

		load = () => {
			/** @param {ComponentInfo} componentInfo */
			const createOption = (componentInfo) => {
				const element = HTMLParser("<div class=\"rk-option-select rk-component-select\">", HTMLParser("<h5>", componentInfo.details?.name || "Unknown Component"), HTMLParser("<span>", componentInfo.details?.description || ""));
				this.html.appendChild(element);
				this.handleHoverFor(element, componentInfo);
				element.addEventListener("click", () => {
					const componentPage = new DefaultThemeEditorComponents.ComponentPage(this.mainComponent, componentInfo.id);
					this.themeEditorPopup.updatePopupContent(componentPage);
					this.themeEditorPopup.removePageFromHistory(this);
				});
			};

			this.html.appendChild(HTMLParser("<h5>", `Inside ${this.mainComponent.info.details?.name}` || "Unknown Component"));

			// Find usable components
			const components = this.themeEditorPopup.getAvailableComponents(3, this.mainComponent);

			components.forEach((comp) => {
				createOption(comp);
			});
		};

		handleHoverFor = (element, info) => {
			element.addEventListener("pointerenter", () => {
				this.getHighlightElements.apply({ info }).forEach((elementHighlight) => {
					elementHighlight.classList.add("rk-highlight-editable");
				});
			});
			element.addEventListener("pointerleave", () => {
				document.querySelectorAll(".rk-highlight-editable").forEach((elementHighlight) => {
					elementHighlight.classList.remove("rk-highlight-editable");
				});
			});
		};

		hide = () => {
			document.querySelectorAll(".rk-highlight-editable").forEach((elementHighlight) => {
				elementHighlight.classList.remove("rk-highlight-editable");
			});
		};

		// copied over but converted to normal function
		getHighlightElements = function () {
			/** @type {HTMLElement[]} */
			const highlightableElements = [];
			if (this.info.highlightSelectors == null)
				return highlightableElements;

			this.info.highlightSelectors.forEach(({ highlight }) => {
				document.querySelectorAll(highlight).forEach((elementHighlight) => {
					highlightableElements.push(elementHighlight);
				});
			});

			return highlightableElements;
		};
	}

	// used for styles, unlike the 2 above. its not for ComponentPage
	class StyleOptions extends PopupPage {
		styleData;
		preservedData = [];

		/** @type {StylePage} */
		previousComponent;

		/** @param {StylePage} previousComponent */
		constructor(previousComponent) {
			super();
			this.previousComponent = previousComponent;
		}

		load = () => {
			const element = this.html;

			// initilize listeners
			element.querySelectorAll("[data-location]")
				.forEach((input) => {
					if (input.classList.contains("btn-toggle")) {
						input.addEventListener("click", () => {
							input.classList.toggle("on", input.classList.contains("off"));
							input.classList.toggle("off", !input.classList.contains("off"));
							this.update();
						});
						return;
					}
					input.addEventListener("input", () => this.update());
				});
			element.querySelectorAll("[data-image-button]").forEach((btn) => {
				const imagePlace = btn.dataset.imageButton;
				this.preservedData.push(imagePlace);
				btn.addEventListener("click", () => {
					// eslint-disable-next-line no-new
					new DefaultThemeEditorComponents.ImageInput(this.styleData?.[imagePlace], (imageData) => {
						if (!this.styleData)
							this.styleData = {};
						this.styleData[imagePlace] = imageData;
						this.update();
					});
				});
			});

			// load data
			if (this.styleData != null) {
				for (const key in this.styleData) {
					const value = this.styleData[key];
					if (value == null)
						continue;

					const input = element.querySelector(`[data-location="${key}"]`);
					if (input == null)
						continue;

					if (input.classList.contains("btn-toggle")) {
						input.classList.toggle("on", value);
						input.classList.toggle("off", !value);
					}
					else {
						input.value = value;
					}
				}
			}
		};

		update = () => {
			this.styleData = this.save();
			this.previousComponent?.updateOptionComponent?.();
		};

		save = () => {
			const element = this.html;
			const component_object = {};

			element.querySelectorAll(`[data-location]`).forEach((input) => {
				const edge = input.dataset.location;
				let value = null;
				if (input.classList.contains("btn-toggle")) {
					value = input.classList.contains("on");
				}
				else {
					value = input.value;
				}

				component_object[edge] = value;
			});

			for (let i = 0; i < this.preservedData.length; i++) {
				const dataName = this.preservedData[i];
				component_object[dataName] = this.styleData?.[dataName];
			}

			return component_object;
		};
	}

	class ImageInput extends PopupPage {
		imageData;
		/** @type {(imageData: any) => {}} */
		callback;

		gradientPoints = [];
		gradientAngle = 90;
		selectedPoint = null;

		constructor(imageData, callback) {
			super();
			this.imageData = imageData;
			this.callback = callback;

			// add element
			const holder = document.createElement("div");
			holder.innerHTML = this.initialHTML;
			this.show();
			this._isHidden = false;
			document.body.appendChild(holder);
			this.html = holder;

			this.load();
		}

		initialHTML = /* html */`
		<div class="rkis-centerpage-popup" data-image-popup="">
			<div class="rk-tabbed-window rkis-box-1" style="width: min(100%, 30rem);min-height: 30%;">
				<div class="rk-tabs">
					<div class="rk-tab" bg-image-clear>Clear</div>
					<div class="rk-tab is-active" page="imageupload">Image</div>
					<div class="rk-tab" page="imagegradient">Gradient</div>
					<div class="rk-tab" page="imagelink">Link</div>
				</div>
				<div class="rk-tab-pages" style="width: 100%;">
					<div class="rk-tab-page is-active" tab="imageupload" style="width: 100%;height: 100%;">
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
						<div class="rk-gradient-preview"></div>

						<div class="rk-gradient-picker">
							<div class="rk-gradient-line" style="background-image: linear-gradient(90deg, #000000, #ffffff);"></div>
							<div class="rk-gradient-points"></div>
						</div>
						
						<div style="display: flex;">
							<div style="width: 100%;">
								<label class="rk-line-option">
									<span>Color:</span>
									<input type="color" value="#000000" class="rk-option-select"
										data-gradient-color>
								</label>
								<div data-gradient-point-delete class="rk-option-select">
									<span>Delete Point</span>
								</div>
								<div data-gradient-done class="rk-option-select" style="border-color: #5a5;background-color: #383;">
									<span>Use this gradient</span>
								</div>
							</div>
							<div style="width: 100%;">
								<h5 style="text-align: center;">Gradient Direction</h5>
								<div class="rk-gradient-direction">
									<div class="rk-gradient-direction-pointer"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="rk-tab-page" tab="imagelink" style="height: 100%;">
						<label class="rk-side-option">
							<span data-translate="themeLink">Link:</span>
							<input type="url" value="" class="rk-option-select"
								data-image-link>
						</label>
					</div>
				</div>
			</div>
		</div>
		`;

		load = () => {
			const element = this.html;
			const imageLinkField = element.querySelector("[data-image-link]");
			const imageUploader = element.querySelector("[data-image-upload]");
			const imageUploaderField = imageUploader.parentElement;

			if (this.imageData?.startsWith("https://")) {
				imageLinkField.value = this.imageData || "";
				// element.linkModificationCheck = this.imageData || "";
			}
			if (this.imageData?.startsWith("linear-gradient(")) {
				// load gradient
				const gradientDirectionPointer = this.html.querySelector(".rk-gradient-direction-pointer");
				this.gradientAngle = Number.parseInt(this.imageData.split("(")[1].split("deg")[0]);
				gradientDirectionPointer.style.transform = `rotate(${Math.floor(this.gradientAngle)}deg)`;
				this.imageData.split(")")[0].split(",").forEach((pointStr, i, strArr) => {
					if (i === 0)
						return;

					let [color, percent] = pointStr.trim().split(" ");
					if (!percent)
						percent = (i - 1) / (strArr.length - 2) * 100;
					if (percent.endsWith?.("%"))
						percent = percent.slice(0, -1);
					percent = Number.parseInt(percent);

					this.addGradientPoint(percent, color);
				});
			}
			else {
				this.addGradientPoint(0, "#000000");
				this.addGradientPoint(100, "#ffffff");
			}

			// setup popup
			const popup = element.querySelector("[data-image-popup]");
			popup.addEventListener("pointerdown", (e) => {
				if (e.target !== popup)
					return;
				document.addEventListener("pointerup", (e) => {
					if (e.target !== popup)
						return;
					this.unload();
				}, { once: true });
			});

			// clear
			element.querySelector("[bg-image-clear]").addEventListener("click", () => {
				this.triggerFileUpload("");
			});
			// image
			document.addEventListener("paste", this.pasteImageEvent);
			imageUploader.addEventListener("input", () => {
				for (const file of imageUploader.files) {
					if (!file.type.startsWith("image/"))
						continue;
					const blob = file;
					const reader = new FileReader();
					reader.onload = () => this.triggerFileUpload(reader.result);
					reader.readAsDataURL(blob);
					break;
				}
			});
			imageUploaderField.addEventListener("drop", (ev) => {
				// Prevent default behavior (Prevent file from being opened)
				ev.preventDefault();

				const totalItems = [...ev.dataTransfer.items, ...ev.dataTransfer.files];
				for (const item of totalItems) {
					if (!item.type?.startsWith("image/"))
						continue;

					let blob = item;
					if (item.kind === "file")
						blob = item.getAsFile();
					if (blob === null)
						continue;

					const reader = new FileReader();
					reader.onload = () => this.triggerFileUpload(reader.result);
					reader.readAsDataURL(blob);
					break;
				}
			});
			this.setupGradient();
			// link
			imageLinkField.addEventListener("blur", () => {
				if (imageLinkField.value === "")
					return;
				this.triggerFileUpload(imageLinkField.value);
			});
		};

		unload = () => {
			this.html.remove();
			document.removeEventListener("paste", this.pasteImageEvent);
			this.callback(this.imageData);
		};

		setupGradient = () => {
			const gradientColor = this.html.querySelector("[data-gradient-color]");
			const gradientLine = this.html.querySelector(".rk-gradient-points");
			const gradientDirection = this.html.querySelector(".rk-gradient-direction");
			const gradientDirectionPointer = this.html.querySelector(".rk-gradient-direction-pointer");
			const gradientPointDelete = this.html.querySelector("[data-gradient-point-delete]");
			const gradientDoneBtn = this.html.querySelector("[data-gradient-done]");

			let gradientDirectionRect = null;
			const angleDrag = (e) => {
				const diffX = e.x - (gradientDirectionRect.x + gradientDirectionRect.width / 2);
				const diffY = e.y - (gradientDirectionRect.y + gradientDirectionRect.height / 2);
				const angleRad = Math.atan2(diffY, diffX);
				const angleDeg = angleRad * (180 / Math.PI);
				let angle = angleDeg + 90;
				if (angle < 0)
					angle = 360 + angle;

				gradientDirectionPointer.style.transform = `rotate(${Math.floor(angle)}deg)`;
				this.gradientAngle = angle;
				this.updateGradientPreview();
			};
			gradientDirection.addEventListener("pointerdown", () => {
				gradientDirectionRect = gradientDirection.getBoundingClientRect();
				document.addEventListener("pointermove", angleDrag);
				document.addEventListener("pointerup", () => {
					document.removeEventListener("pointermove", angleDrag);
				}, { once: true });
			});
			gradientColor.addEventListener("input", () => {
				if (this.selectedPoint == null)
					return;
				this.selectedPoint.color = gradientColor.value;
				const pointColor = this.selectedPoint.element?.querySelector(".rk-gradient-point-color");
				if (pointColor)
					pointColor.style.backgroundColor = gradientColor.value;
				this.updateGradientLine();
			});
			gradientPointDelete.addEventListener("click", () => {
				if (this.selectedPoint == null)
					return;

				const pointIndex = this.gradientPoints.indexOf(this.selectedPoint);
				if (pointIndex === -1)
					return;

				this.gradientPoints.splice(pointIndex, 1);
				this.selectedPoint.element?.remove();
				this.updateGradientLine();
			});
			gradientLine.addEventListener("pointerdown", () => {
				if (this.gradientPoints.length >= 8)
					return;
				document.addEventListener("pointerup", (e) => {
					if (e.target !== gradientLine)
						return;
					let percent = e.offsetX / gradientLine.clientWidth * 100;
					if (percent < 0)
						percent = 0;
					if (percent > 100)
						percent = 100;
					percent = Math.floor(percent);

					const point = this.addGradientPoint(percent, "#000000");
					if (point?.percent === percent) {
						this.updateSelectedPoint(point);
					}
				}, { once: true });
			});
			gradientDoneBtn.addEventListener("click", () => {
				this.imageData = this.generateGradient();
				this.unload();
			});
		};

		updateGradientLine = () => {
			const gradientLine = this.html.querySelector(".rk-gradient-line");
			this.gradientPoints.sort((p1, p2) => p1.percent - p2.percent);

			// format gradient
			let gradientValue = "linear-gradient(90deg";

			for (let pointIndex = 0; pointIndex < this.gradientPoints.length; pointIndex++) {
				const point = this.gradientPoints[pointIndex];
				gradientValue += `,${point.color} ${point.percent}%`;
			}
			gradientValue += ")";

			gradientLine.style.backgroundImage = gradientValue;
			this.updateGradientPreview();
		};

		updateGradientPreview = () => {
			const gradientPreview = this.html.querySelector(".rk-gradient-preview");

			gradientPreview.style.backgroundImage = this.generateGradient();
		};

		addGradientPoint = (percent, color) => {
			const point = {
				percent,
				color,
			};
			/*
				<div class="rk-gradient-point-area" style="left: 0%;">
					<div class="rk-gradient-point-color" style="background-color: black;"></div>
					<input class="rk-gradient-point-input rk-gradient-point-label" value="0">
				</div>
			*/
			const gradientLine = this.html.querySelector(".rk-gradient-line");
			const pointsContainer = this.html.querySelector(".rk-gradient-points");

			const pointArea = document.createElement("div");
			const pointColor = document.createElement("div");
			const pointInput = document.createElement("input");

			pointArea.classList.add("rk-gradient-point-area");
			pointColor.classList.add("rk-gradient-point-color");
			pointInput.classList.add("rk-gradient-point-input", "rk-gradient-point-label");

			// TODO Handle by function, reorgenize list
			// so we can swap places
			pointArea.style.left = `${point.percent}%`;
			pointColor.style.backgroundColor = point.color;
			pointInput.value = point.percent;

			pointArea.appendChild(pointColor);
			pointArea.appendChild(pointInput);

			point.element = pointArea;
			pointsContainer.appendChild(pointArea);

			// setup listeners
			pointInput.addEventListener("input", () => {
				let value = Number.parseInt(pointInput.value);
				if (Number.isNaN(value)) {
					pointInput.value = "0";
					return;
				}
				if (value < 0)
					value = 0;
				if (value > 100)
					value = 100;

				point.percent = value;
				pointArea.style.left = `${point.percent}%`;
				pointInput.value = point.percent;
				this.updateGradientLine();
			});
			let dragStart = null;
			let gradientLineRect = null;
			const percentageDrag = (e) => {
				let percent = (dragStart - gradientLineRect.x + (e.x - dragStart)) / gradientLineRect.width * 100;
				if (percent < 0)
					percent = 0;
				if (percent > 100)
					percent = 100;
				percent = Math.floor(percent);

				point.percent = percent;
				pointArea.style.left = `${point.percent}%`;
				pointInput.value = point.percent;
				this.updateGradientLine();
			};
			pointArea.addEventListener("pointerdown", (eventStart) => {
				this.updateSelectedPoint(point);
				dragStart = eventStart.x;
				gradientLineRect = gradientLine.getBoundingClientRect();
				document.addEventListener("pointermove", percentageDrag);
				document.addEventListener("pointerup", () => {
					document.removeEventListener("pointermove", percentageDrag);
					dragStart = null;
				}, { once: true });
			});

			this.gradientPoints.push(point);

			this.updateGradientLine();
			return point;
		};

		updateSelectedPoint = (point) => {
			if (this.selectedPoint != null) {
				if (this.selectedPoint === point)
					return;
				this.selectedPoint.element?.classList.remove("selected");
			}
			const gradientColor = this.html.querySelector("[data-gradient-color]");
			this.selectedPoint = point;
			this.selectedPoint.element?.classList.add("selected");

			gradientColor.value = this.selectedPoint.color;
		};

		generateGradient = () => {
			if (this.gradientPoints.length < 2)
				return "";

			// format gradient
			let gradientValue = "linear-gradient";
			gradientValue += "(";
			gradientValue += `${this.gradientAngle}deg`;

			for (let pointIndex = 0; pointIndex < this.gradientPoints.length; pointIndex++) {
				const point = this.gradientPoints[pointIndex];
				gradientValue += `,${point.color} ${point.percent}%`;
			}
			gradientValue += ")";

			return gradientValue;
		};

		triggerFileUpload = (file) => {
			// console.log("new file", file);
			this.imageData = file;

			this.unload();
		};

		pasteImageEvent = (e) => {
			for (const clipboardItem of e.clipboardData.files) {
				if (!clipboardItem.type.startsWith("image/"))
					continue;
				e.preventDefault();

				// Do something with the image file.
				const blob = clipboardItem;
				const reader = new FileReader();
				reader.onload = () => this.triggerFileUpload(reader.result);
				reader.readAsDataURL(blob);
				break;
			}
		};
	}

	return {
		PageChanger,
		CustomComponent,
		ComponentPage,
		StylePage,
		CustomizeOptions,
		ComponentOptions,
		StyleOptions,
		ImageInput,
	};
})();

/**
 * @typedef {{
 * page: {
 * 	tags: {[id: string]: boolean;};
 * 	id: string;
 * };
 * tags: {[id: string]: boolean;};
 * ids: {[id: string]: boolean;};
 * }} ComponentParent
 */
/**
 * @typedef {{
 * id: string;
 * tags?: string[];
 * parent?: ComponentParent;
 * highlightSelectors?: {
 * 	highlight: string;
 * }[];
 * isPreviousDependant?: boolean;
 * isPageChild?: boolean;
 * details?: {
 * 	name: string;
 * 	description?: string;
 * 	translate?: {
 * 		name?: string;
 * 		description?: string;
 * 	}
 * }
 * Element: class;
 * }} ComponentInfo
 */
/**
 * @type {ComponentInfo[]}
 */
const ListOfThemeEditorComponents = [

	// Styles //
	{
		id: "videobackground",
		details: {
			name: "Video Background",
			description: "Adds a video player over the background.",
		},
		parent: {
			headId: "styles",
			ids: {
				all: true,
			},
		},
		data: {
			options: [
				{ value: "", details: {
					name: "Disabled",
				} },
				{ value: "videoplayer", details: {
					name: "Video Link",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span>File:</span>
								<input type="url" value="" placeholder="URL"
									data-location="videolink" data-type="value" class="rk-option-select">
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Mute Video</span>
								<button data-location="mutevideo" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle on">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-side-option">
								<span>Video Volume</span>
								<input data-location="videoVolume" type="range" class="rk-option-select"
									min="0" max="100" value="100" step="5">
							</label>
						`;
				} },
				{ value: "youtubeplayer", details: {
					name: "Youtube Link",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span>Link:</span>
								<input data-location="videolink" data-type="value" type="url" value=""
									placeholder="URL" class="rk-option-select">
							</label>
						`;
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // videobackground
	{
		id: "servers",
		isPageChild: true,
		details: {
			name: "Servers",
			translate: {
				name: "tabServers",
			},
		},
		parent: {
			page: {
				id: "game",
			},
			headId: "styles",
			ids: {
				defaultserver: true,
			},
		},
		data: {
			options: [
				{ value: "", image: "images/themes/styles/serversDefault.png", details: {
					name: "Default",
					description: "Roblox's default design",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span class="text-lead">Hide Players</span>
								<button data-location="hidePlayers" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
						`;
				} },
				{ value: "card", image: "images/themes/styles/serversCard.png", details: {
					name: "Card",
					description: "Cards with Player icons on bottom",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span class="text-lead">Hide Players</span>
								<button data-location="hidePlayers" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
						`;
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // servers
	{
		id: "badges",
		isPageChild: true,
		details: {
			name: "Badges",
			translate: {
				name: "tabBadges",
			},
		},
		parent: {
			page: {
				id: "game",
			},
			headId: "styles",
			ids: {
				badge: true,
			},
		},
		data: {
			options: [
				{ value: "", image: "images/themes/styles/badgesDefault.png", details: {
					name: "Default",
					description: "Roblox's default design",
				} },
				{ value: "card", image: "images/themes/styles/badgesCard.png", details: {
					name: "Card",
				} },
				{ value: "simple", details: {
					name: "Simplified",
					description: "no stats and short description",
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // badges
	{
		id: "menu",
		isPageChild: true,
		details: {
			name: "Menu",
			translate: {
				name: "EditorStyleMenu",
			},
		},
		parent: {
			page: {
				id: "all",
			},
			headId: "styles",
			ids: {
				menu: true,
			},
		},
		data: {
			options: [
				{ value: "", image: "images/themes/styles/menuDefault.png", isPortrait: true, details: {
					name: "Default",
					description: "Roblox's default design",
				} },
				{ value: "float", image: "images/themes/styles/menuFloat.png", isPortrait: true, details: {
					name: "Floating",
					description: "Floating phone looking design",
				} },
				{ value: "rod", details: {
					name: "Pole",
					description: "same as floating design but icons only",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span class="text-lead">Extend the Design</span>
								<button data-location="extendedDesign" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Center Menu Items</span>
								<button data-location="centerMenuItems" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle on">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Move avatar to bottom</span>
								<button data-location="moveAvatarBottom" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
						`;
				} },
				{ value: "buttons", details: {
					name: "Buttons",
					description: "floating but saparated buttons",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span class="text-lead">Icons only</span>
								<button data-location="iconsOnly" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
						`;
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // menu
	{
		id: "icons",
		// isPageChild: true,
		details: {
			name: "Icons",
			description: "Changes menu icons pack",
		},
		parent: {
			// page: {
			//	id: "all"
			// },
			headId: "styles",
			ids: {
				// menu: true
				all: true,
			},
		},
		data: {
			options: [
				{ value: "", details: {
					name: "Default",
					description: "Roblox's default icons",
				} },
				{ value: "2018", details: {
					name: "2018",
					description: "Brings back 2018's icons",
				} },
				{ value: "custom", details: {
					name: "Custom",
					description: "Upload your own icon pack",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<div style="width: min-content;min-width: calc(100% - 2rem); margin: 0 1rem;text-align: center;">Use template from our discord server.</div>
							<label class="rk-line-option">
								<span>Template:</span>
								<button class="rk-option-select" data-image-button="iconPackLink">Modify</button>
							</label>
						`;
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // icons
	{
		id: "navbar",
		isPageChild: true,
		details: {
			name: "Top Navigation Bar",
			translate: {
				name: "styletopnavbar",
			},
		},
		parent: {
			page: {
				id: "all",
			},
			headId: "styles",
			ids: {
				menu: true,
			},
		},
		data: {
			options: [
				{ value: "", image: "images/themes/styles/navbarDefault.png", details: {
					name: "Default",
					description: "Roblox's default design",
				} },
				{ value: "float", image: "images/themes/styles/navbarFloat.png", details: {
					name: "Floating",
					description: "Floating design",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span class="text-lead">dont split design</span>
								<button data-location="connectedIslands" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Hide Roblox Logo</span>
								<button data-location="hideRobloxLogo" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Hide Navigation Buttons</span>
								<button data-location="hideNavBtns" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Make Search a Button</span>
								<button data-location="makeSearchBtn" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-side-option">
								<span>Search Bar Length</span>
								<input data-location="searchbarLength" type="range" class="rk-option-select"
									min="25" max="50" value="25" step="5">
							</label>
						`;
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // navbar
	{
		id: "gamecards",
		isPageChild: true,
		details: {
			name: "Game Cards",
			translate: {
				name: "stylegamecards",
			},
		},
		parent: {
			page: {
				id: "all",
			},
			headId: "styles",
			ids: {
				gamesection: true,
			},
		},
		data: {
			options: [
				{ value: "", image: "images/themes/styles/gamecardsDefault.png", details: {
					name: "Default",
					description: "Roblox's default design",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span class="text-lead">Center Text</span>
								<button data-location="centerText" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Show "Join" Text</span>
								<button data-location="showjointext" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
						`;
				} },
				{ value: "1", image: "images/themes/styles/gamecards1.png", details: {
					name: "Style 1",
					description: "Cards game Style",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-line-option">
								<span class="text-lead">Hide Text</span>
								<button data-location="hideText" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Show "Join" Text</span>
								<button data-location="showjointext" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
						`;
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // gamecards
	{
		id: "chat",
		details: {
			name: "Chat",
		},
		parent: {
			headId: "styles",
			ids: {
				all: true,
			},
		},
		data: {
			options: [
				{ value: "", details: {
					name: "Default",
					description: "Roblox's default design",
				} },
				{ value: "bubble", details: {
					name: "Bubble",
					description: "Bubble Header",
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // chat
	{
		id: "userbanner",
		isPageChild: true,
		details: {
			name: "User Banner",
			description: "this applies to all users.",
		},
		parent: {
			page: {
				id: "users",
			},
			headId: "styles",
			ids: {
				profile: true,
			},
		},
		data: {
			options: [
				{ value: "", details: {
					name: "Disabled",
				} },
				{ value: "imglink", details: {
					name: "Custom",
				}, Element: class extends DefaultThemeEditorComponents.StyleOptions {
					initialHTML = /* html */`
							<label class="rk-side-option">
								<span>Banner Image:</span>
								<button class="rk-option-select" data-image-button="bannerImage">Modify</button>
							</label>
							<label class="rk-line-option">
								<span class="text-lead">Combine header</span>
								<button data-location="combineprofileheader" type="button" role="switch"
									class="btn-toggle receiver-destination-type-toggle off">
									<span class="toggle-flip"></span>
									<span class="toggle-on"></span>
									<span class="toggle-off"></span>
								</button>
							</label>
						`;
				} },
			],
		},
		Element: DefaultThemeEditorComponents.StylePage,
	}, // userbanner

	// Customize //
	{
		id: "background",
		parent: {
			all: false,
			headId: "pages",
			tags: {
				page: true,
				blockElement: true,
				hasBackground: true,
			},
		},
		details: {
			name: "Background",
			translate: {
				name: "themeBackground",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "background";

			/** @type {HTMLDivElement} */
			previewButton;

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3 data-translate="themeBackground">Background</h3>

				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<label class="rk-option-select" data-rk-color-button>
					<input type="color" value="#232527"
						data-location="color" data-type="color">
					<span>Color</span>
				</label>

				<label class="rk-side-option">
					<span data-translate="themeAlpha">Alpha:</span>
					<input type="range" value="100" step="10"
						data-location="color" data-type="color-alpha">
				</label>

				<div class="rbx-divider" style="margin: 12px;"></div>

				<div class="rk-option-select" id="rk-bg-image">
					<span>Image</span>
				</div>
			`;

			load = () => {
				const theme_object = this.themeData;
				const element = this.html;

				this._AppendOverwritten();
				this._SetupClearButton();

				this.html.querySelector("#rk-bg-image")
					?.addEventListener("click", () => {
						this.themeEditorPopup.updatePopupContent(new this.info.ImageModifyElement(this, "image"));
					});

				// initilize listerners
				element.querySelectorAll("[data-location]").forEach((input) => {
					input.addEventListener("input", () => {
						this.isBeingUsed = true;
						this.update();
					});
				});

				this.previewButton = element.querySelector("[data-rk-color-button]");

				// load color data
				if (this.themeData != null) {
					this.isBeingUsed = true;
					const rawColor = theme_object.color;
					const splittenColor = rawColor.slice(5).slice(0, -1).split(",");

					element.querySelectorAll(`[data-location="color"]`).forEach((input) => {
						if (input.dataset.type === "color") {
							input.value = rgbToHex(splittenColor[0], splittenColor[1], splittenColor[2]);
						}
						if (input.dataset.type === "color-alpha") {
							let alpha = splittenColor[3];
							if (alpha.endsWith("%"))
								alpha = alpha.slice(0, -1);

							if (Number.parseInt(alpha) <= 0)
								alpha = Number.parseInt(alpha) * 100;
							else alpha = Number.parseInt(alpha);

							input.value = alpha;
						}
					});
				}

				// defaultcomponentElements.imageInputPopup.load(theme_object, idCard);
				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					this.updatePreviewElement(this.html, settings);
					this.previewButton.style.background = "transparent";
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				// background: color image("repeat","position","attachment")
				// background-image: image.url
				// background-image-size: image.size

				this._TriggerLiveUpdate();
				this.updatePreviewElement(this.html, settings);

				this.previewButton.style.background = `${settings.color} ${settings.image.repeat} ${settings.image.position}`;
				this.previewButton.style.backgroundSize = settings.image.size;

				// element.style.background = `${settings.color} ${settings.image.repeat} ${settings.image.attachment}`;
				// element.style.backgroundSize = settings.image.size;
			};

			// updates the preview element only (color button not included.)
			updatePreviewElement = (componentHTML, settings) => {
				let previewElement = componentHTML.querySelector("[data-rk-preview]");

				if (settings == null) {
					if (previewElement != null)
						previewElement.remove();
					return;
				}
				if (previewElement == null) {
					previewElement = HTMLParser(
						"<div data-rk-preview data-translate=\"themePreview\">",
						"Preview",
					);
					componentHTML.appendChild(previewElement);
				}

				// background: color image("repeat","position","attachment")
				// background-image: image.url
				// background-image-size: image.size

				previewElement.style.background = `${settings.color} ${settings.image.repeat} ${settings.image.position}`;
				previewElement.style.backgroundSize = settings.image.size;

				// element.style.background = `${settings.color} ${settings.image.repeat} ${settings.image.attachment}`;
				// element.style.backgroundSize = settings.image.size;

				if (settings.image.link === "")
					return;
				const url = settings.image.link;
				let fill = null;
				if (url === "") {
					fill = "";
				}
				else if (url.startsWith("linear-gradient")) {
					fill = `${url.split(")")[0]})`;
				}
				else if (url.startsWith("data:image/")) {
					fill = `url(${url.split(")")[0]})`;
				}
				else {
					FetchImage(url).then((encoded) => {
						previewElement.style.backgroundImage = encoded;
						// element.style.backgroundImage = encoded;
						// element.imageData = encoded;
					});
				}

				if (fill !== null) {
					previewElement.style.backgroundImage = fill;
					// element.style.backgroundImage = fill;
				}
			};

			// updates actual page
			applyLiveChanges = (themeData) => {
				let propertyName = this.previousComponent.cssPropertyName;
				if (propertyName === this.themeEditorPopup.dynamicPagesHistory.at(1)?.id)
					propertyName = "";
				else
					propertyName += "-";

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}background`, `${themeData.color} ${themeData.image.repeat} ${themeData.image.position} ${themeData.image.attachment}`);
					document.body.style.setProperty(`--rk-${propertyName}background-image-size`, themeData.image.size);
					const hasBackgroundImage = BackgroundImageToElements[propertyName.slice(0, -1).split("-").join(".")];
					if (typeof hasBackgroundImage == "string") {
						const url = themeData.image.link;
						let fill = null;
						if (url === "") {
							fill = "none";
						}
						else if (url.startsWith("linear-gradient")) {
							fill = `${url.split(")")[0]})`;
						}
						else if (url.startsWith("data:image/")) {
							fill = `url(${url.split(")")[0]})`;
						}
						else {
							FetchImage(url).then((encoded) => {
								document.querySelectorAll(hasBackgroundImage).forEach((bg) => {
									bg.style.backgroundImage = encoded;
								});
								// element.style.backgroundImage = encoded;
								// element.imageData = encoded;
							});
						}
						if (fill !== null) {
							document.querySelectorAll(hasBackgroundImage).forEach((bg) => {
								bg.style.backgroundImage = fill;
							});
						}
					}
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}background`, "null");
					// document.body.style.removeProperty(`--rk-${propertyName}background`);
					document.body.style.setProperty(`--rk-${propertyName}background-image-size`, "null");
					const hasBackgroundImage = BackgroundImageToElements[propertyName.slice(0, -1).split("-").join(".")];
					if (typeof hasBackgroundImage == "string") {
						document.querySelectorAll(hasBackgroundImage).forEach((bg) => {
							bg.style.backgroundImage = "none";
						});
					}
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				if (this.isBeingUsed === false)
					return null;
				const element = this.html;

				const component_object = {};

				// save color
				const hexColor = element.querySelector(`[data-location="color"][data-type="color"]`).value;
				const alphaColor = element.querySelector(`[data-location="color"][data-type="color-alpha"]`).value;

				component_object.color = rgbTorgba(hexToRgb(hexColor), alphaColor);

				component_object.image = this.themeData?.image || {
					size: "contain",
					repeat: "round",
					position: "0% 0%",
					attachment: "fixed",
					link: "",
				};

				// apply if doesn't exist
				component_object.image.position = component_object.image.position || "0% 0%";

				return component_object;
			};
		},
		ImageModifyElement: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "image";

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3>Background Image</h3>

				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>
				
				<label class="rk-line-option">
					<span>Image:</span>
					<button class="rk-option-select" data-image-button>Modify</button>
				</label>

				<label class="rk-line-option">
					<span data-translate="themeSize">Size:</span>
					<select class="rk-option-select" selected="contain" data-location="size" data-type="value">
						<option value="contain" data-translate="themeFillX">Fill X</option>
						<option value="cover" data-translate="themeFillY">Fill Y</option>
						<option value="auto" data-translate="themeAuto">Auto</option>
					</select>
				</label>

				<label class="rk-line-option">
					<span data-translate="themeRepeatT">Repeat:</span>
					<select class="rk-option-select" selected="round" data-location="repeat" data-type="value">
						<option value="round" data-translate="themeRound">Round</option>
						<option value="repeat" data-translate="themeRepeat">Repeat</option>
						<option value="space" data-translate="themeSpace">Space</option>
						<option value="no-repeat" data-translate="themeNoRepeat">No Repeat</option>
					</select>
				</label>

				<label class="rk-line-option">
					<span data-translate="themeScroll">Scroll:</span>
					<select class="rk-option-select" selected="fixed" data-location="attachment" data-type="value">
						<option value="fixed" data-translate="themeEnabled">Enabled</option>
						<option value="scroll" data-translate="themeDisabled">Disabled</option>
					</select>
				</label>

				<label class="rk-line-option">
					<span data-translate="">Position:</span>
					<select class="rk-option-select" selected="0% 0%" data-location="position" data-type="value">
						<option value="0% 0%">Top-Left</option>
						<option value="top">Top</option>
						<option value="100% 0%">Top-Right</option>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
						<option value="0% 100%">Bottom-Left</option>
						<option value="bottom">Bottom</option>
						<option value="100% 100%">Bottom-Right</option>
					</select>
				</label>
			`;

			load = () => {
				if (this.previousComponent.themeData == null) {
					this.previousComponent.themeData = {};
				}
				this.themeData = this.previousComponent.themeData.image;
				const theme_object = this.themeData;
				const element = this.html;

				// custom version of this._AppendOverwritten();
				if (this.previousComponent.isBeingOverwritten) {
					const element = HTMLParser("<div class=\"rk-option-select rk-red no-hover\">", HTMLParser("<span>", "This component is being overwritten."));
					this.html.prepend(element);
				}

				this._SetupClearButton();

				this.html.querySelector("[data-image-button]")
					?.addEventListener("click", () => {
						// eslint-disable-next-line no-new
						new DefaultThemeEditorComponents.ImageInput(this.themeData?.link, (imageData) => {
							if (!this.themeData)
								this.themeData = {};
							this.themeData.link = imageData;
							if (this.isBeingUsed === false)
								this.isBeingUsed = imageData !== "" && imageData != null;
							this.update();
						});
					});

				element.querySelectorAll("[data-location]").forEach((input) => {
					input.addEventListener("input", () => {
						this.isBeingUsed = true;
						this.update();
					});
				});

				// load image
				if (this.themeData != null) {
					this.isBeingUsed = true;
					const image = theme_object;

					element.querySelectorAll(`[data-location]`).forEach((input) => {
						const type = input.dataset.location;
						if (image[type] == null)
							return;
						input.value = image[type];
					});
				}

				// defaultcomponentElements.imageInputPopup.load(theme_object, idCard);
				this.update();
			};

			update = () => {
				if (!this.previousComponent.isBeingUsed) {
					this.previousComponent.isBeingUsed = true;
					this.previousComponent.themeData = {};
				}
				this.themeData = this.save();
				if (this.themeData == null) {
					this.html.querySelectorAll("[data-location]").forEach((input) => {
						input.value = input.getAttribute("selected");
					});
					// update parent
					this.previousComponent.themeData.image = null;
					this.previousComponent.update();
					this.previousComponent.updatePreviewElement(this.html, this.previousComponent.themeData);
					return;
				}

				this.previousComponent.themeData.image = this.themeData;
				this.previousComponent.update();
				this.previousComponent.updatePreviewElement(this.html, this.previousComponent.themeData);
			};

			save = () => {
				if (this.isBeingUsed === false)
					return null;
				const element = this.html;

				// save image
				const image = {};

				element.querySelectorAll(`[data-location]`).forEach((input) => {
					const type = input.dataset.location;
					image[type] = input.value;
				});

				image.link = this.themeData?.link || "";

				return image;
			};
		},
	}, // background
	{
		id: "corners",
		parent: {
			all: false,
			headId: "pages",
			tags: {
				blockElement: true,
				hasCorners: true,
			},
		},
		details: {
			name: "Corners Radius",
			translate: {
				name: "themeCornerRadius",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "corners";

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3 data-translate="themeCorners">Corners Radius</h3>
				
				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<label class="rk-side-option">
					<span data-translate="themeAllCorners">All Corners:</span>
					<input type="range" value="0" max="20" min="0"
						data-location="all.radius" data-type="corner">
				</label>

				<div class="rbx-divider" style="margin: 12px;"></div>

				<label class="rk-side-option">
					<div style="text-align: center;" data-translate="themeTLCorner">Top-Left Corner</div>
					<input type="range" value="-1"
						data-location="top-left.radius" data-type="corner" max="20" min="-1">
				</label>

				<label class="rk-side-option">
					<div style="text-align: center;" data-translate="themeTRCorner">Top-Right Corner</div>
					<input type="range" value="-1"
						data-location="top-right.radius" data-type="corner" max="20" min="-1">
				</label>

				<label class="rk-side-option">
					<div style="text-align: center;" data-translate="themeBRCorner">Bottom-Right Corner</div>
					<input type="range" value="-1"
						data-location="bottom-right.radius" data-type="corner" max="20" min="-1">
				</label>

				<label class="rk-side-option">
					<div style="text-align: center;" data-translate="themeBLCorner">Bottom-Left Corner</div>
					<input type="range" value="-1"
						data-location="bottom-left.radius" data-type="corner" max="20" min="-1">
				</label>

				<div class="rbx-divider" style="margin: 12px;"></div>
			`;

			load = () => {
				const theme_object = this.themeData;
				const element = this.html;

				this._AppendOverwritten();
				this._SetupClearButton();

				// initilize listeners
				element.querySelectorAll("[data-location]")
					.forEach((input) => {
						input.addEventListener("input", () => {
							this.isBeingUsed = true;
							this.update();
						});
					});

				// load corner data
				if (this.themeData != null) {
					this.isBeingUsed = true;
					for (const corner in theme_object) {
						if (theme_object[corner].radius == null)
							continue;

						const value = theme_object[corner].radius.slice(0, -2);
						element.querySelector(`[data-location="${corner}.radius"]`).value = value;
					}
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					this.updatePreviewElement(this.html, settings);
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
				this.updatePreviewElement(this.html, settings);

				// top-left
				this.html.querySelector("label:nth-child(5) > div").style.opacity = settings["top-left"].radius === null ? 0.5 : 1.0;
				// top-right
				this.html.querySelector("label:nth-child(6) > div").style.opacity = settings["top-right"].radius === null ? 0.5 : 1.0;
				// bottom-right
				this.html.querySelector("label:nth-child(7) > div").style.opacity = settings["bottom-right"].radius === null ? 0.5 : 1.0;
				// bottom-left
				this.html.querySelector("label:nth-child(8) > div").style.opacity = settings["bottom-left"].radius === null ? 0.5 : 1.0;
			};

			updatePreviewElement = (componentHTML, settings) => {
				let previewElement = componentHTML.querySelector("[data-rk-preview]");

				if (settings == null) {
					if (previewElement != null)
						previewElement.remove();
					return;
				}
				if (previewElement == null) {
					previewElement = HTMLParser(
						"<div data-rk-preview data-translate=\"themePreview\" style=\"background: #333;\">",
						"Preview",
					);
					componentHTML.appendChild(previewElement);
				}

				const finishedStyle = [];

				// "top-left","top-right","bottom-right","bottom-left"
				finishedStyle.push(settings["top-left"]?.radius || settings.all.radius);
				finishedStyle.push(settings["top-right"]?.radius || settings.all.radius);
				finishedStyle.push(settings["bottom-right"]?.radius || settings.all.radius);
				finishedStyle.push(settings["bottom-left"]?.radius || settings.all.radius);

				previewElement.style.borderRadius = finishedStyle.join(" ");
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					const finishedStyle = [];

					// "top-left","top-right","bottom-right","bottom-left"
					finishedStyle.push(themeData["top-left"]?.radius || themeData.all.radius);
					finishedStyle.push(themeData["top-right"]?.radius || themeData.all.radius);
					finishedStyle.push(themeData["bottom-right"]?.radius || themeData.all.radius);
					finishedStyle.push(themeData["bottom-left"]?.radius || themeData.all.radius);

					document.body.style.setProperty(`--rk-${propertyName}-corners-radius`, finishedStyle.join(" "));
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-corners-radius`, "null");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				if (this.isBeingUsed === false)
					return null;

				const element = this.html;
				const component_object = {};

				element.querySelectorAll("[data-location]").forEach((input) => {
					const corner = input.dataset.location.split(".")[0];

					let value = `${input.value}px`;
					if (input.value === -1)
						value = null;

					component_object[corner] = {
						radius: value,
					};
				});

				return component_object;
			};
		},
	}, // corners
	{
		id: "borders",
		parent: {
			all: false,
			headId: "pages",
			tags: {
				blockElement: true,
				hasBorders: true,
			},
		},
		details: {
			name: "Borders",
			translate: {
				name: "themeBorders",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "borders";

			isBeingUsed = false;
			editingBorder = null;

			initialHTML = /* html */`
				<h3 data-translate="themeBorders">Borders</h3>
				
				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<label class="rk-side-option">
					<span data-translate="themeWidth">Width:</span>
					<input type="range" value="0"
						data-location="size" data-type="px" max="10">
				</label>
				<label class="rk-line-option">
					<span data-translate="themeStyle">Style:</span>
					<select selected="solid" data-location="style" data-type="value"
						class="rk-option-select" style="padding: 2px 8px;">
						<option value="solid" data-translate="themeSolid">Solid</option>
						<option value="double" data-translate="themeDouble">Double</option>
						<option value="dashed" data-translate="themeDashed">Dashed</option>
						<option value="dotted" data-translate="themeDotted">Dotted</option>
						<option value="inset" data-translate="themeInset">Inset</option>
						<option value="outset" data-translate="themeOutset">Outset</option>
						<option value="groove" data-translate="themeGroove">Groove</option>
						<option value="ridge" data-translate="themeRidge">Ridge</option>
					</select>
				</label>
				<label class="rk-line-option">
					<span data-translate="themeColor">Color:</span>
					<input type="color" value="#ffffff"
						data-location="color" data-type="color"
						class="rk-option-select">
				</label>
				<label class="rk-side-option">
					<span data-translate="themeAlpha">Alpha:</span>
					<input type="range" value="100" step="10"
						data-location="color" data-type="color-alpha">
				</label>
				
				<div class="rbx-divider" style="margin: 12px;"></div>

				<div class="rk-option-select" data-inner="top">
					<span data-translate="themeTBorder">Top Border</span>
				</div>
				<div class="rk-option-select" data-inner="left">
					<span data-translate="themeLBorder">Left Border</span>
				</div>
				<div class="rk-option-select" data-inner="bottom">
					<span data-translate="themeBBorder">Bottom Border</span>
				</div>
				<div class="rk-option-select" data-inner="right">
					<span data-translate="themeRBorder">Right Border</span>
				</div>
				
				<div class="rbx-divider" style="margin: 12px;"></div>
			`;

			load = () => {
				const element = this.html;

				this._AppendOverwritten();
				this._SetupClearButton();

				this.html.querySelectorAll("[data-inner]").forEach((btn) => {
					btn.addEventListener("click", () => {
						this.editingBorder = btn.dataset.inner;
						this.themeEditorPopup.updatePopupContent(new this.info.BorderElement(this, "single-border"));
					});
				});

				// initilize listeners
				element.querySelectorAll("[data-location]")
					.forEach((input) => {
					// if (input.classList.contains('rk-button')) input.addEventListener('switched', () => element.update());
					// else input.addEventListener('input', () => element.update());
						input.addEventListener("input", () => {
							this.isBeingUsed = true;
							this.update();
						});
					});

				// load data for default border
				if (this.themeData != null && this.themeData.all != null) {
					this.isBeingUsed = true;
					const edge = this.themeData.all;

					const size = edge.size.slice(0, -2); // removes px
					element.querySelector(`[data-location="size"]`).value = size;

					element.querySelector(`[data-location="style"]`).value = edge.style;

					// load color
					const splittenColor = edge.color.slice(5).slice(0, -1).split(",");

					element.querySelectorAll(`[data-location="color"]`).forEach((input) => {
						if (input.dataset.type === "color") {
							input.value = rgbToHex(splittenColor[0], splittenColor[1], splittenColor[2]);
						}
						else if (input.dataset.type === "color-alpha") {
							let alpha = splittenColor[3];
							if (alpha.endsWith("%"))
								alpha.slice(0, -1);

							if (Number.parseInt(alpha) <= 0)
								alpha = Number(alpha) * 100;
							else alpha = Number.parseInt(alpha);

							input.value = alpha;
						}
					});
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					this.updatePreviewElement(this.html, settings);
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
				this.updatePreviewElement(this.html, settings);
			};

			updatePreviewElement = (componentHTML, settings) => {
				let previewElement = componentHTML.querySelector("[data-rk-preview]");

				if (settings == null) {
					if (previewElement != null)
						previewElement.remove();
					return;
				}
				if (previewElement == null) {
					previewElement = HTMLParser(
						"<div data-rk-preview data-translate=\"themePreview\" style=\"background: #333;\">",
						"Preview",
					);
					componentHTML.appendChild(previewElement);
				}

				const finishedStyle = [];

				// "top","right","bottom","left"
				finishedStyle.push({ ...settings.all, ...settings.top });
				finishedStyle.push({ ...settings.all, ...settings.right });
				finishedStyle.push({ ...settings.all, ...settings.bottom });
				finishedStyle.push({ ...settings.all, ...settings.left });

				previewElement.style.borderWidth = finishedStyle.map(x => x.size).join(" ");
				previewElement.style.borderStyle = finishedStyle.map(x => x.style).join(" ");
				previewElement.style.borderColor = finishedStyle.map(x => x.color).join(" ");
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					const finishedStyle = [];

					// "top","right","bottom","left"
					finishedStyle.push({ ...themeData.all, ...themeData.top });
					finishedStyle.push({ ...themeData.all, ...themeData.right });
					finishedStyle.push({ ...themeData.all, ...themeData.bottom });
					finishedStyle.push({ ...themeData.all, ...themeData.left });

					document.body.style.setProperty(`--rk-${propertyName}-borders-size`, finishedStyle.map(x => x.size).join(" "));
					document.body.style.setProperty(`--rk-${propertyName}-borders-style`, finishedStyle.map(x => x.style).join(" "));
					document.body.style.setProperty(`--rk-${propertyName}-borders-color`, finishedStyle.map(x => x.color).join(" "));
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-borders-size`, "null");
					document.body.style.setProperty(`--rk-${propertyName}-borders-style`, "null");
					document.body.style.setProperty(`--rk-${propertyName}-borders-color`, "null");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				if (this.isBeingUsed === false)
					return null;

				const element = this.html;
				const component_object = {};

				const defaultBorder = {};
				const splittenColor = {};

				element.querySelectorAll(`[data-location]`).forEach((input) => {
					const part = input.dataset.location;

					// save color
					if (part === "color") {
						const type = input.dataset.type;

						splittenColor[type] = input.value;

						const edgeColor = splittenColor.color;
						const edgeAlpha = splittenColor["color-alpha"];

						if (edgeColor && edgeAlpha != null) {
							defaultBorder.color = rgbTorgba(hexToRgb(edgeColor), edgeAlpha);
						}
					}

					// save style
					else if (part === "style") {
						defaultBorder[part] = input.value;
					}

					// save size
					else if (part === "size") {
						defaultBorder[part] = `${input.value}px`;
					}
				});

				// nullify unused borders
				component_object.top = this.themeData?.top;
				component_object.left = this.themeData?.left;
				component_object.bottom = this.themeData?.bottom;
				component_object.right = this.themeData?.right;

				component_object.all = defaultBorder;

				return component_object;
			};
		},
		BorderElement: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "single-border";

			isBeingUsed = false;
			edge = null;

			initialHTML = /* html */`
				<h3 data-border-name>Side Border</h3>
				
				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<label class="rk-side-option">
					<span data-translate="themeWidth">Width:</span>
					<input type="range" value="0"
						data-location="size" data-type="px" max="10">
				</label>
				<label class="rk-line-option">
					<span data-translate="themeStyle">Style:</span>
					<select selected="solid" data-location="style" data-type="value"
						class="rk-option-select" style="padding: 2px 8px;">
						<option value="solid" data-translate="themeSolid">Solid</option>
						<option value="double" data-translate="themeDouble">Double</option>
						<option value="dashed" data-translate="themeDashed">Dashed</option>
						<option value="dotted" data-translate="themeDotted">Dotted</option>
						<option value="inset" data-translate="themeInset">Inset</option>
						<option value="outset" data-translate="themeOutset">Outset</option>
						<option value="groove" data-translate="themeGroove">Groove</option>
						<option value="ridge" data-translate="themeRidge">Ridge</option>
					</select>
				</label>
				<label class="rk-line-option">
					<span data-translate="themeColor">Color:</span>
					<input type="color" value="#ffffff"
						data-location="color" data-type="color"
						class="rk-option-select">
				</label>
				<label class="rk-side-option">
					<span data-translate="themeAlpha">Alpha:</span>
					<input type="range" value="100" step="10"
						data-location="color" data-type="color-alpha">
				</label>
			`;

			load = () => {
				this.edge = this.previousComponent.editingBorder;
				if (this.edge == null) {
					this.html.innerHTML = "Error TE1BR0SB1: Couldn't load component";
					return;
				}

				if (this.previousComponent.themeData == null) {
					this.previousComponent.themeData = {};
				}
				this.themeData = this.previousComponent.themeData[this.edge];
				const element = this.html;

				element.querySelector("[data-border-name]").textContent
					= getLocaleMessage(`theme${this.edge[0].toUpperCase()}Border`);

				// custom version of this._AppendOverwritten();
				if (this.previousComponent.isBeingOverwritten) {
					const element = HTMLParser("<div class=\"rk-option-select rk-red no-hover\">", HTMLParser("<span>", "This component is being overwritten."));
					this.html.prepend(element);
				}

				this._SetupClearButton();

				// initilize listeners
				element.querySelectorAll("[data-location]").forEach((input) => {
					input.addEventListener("input", () => {
						this.isBeingUsed = true;
						this.update();
					});
				});

				// load data for spesific border
				if (this.themeData != null) {
					this.isBeingUsed = true;
					const edge = this.themeData;

					const size = edge.size.slice(0, -2); // removes px
					element.querySelector(`[data-location="size"]`).value = size;

					element.querySelector(`[data-location="style"]`).value = edge.style;

					// load color
					const splittenColor = edge.color.slice(5).slice(0, -1).split(",");

					element.querySelectorAll(`[data-location="color"]`).forEach((input) => {
						if (input.dataset.type === "color") {
							input.value = rgbToHex(splittenColor[0], splittenColor[1], splittenColor[2]);
						}
						else if (input.dataset.type === "color-alpha") {
							let alpha = splittenColor[3];
							if (alpha.endsWith("%"))
								alpha.slice(0, -1);

							if (Number.parseInt(alpha) <= 0)
								alpha = Number(alpha) * 100;
							else alpha = Number.parseInt(alpha);

							input.value = alpha;
						}
					});
				}

				this.update();
			};

			unload = () => {};
			update = () => {
				if (!this.previousComponent.isBeingUsed) {
					this.previousComponent.isBeingUsed = true;
					this.previousComponent.themeData = {};
				}
				this.themeData = this.save();

				// update parent
				this.previousComponent.themeData[this.edge] = this.themeData;
				this.previousComponent.update();
				this.previousComponent.updatePreviewElement(this.html, this.previousComponent.themeData);
			};

			save = () => {
				if (this.isBeingUsed === false)
					return null;

				const element = this.html;
				const border = {};
				const splittenColor = {};

				element.querySelectorAll(`[data-location]`).forEach((input) => {
					const part = input.dataset.location;

					// save color
					if (part === "color") {
						const type = input.dataset.type;

						splittenColor[type] = input.value;

						const edgeColor = splittenColor.color;
						const edgeAlpha = splittenColor["color-alpha"];

						if (edgeColor && edgeAlpha != null) {
							border.color = rgbTorgba(hexToRgb(edgeColor), edgeAlpha);
						}
					}

					// save style
					else if (part === "style") {
						border[part] = input.value;
					}

					// save size
					else if (part === "size") {
						border[part] = `${input.value}px`;
					}
				});

				return border;
			};
		},
	}, // borders
	{
		id: "box-shadow",
		parent: {
			all: false,
			headId: "pages",
			tags: {
				blockElement: true,
			},
		},
		details: {
			name: "Border Shadow",
			translate: {
				name: "themeBorderShadow",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "box-shadow";

			maxShadows = 5;
			shadowElements = [];
			shadows = [];

			initialHTML = `
				<h5>Shadows</h5>
				
				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<div id="add-shadow" class="rk-option-select" style="background-color: #383;">
					<span style="color: white;">Add Shadow Effect</span>
				</div>
			`;

			load = () => {
				const addShadowBtn = this.html.querySelector("#add-shadow");

				const createOption = () => {
					const element = HTMLParser("<div style=\"display: flex;margin-bottom: -5px;\">", HTMLParser("<div class=\"rk-option-select\" style=\"width: 100%;\">", HTMLParser("<span data-translate=\"themeShadowComponent\">", "Shadow"), (element) => {
						element.addEventListener("click", () => {
							const shadowIndex = this.shadowElements.indexOf(element.parentElement);
							const componentPage = new this.info.ShadowElement(this, shadowIndex);
							this.themeEditorPopup.updatePopupContent(componentPage);
						});
					}), HTMLParser("<div class=\"rk-option-select\" style=\"width: 3em;margin-left: 0;\">", HTMLParser("<span>", "-"), (element) => {
						element.addEventListener("click", () => {
							const shadowIndex = this.shadowElements.indexOf(element.parentElement);
							this.shadowElements.splice(shadowIndex, 1);
							this.shadows.splice(shadowIndex, 1);
							element.parentElement.remove();
							if (this.shadowElements.length < this.maxShadows) {
								addShadowBtn.classList.remove("hide");
							}
							this.update();
						});
					}));
					this.shadowElements.push(element);
					this.html.appendChild(element);
					this.html.appendChild(addShadowBtn);

					if (this.shadowElements.length >= this.maxShadows) {
						addShadowBtn.classList.add("hide");
					}
				};

				this._AppendOverwritten();

				// custom version of this._SetupClearButton();
				this.html.querySelector("#rk-bg-clear-btn")
					?.addEventListener("click", () => {
						this.shadows = [];
						this.shadowElements.forEach(e => e.remove());
						this.update();
					});

				// initilize listeners
				addShadowBtn.addEventListener("click", () => {
					this.shadows.push("");
					createOption();
				});

				// load data
				if (this.themeData != null) {
					this.shadows = this.themeData.split(",");
					this.shadows = this.shadows.filter(e => e !== "");
					for (let shadowIndex = 0; shadowIndex < this.maxShadows && shadowIndex < this.shadows.length; shadowIndex++) {
						createOption();
					}
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					this.updatePreviewElement(this.html, settings);
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
				this.updatePreviewElement(this.html, settings);
			};

			updatePreviewElement = (componentHTML, settings) => {
				let previewElement = componentHTML.querySelector("[data-rk-preview]");

				if (settings == null) {
					if (previewElement != null)
						previewElement.remove();
					return;
				}
				if (previewElement == null) {
					previewElement = HTMLParser(
						"<div data-rk-preview data-translate=\"themePreview\" style=\"background: #333;\">",
						"Preview",
					);
					componentHTML.appendChild(previewElement);
				}

				previewElement.style.boxShadow = settings;
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}-box-shadow`, themeData);
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-box-shadow`, "null");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				if (this.shadows.filter(e => e !== "").length === 0)
					return null;
				return this.shadows.filter(e => e !== "").join(",");
			};
		},
		ShadowElement: class extends PopupPage {
			id = "shadow";

			/** @type {CustomComponent} */
			previousComponent;

			shadowIndex = -1;
			shadow = "";

			constructor(previousComponent, index) {
				super();
				this.previousComponent = previousComponent;
				this.shadowIndex = index;
				this.shadow = this.previousComponent.shadows[index];
			}

			initialHTML = /* html */`
				<h3>Shadow</h3>

				<label class="rk-line-option">
					<span>Type:</span>
					<select selected="" data-location="type" class="rk-option-select">
						<option value="" selected>Outset</option>
						<option value="inset">Inset</option>
					</select>
				</label>

				<div class="rbx-divider" style="margin: 12px;"></div>

				<label class="rk-side-option">
					<span>X:</span>
					<input type="range" value="0" step="1" min="-20" max="20"
						data-location="x">
				</label>

				<label class="rk-side-option">
					<span>Y:</span>
					<input type="range" value="0" step="1" min="-20" max="20"
						data-location="y">
				</label>

				<div class="rbx-divider" style="margin: 12px;"></div>

				<label class="rk-side-option">
					<span>Blur:</span>
					<input type="range" value="0" step="1" min="0" max="20"
						data-location="blur">
				</label>

				<label class="rk-side-option">
					<span>Spread:</span>
					<input type="range" value="0" step="1" min="0" max="20"
						data-location="spread">
				</label>

				<div class="rbx-divider" style="margin: 12px;"></div>

				<label class="rk-line-option">
					<span data-translate="themeColor">Color:</span>
					<input type="color" value="#000000"
						data-location="color" data-type="color" class="rk-option-select">
				</label>

				<div class="rbx-divider" style="margin: 12px;"></div>
			`;

			load = () => {
				const element = this.html;

				element.querySelectorAll("[data-location]")
					.forEach((input) => {
						input.addEventListener("input", () => this.update());
					});

				// load data
				if (this.shadow != null && this.shadow !== "") {
					// if (theme_object.startsWith('inset ') !== true) theme_object = ' ' + theme_object;
					const [type, x, y, blur, spread, rawColor] = this.shadow.split(" ");

					// load rest
					const inputsValue = { type, x, y, blur, spread, color: rawColor };
					element.querySelectorAll(`[data-location]`).forEach((input) => {
						const value = inputsValue[input.dataset.location];

						input.value = value.split("px")[0];
					});
				}

				this.update();
			};

			update = () => {
				const settings = this.shadow = this.save();
				this.previousComponent.shadows[this.shadowIndex] = settings;
				this.previousComponent.update();
				this.previousComponent.updatePreviewElement(this.html, this.previousComponent.themeData);
			};

			save = () => {
				const element = this.html;
				const inputsValue = {};

				// save inputs
				element.querySelectorAll(`[data-location]`).forEach((input) => {
					let value = input.value;
					if (input.dataset.location !== "type"
						&& input.dataset.location !== "color") {
						value += "px";
					}

					inputsValue[input.dataset.location] = value;
				});

				return `${inputsValue.type} ${inputsValue.x} ${inputsValue.y} ${inputsValue.blur} ${inputsValue.spread} ${inputsValue.color}`;
			};
		},
	}, // box-shadow
	{
		id: "backgroundfilter",
		parent: {
			all: false,
			headId: "pages",
			tags: {
				page: false,
				blockElement: true,
			},
		},
		details: {
			name: "Backdrop Filter",
			description: "adds filters behind the background of the element",
			translate: {
				name: "themeBackdropFilter",
				description: "themeBackdropFilter1",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "backgroundfilter";

			initialHTML = /* html */`
				<h3 data-translate="themeBackdropFilter">Backdrop Filter</h3>
				
				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>
				
				<label class="rk-side-option">
					<label class="rk-line-option">
						<span data-translate="themeFilterBrightness">Brightness</span>
						<button type="button" role="switch" data-enabled="brightness"
							class="btn-toggle receiver-destination-type-toggle off">
							<span class="toggle-flip"></span>
							<span id="toggle-on" class="toggle-on"></span>
							<span id="toggle-off" class="toggle-off"></span>
						</button>
					</label>
					<input type="range" min="0" max="2" value="1" step="0.1"
						data-location="brightness">
				</label>

				<label class="rk-side-option">
					<label class="rk-line-option">
						<span data-translate="themeFilterBlur">Blur</span>
						<button type="button" role="switch" data-enabled="blur"
							class="btn-toggle receiver-destination-type-toggle off">
							<span class="toggle-flip"></span>
							<span id="toggle-on" class="toggle-on"></span>
							<span id="toggle-off" class="toggle-off"></span>
						</button>
					</label>
					<input type="range" min="0" max="50" value="0" step="5"
						data-location="blur">
				</label>

				<label class="rk-side-option">
					<label class="rk-line-option">
						<span data-translate="themeFilterContrast">Contrast</span>
						<button type="button" role="switch" data-enabled="contrast"
							class="btn-toggle receiver-destination-type-toggle off">
							<span class="toggle-flip"></span>
							<span id="toggle-on" class="toggle-on"></span>
							<span id="toggle-off" class="toggle-off"></span>
						</button>
					</label>
					<input type="range" min="0" max="2" value="1" step="0.1"
						data-location="contrast">
				</label>

				<label class="rk-side-option">
					<label class="rk-line-option">
						<span data-translate="themeFilterGrayscale">Grayscale</span>
						<button type="button" role="switch" data-enabled="grayscale"
							class="btn-toggle receiver-destination-type-toggle off">
							<span class="toggle-flip"></span>
							<span id="toggle-on" class="toggle-on"></span>
							<span id="toggle-off" class="toggle-off"></span>
						</button>
					</label>
					<input type="range" min="0" max="1" value="0" step="0.1"
						data-location="grayscale">
				</label>

				<label class="rk-side-option">
					<label class="rk-line-option">
						<span data-translate="themeFilterHueRotate">Hue Rotate</span>
						<button type="button" role="switch" data-enabled="hue-rotate"
							class="btn-toggle receiver-destination-type-toggle off">
							<span class="toggle-flip"></span>
							<span id="toggle-on" class="toggle-on"></span>
							<span id="toggle-off" class="toggle-off"></span>
						</button>
					</label>
					<input type="range" min="0" max="360" value="0" step="10"
						data-location="hue-rotate">
				</label>

				<label class="rk-side-option">
					<label class="rk-line-option">
						<span data-translate="themeFilterSaturate">Saturate</span>
						<button type="button" role="switch" data-enabled="saturate"
							class="btn-toggle receiver-destination-type-toggle off">
							<span class="toggle-flip"></span>
							<span id="toggle-on" class="toggle-on"></span>
							<span id="toggle-off" class="toggle-off"></span>
						</button>
					</label>
					<input type="range" min="0" max="2" value="1" step="0.1"
						data-location="saturate">
				</label>
				
				<label class="rk-side-option">
					<label class="rk-line-option">
						<span data-translate="themeFilterInvert">Invert</span>
						<button type="button" role="switch" data-enabled="invert"
							class="btn-toggle receiver-destination-type-toggle off">
							<span class="toggle-flip"></span>
							<span id="toggle-on" class="toggle-on"></span>
							<span id="toggle-off" class="toggle-off"></span>
						</button>
					</label>
				</label>
				
				<div class="rbx-divider" style="margin: 12px;"></div>
			`;

			load = () => {
				const element = this.html;

				this._AppendOverwritten();

				// custom version of this._SetupClearButton();
				this.html.querySelector("#rk-bg-clear-btn")
					?.addEventListener("click", () => {
						element.querySelectorAll("[data-enabled]").forEach((input) => {
							input.classList.remove("on");
							input.classList.add("off");
						});
						this.update();
					});

				// initilize listeners
				element.querySelectorAll("[data-enabled]")
					.forEach((input) => {
						input.addEventListener("click", () => {
							input.classList.toggle("on", input.classList.contains("off"));
							input.classList.toggle("off", !input.classList.contains("off"));
							this.update();
						});
					});
				element.querySelectorAll("[data-location]")
					.forEach((input) => {
						input.addEventListener("input", () => this.update());
					});

				// load data
				if (this.themeData != null && this.themeData !== "") {
					// for all objects in theme_object
					const filters = this.themeData.split(" ");
					for (const filter of filters) {
						if (filter === "")
							continue;

						const filterName = filter.split("(")[0];

						// check if path/object key exist in components as id
						if (filterName == null || filterName === "")
							continue;

						const filterEnabled = element.querySelector(`[data-enabled="${filterName}"]`);
						const filterElement = element.querySelector(`[data-location="${filterName}"]`);
						if (filterEnabled == null)
							continue;

						// add component
						let value = filter.split("(")[1].split(")")[0];
						switch (filterName) {
							case "blur":
								value = value.split("px")[0];
								break;
							case "hue-rotate":
								value = value.split("deg")[0];
								break;
						}

						// after setup do load and pass the same object's value
						if (filterElement)
							filterElement.value = value;
						filterEnabled.classList.remove("off");
						filterEnabled.classList.add("on");
					}
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					this.updatePreviewElement(this.html, settings);
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
				this.updatePreviewElement(this.html, settings);
			};

			updatePreviewElement = (componentHTML, settings) => {
				let previewElement = componentHTML.querySelector("[data-rk-preview]");

				if (settings == null) {
					if (previewElement != null)
						previewElement.remove();
					return;
				}
				if (previewElement == null) {
					previewElement = HTMLParser(
						"<div data-rk-preview data-translate=\"themePreview\" style=\"background: #33333333;\">",
						"Preview",
					);
					componentHTML.appendChild(previewElement);
				}

				previewElement.style.backdropFilter = settings;
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}-backdrop-filter`, themeData);
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-backdrop-filter`, "null");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				const element = this.html;
				const theme_object = {};

				element.querySelectorAll("[data-enabled]").forEach((input) => {
					if (input.classList.contains("off"))
						return;
					const type = input.dataset.enabled;
					const inputValue = element.querySelector(`[data-location="${type}"]`);
					if (!inputValue) {
						theme_object[type] = "1";
						return;
					}
					switch (type) {
						case "blur":
							theme_object[type] = `${inputValue.value}px`;
							return;
						case "hue-rotate":
							theme_object[type] = `${inputValue.value}deg`;
							return;
						default:
							theme_object[type] = inputValue.value;
					}
				});

				const value = Object.keys(theme_object)
					.map(key => `${key}(${theme_object[key]})`)
					.join(" ");

				if (value === "")
					return null;
				return value;
			};
		},
	}, // backgroundfilter

	{
		id: "column",
		parent: {
			headId: "pages",
			tags: {
				server: true,
			},
		},
		details: {
			name: "Column Count",
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "column";

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3>Column Count</h3>

				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<label class="rk-side-option">
					<span data-translate="themeSvrPerRow">Servers Per Row:</span>
					<input type="range" value="5"
						data-location="column" data-type="value" max="8">
				</label>
			`;

			load = () => {
				const element = this.html;

				this._SetupClearButton();

				const input = element.querySelector(`[data-location="column"]`);
				if (!input)
					return;

				// initilize listeners
				input.addEventListener("input", () => {
					this.isBeingUsed = true;
					this.update();
				});

				// load data
				if (this.themeData != null) {
					this.isBeingUsed = true;
					input.value = this.themeData;
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}-column`, themeData);
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-column`, "5");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				if (this.isBeingUsed === false)
					return null;
				return this.html.querySelector(`[data-location="column"]`).value;
			};
		},
	}, // column
	{
		id: "gap",
		parent: {
			headId: "pages",
			tags: {
				server: true,
			},
		},
		details: {
			name: "Gap Between Servers",
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "gap";

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3>Gap Between Servers</h3>

				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<label class="rk-side-option">
					<span data-translate="themeSvrGap">Servers Gap:</span>
					<input type="range" value="0.3" step="0.1"
						data-location="gap" data-type="percent" max="2">
				</label>
			`;

			load = () => {
				const element = this.html;

				this._SetupClearButton();

				const input = element.querySelector(`[data-location="gap"]`);
				if (!input)
					return;

				// initilize listeners
				input.addEventListener("input", () => {
					this.isBeingUsed = true;
					this.update();
				});

				// load data
				if (this.themeData != null) {
					this.isBeingUsed = true;
					input.value = this.themeData.slice(0, -1);
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}-gap`, themeData);
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-gap`, "0.3%");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				if (this.isBeingUsed === false)
					return null;
				return `${this.html.querySelector(`[data-location="gap"]`).value}%`;
			};
		},
	}, // gap
	{
		id: "color",
		parent: {
			headId: "pages",
			ids: {
				pagenav: true,
			},
			tags: {
				hasColor: true,
			},
		},
		details: {
			name: "Text Color",
			translate: {
				name: "themeTxtColor",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "color";

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3 data-translate="themeTxtColor">Text Color</h3>

				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<div class="rk-option-select rk-cyan no-hover">
					<span>This component doesn't support live preview</span>
				</div>

				<label class="rk-line-option">
					<span data-translate="themeTxtColor">Text Color</span>
					<input type="color" value="#ffffff"
						data-location="color" data-type="value" class="rk-option-select">
				</label>
			`;

			load = () => {
				const element = this.html;
				const theme_object = this.themeData;

				this._SetupClearButton();

				const input = element.querySelector(`[data-location="color"]`);
				if (!input)
					return;

				// initilize listeners
				input.addEventListener("input", () => {
					this.isBeingUsed = true;
					this.update();
				});

				// load data
				if (theme_object != null) {
					this.isBeingUsed = true;
					if (theme_object.startsWith("#"))
						input.value = theme_object;
					else input.value = rgbToHex(...Object.values(rgbaTovar(theme_object)));
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					// this.updatePreviewElement(this.html, settings);
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
				// this.updatePreviewElement(this.html, settings);
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}-color`, themeData);
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-color`, "null");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				const element = this.html;
				return hexToRgb(element.querySelector(`[data-location="color"]`).value);
			};
		},
	}, // color
	{
		id: "colors",
		parent: {
			headId: "pages",
			ids: {
				badge: true,
				menu: true,
			},
			tags: {
				hasBrightnDarkColors: true,
			},
		},
		details: {
			name: "Text Color",
			translate: {
				name: "themeTxtColor",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "colors";

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3 data-translate="themeTxtColor">Text Color</h3>

				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<div class="rk-option-select rk-cyan no-hover">
					<span>This component doesn't support live preview</span>
				</div>
				
				<label class="rk-line-option">
					<span data-translate="themeBrtColor">Bright Color:</span>
					<input type="color" value="#ffffff"
						data-location="bright" data-type="value" class="rk-option-select">
				</label>
				
				<label class="rk-line-option">
					<span data-translate="themeDrkColor">Dark Color:</span>
					<input type="color" value="#bdbebe"
						data-location="dark" data-type="value" class="rk-option-select">
				</label>
			`;

			load = () => {
				const element = this.html;
				const theme_object = this.themeData;

				this._SetupClearButton();

				// initilize listeners
				element.querySelectorAll("[data-location]").forEach((input) => {
					input.addEventListener("input", () => {
						this.isBeingUsed = true;
						this.update();
					});
				});

				// load data
				if (theme_object != null) {
					this.isBeingUsed = true;
					element.querySelector(`[data-location="bright"]`).value = theme_object.bright;
					element.querySelector(`[data-location="dark"]`).value = theme_object.dark;
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					// this.updatePreviewElement(this.html, settings);
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
				// this.updatePreviewElement(this.html, settings);
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}-bright-color`, themeData.bright);
					document.body.style.setProperty(`--rk-${propertyName}-dark-color`, themeData.dark);
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-bright-color`, "#ffffff");
					document.body.style.setProperty(`--rk-${propertyName}-dark-color`, "#bdbebe");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				const element = this.html;

				return {
					bright: element.querySelector(`[data-location="bright"]`).value,
					dark: element.querySelector(`[data-location="dark"]`).value,
				};
			};
		},
	}, // colors - 2
	{
		id: "colors2",
		parent: {
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Text Color",
			translate: {
				name: "themeTxtColor",
			},
		},
		Element: class extends DefaultThemeEditorComponents.CustomComponent {
			id = "colors2";

			isBeingUsed = false;

			initialHTML = /* html */`
				<h3 data-translate="themeTxtColor">Text Color</h3>

				<button id="rk-bg-clear-btn" class="rk-extra-nav-button rk-button" title="Clear Inputs">
					<div class="rb-reload-icon"></div>
				</button>

				<div class="rk-option-select rk-cyan no-hover">
					<span>This component doesn't support live preview</span>
				</div>
				
				<label class="rk-line-option">
					<span>Header Color:</span>
					<input type="color" value="#ffffff"
						data-location="bright" data-type="value" class="rk-option-select">
				</label>

				<label class="rk-line-option">
					<span>Title Color:</span>
					<input type="color" value="#ffffff"
						data-location="bright2" data-type="value" class="rk-option-select">
				</label>
				
				<label class="rk-line-option">
					<span>Content Color:</span>
					<input type="color" value="#bdbebe"
						data-location="dark" data-type="value" class="rk-option-select">
				</label>
			`;

			load = () => {
				const element = this.html;
				const theme_object = this.themeData;

				this._SetupClearButton();

				// initilize listeners
				element.querySelectorAll("[data-location]").forEach((input) => {
					input.addEventListener("input", () => {
						this.isBeingUsed = true;
						this.update();
					});
				});

				// load data
				if (theme_object != null) {
					this.isBeingUsed = true;
					element.querySelector(`[data-location="bright"]`).value = theme_object.primary;
					element.querySelector(`[data-location="bright2"]`).value = theme_object.primary2;
					element.querySelector(`[data-location="dark"]`).value = theme_object.secondary;
				}

				this.update();
			};

			update = () => {
				const settings = this.themeData = this.save();
				if (settings == null) {
					// this.updatePreviewElement(this.html, settings);
					if (this.isBeingOverwritten)
						return;

					// remove live preview
					this.applyLiveChanges(this._GetDefaultValue());
					return;
				}

				this._TriggerLiveUpdate();
				// this.updatePreviewElement(this.html, settings);
			};

			applyLiveChanges = (themeData) => {
				const propertyName = this.previousComponent.cssPropertyName;

				if (themeData != null) {
					document.body.style.setProperty(`--rk-${propertyName}-textcolor-primary`, themeData.primary);
					document.body.style.setProperty(`--rk-${propertyName}-textcolor-primary2`, themeData.primary2);
					document.body.style.setProperty(`--rk-${propertyName}-textcolor-secondary`, themeData.secondary);
				}
				else {
					document.body.style.setProperty(`--rk-${propertyName}-textcolor-primary`, "#ffffff");
					document.body.style.setProperty(`--rk-${propertyName}-textcolor-primary2`, "#ffffff");
					document.body.style.setProperty(`--rk-${propertyName}-textcolor-secondary`, "#bdbebe");
				}
				this.lastAnimationFrame = null;
			};

			save = () => {
				const element = this.html;

				return {
					primary: element.querySelector(`[data-location="bright"]`).value,
					primary2: element.querySelector(`[data-location="bright2"]`).value,
					secondary: element.querySelector(`[data-location="dark"]`).value,
				};
			};
		},
	}, // colors2 - 2 primary 1 secondary

	// Components //
	{
		id: "all",
		tags: ["page"],
		parent: {
			ids: {
				pages: true,
			},
		},
		details: {
			name: "All Pages",
			description: "Default components for all pages.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // all
	{
		id: "home",
		tags: ["page"],
		parent: {
			ids: {
				pages: true,
			},
		},
		details: {
			name: "Home Page",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // home
	{
		id: "game",
		tags: ["page"],
		parent: {
			ids: {
				pages: true,
			},
		},
		details: {
			name: "Game Page",
			translate: {
				name: "categoryGamePage",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // game
	{
		id: "users",
		tags: ["page"],
		parent: {
			ids: {
				pages: true,
			},
		},
		details: {
			name: "User Page",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // users
	{
		id: "groups",
		tags: ["page"],
		parent: {
			ids: {
				pages: true,
			},
		},
		details: {
			name: "Group Page",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // groups
	{
		id: "avatarpage",
		tags: ["page", "no-gamecards"],
		parent: {
			ids: {
				pages: true,
			},
		},
		details: {
			name: "Avatar Page",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // avatarpage
	{
		id: "catalog",
		tags: ["page", "no-gamecards"],
		parent: {
			ids: {
				pages: true,
			},
		},
		details: {
			name: "Catalog Page",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // catalog
	{
		id: "content",
		tags: ["blockElement"],
		highlightSelectors: [
			{ highlight: "#container-main > div.content" },
		],
		parent: {
			headId: "pages",
			tags: {
				page: true,
			},
		},
		details: {
			name: "Page's Content",
			description: "Edits the middle block that holds page content.",
			translate: {
				name: "themePageContent",
				description: "themePageContentDesc",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // content
	{
		id: "menu",
		tags: ["blockElement"],
		highlightSelectors: [
			{ highlight: "#header,#navigation,#footer-container" },
		],
		parent: {
			headId: "pages",
			tags: {
				page: true,
			},
		},
		details: {
			name: "Page's Menu",
			description: "Edits the top, left and bottom navigation bars all togeather.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // menu
	{
		id: "icon",
		tags: ["hasBackground"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: ".rbx-header .icon-logo" },
		],
		parent: {
			ids: {
				menu: true,
			},
		},
		details: {
			name: "Header Wide Logo",
			description: "Edits the 'ROBLOX' logo on top right of site.",
			translate: {
				name: "componmentIcon",
				description: "componmentIconDesc",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // icon
	{
		id: "iconr",
		tags: ["hasBackground"],
		highlightSelectors: [
			{ highlight: ".rbx-header .icon-logo-r" },
		],
		isPageChild: true,
		parent: {
			ids: {
				menu: true,
			},
		},
		details: {
			name: "Header Short Logo",
			description: "Edits the 'O' logo on top right of site.",
			translate: {
				name: "componmentIconR",
				description: "componmentIconRDesc",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // iconr
	{
		id: "popup",
		tags: ["blockElement"],
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.popup },
		],
		parent: {
			headId: "pages",
			tags: {
				page: true,
			},
		},
		details: {
			name: "Popups",
			description: "Edits any modal or popup.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // popup
	{
		id: "gamesection",
		tags: ["blockElement"],
		highlightSelectors: [
			{ highlight: "div > .game-carousel, .game-grid, .game-cards" },
		],
		isPageChild: true,
		parent: {
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Game Section",
			description: "Edits around a group of game cards.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // gamesection
	{
		id: "peoplesection",
		tags: ["blockElement"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: ".rbx-body .content .friends-carousel-list-container" },
		],
		parent: {
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Profiles Section",
			description: "Edits around a group of profile cards.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // peoplesection
	{
		id: "group",
		tags: ["blockElement"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.group },
		],
		parent: {
			page: {
				id: "groups",
			},
			ids: {
				content: true,
			},
		},
		details: {
			name: "Group Header",
			description: "Edits group header, groups list and group buttons all togeather.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // group
	{
		id: "profile",
		tags: ["blockElement"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.profile },
		],
		parent: {
			page: {
				id: "users",
			},
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Profile Header",
			description: "Edits profile header, profile blocks of information (avatar, badges, etc.), profile buttons and friend list all togeather.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // profile
	{
		id: "avatar",
		tags: ["blockElement"],
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.avatar },
		],
		parent: {
			headId: "pages",
			tags: {
				page: true,
			},
		},
		details: {
			name: "User Avatars",
			description: "Edits all circular user avatars.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // avatar
	{
		id: "avatareditor",
		tags: ["blockElement"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.avatareditor },
		],
		parent: {
			page: {
				id: "avatarpage",
			},
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Avatar Preview",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // avatareditor
	{
		id: "quickgamejoin",
		tags: ["blockElement"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.quickgamejoin },
		],
		parent: {
			headId: "pages",
			tags: {
				"no-gamecards": false,
			},
			ids: {
				gamesection: true,
			},
		},
		details: {
			name: "Quick Join Button",
			description: "Edits the join button created by 'Quick Join Button' feature which is shown on game cards.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // quickgamejoin
	{
		id: "gameplay",
		tags: ["blockElement"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.gameplay },
		],
		parent: {
			page: {
				id: "game",
			},
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Play Game Button",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // gameplay
	{
		id: "badge",
		tags: ["blockElement", "hasBrightnDarkColors"],
		isPageChild: true,
		highlightSelectors: [
			{ highlight: BackgroundImageToElements.badge },
		],
		parent: {
			page: {
				id: "game",
			},
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Badge",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // badge
	{
		id: "pagenav",
		tags: ["blockElement", "hasColor"],
		isPageChild: true,
		parent: {
			page: {
				id: "game",
			},
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Game Page Navigator",
			description: "Edits the navigation button under servers list",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // pagenav
	{
		id: "button",
		tags: ["blockElement"],
		isPreviousDependant: true,
		parent: {
			tags: {
				hasButton: true,
			},
		},
		details: {
			name: "Button",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // button
	{
		id: "defaultserver",
		tags: ["blockElement", "hasButton"],
		highlightSelectors: [
			{ highlight: ".server-list-section ul.card-list > li" },
		],
		isPageChild: true,
		parent: {
			page: {
				id: "game",
			},
			headId: "pages",
			ids: {
				content: true,
			},
		},
		details: {
			name: "Default Server",
			description: "Default Components for Servers.",
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // defaultserver
	{
		id: "publicserver",
		tags: ["blockElement", "hasButton", "server"],
		highlightSelectors: [
			{ highlight: "li.rbx-public-game-server-item" },
		],
		isPageChild: true,
		parent: {
			headId: "pages",
			ids: {
				defaultserver: true,
			},
		},
		details: {
			name: "Public Server",
			translate: {
				name: "serversPublic",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // publicserver
	{
		id: "smallserver",
		tags: ["blockElement", "hasButton", "server"],
		highlightSelectors: [
			{ highlight: "li.rbx-small-game-server-item" },
		],
		isPageChild: true,
		parent: {
			headId: "pages",
			ids: {
				defaultserver: true,
			},
		},
		details: {
			name: "Small Server",
			translate: {
				name: "serversSmall",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // smallserver
	{
		id: "friendsserver",
		tags: ["blockElement", "hasButton", "hasColor", "server"],
		highlightSelectors: [
			{ highlight: "li.rbx-friends-game-server-item" },
		],
		isPageChild: true,
		parent: {
			headId: "pages",
			ids: {
				defaultserver: true,
			},
		},
		details: {
			name: "Friends Server",
			translate: {
				name: "serversFriends",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // friendsserver
	{
		id: "privateserver",
		tags: ["blockElement", "hasButton", "hasColor", "server"],
		highlightSelectors: [
			{ highlight: "li.rbx-private-game-server-item" },
		],
		isPageChild: true,
		parent: {
			headId: "pages",
			ids: {
				defaultserver: true,
			},
		},
		details: {
			name: "Private Server",
			translate: {
				name: "serversPrivate",
			},
		},
		Element: DefaultThemeEditorComponents.ComponentPage,
	}, // privateserver

];

Rkis.ThemeEdtior.isInitilized = false;
Rkis.ThemeEdtior.initilize = function (themeId) {
	if (Rkis.generalLoaded !== true) {
		document.addEventListener("rk-general-loaded", () => {
			Rkis.ThemeEdtior.initilize();
		}, { once: true });
		return;
	}

	if (!Rkis.wholeData?.Designer?.Themes?.[themeId])
		return;
	const theme = structuredClone(Rkis.wholeData.Designer.Themes[themeId]);
	const themeEditorPopup = new ThemeEditorPopup(theme);
	themeEditorPopup.onSave((themeData) => {
		console.log("save", themeData);
		Rkis.wholeData.Designer.Themes[themeId] = themeData;
		Rkis.database.save();
	});

	document.$watch("body", (body) => {
		body.appendChild(themeEditorPopup.mainPopup);
	});

	if (!Rkis.ThemeEdtior.isInitilized) {
		Rkis.ThemeEdtior.isInitilized = true;

		// load css
		Rkis.Designer.addCSS(["js/Theme/ThemeEditor.css"]);

		// slider value previewer
		document.$watchLoop(`#rkis-editor input[type="range"]`, (inputElement) => {
			const parentElement = inputElement.parentElement;
			let isContainer = parentElement.tagName === "LABEL" || parentElement.children.length === 2;
			const textElement = parentElement.querySelector("span,div");
			if (textElement == null)
				isContainer = false;
			if (isContainer === false)
				return;

			let originalText = textElement.textContent;
			let textTimeout = null;
			const maxValue = inputElement.max || "100";
			inputElement.addEventListener("input", () => {
				if (textTimeout !== null) {
					clearTimeout(textTimeout);
				}
				else {
					originalText = textElement.textContent;
				}
				textTimeout = setTimeout(() => {
					textElement.textContent = originalText;
					textTimeout = null;
				}, 3000);

				textElement.textContent = `${inputElement.value} / ${maxValue}`;
			});
		});
	}
};

// Rkis.ThemeEdtior.initilize();

class ThemeEditorPopup {
	/** @type {ThemeEditorPopup} */
	static instance;

	/** @type {HTMLDivElement} */
	mainPopup;
	/** @type {HTMLDivElement} */
	mainPopupContent;
	/** @type {HTMLDivElement} */
	mainPopupBackBtn;
	/** @type {HTMLDivElement} */
	mainPopupSaveBtn;
	/** @type {HTMLDivElement} */
	mainPopupCloseBtn;

	// entire theme data
	themeData;

	/** @type {PopupPage[]} */
	dynamicPagesHistory = [];
	/**
	 * @type {Function[]}
	 */
	saveListeners = [];

	constructor(themeData) {
		ThemeEditorPopup.instance = this;
		this.themeData = themeData;
		this.mainPopup = this.initilizePopup();
		this.mainPopupContent = this.mainPopup.querySelector("#rkis-editor-content-container");
		this.updatePopupContent(new DefaultThemeEditorComponents.PageChanger());
	}

	initilizePopup() {
		const editorHTML = HTMLParser("<div id=\"rkis-editor\">", element => element.innerHTML = `
				<div class="rkis-editor-buttons">
					<button id="rkis-editor-back" class="rk-button hidden">&lt;- Back</button>
					<span class="rk-flex-grow"></span>
					<button id="rkis-editor-save" class="rk-button rk-green">Save</button>
					<button id="rkis-editor-close" class="rk-button">X</button>
				</div>
				<div id="rkis-editor-content-container" class="rkis-box-1"></div>
			`);

		this.mainPopupBackBtn = editorHTML.querySelector("#rkis-editor-back");
		this.mainPopupBackBtn.addEventListener("click", () => this.previousPopupPage());
		this.mainPopupSaveBtn = editorHTML.querySelector("#rkis-editor-save");
		this.mainPopupSaveBtn.addEventListener("click", () => this.saveChanges());
		this.mainPopupCloseBtn = editorHTML.querySelector("#rkis-editor-close");
		this.mainPopupCloseBtn.addEventListener("click", () => this.cancelChanges());

		return editorHTML;
	}

	onSave(fn) { this.saveListeners.push(fn); }

	saveChanges() {
		while (this.dynamicPagesHistory.length > 1) {
			this.previousPopupPage();
		}
		// this.saveListeners.forEach(fn => fn(this.themeData));

		for (const fn of this.saveListeners) {
			fn(this.themeData);
		}

		this.removeLiveChanges();
		Rkis.Designer.ReloadCurrentThemeElement();
	}

	cancelChanges() {
		this.removeLiveChanges();
		this.mainPopup.remove();
		ThemeEditorPopup.instance = null;
		Rkis.Designer.ReloadCurrentThemeElement();
	}

	removeLiveChanges() {
		// resets properties
		for (let styleIndex = document.body.style.length - 1; styleIndex >= 0; styleIndex--) {
			const property = document.body.style[styleIndex];
			if (!property.startsWith("--rk-"))
				continue;
			document.body.style.removeProperty(property);
		}

		// resets background workaround
		for (const key in BackgroundImageToElements) {
			const elements = BackgroundImageToElements[key];

			document.querySelectorAll(elements).forEach((bg) => {
				bg.style.removeProperty("background-image");
			});
		}
	}

	cleanMainContent() {
		this.mainPopupContent.childNodes.forEach(n => n.remove());
		this.dynamicPagesHistory.forEach((p) => {
			if (p._isHidden)
				return;
			p._isHidden = true;
			p.hide();
		});
	}

	/** @param {PopupPage} pageToRemove */
	removePageFromHistory(pageToRemove) {
		if (this.dynamicPagesHistory.at(-1) === pageToRemove) {
			return this.previousPopupPage();
		}
		if (!this.dynamicPagesHistory.includes(pageToRemove))
			return;
		this.dynamicPagesHistory = this.dynamicPagesHistory.filter(p => p !== pageToRemove);
		pageToRemove.unload();
	}

	previousPopupPage() {
		this.dynamicPagesHistory.pop().unload();
		this.cleanMainContent();
		const previousPage = this.dynamicPagesHistory.at(-1);
		previousPage.show();
		previousPage._isHidden = false;
		this.mainPopupContent.appendChild(previousPage.html);

		if (this.dynamicPagesHistory.length <= 1) {
			this.mainPopupBackBtn.classList.add("hidden");
		}
	}

	/** @param {PopupPage} popupPage */
	updatePopupContent(popupPage) {
		this.cleanMainContent();

		this.dynamicPagesHistory.push(popupPage);
		popupPage.themeEditorPopup = this;

		// add element
		const holder = document.createElement("div");
		holder.classList.add("rk-dynamic-popup");
		holder.innerHTML = popupPage.initialHTML;
		popupPage.show();
		popupPage._isHidden = false;
		this.mainPopupContent.appendChild(holder);
		popupPage.html = holder;

		if (this.dynamicPagesHistory.length > 1) {
			this.mainPopupBackBtn.classList.remove("hidden");
		}

		popupPage.load();
	}

	/**
	 * @param {1|2|3} type Customize | Style | Components
	 * @param {DefaultThemeEditorComponents.ComponentPage} componentPage
	 * @return {ComponentInfo[]}
	 */
	getAvailableComponents(type, componentPage) {
		/** @type {ComponentInfo} */
		const componentInfo = componentPage.info;
		if (componentInfo == null)
			throw new Error(`Couldn't find component id: ${componentPage.id}`);

		// if (type == 1) type = false;
		// else if (type == 3) type = true;

		let isIdBtn = true;
		let isTagBtn = true;

		// Checks if the component has an id.
		const id = componentInfo.id;
		if (id == null || id === "") {
			isIdBtn = false;
		}

		// Checks if a component has any tags.
		const tags = componentInfo.tags;
		if (tags == null || tags.length === 0) {
			isTagBtn = false;
		}

		// Exit if couldn't identify the element
		if (isIdBtn === false && isTagBtn === false)
			return [];

		// Find usable components
		const components = ListOfThemeEditorComponents.filter((x) => {
			if (getComponentType(x.Element) !== type)
				return false;
			if (x.parent == null)
				return false;

			if (x.parent.page != null) {
				if (x.parent.page.id != null && this.dynamicPagesHistory.at(1)?.id != null) {
					if (x.parent.page.id !== this.dynamicPagesHistory.at(1).id) {
						return false;
					}
				}

				if (isTagBtn === true && x.parent.page.tags != null) {
					for (const tag of tags) {
						if (x.parent.page.tags[tag] === false)
							return false;
					}
				}
			}

			let pass = x.parent.all ?? false;

			if (isIdBtn === true && x.parent.ids != null) {
				if (x.parent.ids[id] === true)
					pass = true;
				else if (x.parent.ids[id] === false)
					return false;
			}

			if (isTagBtn === true && x.parent.tags != null) {
				for (const tag of tags) {
					if (x.parent.tags[tag] === true)
						pass = true;
					else if (x.parent.tags[tag] === false)
						return false;
				}
			}
			return pass;
		});

		return components;
	}
}

/** @returns {0|1|2|3} Unknown | Customize | Style | Components */
function getComponentType(x) {
	const isOfClass = (e, c) =>
		e === c
		|| e?.prototype instanceof c
	;

	if (isOfClass(x, DefaultThemeEditorComponents.ComponentPage)) {
		return 3;
	}
	else if (isOfClass(x, DefaultThemeEditorComponents.StylePage)) {
		return 2;
	}
	else {
		return 1;
	}
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? `rgb(${Number.parseInt(result[1], 16)},${Number.parseInt(result[2], 16)},${Number.parseInt(result[3], 16)})` : null;
}

function rgbTorgba(rgb, alpha) {
	let result = rgb.replace("rgb(", "rgba(");
	if (result.split(",").length > 3)
		result = `${result.split(",").slice(0, -1).join(",")})`;
	return result.replace(")", `,${alpha}%)`);
}

function rgbaTovar(rgba) {
	const vars = rgba.split("(")[1].split(")")[0].split("%")[0].split(",");
	return { r: Number(vars[0]), g: Number(vars[1]), b: Number(vars[2]), a: Number(vars[3]) };
}

function rgbToHex(r, g, b) {
	return `#${((1 << 24) + (r << 16) + (g << 8) + Number.parseInt(b)).toString(16).slice(1)}`;
}
