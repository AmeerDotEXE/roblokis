if(Rkis.wholeData.CustomName != null && Rkis.wholeData.CustomName != "") 
  document.$watch("#right-navigation-header > div.navbar-right > ul > div > a > span.age-bracket-label-username", (topright) => {
    topright.innerText = Rkis.wholeData.CustomName;
  })