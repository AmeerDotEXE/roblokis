var Rkis = Rkis || {};


window.ContextScript = true;

var manifestData = chrome.runtime.getManifest();
Rkis.version = manifestData.version;

Rkis.id = chrome.runtime.id;
Rkis.fileLocation = `chrome-extension://${Rkis.id}/`;

Rkis.RunFunction(() => {
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', () => {
      var requestevent = new CustomEvent('rkrequested', {
        detail: this
      });
      document.dispatchEvent(requestevent);
    });
    origOpen.apply(this, arguments);
  };
});


if(window.location.href.includes("/games/")) {
  Rkis.GameId = window.location.href.split("/games/")[1].split("/")[0];
  Rkis.pageName = "game";
}
else if(window.location.href.includes("/users/")) {
  Rkis.UserId = window.location.href.split("/users/")[1].split("/")[0];
  Rkis.pageName = "users";
}
else if(window.location.href.includes("/groups/")) {
  Rkis.GroupId = window.location.href.split("/groups/")[1].split("/")[0];
  Rkis.pageName = "groups";
}
else if(window.location.href.includes("/home")) Rkis.pageName = "home";
else Rkis.pageName = "all";

var wholedata = localStorage.getItem("Roblokis");
if(wholedata) wholedata = JSON.parse(wholedata) || {};

Rkis.wholeData = {...wholedata};
Rkis.SubDomain = (window.location.hostname.startsWith("web") == true ? "web" : "www");
Rkis.codeLoader = {save: {}, load: {}};

(() => {
  Rkis.RunFunction(Setup$rObject);
})();

(function() {
  Rkis.language = Rkis.language || {};
  Rkis.language.get = (msg, txt1, txt2, txt3, txt4, txt5, txt6, txt7, txt8, txt9) => Rkis.language[msg].split("$1$").join(txt1).split("$2$").join(txt2).split("$3$").join(txt3).split("$4$").join(txt4).split("$5$").join(txt5).split("$6$").join(txt6).split("$7$").join(txt7).split("$8$").join(txt8).split("$9$").join(txt9);

  var allCodes = {};

  document.$watchLoop("[data-translate]", (e) => {
    var place = e.dataset.translate;
    if(place == null || place == "") return;

    var valueText = chrome.i18n.getMessage(place, [ e.dataset.translate1, e.dataset.translate2, e.dataset.translate3, e.dataset.translate4, e.dataset.translate5, e.dataset.translate6, e.dataset.translate7, e.dataset.translate8, e.dataset.translate9 ]);
    valueText = (allCodes[place] != null ? (allCodes[place].message || valueText) : valueText);

    valueText.split("$").forEach((e, i) => {
      if(i == 0) return valueText = e;

      if((i / 2).toString().includes(".")) valueText += `$${Math.floor(i / 2) + 1}$`;
      else valueText += e;
    })

    valueText = valueText.split("$1$").join(e.dataset.translate1).split("$2$").join(e.dataset.translate2).split("$3$").join(e.dataset.translate3).split("$4$").join(e.dataset.translate4).split("$5$").join(e.dataset.translate5).split("$6$").join(e.dataset.translate6).split("$7$").join(e.dataset.translate7).split("$8$").join(e.dataset.translate8).split("$9$").join(e.dataset.translate9);

    if(e.tagName == "INPUT") e.placeholder = valueText;
    else e.innerText = valueText;
  })

  if(Rkis.wholeData.SiteLanguage == true) {
    Rkis.robloxCode = localStorage.getItem("RobloxLocaleCode");
    Rkis.roblokisCodes = {"pt": "pt_BR"};

    Rkis.languageCode = Rkis.robloxCode.split("_")[0];
    Rkis.languageCode = Rkis.roblokisCodes[Rkis.languageCode] || Rkis.languageCode;

    fetch(Rkis.fileLocation + `_locales/${Rkis.languageCode}/messages.json`)
    .then((res) => res.json())
    .then((text) => {
      if(text == null || text == {}) return;
      allCodes = text;

      for (code in allCodes) {
        Rkis.language[code] = allCodes[code].message || Rkis.language[code];
          
        Rkis.language[code].split("$").forEach((e, i) => {
          if(i == 0) return Rkis.language[code] = e;

          if((i / 2).toString().includes(".")) Rkis.language[code] += `$${Math.floor(i / 2) + 1}$`;
          else Rkis.language[code] += e;
        })
      }
    })
    .catch((err) => {console.error("Rkis", err)})

    fetch(Rkis.fileLocation + `_locales/${Rkis.languageCode}/messages.json`)
    .then((res) => res.json())
    .then((text) => {
      if(text == null || text == {}) return;
      var allCodes = text;

      for (code in allCodes) {
        Rkis.language[code] = allCodes[code].message || Rkis.language[code];

        Rkis.language[code].split("$").forEach((e, i) => {
          if(i == 0) return Rkis.language[code] = e;

          if((i / 2).toString().includes(".")) Rkis.language[code] += `$${Math.floor(i / 2) + 1}$`;
          else Rkis.language[code] += e;
        })
      }
    })
    .catch((err) => {console.error("Rkis", err)})
  }

  //Rkis.language[""] = chrome.i18n.getMessage("");
  l = (msg) => {
    if(Rkis.language[msg] != null && Rkis.language[msg] != "") return;

    Rkis.language[msg] = chrome.i18n.getMessage(msg, ["$1$", "$2$", "$3$", "$4$", "$5$", "$6$", "$7$", "$8$", "$9$"]);
    Rkis.language[msg] = (allCodes[msg] != null ? (allCodes[msg].message || Rkis.language[msg]) : Rkis.language[msg]);
        
    Rkis.language[msg].split("$").forEach((e, i) => {
      if(i == 0) return Rkis.language[msg] = e;

      if((i / 2).toString().includes(".")) Rkis.language[msg] += `$${Math.floor(i / 2) + 1}$`;
      else Rkis.language[msg] += e;
    })
  }
  //lc = (msg) => { Rkis.language = (msg, txt) => this.l.split("$1$").join(txt); Rkis.language[msg]["l"] = chrome.i18n.getMessage(msg, "$1$"); };

  l("errorCode");
  l("error");
  l("errorNameLength");
  l("errorDescLength");
  l("errorAtoZ");
  l("errorMaxSlots");
  l("errorNameExist");

  l("btnSaved");
  l("btnSave");//
  l("themeSlotNumber");

  l("copyTextSuccess");
  l("copyTextUnseccuss");
  l("cantCopyText");

  l("settingsPageTitle");//
  l("themeImport");
  l("themeBackground");
  l("themeCorners");
  l("themeBorders");

  l("badgeNoDescription");
  l("badgeNoName");//
  l("badgeRare");
  l("badgeLastWon");
  l("badgeWon");//
  l("badgeAchievedShort");
  l("badgeAchievedLong");
  l("badgeCreatedShort");
  l("badgeCreatedLong");
  l("badgeUpdatedShort");
  l("badgeUpdatedLong");

  l("joinButtons");

  l("cancelRequest");
  l("canceledRequest");//
  l("lastGame");
  l("lastPlace");
  l("lastSeen");
  l("lastSeenLong");

  l("smallSection");
  l("slowServer");
  l("loadMore");
  l("joinPrivateServer");
  l("JoinPublicServer");
}());


//onload
Rkis.OnReady = function (func) {
  document.addEventListener("readystatechange", function() {
    if(document.readyState != "complete") return;
    func();
  });
};

//delay
Rkis.delay = function delay(ms) {
  return new Promise(resolve => {
    setTimeout(function() { return resolve(); }, ms);
  });
}

document.$watchLoop("savecode", (e) => {
  var name = e.getAttribute("code");
  if(name == null || name == "") return;
  Rkis.codeLoader.save[name] = e.innerHTML;

  if(Rkis.codeLoader.load[name] != null) {
    Rkis.codeLoader.load[name].forEach((a) => {
      Rkis.Execute(`function(element){${Rkis.codeLoader.save[name]}}`, a)
    })
  }
});

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
      Rkis.Execute(`function(element){ ${Rkis.codeLoader.save[name]} }`, e)
    }catch(err){console.error("Roblokis Error",{fun:Rkis.codeLoader.save[name]},err)}
  } else if(cod != null && cod != "") {
    try{
      Rkis.Execute(`function(element){ ${cod} }`, e)
    }catch(err){console.error("Roblokis Error",{fun: cod},err)}
  }
});

Rkis.RunFunction(() => {
  document.addEventListener("rkrequested", (darequest) => {
    if (darequest && darequest.detail && darequest.detail.responseURL.includes("servers/VIP") == true) {
      var requestevent = new CustomEvent('rkrequested-private', {
        detail: null
      });
      document.dispatchEvent(requestevent);
      return;
    }
    if (darequest && darequest.detail && darequest.detail.responseURL.includes("servers/Friend") == true) {
      var requestevent = new CustomEvent('rkrequested-friends', {
        detail: null
      });
      document.dispatchEvent(requestevent);
      return;
    }
    if (darequest && darequest.detail && darequest.detail.responseURL.includes("servers/Public") == true) {
      var requestevent = new CustomEvent('rkrequested-public', {
        detail: null
      });
      document.dispatchEvent(requestevent);
      return;
    }
    if (darequest && darequest.detail && darequest.detail.responseURL.includes("badges.roblox.com/v1/universes") == true) {
      var requestevent = new CustomEvent('rkrequested-badge', {
        detail: null
      });
      document.dispatchEvent(requestevent);
      return;
    }
  });
});

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
    var msg = successful ? Rkis.language["copyTextSuccess"] : Rkis.language["copyTextUnseccuss"];
    Rkis.Toast(msg);
  } catch (err) {
    Rkis.Toast(Rkis.language["cantCopyText"], err);
  }

  document.firstElementChild.removeChild(textArea);
}

Rkis.fetch = function(method, href, json) {
  console.trace("Rkis | this method will be removed soon.");
  return new Promise(resolve => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method.toUpperCase(), href, false);
    xmlhttp.send();

    if (xmlhttp.status != 200) return resolve({});

    if(json == true) return resolve(JSON.parse(xmlhttp.response));
    else return resolve(xmlhttp.response);
  });
}

Rkis.GetTextFromLocalFile = function(filelocation) {
  return new Promise(resolve => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", Rkis.fileLocation + filelocation, false);
    xmlhttp.send();

    resolve(xmlhttp.responseText);
  })
}

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

Rkis.ErrorToast = function (text, ms) {
  if(Rkis.ToastHolder == null) {
    alert(`${Rkis.language["errorCode"]} ` + text);
    return;
  }

  Rkis.ToastHolder.innerText = text;
  Rkis.ToastHolder.innerHTML = `<span style='color:#f00;font-size:17px;'>${Rkis.language["errorCode"]}</span> ` + Rkis.ToastHolder.innerHTML;
  Rkis.ToastHolder.style.opacity = "1";
  Rkis.ToastHolder.style.bottom = "30px";
  setTimeout(() => {Rkis.ToastHolder.style.opacity = "0";Rkis.ToastHolder.style.bottom = "0px";}, ms || 4000)
}


//open public roblox game
Rkis.OnReady(function(){
  Rkis.RunFunction(function(){
    var weburl = window.location.href;
    if (weburl.includes("placeid=") && weburl.includes("gameid=")) {

      var placeid = weburl.split("placeid=")[1].split("&")[0];
      var gameid = weburl.split("gameid=")[1].split("&")[0];

      if (placeid && gameid) Roblox.GameLauncher.joinGameInstance(parseInt(placeid), gameid);

    }
  });
});


if(Rkis.ToastHolder == null || Rkis.ToastHolder == {}) {
  Rkis.ToastHolder = document.createElement("div");
  Rkis.ToastHolder.id = "rk-toastholder";
  Rkis.ToastHolder.style = "opacity: 0;min-width: 250px;background-color: #333;color: #fff;text-align: center;padding: 16px;position: fixed;z-index: 1;left: 50%;transform: translate(-50%, 0);bottom: 0px;font-size: 17px;border-radius: 20px;box-shadow: black 0 0 16px;transition: all 200ms ease-in-out;pointer-events: none;";
  document.firstElementChild.appendChild(Rkis.ToastHolder);
}

(function(){
  var weburl = window.location.href;
  if (weburl.includes("open=roblokis")) {
    window.location.replace(weburl.split("roblox.com/")[0] + "roblox.com/roblokis");
  }
}());

(async function() {
  var stng = await document.$watch("#navbar-settings").$promise();
  if(stng == null) return;

  stng.addEventListener("click", async () => {
    if(stng.getAttribute("aria-describedby") != null) return;

    var rkisbtn = document.createElement("li");
    rkisbtn.innerHTML = `<a class="rbx-menu-item roblokis-settings-button" href="https://${Rkis.SubDomain}.roblox.com/roblokis" style="color: rgb(255,64,64);">Roblokis</a>`;

    var doc = await document.$watch("#settings-popover-menu").$promise();
    if(doc == null || doc.querySelector(".roblokis-settings-button") != null) return;
    doc.insertBefore(rkisbtn, doc.firstElementChild);
  })
}());

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//random button angle generator
document.$watchLoop('a.game-card-link[data-addedjoin="true"] > a.rbx-game-server-join[onclick][data-placeid]', (e) => {
  var num = getRndInteger(-5, 5);
  e.classList.add("rk-btn-r" + num);
})

document.$watch("body", (e) => {e.classList.add("Roblokis-installed")});