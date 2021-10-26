var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var newserver = document.querySelector("#rkpagenewservercheck");
  var linkjoin = document.querySelector("#rkpagelinkjoincheck");
  var loadmore = document.querySelector("#rkpageloadmorecheck");
  var availonly = document.querySelector("#rkpageavailonlycheck");

  if(newserver) wholedata.SPSV = page.getSwich(newserver);
  if(linkjoin) wholedata.SPS = page.getSwich(linkjoin);
  if(loadmore) wholedata.SSPS = page.getSwich(loadmore);
  if(availonly) wholedata.SUAPS = page.getSwich(availonly);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var newserver = document.querySelector("#rkpagenewservercheck");
  var linkjoin = document.querySelector("#rkpagelinkjoincheck");
  var loadmore = document.querySelector("#rkpageloadmorecheck");
  var availonly = document.querySelector("#rkpageavailonlycheck");

  if(newserver) newserver.addEventListener("click", () => {page.toggleSwich(newserver);});
  if(linkjoin) linkjoin.addEventListener("click", () => {page.toggleSwich(linkjoin);});
  if(loadmore) loadmore.addEventListener("click", () => {page.toggleSwich(loadmore);});
  if(availonly) availonly.addEventListener("click", () => {page.toggleSwich(availonly);});

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SPSV != null && newserver) page.toggleSwich(newserver, wholedata.SPSV);
  if(wholedata.SPS != null && linkjoin) page.toggleSwich(linkjoin, wholedata.SPS);
  if(wholedata.SSPS != null && loadmore) page.toggleSwich(loadmore, wholedata.SSPS);
  if(wholedata.SUAPS != null && availonly) page.toggleSwich(availonly, wholedata.SUAPS);
}())