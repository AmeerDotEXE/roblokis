var Rkis = Rkis || {};

if(Rkis.wholeData.CancelPending != false) {

  Rkis.Scripts = Rkis.Scripts || {};
  Rkis.Scripts.CancelFriendPending = Rkis.Scripts.CancelFriendPending || {};

  Rkis.AddRunListener(function() {
    Rkis.Scripts.CancelFriendPending.firstone();
  })

  Rkis.Scripts.CancelFriendPending.firstone = function() {

    document.$watch(`ul.details-actions > li.btn-friends > button`, (check) => {
      if(check.innerText == "Pending") return true;
      return false;
    }, (penbtn) => {
      penbtn.innerText = "Cancel Request";
      penbtn.classList.remove("disabled");
      penbtn.parentElement.addEventListener("click", Rkis.Scripts.CancelFriendPending.secondone);
      penbtn.parentElement.style.cursor = "pointer";
    });

  }

  Rkis.Scripts.CancelFriendPending.secondone = function() {
    var target = $r(`ul.details-actions > li.btn-friends > button`);
    var theid = Rkis.UserId;
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
        target.innerText = "Canceled";
        target.classList.add("disabled");
        target.parentElement.removeEventListener("click", Rkis.Scripts.CancelFriendPending.secondone);
        target.parentElement.style.cursor = "";
      }
    })
    .catch(() => {})
  }

}