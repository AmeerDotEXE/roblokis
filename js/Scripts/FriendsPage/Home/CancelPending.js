var Rkis = Rkis || {};
Rkis.SCP = Rkis.SCP || {};

Rkis.SCP.running = false;

Rkis.SCP.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/users/")) {
    document.addEventListener("rkrequested", Rkis.SCP.firstone);
  }

  Rkis.SCP.firstone("first");
}

Rkis.SCP.firstone = async function(darequest) {

  if (Rkis.SCP.running == true) return;
  if (darequest && darequest.detail && darequest.detail.responseURL.startsWith("https://friends.roblox.com/v1/users") == false) return;

  Rkis.SCP.running = true;
  if(darequest == "first") await Rkis.delay(1000);

  var penbtn = await document.waitSelector(`[ng-bind="'Action.Pending' | translate"]`);
  if(penbtn == null) {Rkis.SCP.running = false; return;}

  penbtn.innerText = "Cancel Pending";
  penbtn.style.opacity = "1";
  penbtn.parentElement.addEventListener("click", Rkis.SCP.secondone);
  penbtn.parentElement.style.cursor = "pointer";
}

Rkis.SCP.secondone = function(e) {
  console.log(e.target.firstElementChild);
  var theid = window.location.href.split("/users/")[1].split("/")[0];
  if (theid == null) return;

  fetch(`https://friends.roblox.com/v1/users/${theid}/unfriend`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'x-csrf-token': document.querySelector("#rbx-body > meta").dataset.token
    }
  })
  .then((resp) => {
    if(resp.status == 200) {
      e.target.firstElementChild.innerText = "Canceled";
      e.target.firstElementChild.style.opacity = "0.5";
      e.target.removeEventListener("click", Rkis.SCP.secondone);
      e.target.style.cursor = "";
    }
  })
  .catch(() => {})
}

Rkis.SCP.setup();