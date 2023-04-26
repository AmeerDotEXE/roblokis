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
			<div class="rk-popup" style="width: min(100%, 55rem);max-height: 100%;padding: 0;overflow: hidden;"><!--data-designer-func="add-edits"-->
				<div data-component-holder style="width: 100%;overflow: auto;padding: 1rem;"> 
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
					infoElement.textContent = detail.description;
					if (hasLanguageTag)
						infoElement.dataset.translate = translate.description;
				} else if (infoType == 'note' && detail.note) {
					infoElement.textContent = detail.note;
					if (hasLanguageTag)
						infoElement.dataset.translate = translate.note;
				}
			});

			//setup component manager
			let componentHolder = element.querySelector(`[data-component-holder]`);
			
			componentHolder.dataset.componentId = component.id;
			componentHolder.dataset.headId = element.dataset.headId;
			componentHolder.componentTags = component.tags || [];

			Designer.ThemeEditor.setupComponentsManager(componentHolder);
			element.load = componentHolder.load;
			element.save = componentHolder.save;
			
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
			});
		}
	}
};
let designerComponents = [
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
			<div class="section-content">
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
					<span style="min-width: fit-content;margin-right: 5px;" data-translate="themeLink">File:</span>
					<input type="url" value=""
						data-location="image.link" data-type="value" class="form-control input-field">
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

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
					.addEventListener("click", () => {
						//console.log("Not Implemented");
						parentElement.removeComponent(idCard.component);
					});
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
						if (alpha.endsWith('%')) alpha.slice(0, -1);

						if (parseInt(alpha) <= 0) alpha = Number(alpha) * 100;
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

				return component_object;
			}
		}
	},//background
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
			<div class="section-content">
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

				//setup remove component btn
				element.querySelector(`[data-remove-component]`)
					.addEventListener("click", () => {
						parentElement.removeComponent(idCard.component);
					});
			},
			load: function (theme_object, idCard) {
				let element = idCard.element;

				for (let corner in theme_object) {
					if (theme_object[corner].radius == null) continue;

					let value = theme_object[corner].radius.slice(0, -2);
					element.querySelector(`[data-location="corners.${corner}.radius"]`).value = value;
				}
			},
			save: function (idCard) {
				let element = idCard.element;
				let component_object = {};

				element.querySelectorAll(`[data-location]`).forEach((input) => {
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
			<div class="section-content" style="min-width: 260px;">
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
					<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
					<label class="accordion__label" style="font-weight: 400;" data-translate="themeTBorder">Top Border</label>

					<span data-location="borders.top" class="rk-button receiver-destination-type-toggle off" style="float: right;">
						<span class="toggle-flip"></span>
						<span class="toggle-on"></span>
						<span class="toggle-off"></span>
					</span>
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
					<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
					<label class="accordion__label" style="font-weight: 400;" data-translate="themeLBorder">Left Border</label>

					<span data-location="borders.left" class="rk-button receiver-destination-type-toggle off" style="float: right;">
						<span class="toggle-flip"></span>
						<span class="toggle-on"></span>
						<span class="toggle-off"></span>
					</span>
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
					<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
					<label class="accordion__label" style="font-weight: 400;" data-translate="themeBBorder">Bottom Border</label>

					<span data-location="borders.bottom" class="rk-button receiver-destination-type-toggle off" style="float: right;">
						<span class="toggle-flip"></span>
						<span class="toggle-on"></span>
						<span class="toggle-off"></span>
					</span>
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
					<input type="radio" class="accordion__input" style="margin: 5px 10px;float: left;" name="contentborders">
					<label class="accordion__label" style="font-weight: 400;" data-translate="themeRBorder">Right Border</label>

					<span data-location="borders.right" class="rk-button receiver-destination-type-toggle off" style="float: right;">
						<span class="toggle-flip"></span>
						<span class="toggle-on"></span>
						<span class="toggle-off"></span>
					</span>
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
				let isEmpty = true;

				for (let edge in theme_object) {
					if (edge == null) continue;

					isEmpty = true;
					break;
				}

				return isEmpty;
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
		id: "content",
		tags: ["blockElement"],
		parent: {
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
		tags: ["hasBackground"],
		parent: {
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
		id: "shadow",
		parent: {
			headId: 'pages',
			ids: {
				content: true
			},
			tags: {
				hasShadow: true
			}
		},
		details: {
			name: "Border Shadow",
			translate: {
				name: 'themeBorderShadow'
			}
		},
		element: {
			html: /*html*/`
			<div class="section-content">
				<div class="rk-flex rk-space-between rk-center-x">
					<span data-translate="themeShadow">Shadow:</span>
					<button class="rk-btn" data-remove-component>-</button>
				</div>
				
				<select selected="" data-location="shadow" data-type="value" style="width: 100%;margin: 0;">
					<option value="" data-translate="themeEnabled">Enabled</option>
					<option value="disabled" data-translate="themeDisabled">Disabled</option>
				</select>
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

				element.querySelector(`[data-location="shadow"]`).value = theme_object;
			},
			save: function (idCard) {
				let element = idCard.element;

				return element.querySelector(`[data-location="shadow"]`).value;
			}
		}
	},//shadow
	{
		id: "badge",
		tags: ["blockElement", "hasBrightnDarkColors"],
		parent: {
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
				badge: true
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
		id: "pagenav",
		tags: ["blockElement", "hasColor", "hasButton"],
		parent: {
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

				element.querySelector(`[data-location="color"]`).value = theme_object;
			},
			save: function (idCard) {
				let element = idCard.element;

				return element.querySelector(`[data-location="color"]`).value;
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
		chrome.runtime.sendMessage({about: "getImageRequest", url: url, quick: quick}, 
		function(data) {
			resolve(data)
		})
	})
}



//SECTION - ThemeManager

Designer.LoadThemesData = async function() {
	var customthemesholder = await document.$watch("#customthemesholder").$promise();
	customthemesholder.innerHTML = "";

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};
	wholedata.Designer.Theme = wholedata.Designer.Theme || {};
	wholedata.Designer.Themes = wholedata.Designer.Themes || [];

	var letterNumber = /^[\s0-9a-zA-Z-_]+$/g;

	document.querySelector("#currentthemeplace").textContent = (wholedata.Designer.Theme.isDefaultTheme != true ? (wholedata.Designer.Themes[wholedata.Designer.Theme.id] ? wholedata.Designer.Themes[wholedata.Designer.Theme.id].name : "Default Theme") : wholedata.Designer.Theme.name);

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
				<div class="theme-template">
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
}

Designer.SaveNewTheme = async function(name, desc, themedata) {
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

	if(themedata != null) thenewtheme = jsonConcat(themedata, thenewtheme);

	wholedata.Designer.Themes.push(jsonConcat(themetemplate, thenewtheme));

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

	return {};
	
}

Designer.SelectThemeButton = function(button) {
	if(button == null) return;

	Designer.Selected.name = button.dataset.theme;
	Designer.Selected.id = button.dataset.themeid;
	Designer.Selected.isDefaultTheme = button.dataset.isdefaulttheme != "false";

	var wholedata = Rkis.wholeData || {};
	wholedata.Designer = wholedata.Designer || {};

	wholedata.Designer.Theme = {...Designer.Selected};

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;
	
	if (Designer.Selected.isDefaultTheme == false) {
		let theTheme = wholedata.Designer.Themes[Designer.Selected.id];
		fetch("https://accountsettings.roblox.com/v1/themes/user", {
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
				"x-csrf-token": document.querySelector("#rbx-body > meta").dataset.token
			},
			"body": `themeType=${theTheme.isDark != false ? 'Dark' : 'Light'}`,
			"method": "PATCH",
			"credentials": "include"
		});
	}

	Designer.LoadThemesData();
}

Designer.CreateTheme = function() {
	document.querySelector("#rk-createthemesection").style.display = "flex";
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

	if (newthemeimage != null) filetheme = {"pages":{"all":{"background":{"image":{"link":themeimage}}}}};
	filetheme = filetheme || {};
	filetheme.isDark = document.body.classList.contains('dark-theme');

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

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

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

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

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

	localStorage.setItem("Roblokis", JSON.stringify(wholedata));
	Rkis.wholeData = wholedata;

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
	
	if (theme.pages != null) pagestab.load(theme.pages);
	else {
		let pages_object = {};

		for (let page in theme) {
			if (theme[page].css == null) continue;

			pages_object[page] = theme[page].css;
		}

		pagestab.load(pages_object);
	}

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

	let componentsList = document.querySelector(`#rk-add-edits-list`);
	let currentComponents = [];

	// Displays the theme template add - components - card
	btn.showAddComponentMenu = function() {
		componentsList.innerHTML = "";
		components.forEach(component => {
			if (currentComponents.find(x => x.id == component.id) != null) return;

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
				ComponentDiv.remove();
			}, {once: true});

			componentsList.appendChild(ComponentDiv);
		});
		document.querySelector("#rk-editthemesectionadding").style.display = "flex";
	}
	btn.addComponent = function(component) {
		if (!components.includes(component)) return;

		let addedComponent = currentComponents.find(x => x.id == component.id);
		if (addedComponent != null) return addedComponent;

		//add element
		let holder = document.createElement('div');
		holder.classList.add("component-holder");
		holder.innerHTML = component.element.html;
		holder.dataset.componentId = component.id;
		holder.dataset.headId = headId;
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
			component
		};

		let run = component.element.js;
		if (typeof run == 'function') run(idCard, btn);
		
		//add in currentComponents
		currentComponents.push(idCard);

		return idCard;
	}
	btn.removeComponent = function(component) {
		currentComponents = currentComponents.filter(x => {
			if (x.id != component.id) return true;

			x.element.remove();
			return false;
		});
		return;
	}
	btn.load = function(theme_object) {
		//if (id == 'pages') console.log(`loading theme`, theme_object);

		//clear currentComponents
		currentComponents = [];
		btn.querySelectorAll('.component-holder').forEach((element) => {
			element.remove();
		});

		//for all objects in theme_object
		for (let path in theme_object) {
			if (theme_object[path] == null) continue;
			if (JSON.stringify(theme_object[path]) === '{}') continue;

			let component = components.find(x => x.id == path);

			//check if path/object key exist in components as id
			if (component == null) continue;

			if (typeof component.isEmpty == 'function' && component.isEmpty(theme_object[path])) continue;

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

//END SECTION ThemeEditor



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
				Designer.CreateTheme();
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
		} else if(e.classList.contains("create")) {
			e.$on("click", () => {
				Designer.CreateTheme();
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
}

Designer.waitingForGeneral();