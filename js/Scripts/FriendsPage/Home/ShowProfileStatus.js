var Rkis = Rkis || {};

if(Rkis.wholeData.StatusShow != false)
Rkis.AddRunListener(function() {

  document.$watch('[ng-hide="isUserStatusDisabled()"]', (status) => {
    status.classList.remove("ng-hide");
  });

});