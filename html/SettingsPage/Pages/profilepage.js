var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var laststatus = document.querySelector("#rkpagelastcheck");
  var thestatus = document.querySelector("#rkstatuscheck");
  var pendcancel = document.querySelector("#rkcancelcheck");

  if(laststatus) wholedata.SLS = page.getSwich(laststatus);
  if(thestatus) wholedata.SSW = page.getSwich(thestatus);
  if(pendcancel) wholedata.SCP = page.getSwich(pendcancel);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var laststatus = document.querySelector("#rkpagelastcheck");
  var thestatus = document.querySelector("#rkstatuscheck");
  var pendcancel = document.querySelector("#rkcancelcheck");

  if(laststatus) laststatus.addEventListener("click", () => {page.toggleSwich(laststatus);});
  if(thestatus) thestatus.addEventListener("click", () => {page.toggleSwich(thestatus);});
  if(pendcancel) pendcancel.addEventListener("click", () => {page.toggleSwich(pendcancel);});

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SLS != null && laststatus) page.toggleSwich(laststatus, wholedata.SLS);
  if(wholedata.SSW != null && thestatus) page.toggleSwich(thestatus, wholedata.SSW);
  if(wholedata.SCP != null && pendcancel) page.toggleSwich(pendcancel, wholedata.SCP);
}())