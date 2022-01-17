var Rkis = Rkis || {};

if(Rkis.wholeData.QuickGameJoin != false) {

  Rkis.Scripts = Rkis.Scripts || {};
  Rkis.Scripts.QuickGameJoin = Rkis.Scripts.QuickGameJoin || {};

  Rkis.AddRunListener(() => {
    document.$watchLoop("a.game-card-link", (elem) => {
      if(elem == null || elem.href == null || elem.dataset.addedjoin == "true") return;

      elem.dataset.addedjoin = "true";

      //https://www.roblox.com/games/refer?IsLargeGameTile=false&PageId=4a6d26c8-7d80-4a32-ab3b-9e9365bcad66&PageType=Games&PlaceId=6872265039&Position=7&SortName=PersonalRecommendation&SortPosition=2&LocalTimestamp=2022-01-10T08:07:43.575Z
      //https://www.roblox.com/games/537413528/Build-A-Boat-For-Treasure?gameSetTypeId=100000003&homePageSessionInfo=6f32c5c3-dca9-47ae-9182-94c864d9fd15&isAd=false&numberOfLoadedTiles=6&page=homePage&placeId=537413528&position=1&sortPos=0&universeId=210851291
      //https://www.roblox.com/games/refer?SortFilter=5&PlaceId=537413528&Position=1&SortPosition=1&PageId=11c345b9-248d-4d6b-a4e8-9cdc1c8adcff&PageType=Profile
      //https://www.roblox.com/games/refer?PlaceId=4883151089&Position=2&PageType=Profile
      //https://www.roblox.com/games/refer?PlaceId=537413528&PageType=GroupDetail&LocalTimestamp={localTimestamp}

      var id = elem.href.toLowerCase().split("placeid=")[1].split("&")[0];

      var elmnt = document.createElement("a");
      elmnt.className = "btn-full-width btn-control-xs rbx-game-server-join";
      elmnt.dataset.placeid = id;
      elmnt.setAttribute("onclick", `Roblox.GameLauncher.joinMultiplayerGame(${elmnt.dataset.placeid})`);
      elmnt.setAttribute("style", `margin: 8px 0 0 0; display: inline-block;`);
      elmnt.innerHTML = "Join";

      var namethingy = elem.$find("div.game-card-name.game-name-title");
      elem.insertBefore(elmnt, namethingy);
    });
  });

}