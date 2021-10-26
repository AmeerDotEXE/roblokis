var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var smallserver = document.querySelector("#rkpagenewbadgescheck");
  var serverlink = document.querySelector("#rkpagehiddenbadgecheck");

  if(smallserver) wholedata.SBV = page.getSwich(smallserver);
  if(serverlink) wholedata.SBVH = page.getSwich(serverlink);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var smallserver = document.querySelector("#rkpagenewbadgescheck");
  var serverlink = document.querySelector("#rkpagehiddenbadgecheck");

  page.toggleDisable(serverlink, page.getSwich(smallserver) == false);

  if(smallserver) smallserver.addEventListener("click", () => { page.toggleDisable(serverlink, page.toggleSwich(smallserver) == false); });
  if(serverlink) serverlink.addEventListener("click", () => { if(serverlink.style.opacity == "") page.toggleSwich(serverlink); });

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SBV != null && smallserver) page.toggleDisable(serverlink, page.toggleSwich(smallserver, wholedata.SBV) == false);
  if(wholedata.SBVH != null && serverlink) page.toggleSwich(serverlink, wholedata.SBVH);
}())