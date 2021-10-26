var Rkis = Rkis || {};
Rkis.SSW = Rkis.SSW || {};

(async function() {

  var status = await document.waitSelector('[ng-hide="isUserStatusDisabled()"]');
  if (status == null) return;

  status.className = "ng";
}())