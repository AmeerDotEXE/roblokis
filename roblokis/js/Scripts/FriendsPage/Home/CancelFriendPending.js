var Rkis = Rkis || {};

if (Rkis.IsSettingEnabled("CancelPending", {
	id: "CancelPending",
	type: "switch",
	value: { switch: true },
	details: {
		default: "en",
		translate: {
			name: "sectionCP",
			description: "sectionCP1"
		},
		"en": {
			name: "Cancel Pending",
			description: "Shows a \"Cancel Pending\" Button instead of \"Pending\"."
		}
	}
})) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.CancelFriendPending = Rkis.Scripts.CancelFriendPending || {};

	document.$watch(`ul.details-actions > li.btn-friends > button`, (check) => {
		if (check.textContent == "Pending") return true;
		return false;
	}, (penbtn) => {
		penbtn.textContent = Rkis.language["cancelRequest"];
		penbtn.classList.remove("disabled");
		penbtn.parentElement.addEventListener("click", Rkis.Scripts.CancelFriendPending.secondone);
		penbtn.parentElement.style.cursor = "pointer";
	});

	Rkis.Scripts.CancelFriendPending.secondone = function () {
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
				if (resp.status == 200) {
					target.textContent = Rkis.language["canceledRequest"];
					target.classList.add("disabled");
					target.parentElement.removeEventListener("click", Rkis.Scripts.CancelFriendPending.secondone);
					target.parentElement.style.cursor = "";
				}
			})
			.catch(() => { })

	}

}