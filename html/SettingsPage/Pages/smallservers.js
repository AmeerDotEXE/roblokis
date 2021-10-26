var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var smallserver = document.querySelector("#rkpagesmallservercheck");
  var serverlink = document.querySelector("#rkpageserverlinkcheck");

  if(smallserver) wholedata.SSS = page.getSwich(smallserver);
  if(serverlink) wholedata.SSSL = page.getSwich(serverlink);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var smallserver = document.querySelector("#rkpagesmallservercheck");
  var serverlink = document.querySelector("#rkpageserverlinkcheck");

  page.toggleDisable(serverlink, page.getSwich(smallserver) == false);

  if(smallserver) smallserver.addEventListener("click", () => { page.toggleDisable(serverlink, page.toggleSwich(smallserver) == false); });
  if(serverlink) serverlink.addEventListener("click", () => { if(serverlink.style.opacity == "") page.toggleSwich(serverlink); });

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SSS != null && smallserver) page.toggleDisable(serverlink, page.toggleSwich(smallserver, wholedata.SSS) == false);
  if(wholedata.SSSL != null && serverlink) page.toggleSwich(serverlink, wholedata.SSSL);
}())