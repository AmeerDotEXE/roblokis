var Rkis = Rkis || {};

(function() {

//copy function
Rkis.CopyTextToClip = function (text) {
  var textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.firstElementChild.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successfuly" : "unsuccessfuly";
    alert("Copied text " + msg);
  } catch (err) {
    alert("Oops, unable to copy", err);
  }

  document.firstElementChild.removeChild(textArea);
}

Rkis.fetch = function(method, href, json) {
  return new Promise(resolve => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, href, false);
    xmlhttp.send();

    if (xmlhttp.status != 200) return resolve({});

    if(json == true) return resolve(JSON.parse(xmlhttp.response));
    else return resolve(xmlhttp.response);
  });
}

//onload
Rkis.OnLoad = function (func) {
  /*if(window.onload) {
    var currentOnLoad = window.onload;
    var newOnLoad = function(evt) {
      currentOnLoad(evt);
      func(evt);
    };
    window.onload = newOnLoad;
  } else {
    window.onload = func;
  }*/

  window.addEventListener("load", func);
};

//open public roblox game
Rkis.OnLoad(function(){
  var weburl = window.location.href;
  if (weburl.includes("placeid=") && weburl.includes("gameid=")) {
    var fullquery = "";
    if (weburl.split("?").length >= 2) fullquery = weburl.split("?")[1];

    var queries = fullquery.split("&");

    var placeid = queries.find(x => x.toLowerCase().startsWith("placeid="));
    if (placeid) placeid = placeid.split("=")[1];

    var gameid = queries.find(x => x.toLowerCase().startsWith("gameid="));
    if (gameid) gameid = gameid.split("=")[1];

    if (placeid && gameid) Roblox.GameLauncher.joinGameInstance(parseInt(placeid), gameid)
  }
});

(function(){
  var weburl = window.location.href;
  if (weburl.includes("open=roblokis")) {
    window.location.replace(weburl.split("roblox.com/")[0] + "roblox.com/roblokis");
  }
}())

//delay
Rkis.delay = function delay(ms) {
  return new Promise(resolve => {
      setTimeout(function() { return resolve(); }, ms);
    });
}

//wait For Element
document.waitSelector = function (selector, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  return new Promise(resolve => {
        if (document.querySelector(selector))
            return resolve(document.querySelector(selector));

        if(checkFrequencyInMs == null) checkFrequencyInMs = 100;
        if(timeoutInMs == null) timeoutInMs = 60*1000;

        (function loopSearch() {
          if (document.querySelector(selector) != null) {
            return resolve(document.querySelector(selector));
          }
          else {
            setTimeout(function () {
              if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                return resolve(null);
              loopSearch();
            }, checkFrequencyInMs);
          }
        })();
    });
}
Element.prototype.waitSelector = document.waitSelector;

//wait For Elements
document.waitSelectorAll = function (selector, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  return new Promise(resolve => {
        if (document.querySelectorAll(selector).length > 0)
            return resolve(document.querySelectorAll(selector));

        if(checkFrequencyInMs == null) checkFrequencyInMs = 100;
        if(timeoutInMs == null) timeoutInMs = 60*1000;

        (function loopSearch() {
          if (document.querySelectorAll(selector).length > 0) {
            return resolve(document.querySelectorAll(selector));
          }
          else {
            setTimeout(function () {
              if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                return resolve([]);
              loopSearch();
            }, checkFrequencyInMs);
          }
        })();
    });
}

Element.prototype.waitSelectorAll = document.waitSelectorAll;

}());

//Track every request
(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            const requestevent = new CustomEvent('rkrequested', {
              detail: this
            });
            document.dispatchEvent(requestevent);
        });
        origOpen.apply(this, arguments);
    };
})();