var page = page || {};

document.$watch("#rkpage .gamepage .servers", (e) => { e.$on("script", () => {
  var selection = e.querySelector(".serversselector select");
  if(selection == null) return;

  var holder = e.querySelector("#pageloadplace");
  if(holder == null) return;

  if(selection.dataset.listening == "true") return;
  selection.dataset.listening = "true";

  selection.value = "";
  selection.$on("change", async () => {
    holder.$findAll(".serversection", (e) => { e.classList.remove("active"); });
    holder.$find(".serversection." + selection.value, (e) => { e.classList.add("active"); });
  });
}) })