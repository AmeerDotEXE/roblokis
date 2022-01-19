if (Rkis.wholeData.CustomRobux != null && Rkis.wholeData.CustomRobux != "") {

  //set Custom Robux
  document.$watch("#navbar-robux").$then()
  .$watch("#nav-robux-amount", async (rbxplate) => {
    rbxplate.id = "nav-custom-robux-amount";
    for (var i = 0; i < 10; i++) {
      rbxplate.innerText = Rkis.wholeData.CustomRobux;
      await Rkis.delay(100);
    }

    document.$watch("#nav-robux-amount", async (rbxplate) => {
      rbxplate.id = "nav-custom-robux-amount";
      //for (var i = 0; i < 10; i++) {
        rbxplate.innerText = Rkis.wholeData.CustomRobux;
      //  await Rkis.delay(1000);
      //}
    })
  })


  //set popup Robux
  document.$on("click", "#navbar-robux", () => {
    var rbxmenu = $r("#nav-robux-balance");
    if(rbxmenu) {
      rbxmenu.id = "nav-custom-robux-balance";
      rbxmenu.innerText = Rkis.wholeData.CustomRobux + " Robux";
    }
  })

};