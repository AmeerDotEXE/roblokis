var Rkis = window.Rkis || {};

(function() {
  window.ContextScript = true;

  var manifestData = chrome.runtime.getManifest();
  Rkis.version = manifestData.version;

  var mainholder = document.createElement("div");
  mainholder.id = 'roblokis-script-holder';
  document.firstElementChild.append(mainholder);

  Rkis.id = chrome.runtime.id;
  Rkis.fileLocation = `chrome-extension://${Rkis.id}/`;

  var scrpt = document.createElement("script");
  scrpt.innerHTML = `

(function() {

  document.addEventListener("rk-to-page", (e) => {
    if (e.detail == null) return;

    if(e.detail.itm != null && e.detail.itm.length > 0) {
      e.detail.itm.forEach((itm) => {
        window[itm.name] = JSON.parse(itm.value, function(key, value) {
          if (typeof value === "string" &&
              value.startsWith("/Function(") &&
              value.endsWith(")/")) {
            value = value.substring(10, value.length - 2);
            return (0, eval)("(" + value + ")");
          }
          return value;
        });
      })
    }
    
    if(e.detail.script != null && e.detail.script != "") {
      eval(e.detail.script);
    }
  });

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

}())

  `;
  mainholder.append(scrpt);
  mainholder.remove();

}())