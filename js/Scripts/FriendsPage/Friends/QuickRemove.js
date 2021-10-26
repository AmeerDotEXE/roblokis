var Rkis = Rkis || {};
Rkis.SQR = Rkis.SQR || {};

Rkis.SQR.friendsbtn = null;

Rkis.SQR.setup = async function() {
  var weburl = window.location.href;

  if ( (weburl.includes(`users${Roblox.CurrentUser.userId ? `/${Roblox.CurrentUser.userId}` : ``}/friends`) ||
        weburl.includes(`users/friends`)) && Rkis.SQR.friendsbtn == null) {
    Rkis.SQR.friendsbtn = await document.waitSelector("#friends", null, 30*1000);
    if (Rkis.SQR.friendsbtn != null) {
      Rkis.SQR.friendsbtn.addEventListener("click", () => {console.log("clicked");Rkis.SQR.firstone();});
    }
  }

  if (weburl.includes(`users${Roblox.CurrentUser.userId ? `/${Roblox.CurrentUser.userId}` : ``}/friends#!/friends`) ||
      weburl.includes(`users/friends#!/friends`)) {

    var loadmoreBTN = await document.waitSelector("#friends-container > div > div.rbx-tabs-horizontal.rbx-scrollable-tabs-horizontal > div > div > div.pager-holder > ul > li.pager-prev > button", null, 30*1000);
    if (loadmoreBTN) {
      loadmoreBTN.addEventListener("click", () => {setTimeout(Rkis.SQR.firstone, 200);});
    }

    var refreshBTN = await document.waitSelector("#friends-container > div > div.rbx-tabs-horizontal.rbx-scrollable-tabs-horizontal > div > div > div.pager-holder > ul > li.pager-next > button", null, 30*1000);
    if (refreshBTN) {
      refreshBTN.addEventListener("click", () => {setTimeout(Rkis.SQR.firstone, 200);});
    }

    Rkis.SQR.firstone();
  }
}

Rkis.SQR.firstone = async function() {
  if (document.querySelector("#friends > a") != null && document.querySelector("#friends > a").ariaCurrent != "page") return setTimeout(Rkis.SQR.setup, 200);
  var allshowenfriends = await document.waitSelectorAll("div.friends-content.section > ul >li.list-item.avatar-card");
  if (allshowenfriends.length <= 0) return setTimeout(Rkis.SQR.setup, 500);
  allshowenfriends.forEach((e) => {
    var placetoadd = e.querySelector("div > div > div.avatar-card-caption > span");
    if(placetoadd && e.id && document.querySelector("#delbtn" + e.id) == null) {

      var deletebutton = document.createElement("div");
      deletebutton.id = "delbtn" + e.id;
      deletebutton.setAttribute("style", "float: right; width: 24px; height: 24px; text-align: center; border: 2px dashed red; color: red; border-radius: 50%; font-size: 14px; background-color: transparent;");
      deletebutton.setAttribute("onmouseover", "this.style.backgroundColor='#444';this.style.border='2px solid red';");
      deletebutton.setAttribute("onmouseout", "this.style.backgroundColor='transparent';this.style.border='2px dashed red';");
      deletebutton.setAttribute("ondblclick", `Rkis.SQR.secondone("${e.id}")`);
      deletebutton.innerHTML = "-";

      placetoadd.insertBefore(deletebutton, placetoadd.firstChild);
    }
  });
}

Rkis.SQR.secondone = function(theid) {
  if(document.querySelector("#rbx-body > meta") == null) return;

  fetch(`https://friends.roblox.com/v1/users/${theid}/unfriend`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'x-csrf-token': document.querySelector("#rbx-body > meta").dataset.token
    }
  })
  .then((resp) => {
    if(resp.status == 200) {
      //window.location.reload();
      var daitm = document.querySelector("#delbtn" + theid);
      if(daitm) daitm.remove();
    }
  })
  .catch(() => {})
}

Rkis.OnLoad(Rkis.SQR.setup);