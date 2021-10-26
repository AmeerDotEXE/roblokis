var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var newserver = document.querySelector("#rkpagenewservercheck");
  var renamejoin = document.querySelector("#rkpagerenamejoincheck");
  var linkjoin = document.querySelector("#rkpagelinkjoincheck");

  if(newserver) wholedata.SFSV = page.getSwich(newserver);
  if(renamejoin) wholedata.SFST = page.getSwich(renamejoin);
  if(linkjoin) wholedata.SFSL = page.getSwich(linkjoin);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var newserver = document.querySelector("#rkpagenewservercheck");
  var renamejoin = document.querySelector("#rkpagerenamejoincheck");
  var linkjoin = document.querySelector("#rkpagelinkjoincheck");

  if(newserver) newserver.addEventListener("click", () => {page.toggleSwich(newserver);});
  if(renamejoin) renamejoin.addEventListener("click", () => {page.toggleSwich(renamejoin);});
  if(linkjoin) linkjoin.addEventListener("click", () => {page.toggleSwich(linkjoin);});

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SFSV != null && newserver) page.toggleSwich(newserver, wholedata.SFSV);
  if(wholedata.SFST != null && renamejoin) page.toggleSwich(renamejoin, wholedata.SFST);
  if(wholedata.SFSL != null && linkjoin) page.toggleSwich(linkjoin, wholedata.SFSL);
}())