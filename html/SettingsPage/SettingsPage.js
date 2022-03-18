var page = page || {};

page.setup = function() {
  var wholedata = Rkis.wholeData || {};

  document.querySelectorAll("button.main-save-button").forEach((e) => {
    if(e.dataset.listening != null) return;
    e.dataset.listening = "true";
    
    e.addEventListener("click", () => {page.save(e);});
  });
  
  document.querySelectorAll(".rk-button").forEach((e) => {
    if(e.dataset.listening != null) return;
    e.dataset.listening = "true";

    e.addEventListener("click", () => {page.toggleSwich(e);});
    if(e.dataset.file == null || wholedata[e.dataset.file] == null) return;
    page.toggleSwich(e, wholedata[e.dataset.file]);
  });

  document.querySelectorAll(".rk-textfield").forEach((e) => {
    if(e.dataset.listening != null) return;
    e.dataset.listening = "true";

    if(e.dataset.file == null || wholedata[e.dataset.file] == null) return;
    e.value = wholedata[e.dataset.file];
  });
}

page.open = async function(pagetoopen, bypass) {
  if(document.querySelector(`[data-file="${pagetoopen}"]`) == null) return "404";

  var currentactivetab = document.querySelector("#vertical-menu > li.menu-option.active");
  if(bypass != true && currentactivetab.dataset.file == pagetoopen) return; //already on the page

  window.location.replace(window.location.href.split("#")[0] + "#!/" + pagetoopen); //change link
  currentactivetab.classList.remove("active"); //change tab

  document.querySelector(`[data-file="${pagetoopen}"]`).classList.add("active"); //make tab active

  var daplacetoload = document.querySelector("#rkpage");
  if(daplacetoload == null) return Rkis.ErrorToast("SP32");
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
    if (swich.classList.contains("on")) {swich.classList.remove("on"); swich.classList.add("off"); return false;}
    else if (swich.classList.contains("off")) {swich.classList.remove("off"); swich.classList.add("on"); return true;}
  }
  else {
    swich.classList.remove("on");
    swich.classList.remove("off");
    swich.classList.add(stat ? "on" : "off");

    return stat
  }

  return null;
}

page.getSwich = function(swich) {
  if(!swich) return null;

  if (swich.classList.contains("on")) return true;
  else if (swich.classList.contains("off")) return false;

  return null;
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

  button.innerText = Rkis.language["btnSaved"];
  setTimeout((btn) => {btn.innerText = Rkis.language["btnSave"];}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

page.start = async function() {
  await document.$watch("#rkmainpage").$promise()
  if(await page.open(document.querySelector("#vertical-menu > li.menu-option.active").dataset.file, true) == "404") {
    page.open(document.querySelector("#vertical-menu > li.menu-option").dataset.file, true);
  }

  document.querySelectorAll("#vertical-menu > li.menu-option").forEach((e) => {
    e.addEventListener("click", () => {page.open(e.dataset.file);});
  });
};

page.start();