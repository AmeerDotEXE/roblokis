var Rkis = Rkis || {};

if (Rkis.IsSettingEnabled("ShowPrivateServers", {
	id: "ShowPrivateServers",
	type: "switch",
	value: { switch: true },
	details: {
		default: "en",
		translate: {
			name: "sectionALM",
			description: "sectionALM1"
		},
		"en": {
			name: "Automatic Load More",
			description: "Automatically clicks load more then the servers refresh.",
		}
	}
})) {

	document.$watchLoop("#rbx-private-running-games > div.rbx-private-running-games-footer > button", async (loadmoreBTN) => {
		while (document.contains(loadmoreBTN)) {
			if (loadmoreBTN.getAttribute("disabled") == null) {
				loadmoreBTN.click();
			}
			await Rkis.delay(200);
		}
	})

}