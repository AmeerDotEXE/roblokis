var Rkis = Rkis || {};

(function() {

  if(window.location.href.includes("/games/"))
    Rkis.GameId = window.location.href.split("/games/")[1].split("/")[0];

  if(window.location.href.includes("/users/"))
    Rkis.UserId = window.location.href.split("/users/")[1].split("/")[0];

  if(window.location.href.includes("/groups/"))
    Rkis.GroupId = window.location.href.split("/groups/")[1].split("/")[0];

  if(window.location.href.includes("/home")) Rkis.pageName = "home";
  else if(window.location.href.includes("/games/")) Rkis.pageName = "game";
  else if(window.location.href.includes("/users/")) Rkis.pageName = "users";
  else if(window.location.href.includes("/groups/")) Rkis.pageName = "groups";
  else Rkis.pageName = "all";

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  Rkis.wholeData = {...wholedata};
  Rkis.SubDomain = (window.location.hostname.startsWith("web") == true ? "web" : "www");
  Rkis.codeLoader = {save: {}, load: {}};
  
  //copy function
  Rkis.CopyText = function (text) {
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
      Rkis.Toast("Copied text " + msg);
    } catch (err) {
      Rkis.Toast("Oops, unable to copy", err);
    }

    document.firstElementChild.removeChild(textArea);
  }
  Rkis.CopyTextToClip = function(t) {
    console.warn("CopyTextToClip will be removed!");
    Rkis.CopyText(t);
  };

  Rkis.Toast = function (text, ms) {
    if(Rkis.ToastHolder == null) {
      alert(text);
      return;
    }

    Rkis.ToastHolder.innerText = text;
    Rkis.ToastHolder.style.opacity = "1";
    Rkis.ToastHolder.style.bottom = "30px";
    setTimeout(() => {Rkis.ToastHolder.style.opacity = "0";Rkis.ToastHolder.style.bottom = "0px";}, ms || 4000)
  }
  
  Rkis.GetTextFromLocalFile = function(filelocation) {
    return new Promise(resolve => {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", Rkis.fileLocation + filelocation, false);
      xmlhttp.send();

      resolve(xmlhttp.responseText);
    })
  }

  Rkis.fetch = function(method, href, json) {
    return new Promise(resolve => {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open(method.toUpperCase(), href, false);
      xmlhttp.send();

      if (xmlhttp.status != 200) return resolve({});

      if(json == true) return resolve(JSON.parse(xmlhttp.response));
      else return resolve(xmlhttp.response);
    });
  }

  //onload
  Rkis.OnReady = function (func) {
    document.addEventListener("readystatechange", function() {
      if(document.readyState != "complete") return;
      func();
    });
  };

  //on rkis loaded run these
  Rkis.AllRunListeners = [];
  Rkis.RunAllListeners = function (func) {
    Rkis.AllRunListeners.forEach(fun => {fun();})
  };
  Rkis.AddRunListener = function (func) {
    Rkis.AllRunListeners.push(func);
  };

  //open public roblox game
  Rkis.AddRunListener(() => {Rkis.OnReady(function(){
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
  })});

  Rkis.AddRunListener(function() {
    if(Rkis.ToastHolder == null) {
      Rkis.ToastHolder = document.createElement("div");
      Rkis.ToastHolder.style = "opacity: 0;min-width: 250px;background-color: #333;color: #fff;text-align: center;padding: 16px;position: fixed;z-index: 1;left: 50%;transform: translate(-50%, 0);bottom: 0px;font-size: 17px;border-radius: 20px;box-shadow: black 0 0 16px;transition: all 200ms ease-in-out;pointer-events: none;"
      document.firstElementChild.appendChild(Rkis.ToastHolder);
    }
  });

  (function(){
    var weburl = window.location.href;
    if (weburl.includes("open=roblokis")) {
      window.location.replace(weburl.split("roblox.com/")[0] + "roblox.com/roblokis");
    }
  }());

  //delay
  Rkis.delay = function delay(ms) {
    return new Promise(resolve => {
      setTimeout(function() { return resolve(); }, ms);
    });
  }

  Rkis.AddRunListener(() => {
    document.$watchLoop("savecode", (e) => {
      var name = e.getAttribute("code");
      if(name == null || name == "") return;
      Rkis.codeLoader.save[name] = e.innerHTML;

      if(Rkis.codeLoader.load[name] != null) {
        Rkis.codeLoader.load[name].forEach((a) => {
          eval(`(function(element){${Rkis.codeLoader.save[name]}})`)(a)
        })
      }
    })

    document.$watchLoop("loadcode", (e) => {
      var name = e.getAttribute("code");
      var cod = e.getAttribute("run");
      if(name != null && name != "") {

        if(Rkis.codeLoader.save[name] == null) {
          if(Rkis.codeLoader.load[name] == null) Rkis.codeLoader.load[name] = [];

          Rkis.codeLoader.load[name].push(e);
          return;
        }

        try{
          eval(`(function(element){ ${Rkis.codeLoader.save[name]} })`)(e)
        }catch(err){console.error("Roblokis Error",err)}
      } else if(cod != null && cod != "") {
        try{
          eval(`(function(element){ ${cod} })`)(e)
        }catch(err){console.error("Roblokis Error",err)}
      }
    })
  })

}());

Rkis.AddRunListener(function() {

  //wait For Element
  document.waitSelector = function (selector, checkFrequencyInMs, timeoutInMs) {
    console.warn("waitSelector will be removed!\nuse $watch instead.");
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
    console.warn("waitSelectorAll will be removed!\nuse $watchAll instead.");
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

});

Rkis.AddRunListener(async function() {
  var stng = await document.$watch("#navbar-settings").$promise();
  if(stng == null) return;
  stng.addEventListener("click", async () => {
    if(stng.getAttribute("aria-describedby") != null) return;

    var rkisbtn = document.createElement("li");
    rkisbtn.innerHTML = `<a class="rbx-menu-item" href="https://${Rkis.SubDomain}.roblox.com/roblokis" style="color: rgb(255,64,64);">Roblokis</a>`;

    var doc = await document.$watch("#settings-popover-menu").$promise();
    if(doc == null) return;
    doc.insertBefore(rkisbtn, doc.firstElementChild);
  })
});

Rkis.OnReady(() => {
  document.body.classList.add("Roblokis-installed");
});