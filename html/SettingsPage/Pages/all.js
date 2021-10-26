var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var customrobux = document.querySelector("#rkcustomrobuxtext");
  var customname = document.querySelector("#rkcustomnametext");
  var qickjincheck = document.querySelector("#rkpageqicjincheck");
  var desktopapp = document.querySelector("#rkpageappcheck");

  if(customrobux) wholedata.SCR = customrobux.value;
  if(customname) wholedata.SCN = customname.value;
  if(qickjincheck) wholedata.QGJ = page.getSwich(qickjincheck);
  if(desktopapp) wholedata.SDA = page.getSwich(desktopapp);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var customrobux = document.querySelector("#rkcustomrobuxtext");
  var customname = document.querySelector("#rkcustomnametext");
  var qickjincheck = document.querySelector("#rkpageqicjincheck");
  var desktopapp = document.querySelector("#rkpageappcheck");

  if(qickjincheck) qickjincheck.addEventListener("click", () => {page.toggleSwich(qickjincheck);});
  if(desktopapp) desktopapp.addEventListener("click", () => {page.toggleSwich(desktopapp);});

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SCR && customrobux) customrobux.value = wholedata.SCR;
  if(wholedata.SCN && customname) customname.value = wholedata.SCN;
  if(wholedata.QGJ != null && qickjincheck) page.toggleSwich(qickjincheck, wholedata.QGJ);
  if(wholedata.SDA != null && desktopapp) page.toggleSwich(desktopapp, wholedata.SDA);
}())