var Rkis = window.Rkis || {};

(function() {
  
  document.dispatchEvent(new CustomEvent('rk-to-page', {
    detail: {
      script: "(function() { Rkis.temp.set$(); if(Rkis.AllRunListeners) Rkis.AllRunListeners.forEach(fun => {fun();}); }())",
      itm: [
        {
          name: "Rkis",
          value: JSON.stringify(Rkis, function(key, value) {
            if (typeof value === "function") {
              return "/Function(" + value.toString() + ")/";
            }
            return value;
          })
        }
      ]
    }
  }));

}())