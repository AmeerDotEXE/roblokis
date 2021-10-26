async function SCR() {
  var rbxmenu = await document.waitSelector("#nav-robux-balance");
  if(rbxmenu) {
    rbxmenu.id = "nav-custom-robux-balance";
    rbxmenu.innerHTML = Rkis.wholeData.SCR + " Robux";
  }
}

(async function() {
  if (Rkis.wholeData.SCR && Rkis.wholeData.SCR != "") {

    var rbxplate = await document.waitSelector("#nav-robux-amount");
    if(rbxplate) {
      rbxplate.id = "nav-custom-robux-amount";
      console.log(rbxplate.innerHTML);
      if (rbxplate.innerHTML == "") await Rkis.delay(200);
      rbxplate.innerHTML = Rkis.wholeData.SCR;
    }

    var robuxbtn = document.querySelector("#navbar-robux");
    if(robuxbtn) robuxbtn.addEventListener("click", SCR);
  }
}())