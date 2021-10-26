(async function() {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  var topright = await document.waitSelector("#right-navigation-header > div.navbar-right > ul > div > a > span.age-bracket-label-username");
  if(topright && wholedata.SCN && wholedata.SCN != "") topright.innerHTML = wholedata.SCN;
}())