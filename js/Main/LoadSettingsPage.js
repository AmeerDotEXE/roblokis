var Rkis = Rkis || {};

Rkis.AllRunListeners = Rkis.AllRunListeners || [];
Rkis.AllRunListeners.push(() =>{
  document.$watch("#container-main > div.content", async (mainplace) => {
    
    mainplace.innerHTML = `
<div id="rkmainpage">
   <div id="rkmaintitle" style="text-align: center;font-weight: 800;font-size: 32px;margin: 1%;" data-translate="settingsPageTitle">Roblokis Settings Page</div>
   <div style="display: flex;justify-content: center;">
      <div class="left-navigation">

         <div data-translate="categoryMain">Main</div>
         <ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
            <li class="menu-option active" data-file="Main/About"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAbout">About</span> </a> </li>
            <li class="menu-option" data-file="Main/Changelog"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabChangelog">Changelog</span> </a> </li>
            <li class="menu-option" data-file="Main/All"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabAll">All</span> </a> </li>
            <li class="menu-option" data-file="Main/Designer"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabDesigner">Designer</span> </a> </li>
         </ul>

         <div data-translate="categoryGamePage">Game Page</div>
         <ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
            <li class="menu-option" data-file="GamePage/Badges"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabBadges">Badges</span> </a> </li>
            <li class="menu-option" data-file="GamePage/Servers"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabServers">Servers</span> </a> </li>
         </ul>

         <div data-translate="categoryProfiles">Profiles</div>
         <ul id="vertical-menu" class="menu-vertical submenus" role="tablist">
            <li class="menu-option" data-file="Profiles/ProfilePage"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabProfilePage">Profile Page</span> </a> </li>
            <li class="menu-option" data-file="Profiles/FriendsPage"> <a class="menu-option-content"> <span class="font-caption-header" data-translate="tabFriendsPage">Friends Page</span> </a> </li>
         </ul>
         
      </div>
      <div id="rkpage" style="margin: 0 0 0 1%;width: 60%;"></div>
   </div>
</div>`;

    var scrpt0 = document.createElement("script");
    scrpt0.src = Rkis.fileLocation + "html/SettingsPage/SettingsPage.js";
    mainplace.append(scrpt0);

    var ttle = document.createElement("title");
    ttle.innerText = Rkis.language["settingsPageTitle"];

    document.firstElementChild.insertBefore(ttle, document.firstElementChild.firstElementChild);

    //eval(xmlhttp2.responseText);
    
  });
});