var page = page || {};

page.setup = function() {
  var wholedata = Rkis.wholeData || {};
  
  var buttons = document.querySelectorAll(".rk-button");
  buttons.forEach((e) => {
    e.addEventListener("click", () => {page.toggleSwich(e);});
    if(e.dataset.file == null || wholedata[e.dataset.file] == null) return;
    page.toggleSwich(e, wholedata[e.dataset.file]);
  });

  var textfields = document.querySelectorAll(".rk-textfield");
  textfields.forEach((e) => {
    if(e.dataset.file == null || wholedata[e.dataset.file] == null) return;
    e.value = wholedata[e.dataset.file];
  });
}

page.open = async function(pagetoopen, bypass) {
  var currentactivetab = document.querySelector("#vertical-menu > li.menu-option.active");
  if(bypass != true && currentactivetab.dataset.file == pagetoopen) return;

  window.location.replace(window.location.href.split("#")[0] + "#!/" + pagetoopen);
  currentactivetab.setAttribute("class", "menu-option");
  document.querySelector(`[data-file="${pagetoopen}"]`).className = "menu-option active";
  var daplacetoload = document.querySelector("#rkpage");
  if(daplacetoload == null) return;
  try {
    daplacetoload.innerHTML = await Rkis.GetTextFromLocalFile(`html/SettingsPage/Pages/${pagetoopen}.html`);
    var scrpt0 = document.createElement("script");
    scrpt0.src = Rkis.fileLocation + `html/SettingsPage/Pages/${pagetoopen}.js`;
    daplacetoload.append(scrpt0);
    //eval(`(function() {`+await Rkis.GetTextFromLocalFile(`html/SettingsPage/Pages/${pagetoopen}.js`)+`}())`);
  }catch{}
  page.setup();
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

page.save = function(button) {
  var wholedata = Rkis.wholeData || {};

  var buttons = document.querySelectorAll(".rk-button");
  buttons.forEach((e) => {
    if(e.dataset.file == null) return;
    wholedata[e.dataset.file] = page.getSwich(e);
  });

  var textfields = document.querySelectorAll(".rk-textfield");
  textfields.forEach((e) => {
    if(e.dataset.file == null) return;
    wholedata[e.dataset.file] = e.value;
  });

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));
  Rkis.wholeData = wholedata;

  button.innerText = "Saved";
  setTimeout((btn) => {btn.innerText = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  if (window.location.hash.includes("#!/")) {
    page.open(window.location.hash.split("#!/")[1], true);
  }
  else {
    page.open(document.querySelector("#vertical-menu > li.menu-option.active").dataset.file, true);
  }

  document.querySelectorAll("#vertical-menu > li.menu-option").forEach((e) => {
    e.addEventListener("click", () => {page.open(e.dataset.file);});
  });
}())