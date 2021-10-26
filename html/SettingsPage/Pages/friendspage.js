var page = page || {};

page.save = function(button) {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var quickremove = document.querySelector("#rkpageqickremcheck");

  if(quickremove) wholedata.SQR = page.getSwich(quickremove);

  localStorage.setItem("Roblokis", JSON.stringify(wholedata));

  button.innerHTML = "Saved";
  setTimeout((btn) => {btn.innerHTML = "Save";}, 1000, button);
}

page.E = "A";
page.Sports = "It's in the Game";

(function() {
  var quickremove = document.querySelector("#rkpageqickremcheck");

  if(quickremove) quickremove.addEventListener("click", () => {page.toggleSwich(quickremove);});

  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) return;

  if(wholedata.SQR != null && quickremove) page.toggleSwich(quickremove, wholedata.SQR);
}())