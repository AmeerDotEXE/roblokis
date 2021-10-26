var page = page || {};

page.open = function(pagetoopen) {
  window.location.replace(window.location.href.split("#")[0] + "#!/" + pagetoopen);
  document.querySelector("#vertical-menu > li.menu-option.ng-scope.active").setAttribute("class", "menu-option ng-scope");
  document.querySelectorAll("#vertical-menu > li.menu-option.ng-scope").forEach((e) => {if(e.getAttribute("ui-sref") == pagetoopen) e.setAttribute("class", "menu-option ng-scope active");});
  $("#rkpage").load(Rkis.fileLocation + `html/SettingsPage/Pages/${pagetoopen}.html`);
  $.getScript(Rkis.fileLocation + `html/SettingsPage/Pages/${pagetoopen}.js`);
}

page.toggleSwich = function(swich, stat) {
  if(!swich) return null;

  if (stat == null) {
    var daclass = swich.getAttribute("class");
    if (daclass && daclass.endsWith(" on")) {swich.setAttribute("class", daclass.slice(0, -2) + "off"); return false;}
    else if (daclass && daclass.endsWith(" off")) {swich.setAttribute("class", daclass.slice(0, -3) + "on"); return true;}
  }
  else {
    var daclass = swich.getAttribute("class");
    if (daclass && daclass.endsWith(" off") && stat) {swich.setAttribute("class", daclass.slice(0, -3) + "on"); return true;}
    else if (daclass && daclass.endsWith(" on") && !stat) {swich.setAttribute("class", daclass.slice(0, -2) + "off"); return false;}
  }
}

page.getSwich = function(swich) {
  if(!swich) return null;

  var daclass = swich.getAttribute("class");
  if (daclass && daclass.endsWith(" on")) return true;
  else if (daclass && daclass.endsWith(" off")) return false;

  return null;
}

page.toggleDisable = function(swich, stat) {
  if(!swich) return null;

  if (stat == null) {
    var daclass = swich.style.opacity;
    if (daclass == "") {swich.style.opacity = "0.5"; return true;}
    else {swich.style.opacity = ""; return false;}
  }
  else {
    var daclass = swich.style.opacity;
    if (daclass == "" && stat == true) {swich.style.opacity = "0.5"; return true;}
    else if (daclass != "" && stat == false) {swich.style.opacity = ""; return false;}
  }
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  if (window.location.hash.includes("#!/")) {
    page.open(window.location.hash.split("#!/")[1]);
  }
  else {
    page.open(document.querySelector("#vertical-menu > li.menu-option.ng-scope.active").getAttribute("ui-sref"));
  }

  document.querySelectorAll("#vertical-menu > li.menu-option.ng-scope").forEach((e) => {
    e.addEventListener("click", () => {page.open(e.getAttribute("ui-sref"));});
  });
}())