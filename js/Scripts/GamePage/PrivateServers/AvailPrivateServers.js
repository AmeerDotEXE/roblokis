var Rkis = Rkis || {};

if (Rkis.IsSettingEnabled("AvailPrivateServers", {
	id: "AvailPrivateServers",
	type: "switch",
	value: { switch: false },
	details: {
		default: "en",
		translate: {
			name: "sectionASO",
			description: "sectionASO1"
		},
		"en": {
			name: "Available Servers Only",
			description: "Removes all unavailable servers or all servers without a join button.",
		}
	}
})) {

	document.$watchLoop("#rbx-private-running-games > ul > li", (server) => {
		var jionBtn = server.querySelector('div.rbx-private-game-server-details > span > button.rbx-private-game-server-join');

		if (jionBtn == null) {
			server.style = "display: none !important;";
		}

	})

}