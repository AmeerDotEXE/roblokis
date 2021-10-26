var Rkis = Rkis || {};
Rkis.SLS = Rkis.SLS || {};

Rkis.SLS.setup = function() {
  var weburl = window.location.href;
  if (weburl.includes("/users/")) {
    document.addEventListener("rkrequested", Rkis.SLS.firstone);
  }
}

Rkis.SLS.firstone = async function(darequest) {

  if (darequest && darequest.detail && darequest.detail.responseURL.startsWith("https://users.roblox.com/v1/users") == false) return;

  var id = window.location.href.split("/users/")[1].split("/")[0];
  if (id == null) return;

  var result = await fetch("https://presence.roblox.com/v1/presence/users", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "userIds": [ id ] })
  })
  .then((response) => response.json())
  .catch(() => {return null;});
  if(result != null && result.userPresences != null) result = result.userPresences;
  if(result != null && result.length > 0) result = result[0];

  var statusholder = await document.waitSelector("#profile-statistics-container");
  if(statusholder == null) return;

  var oldthingytodelete = document.querySelector("#lastseentheprofileis");
  if(oldthingytodelete != null) oldthingytodelete.remove();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  var onlinestats = null;
  var onlineseen = null;
  var onlinegame = null;

  if(result != null) {
    var award = new Date(result.lastOnline);

    if(result.placeId != null) onlinestats = `<a class="text-lead" href="${window.location.origin}/games/refer?PlaceId=${result.placeId}" style="text-decoration: underline;">${result.lastLocation}</a>`;
    else onlinestats = `<p class="text-lead">${result.lastLocation}</p>`;

    if(result.placeId != null && result.gameId != null) onlinegame = `<li class="profile-stat" style="display: grid;justify-items: center;"><p class="text-label">Last Game</p> <p class="text-lead" onclick="Roblox.GameLauncher.joinGameInstance(${result.placeId}, '${result.gameId}')" style="width: fit-content;background-color: #00b06f;border-radius: 10px;padding: 0 20%;cursor: pointer;align-self: center;">Join</p> </li>`;

    onlineseen = `<p class="text-lead"
    title="Seen on ${award.getMonth() + 1}/${award.getDate()}/${award.getFullYear()}, ${award.getHours()}:${award.getMinutes()}:${award.getSeconds()}">${monthNames[award.getMonth()]}, ${award.getDate()} ${award.getFullYear()}</p>`;
  }

  statusholder.innerHTML += `<div id="lastseentheprofileis" class="section-content" style="border-radius: 20px;border-right: 1px solid #b8b8b8;border-bottom: 1px solid #b8b8b8;margin: 10px;display: grid;"><ul class="profile-stats-container" style="display: flex;">
    <li class="profile-stat"><p class="text-label">Last Seen</p> ${onlineseen || `<p class="text-lead">Unknown</p>`} </li>
    <li class="profile-stat"><p class="text-label">Last Place</p> ${onlinestats || `<p class="text-lead">Unknown</p>`} </li>${onlinegame || ""}</ul></div>`;
}

Rkis.SLS.setup();