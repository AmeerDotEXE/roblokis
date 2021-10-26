var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var newserver = document.querySelector("#rkpagenewservercheck");
  var linkjoin = document.querySelector("#rkpagelinkjoincheck");
  var pagenav = document.querySelector("#rkpagepagenavcheck");

  if(newserver) wholedata.SSV = page.getSwich(newserver);
  if(linkjoin) wholedata.SSL = page.getSwich(linkjoin);
  if(pagenav) wholedata.SPN = page.getSwich(pagenav);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var newserver = document.querySelector("#rkpagenewservercheck");
  var linkjoin = document.querySelector("#rkpagelinkjoincheck");
  var pagenav = document.querySelector("#rkpagepagenavcheck");

  if(newserver) newserver.addEventListener("click", () => {page.toggleSwich(newserver);});
  if(linkjoin) linkjoin.addEventListener("click", () => {page.toggleSwich(linkjoin);});
  if(pagenav) pagenav.addEventListener("click", () => {page.toggleSwich(pagenav);});

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SSV != null && newserver) page.toggleSwich(newserver, wholedata.SSV);
  if(wholedata.SSL != null && linkjoin) page.toggleSwich(linkjoin, wholedata.SSL);
  if(wholedata.SPN != null && pagenav) page.toggleSwich(pagenav, wholedata.SPN);
}())