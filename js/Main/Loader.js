var Rkis = window.Rkis || {};

(function() {
  var wholedata = localStorage.getItem("Roblokis");
  if(wholedata) wholedata = JSON.parse(wholedata);
  if(!wholedata) wholedata = {};

  Rkis.wholeData = {...wholedata};

  var sitesplitbydot = window.location.hostname.split(".");
  if(sitesplitbydot.length >= 3) Rkis.SubDomain = sitesplitbydot[0];

  let wholeData = [
    {location: "js/Main/General.js", id: "MG", type: "none"},
    {location: "js/Main/LoadSettingsPage.js", id: "SP", type: "none"},
    {location: "js/Scripts/Main/All/CustomRobux.js", id: "SCR", type: "textfield"},
    {location: "js/Scripts/Main/All/CustomName.js", id: "SCN", type: "textfield"},
    {location: "js/Scripts/Main/All/DesktopApp.js", id: "SDA", type: "checkbox"},
    {location: "js/Scripts/Main/All/QuickGameJoin.js", id: "QGJ", type: "checkbox"},
    {location: "js/Scripts/Main/All/LastStats.js", id: "SLS", type: "checkbox"},
    {location: "js/Scripts/GamePage/About/Badges.js", id: "SBV", type: "checkbox"},
    {location: "js/Scripts/GamePage/PrivateServers/AvailPrivateServers.js", id: "SUAPS", type: "checkbox"},
    {location: "js/Scripts/GamePage/PrivateServers/PrivateServersView.js", id: "SPSV", type: "checkbox"},
    {location: "js/Scripts/GamePage/PrivateServers/ShowPrivateServers.js", id: "SSPS", type: "checkbox"},
    {location: "js/Scripts/GamePage/PrivateServers/PrivateServersLink.js", id: "SPS", type: "checkbox"},
    {location: "js/Scripts/GamePage/FriendServers/FriendsServersView.js", id: "SFSV", type: "checkbox"},
    {location: "js/Scripts/GamePage/FriendServers/FriendsServersText.js", id: "SFST", type: "checkbox"},
    {location: "js/Scripts/GamePage/FriendServers/FriendsServersLink.js", id: "SFSL", type: "checkbox"},
    {location: "js/Scripts/GamePage/SmallServers/SmallServer.js", id: "SSS", type: "checkbox"},
    {location: "js/Scripts/GamePage/PublicServers/ServersView.js", id: "SSV", type: "checkbox"},
    {location: "js/Scripts/GamePage/PublicServers/PublicServersLinks.js", id: "SSL", type: "checkbox"},
    {location: "js/Scripts/GamePage/PublicServers/PageNav.js", id: "SPN", type: "checkbox"},
    {location: "js/Scripts/FriendsPage/Friends/QuickRemove.js", id: "SQR", type: "checkbox"},
    {location: "js/Scripts/FriendsPage/Home/StatusShow.js", id: "SSW", type: "checkbox"},
    {location: "js/Scripts/FriendsPage/Home/CancelPending.js", id: "SCP", type: "checkbox"}
  ];

  for (var i = 0; i < wholeData.length; i++) {
   try {
    if (wholeData[i].type == "none" || (Rkis.wholeData[wholeData[i].id] == true || Rkis.wholeData[wholeData[i].id] != "")) {
      var scrpt = document.createElement("script");
      scrpt.src = Rkis.fileLocation + wholeData[i].location;
      document.querySelector("#roblokis-script-holder").append(scrpt);
    }
   }catch(err){console.error(err)}
  }

  document.querySelector("#roblokis-script-holder").remove();
}())