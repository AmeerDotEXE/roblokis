var Rkis = Rkis || {};
Rkis.temp = Rkis.temp || {};


Rkis.temp.set$ = () => {

	$r = (() => {
		let $
		
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

		//set how many zeros
		function FixedNumber(num, len) {
			const str = String(num);
			const amt = len - str.length;

			return amt > 0 ? "0".repeat(amt) + str : str;
		}
		
		//assigning multiple functions
		function Assign(stuff, data) { stuff.forEach(constructor => { Object.assign(constructor.prototype, data); }) }
		
		let DTF; //for time format (PM, AM)
		
		if (self.document) {
			$ = function(selector) { return $.find(document, selector); } // $(selector) == $.find(document, selector)
			$.all = function(selector) { return $.findAll(document, selector); } // $.all(selector) == $.findall(document, selector)
			
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

						for (let index = 0, len = matches.length; index < len; index++) {
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
				}

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
		
				$watchAll(...args) {
					this.targetPromise.then(target => { target.$watchAll(...args); })
					return this;
				},
				
				$watchLoop(...args) {
					this.targetPromise.then(target => { target.$watchLoop(...args); })
					return this;
				},
		
				$then(callback) {
					const nxt = {
						targetPromise: this.finishPromise || this.targetPromise,
						finishPromise: null,
						
						parent: this,
						__proto__: watchProto
					}
		
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
			}
		
			function handleMuts(muts, self) {
				const listeners = self.listeners;
				let index = 0;
		
				while (index < listeners.length) {
					const item = listeners[index];
		
					if (!item.stopped)
						item.execute();
		
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
				ready(fn) {
					if (document.readyState !== "loading")
						fn();
					else
						document.addEventListener("DOMContentLoaded", fn, { once: true });
				},

				watch(target, selectors, filter, callback) {
					if (typeof callback !== "function") {
						callback = filter;
						filter = null;
					}

					if ((target instanceof Document) || (target instanceof DocumentFragment)) {
						target = target.documentElement;
					}

					if (!Array.isArray(selectors)) selectors = [selectors];

					let finishPromise;

					//const promises = selectors.map(selector => addWatch(target, selector, filter));
					const promises = selectors.map(selector => new Promise(resolve => addWatch(target, selector, filter, resolve)));

					finishPromise = Promise.all(promises).then(elems => {
						if (callback) {
							try { callback(...elems); }
							catch(ex) { console.error(ex); }
						}
		
						return elems[0];
					})

					return {
						targetPromise: Promise.resolve(target),
						finishPromise,
						__proto__: watchProto
					}
				},
				
				watchLoop(target, selector, filter, callback) {

				  if (typeof callback !== "function") {
						callback = filter;
						filter = null;
					}

					if ((target instanceof Document) || (target instanceof DocumentFragment)) {
						target = target.documentElement;
					}

				  const item = {
		  			checked: new WeakSet(),
				  	firstSearch: false,
				  	stopped: false,

				  	resolve(node) {
              if (callback) {
								try { callback(node, () => this.stopped = true); }
								catch(ex) { console.error(ex); }
							}
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

					  	for (let index = 0, len = matches.length; index < len; index++) {
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
		  		}

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

				find(self, selector) {
					return self.querySelector(selector.replace(/(^|,)\s*(?=>)/g, "$&:scope"));
				},
				findAll(self, selector) {
					return self.querySelectorAll(selector.replace(/(^|,)\s*(?=>)/g, "$&:scope"));
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
							}

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
						}

						const listener = {
							selector, callback,
							params: [eventName, handler, config]
						};

						listeners.push(listener);
						self.addEventListener(...listener.params);
					})

					return self
				},
				triggerCustom(self, type, detail) {
					self.dispatchEvent(new CustomEvent(type, { detail }));
					return self;
				}
			})
			
			Assign([self.EventTarget, EventTarget], {
				$on(...args) { return $.on(this, ...args); },
				$triggerCustom(...args) { return $.triggerCustom(this, ...args); }
			})

			Assign([self.Element, Element, self.Document, Document, self.DocumentFragment, DocumentFragment], {
				$find(...args) { return $.find(this, ...args); },
				$findAll(...args) { return $.findAll(this, ...args); },
				$watch(...args) { return $.watch(this, ...args); },
				$watchLoop(...args) { return $.watchLoop(this, ...args); }
			})
		}
		else {
			$ = {};
		}

		Object.assign($, {
			
			dateFormat(date, format) {
				if (typeof date == "string") {
					date = new Date(date);
				}

				return format.replace(/a|A|Z|T|S(SS)?|ss?|mm?|HH?|hh?|D{1,4}|M{1,4}|YY(YY)?|'([^']|'')*'/g, str => {
					switch(str[0]) {
						case "'": return str.slice(1, -1).replace(/''/g, "'")
						case "a": return date.getHours() < 12 ? "am" : "pm"
						case "A": return date.getHours() < 12 ? "AM" : "PM"
						case "Z": return (("+" + -date.getTimezoneOffset() / 60).replace(/^\D?(\D)/, "$1").replace(/^(.)(.)$/, "$10$2") + "00")
						case "T":
							if (!DTF) { DTF = new Intl.DateTimeFormat("en-us", { timeZoneName: "short" }) }
							return DTF.format(date).split(" ")[1]
						case "Y": return ("" + date.getFullYear()).slice(-str.length)
						case "M": return str.length > 2 ? Months[date.getMonth()].slice(0, str.length > 3 ? 9 : 3) : FixedNumber(date.getMonth() + 1, str.length)
						case "D": return str.length > 2 ? Days[date.getDay()].slice(0, str.length > 3 ? 9 : 3)
							: str.length == 2 ? FixedNumber(date.getDate(), 2) : date.getDate()
						case "H": return FixedNumber(date.getHours(), str.length)
						case "h": return FixedNumber(date.getHours() % 12 || 12, str.length)
						case "m": return FixedNumber(date.getMinutes(), str.length)
						case "s": return FixedNumber(date.getSeconds(), str.length)
						case "S": return FixedNumber(date.getMilliseconds(), str.length)
						default: return ""
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
		})

		Assign([self.Date, Date], {
			$format(...args) { return $.dateFormat(this, ...args); },
			$since(...args) { return $.dateSince(this, ...args); }
		})
		
		return $;
	})();

};

Rkis.temp.set$();