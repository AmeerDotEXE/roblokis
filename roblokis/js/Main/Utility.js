var globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this;
const IS_CHROME_API = typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype;
const BROWSER = IS_CHROME_API ? chrome : globalThis.browser;

var Rkis = Rkis || {};

Rkis.InjectFile = function(src) {
	let head = document.head;
	if (head == null) head = document.documentElement;

	const script = document.createElement('script');
	script.src = src;
	script.onload = function() {
		//console.log("script injected");
		this.remove();
	};

	head.appendChild(script);
};
Rkis.IS_DEV = BROWSER.runtime.getManifest().update_url == null;

console.log = (function(old) {
	return function(...args) {
		return old("[%cRoblokis%c]", "color:red", "color:white", ...args)
	}
})(console.log);

console.error = (function(old) {
	return function(...args) {
		return old("[Roblokis Error]", ...args.map(x => {
			if (Rkis.IS_DEV == true) return x;
			if (typeof x == "object") return JSON.stringify(x);
			if (typeof x == "function") return x.toString();
			return x;
		}))
	}
})(console.error);

$r = (() => {
	let $ = {};
	
	const Months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	const ShortMonths = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];

	const Days = [
		"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
	];

	const ShortDays = [
		"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
	];

	/*set how many zeros*/
	function FixedNumber(num, len) {
		const str = String(num);
		const amt = len - str.length;

		return amt > 0 ? "0".repeat(amt) + str : str;
	}
	
	/*assigning multiple functions*/
	function Assign(stuff, data) { stuff.forEach(constructor => { Object.assign(constructor.prototype, data); }) }
	
	let DTF; /*for time format (PM, AM)*/
	
	if (self.document) {
		$ = function(selector) { return $.find(document, selector); } /* $(selector) == $.find(document, selector)*/
		$.all = function(selector) { return $.findAll(document, selector); }; /* $.all(selector) == $.findall(document, selector)*/
		
		const Observers = new WeakMap();

		function addWatch(target, selector, filter, resolve) {
			const item = {
				checked: new WeakSet(),
				firstSearch: false,
				stopped: false,

				resolve(node) {
					this.stopped = true;
					resolve(node);
				},

				execute() {
					if (!this.firstSearch) {
						const elem = target.$find(selector);
						if (!elem) return;

						this.firstSearch = true;
						this.checked.add(elem);

						if (!filter || filter(elem)) {
							item.resolve(elem);
							if (item.stopped) return;
						}
					}

					const matches = target.$findAll(selector);

					for (let index = 0; index < matches.length; index++) {
						const match = matches[index];

						if (!this.checked.has(match)) {
							this.checked.add(match);

							if (!filter || filter(match)) {
								this.resolve(match);
								if (this.stopped) return;
							}
						}
					}
				}
			};

			item.execute();

			if (!item.stopped) {
				let observer = Observers.get(target);

				if (!observer) {
					observer = new MutationObserver(handleMuts);
					Observers.set(target, observer);

					observer.listeners = [];
					observer.target = target;

					observer.observe(target, { childList: true, subtree: true });
				}

				observer.listeners.push(item);
			}
		}

		const watchProto = {
			$watch(...args) {
				const finishPromise = this.targetPromise.then(target => target.$watch(...args).finishPromise);
	
				return {
					targetPromise: this.targetPromise,
					finishPromise,
	
					parent: this.parent,
					__proto__: watchProto
				}
			},
			
			$watchLoop(...args) {
				this.targetPromise.then(target => { target.$watchLoop(...args); });
				return this;
			},
			
			$watchData(...args) {
				this.targetPromise.then(target => { target.$watchData(...args); });
				return this;
			},
	
			$then(callback) {
				const nxt = {
					targetPromise: this.finishPromise || this.targetPromise,
					finishPromise: null,
					
					parent: this,
					__proto__: watchProto
				};
	
				if (callback) nxt.targetPromise.then(callback);
				return nxt;
			},
	
			$back() {
				if (!this.parent) console.error("your at the top of the watcher");
				return this.parent;
			},
	
			$promise() {
				return (this.finishPromise || this.targetPromise);
			}
		};
	
		function handleMuts(muts, self) {
			const listeners = self.listeners;
			let index = 0;
	
			while (index < listeners.length) {
				const item = listeners[index];
	
				if (!item.stopped)
					item.execute(muts);
	
				if (item.stopped) 
					listeners.splice(index, 1);
				else
					index++;
			}
	
			if (!listeners.length) {
				self.disconnect();
				Observers.delete(self.target);
			}
		}
		
		Object.assign($, {
			each(list, fn) { 
				Array.prototype.forEach.call(list, fn);
			},

			ready(fn) {
				if (document.readyState != "loading")
					fn();
				else
					document.addEventListener("DOMContentLoaded", fn, { once: true });
			},

			watch(target, selectors, filter, callback) {
				if (typeof callback != "function") {
					callback = filter;
					filter = null;
				}

				if ((target instanceof Document) || (target instanceof DocumentFragment)) {
					target = target.documentElement;
				}

				if (!Array.isArray(selectors)) selectors = [selectors];

				let finishPromise;

				/*const promises = selectors.map(selector => addWatch(target, selector, filter));*/
				const promises = selectors.map(selector => new Promise(resolve => addWatch(target, selector, filter, resolve)));

				finishPromise = Promise.all(promises).then(elems => {
					if (callback) {
						try { callback(...elems); }
						catch(ex) { console.error(selectors, ex); }
					}
	
					return elems[0];
				});

				return {
					targetPromise: Promise.resolve(target),
					finishPromise,
					__proto__: watchProto
				}
			},
			watchLoop(target, selector, filter, callback) {

				if (typeof callback != "function") {
					callback = filter;
					filter = null;
				}

				if ((target instanceof Document) || (target instanceof DocumentFragment)) {
					target = target.documentElement;
				}

				const item = {
					checked: new WeakSet(),
					stopped: false,

					resolve(node) {
						if (callback) {
							try { callback(node, () => this.stopped = true); }
							catch(ex) { console.error(selector, ex); }
						}
					},

					execute() {
						const matches = target.$findAll(selector);

						for (const match of matches) {
							if (this.checked.has(match) == false) {
								this.checked.add(match);

								if (!filter || filter(match)) {
									this.resolve(match);
									if (this.stopped) return;
								}
							}
						}
					}
				};

				item.execute();

				if (!item.stopped) {
					let observer = Observers.get(target);

					if (!observer) {
						observer = new MutationObserver(handleMuts);
						Observers.set(target, observer);

						observer.listeners = [];
						observer.target = target;

						observer.observe(target, { childList: true, subtree: true });
					}

					observer.listeners.push(item);
				}
			},
			watchData(target, filter, callback) {

				if (typeof callback != "function") {
					callback = filter;
					filter = null;
				}

				if ((target instanceof Document) || (target instanceof DocumentFragment)) {
					target = target.documentElement;
				}

				const item = {
					checked: new WeakSet(),
					stopped: false,

					resolve(node) {
						if (callback) {
							try { callback(node, () => this.stopped = true); }
							catch(ex) { console.error(ex); }
						}
					},

					execute() {
						if (!filter || filter(target)) {
							this.resolve(target);
							if (this.stopped) return;
						}
					}
				};

				item.execute();

				if (!item.stopped) {
					let observer = Observers.get(target);

					if (!observer) {
						observer = new MutationObserver(handleMuts);
						Observers.set(target, observer);

						observer.listeners = [];
						observer.target = target;

						observer.observe(target, { characterData: true, attributes: true, subtree: true });
					}

					observer.listeners.push(item);
				}
			},

			find(self, selector, callback) {
				let result = self.querySelector(selector);
				if (callback != null && result != null) return (callback(result) || result);
				return result;
			},
			findAll(self, selector, callback) {
				let result = self.querySelectorAll(selector);
				if (callback != null && result != null && result.length > 0) Array.prototype.forEach.call(result, callback);
				return result;
			},
			clear(self) {
				Array.prototype.forEach.call(self.childNodes, (node) => {
					node.remove();
				});
				Array.prototype.forEach.call(self.children, (element) => {
					element.remove();
				});
			},

			on(self, events, selector, callback, config) {
				if (typeof selector == "function") { [selector, callback, config] = [null, selector, callback]; }
				if (!self.$events) { Object.defineProperty(self, "$events", { value: {} }); }

				events.split(" ").forEach(eventType => {
					eventType = eventType.trim();

					const eventName = eventType.replace(/^([^.]+).*$/, "$1");
					if (!eventName) return;

					let listeners = self.$events[eventType];
					if (!listeners) { listeners = self.$events[eventType] = []; }

					const handler = event => {
						if (!selector) return callback.call(self, event, self);

						const fn = event.stopImmediatePropagation;
						let immediateStop = false;

						event.stopImmediatePropagation = function() {
							immediateStop = true;
							return fn.call(this);
						};

						const path = event.composedPath();
						const maxIndex = path.indexOf(self);
						for (let i = 0; i < maxIndex; i++) {
							const node = path[i];

							if (node.matches(selector)) {
								Object.defineProperty(event, "currentTarget", { value: node, configurable: true });
								callback.call(self, event, self);
								delete event.currentTarget;

								if (immediateStop) break;
							}
						}

						delete event.stopImmediatePropagation;
					};

					const listener = {
						selector, callback,
						params: [eventName, handler, config]
					};

					listeners.push(listener);
					self.addEventListener(...listener.params);
				});

				return self
			},
			triggerCustom(self, type, detail) {
				self.dispatchEvent(new CustomEvent(type, { detail }));
				return self;
			}
		});
		
		Assign([self.EventTarget, EventTarget], {
			$on(...args) { return $.on(this, ...args); },
			$triggerCustom(...args) { return $.triggerCustom(this, ...args); },
			$event(...args) { return $.triggerCustom(this, ...args); }
		});

		Assign([self.Element, Element, self.Document, Document, self.DocumentFragment, DocumentFragment], {
			$each(...args) { return $.each(this.children, ...args); },
			$find(...args) { return $.find(this, ...args); },
			$findAll(...args) { return $.findAll(this, ...args); },
			$clear() { return $.clear(this); },
			$watch(...args) { return $.watch(this, ...args); },
			$watchLoop(...args) { return $.watchLoop(this, ...args); },
			$watchData(...args) { return $.watchData(this, ...args); }
		});

		Assign([self.NodeList, NodeList], {
			$each(...args) { return $.each(this, ...args); }
		});
	} else {
		$ = {};
	}

	Object.assign($, {
		dateFormat(date, format) {
			if (typeof date == "string") {
				date = new Date(date);
			}

			return format.replace(/a|A|Z|T|S(SS)?|ss?|mm?|HH?|hh?|D{1,4}|M{1,4}|YY(YY)?|'([^']|'')*'/g, str => {
				switch(str[0]) {
					case "'": return str.slice(1, -1).replace(/''/g, "'");
					case "a": return date.getHours() < 12 ? "am" : "pm";
					case "A": return date.getHours() < 12 ? "AM" : "PM";
					case "Z": return (("+" + -date.getTimezoneOffset() / 60).replace(/^\D?(\D)/, "$1").replace(/^(.)(.)$/, "$10$2") + "00");
					case "T":
						if (!DTF) { DTF = new Intl.DateTimeFormat("en-us", { timeZoneName: "short" }); }
						return DTF.format(date).split(" ")[1];
					case "Y": return ("" + date.getFullYear()).slice(-str.length);
					case "M": return str.length > 2 ? Months[date.getMonth()].slice(0, str.length > 3 ? 9 : 3) : FixedNumber(date.getMonth() + 1, str.length);
					case "D": return str.length > 2 ? Days[date.getDay()].slice(0, str.length > 3 ? 9 : 3)
						: str.length == 2 ? FixedNumber(date.getDate(), 2) : date.getDate();
					case "H": return FixedNumber(date.getHours(), str.length);
					case "h": return FixedNumber(date.getHours() % 12 || 12, str.length);
					case "m": return FixedNumber(date.getMinutes(), str.length);
					case "s": return FixedNumber(date.getSeconds(), str.length);
					case "S": return FixedNumber(date.getMilliseconds(), str.length);
					default: return "";
				}
			})
		},

		dateSince(date, relativeTo, short = false, ignoreSec) {
			if (relativeTo instanceof Date) {
				relativeTo = relativeTo.getTime();
			} else if (typeof relativeTo == "string") {
				relativeTo = new Date(relativeTo).getTime();
			} else if (!relativeTo) {
				relativeTo = Date.now();
			}

			if (date instanceof Date) {
				date = date.getTime();
			} else if (typeof date == "string") {
				date = new Date(date).getTime();
			}

			const since = (relativeTo - date) / 1000;

			if (Math.floor(since) <= 0) return "Just now";

			const y = Math.floor(since / 3600 / 24 / 365);
			if (y >= 1) { return Math.floor(y) + (short ? " y" : " year" + (y < 2 ? "" : "s")) + " ago"; }

			const M = Math.floor(since / 3600 / 24 / 31);
			if (M >= 1) { return Math.floor(M) + (short ? " m" : " month" + (M < 2 ? "" : "s")) + " ago"; }

			const w = Math.floor(since / 3600 / 24 / 7);
			if (w >= 1) { return Math.floor(w) + (short ? " w" : " week" + (w < 2 ? "" : "s")) + " ago"; }

			const d = Math.floor(since / 3600 / 24);
			if (d >= 1) { return Math.floor(d) + (short ? " d" : " day" + (d < 2 ? "" : "s")) + " ago"; }

			const h = Math.floor(since / 3600);
			if (h >= 1) { return Math.floor(h) + (short ? " h" : " hour" + (h < 2 ? "" : "s")) + " ago"; }

			const m = Math.floor(since / 60);
			if (m >= 1) { return Math.floor(m) + (short ? " min" : " minute" + (m < 2 ? "" : "s")) + " ago"; }

			if (ignoreSec == true) return "Just Now";

			const s = Math.floor(since);
			return Math.floor(s) + (short ? " sec" : " second" + (Math.floor(s) == 1 ? "" : "s")) + " ago";
		}
	});

	Assign([self.Date, Date], {
		$format(...args) { return $.dateFormat(this, ...args); },
		$since(...args) { return $.dateSince(this, ...args); }
	});
	
	return $;
})();

//Unfinished
converter = (() => {
	let cv = {};

	cv.directions = {
		//direction: [ left, top, right, bottom ]
		"center": [ true, true, true, true ],
		"middle": [ true, true, true, true ],

		"left": [ true, null, false, null ],
		"top": [ null, true, null, false ],
		"right": [ false, null, true, null ],
		"bottom": [ null, false, null, true ]
	};

	/*assigning multiple functions*/
	function Assign(stuff, data) { stuff.forEach(constructor => { Object.assign(constructor.prototype, data); }) }

	Object.assign(cv, {
		direction(dir) {
			if(obj == null) obj = "";
			var result = [ false, false, false, false ];

			if (dir.includes("center") || dir.includes("middle")) { result = [ true, true, true, true ]; }
			if (dir.includes("left")) { cv.directions["left"].forEach((state, face) => { if (state == null) { return; } result[face] = state; }); }
			if (dir.includes("top")) { cv.directions["top"].forEach((state, face) => { if (state == null) { return; } result[face] = state; }); }
			if (dir.includes("right")) { cv.directions["right"].forEach((state, face) => { if (state == null) { return; } result[face] = state; }); }
			if (dir.includes("bottom")) { cv.directions["bottom"].forEach((state, face) => { if (state == null) { return; } result[face] = state; }); }

			return result;
		},
		fn(obj) {
			if (typeof obj == "function") return obj();
			return obj;
		},
		color(obj) {
			var formats = {
				"0": "hex",
				"1": "rgb",
				"2": "rgba"
			};
			var format = cv.fn((obj?.format || obj?.f || obj?.type || 1));
			format = (formats[format] || "rgb");

			switch (format) {
				case "hex":
					obj.hex = cv.fn((obj?.hex || obj));
					obj.hex = (obj.hex || "#FFFFFF");

					if (!obj.hex.includes("#")) { obj.hex = "#" + obj.hex; }

					return obj.hex;
					break;
				default:
					obj.red = cv.fn((obj?.red || obj?.r || obj[0] || "255"));
					obj.green = cv.fn((obj?.green || obj?.g || obj[1] || "255"));
					obj.blue = cv.fn((obj?.blue || obj?.b || obj[2] || "255"));

					return `rgb(${obj.red}, ${obj.green}, ${obj.blue})`;
					break;
				case "rgba":
					obj.red = cv.fn((obj?.red || obj?.r || obj[0] || "255"));
					obj.green = cv.fn((obj?.green || obj?.g || obj[1] || "255"));
					obj.blue = cv.fn((obj?.blue || obj?.b || obj[2] || "255"));
					obj.opacity = cv.fn((obj?.opacity || obj?.transparent || obj?.transparency || obj?.o || obj?.t || obj[3] || "100"));

					obj.opacity = Number(obj.opacity.toString().split("%").join(""));
					if (obj.opacity > 1) obj.opacity /= 100;

					return `rgba(${obj.red}, ${obj.green}, ${obj.blue}, ${obj.opacity})`;
					break;
			}

			return `rgb(255, 255, 255)`;
		},
		corner(obj) {
			obj = (obj || "0px");
			obj = cv.fn(obj);

			if (typeof obj == "string") { return obj; }
			else {
				obj.topleft = cv.fn((obj.topleft || obj["top-left"] || obj.top_left || obj.tl || "0px"));
				obj.topright = cv.fn((obj.topright || obj["top-right"] || obj.top_right || obj.tr || "0px"));
				obj.bottomright = cv.fn((obj.bottomright || obj["bottom-right"] || obj.bottom_right || obj.br || "0px"));
				obj.bottomleft = cv.fn((obj.bottomleft || obj["bottom-left"] || obj.bottom_left || obj.bl || "0px"));

				if (isNaN(obj.topleft)) obj.topleft += "px";
				if (isNaN(obj.topright)) obj.topright += "px";
				if (isNaN(obj.bottomright)) obj.bottomright += "px";
				if (isNaN(obj.bottomleft)) obj.bottomleft += "px";

				return `${obj.topleft} ${obj.topright} ${obj.bottomright} ${obj.bottomleft}`;
			}

			return "0px";
		},
		border(obj) {
			obj = (obj || "none");
			obj = cv.fn(obj);

			if (typeof obj == "string" && obj.split(" ").length >= 2) {
				var elements = obj.split(" ");
				return { width: elements[0], style: elements[1], color: (elements[2] || "white")};
			} else {
				var width = "";
				if (obj.width != null || obj.w != null) { width = cv.fn((obj.width || obj.w)); }
				else {
					obj.topwidth = cv.fn((obj.topwidth || obj.topsize || obj.tw || "0px"));
					obj.rightwidth = cv.fn((obj.rightwidth || obj.rightsize || obj.rw || "0px"));
					obj.bottomwidth = cv.fn((obj.bottomwidth || obj.bottomsize || obj.bw || "0px"));
					obj.leftwidth = cv.fn((obj.leftwidth || obj.leftsize || obj.lw || "0px"));

					if (isNaN(obj.topwidth)) obj.topwidth += "px";
					if (isNaN(obj.rightwidth)) obj.rightwidth += "px";
					if (isNaN(obj.bottomwidth)) obj.bottomwidth += "px";
					if (isNaN(obj.leftwidth)) obj.leftwidth += "px";

					width = `${obj.topwidth} ${obj.rightwidth} ${obj.bottomwidth} ${obj.leftwidth}`;
				}

				var style = "";
				if (obj.style != null || obj.s != null) { style = cv.fn((obj.style || obj.s)); }
				else {
					obj.topstyle = cv.fn((obj.topstyle || obj.topshape || obj.ts || "none"));
					obj.rightstyle = cv.fn((obj.rightstyle || obj.rightshape || obj.rs || "none"));
					obj.bottomstyle = cv.fn((obj.bottomstyle || obj.bottomshape || obj.bs || "none"));
					obj.leftstyle = cv.fn((obj.leftstyle || obj.leftshape || obj.ls || "none"));

					style = `${obj.topstyle} ${obj.rightstyle} ${obj.bottomstyle} ${obj.leftstyle}`;
				}

				var color = "";
				if (obj.color != null || obj.c != null) { color = cv.fn((obj.color || obj.c)); }
				else {
					obj.topcolor = cv.fn((obj.topcolor || obj.tc || "white"));
					obj.rightcolor = cv.fn((obj.rightcolor || obj.rc || "white"));
					obj.bottomcolor = cv.fn((obj.bottomcolor || obj.bc || "white"));
					obj.leftcolor = cv.fn((obj.leftcolor || obj.lc || "white"));

					color = `${obj.topcolor} ${obj.rightcolor} ${obj.bottomcolor} ${obj.leftcolor}`;
				}

				return { width: width, style: style, color: color };
			}

			return { width: "0px", style: "none", color: "white" };
		},
		size(obj) {
			obj = (obj || "fit-content");
			obj = cv.fn(obj);

			if (typeof obj == "string") {
				if (obj.split(" ").length > 1) {
					var width = obj.split(" ")[0];
					var height = obj.split(" ")[1];
					return { width, height };
				}
				return { width: obj, height: obj };
			} else {
				obj.width = cv.fn((obj.width || obj.wide || obj.w || obj[0] || "fit-content"));
				obj.height = cv.fn((obj.height || obj.tall || obj.h || obj[1] || "fit-content"));
				return obj;
			}
		},
		margin(obj) {
			obj = (obj || "0px");
			obj = cv.fn(obj);

			if (typeof obj != "string") {
				var top = cv.fn((obj.top || obj.t || obj[1] || "0px"));
				var right = cv.fn((obj.right || obj.r || obj[2] || "0px"));
				var bottom = cv.fn((obj.bottom || obj.b || obj[3] || "0px"));
				var left = cv.fn((obj.left || obj.l || obj[0] || "0px"));

				return `${top} ${right} ${bottom} ${left}`;
			} else {
				return (obj || "0px");
			}
		},
		position(obj) {
			obj = (obj || null);
			obj = cv.fn(obj);

			var type = cv.fn((obj?.type || "fixed"));

			if (typeof obj == "string") {
				if (obj.split(" ").length == 1) {
					var position = cv.direction(obj);
					position.forEach((e, i) => { position[i] = (e ? "0px" : "unset"); });

					var left = position[0];
					var top = position[1];
					var right = position[2];
					var bottom = position[3];
					return { left, top, right, bottom };
				} else {
					var top = "unset";
					var left = "unset";
					var right = "unset";
					var bottom = "unset";

					obj.split(" ").forEach((axis, number) => {
						if (
							!axis.includes("center") && 
							!axis.includes("middle") && 
							!axis.includes("left") && 
							!axis.includes("right") && 
							!axis.includes("top") && 
							!axis.includes("bottom")
							) {
							if (axis.includes("-")) {
								if (number == 0) { right = axis.split("-").join(""); }
								else { bottom = axis.split("-").join(""); }
							} else {
								if (number == 0) { left = axis; }
								else { top = axis; }
							}
						} else {
							var position = cv.direction(axis);
							position.forEach((e, i) => { position[i] = (e ? "0px" : "unset"); });

							if (number == 0) {
								left = position[0];
								right = position[2];
							} else {
								top = position[1];
								bottom = position[3];
							}
						}
					});

					return { left, top, right, bottom };
				}
			} else {
				if (obj == null) obj = [];
				obj.left = cv.fn((obj?.left || obj?.l || obj[0] || "unset"));
				obj.top = cv.fn((obj?.top || obj?.t || obj[1] || "unset"));
				obj.right = cv.fn((obj?.right || obj?.r || obj[2] || "unset"));
				obj.bottom = cv.fn((obj?.bottom || obj?.b || obj[3] || "unset"));

				return obj;
			}
		},

		toInput(item, value, customInput) {
			// depending on item give the output needed for it
			// custom Itput if given
		}
	});
	
	return cv;
})();

popup = (() => {
	let popup = {};
	
	popup.list = [];

	popup.objectStructor = {
		background: function(value) {
			value = converter.fn(value);
			var result = {};
			
			result.bgColor = converter.color((value?.bgColor || value?.bgcolor || value?.color || value?.colors));
			result.hideWhenClicked = converter.fn((value.hideWhenClicked || value.clickHide || value.hide));
			return result;
		},
		main: function(value) {
			value = converter.fn(value);
			var result = {};

			result.size = converter.size((value?.size || value?.width || value?.height || value?.shape));
			result.bgColor = converter.color((value.bgColor || value.bgcolor || value.color || value.colors));
			result.corners = converter.corner((value.corners || value.corner || value.round || value.roundness));
			result.borders = converter.border((value.borders || value.border || value.around));
			result.margin = converter.margin((value.margin || value.margins));
			result.position = converter.position((value.position || value.positions || value.location || value.place));
			return result;
		}
	};

	popup.elementStructor = {
		background(bgColor, hideWhenClicked) {
			var el = document.createElement("div");
			el.id = "popup-system";

			el.classList.add("ps-background");
			el.style.backgroundColor = (bgColor || "rgba(0, 0, 0, 0.3)");

			var toggleVisible = true;

			el.show = function() {
				if (toggleVisible == true) return;

				el.$triggerCustom("show-popup");
				el.style.display = "block";
				toggleVisible = true;
			}
			el.hide = function() {
				if (toggleVisible == false) return;

				el.$triggerCustom("hide-popup");
				el.style.display = "none";
				toggleVisible = false;
			}

			if (hideWhenClicked == true) {
				//el.style.cursor = "pointer";

				el.addEventListener("click", (e) => { if (e.target == el) { el.hide(); } });
			}

			return el;
		},
		main(size, bgColor, corners, borders, margin, position) {
			var el = document.createElement("div");
			el.id = "ps-main";

			el.style.width = (size != null ? (size.width || "fit-content") : "fit-content");
			el.style.height = (size != null ? (size.height || "fit-content") : "fit-content");

			el.style.backgroundColor = (bgColor || "rgb(35, 37, 39)");
			el.style.borderRadius = (corners || "20px");

			el.style.borderColor = (borders != null ? (borders.color || "white") : "white");
			el.style.borderStyle = (borders != null ? (borders.style || "solid") : "solid");
			el.style.borderWidth = (borders != null ? (borders.width || "1px") : "1px");

			el.style.margin = (margin || "unset");

			el.style.position = (position != null ? (position.type || "absolute") : "absolute");
			el.style.left = (position != null ? (position.left || "0px") : "0px");
			el.style.top = (position != null ? (position.top || "0px") : "0px");
			el.style.right = (position != null ? (position.right || "0px") : "0px");
			el.style.bottom = (position != null ? (position.bottom || "0px") : "0px");

			return el;
		},
		structor(background, main/*, title, close, footer, sections, options*/) {
			var giveback = null;

			if (main != null) {
				giveback = main;
			}
			if (background != null && main != null) {
				background.prepend(main);
				giveback = background;
			}

			return (giveback || background);
		}
	};

	/*assigning multiple functions*/
	function Assign(stuff, data) { stuff.forEach(constructor => { Object.assign(constructor.prototype, data); }) }

	Object.assign(popup, {
		create(element, object) {
			if (!element || !object) return console.error("Peremeters can not be empty!");

			var toCss = function(item, value) {
				if (!item) { console.error("Peremeters can not be empty!"); return value; }
				item = item.toLowerCase();
				if (typeof popup.objectStructor[item] != "function") return value;

				return popup.objectStructor[item](value);
			}

			for (const key in object) {
				var value = object[key];
				object[key] = toCss(key, value);

				object[key] = popup.elementStructor[key].apply(this, Object.values(object[key]));
			}

			//order to structer properties + include empty ones

			element.prepend(popup.elementStructor.structor.apply(this, Object.values(object)));
		}
	});

	Assign([self.Element, Element, self.Document, Document, self.DocumentFragment, DocumentFragment], {
		popupcreate(...args) { return popup.create(this, ...args); }
	});
	
	return popup;
})();

function escapeHTML(...text) {
	let temp = document.createElement('div');
	temp.textContent = text.join('');
	let result = temp.innerHTML;
	temp.remove();
	return result;
}

function escapeJSON(json) {
	if (typeof json == 'object') {
		if (json == null) return;

		if (json.length > 0 || json.length === 0) {
			return json.map(x => escapeJSON(x));
		}
		
		let object = {};

		Object.keys(json).forEach(x => object[x] = escapeJSON(json[x]));
		
		return object;
	}

	if (typeof json == 'string') return escapeHTML(json);
	return json;
}

function HTMLParser(input, ...elements) {
	let holder = null;

	if (input?.tagName != null && input?.tagName != '') holder = input;
	
	if (typeof input == 'string') {
		let tag = input;
		if (tag.startsWith('<')) tag = tag.slice(1);
		if (tag.endsWith('>')) tag = tag.slice(0, -1);

		tag = tag.split(' = ').join('=');
		
		let tokens = tag.match(/\S+(="(\\"|[^"])*")|\S+/g);
		let tagName = tokens[0];

		let attributes = {};

		tokens.slice(1)
		.map(x => (x.includes('=') ? x : x+'=""'))
		.reduce((all, curr) => {
			all[curr.split("=")[0]] = curr.split("=")[1].slice(1, -1);
			return all;
		}, attributes);

		holder = document.createElement(tagName);
		if (attributes.class != null) holder.className = attributes.class;

		for (let attr in attributes) {
			if (attr == 'class') continue;
			holder.setAttribute(attr, attributes[attr]);
		}
	}
	
	if (holder == null) holder = document.createElement('div');
	
	let functions = elements.filter(x => typeof x == "function");
	elements = elements.filter(x => typeof x != "function" && x != null);

	if (elements.length > 0) holder.append(...elements);

	functions.forEach(x => x(holder));

	return holder;
}