var Rkis = Rkis || {};

if (Rkis.IsSettingEnabled("QuickRemove", {
	id: "QuickRemove",
	type: "switch",
	value: { switch: true },
	details: {
		default: "en",
		translate: {
			name: "sectionQRB",
			description: "sectionQRB1",
			note: "sectionQRB2"
		},
		"en": {
			name: "Quick Remove Button",
			description: "Small button to remove friends faster.",
			note: "You have to double click the button to remove friends!"
		}
	}
})) {

	Rkis.Scripts = Rkis.Scripts || {};
	Rkis.Scripts.QuickFriendRemove = Rkis.Scripts.QuickFriendRemove || {};

	Rkis.Scripts.QuickFriendRemove.unFriend = function (btn, theid) {
		if (document.$find("#rbx-body > meta") == null) {
			btn.remove();
			console.error(`QFR11`);
			return;
		}

		fetch(`https://friends.roblox.com/v1/users/${theid}/unfriend`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'x-csrf-token': document.$find("#rbx-body > meta").dataset.token
			}
		})
			.then((resp) => {
				if (resp.ok == true) {
					//window.location.reload();
					var daitm = document.$find("#delbtn" + theid);
					if (daitm) daitm.remove();
				}
			})
			.catch((err) => { console.error(err); console.error("Couldn't UnFriend the Person"); })
	}

	Rkis.Scripts.QuickFriendRemove.setup = function () {

		document.$watch("div.tab-content.rbx-tab-content > div.tab-pane.active > div.friends-content.section", (check) => {
			return $r("#friends > a").classList.contains("active") || false;
		}, () => { }).$then()
			.$watchLoop("ul.avatar-cards > li.avatar-card", (e) => {

				var placetoadd = e.$find("div > div > div.avatar-card-caption > span");
				if (placetoadd && e.id && document.$find("#delbtn" + e.id) == null) {

					var deletebutton = document.createElement("div");
					deletebutton.id = "delbtn" + e.id;
					deletebutton.setAttribute("style", "float: right; width: 24px; height: 24px; text-align: center; border: 2px dashed red; color: red; border-radius: 50%; font-size: 14px; background-color: transparent;");
					deletebutton.setAttribute("onmouseover", "this.style.backgroundColor='rgb(255,255,255,0.1)';this.style.border='2px solid red';");
					deletebutton.setAttribute("onmouseout", "this.style.backgroundColor='transparent';this.style.border='2px dashed red';");
					//deletebutton.setAttribute("ondblclick", `Rkis.Scripts.QuickFriendRemove.unFriend(this, "${e.id}")`);
					deletebutton.addEventListener("dblclick", () => { Rkis.Scripts.QuickFriendRemove.unFriend(this, "" + e.id) })
					deletebutton.textContent = "-";

					placetoadd.insertBefore(deletebutton, placetoadd.firstChild);

				}

			})

	}

	Rkis.Scripts.QuickFriendRemove.first = async function () {
		await document.$watch("#container-main").$promise();
		var weburl = window.location.href;

		var robloxuserid = document.$find("head > meta[data-userid]", (e) => { return e.dataset.userid; })

		if (weburl.includes(`users${robloxuserid ? `/${robloxuserid}` : ``}/friends`) ||
			weburl.includes(`users/friends`)) {

			document.$watch("#friends", (btn) => {
				btn.addEventListener("click", Rkis.Scripts.QuickFriendRemove.setup);
			});
			Rkis.Scripts.QuickFriendRemove.setup();

		}
	}

	Rkis.Scripts.QuickFriendRemove.first();

}