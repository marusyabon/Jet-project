import {JetView} from "webix-jet";
import {contacts} from "models/contacts";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		let userInfo = "<div class='user_icon'></div><p class='user_name'>#FirstName# #LastName#</p><p class='user_email'>#Email#</p>";
		let list = {
			rows: [
				{
					view: "toolbar",
					elements: [
						{
							view: "text",
							localId: "listFilter",
							placeholder: "type to find matcing contacts",
							on: {
								"onTimedKeyPress": () => { 
									let value = this.$$("listFilter").getValue().toLowerCase();
									
									this.$$("list").filter((obj) => {
										for (let key in obj) {
											if (obj[key].toString().toLowerCase().indexOf(value) != -1)
												return true;
										}
									});
								}
							}
						}
					]
				},
				{
					view: "list",
					localId: "list",
					width: 300,
					css: "users_list",
					select: true,
					template: userInfo,
					type: {
						height: 50
					},
					on: {
						"onAfterSelect": (id) => {
							this.show(`/top/contacts.contacts?id=${id}/contacts.details`);
						}
					},
				},
				{
					view: "button",
					type: "form",
					value: _("Add"),
					click: () => {
						let id = this.getParam("id", true);
						this.show(`/top/contacts.contacts?id=${id}&new=true/contacts.form`);
					}
				},
				{
					height: 15
				}
			]
		};
		return {
			margin: 20,
			cols: [
				list,
				{ $subview: true }
			]
		};
	}

	init(view) {
		this.$$("list").sync(contacts);

		this.on(this.app, "onContactDelete", () => {
			let id = contacts.getFirstId();
			if (id) {
				view.queryView("list").select(id);
			}
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			let id = this.getParam("id") || contacts.getFirstId();
			if (id && contacts.exists(id)) {
				this.$$("list").select(id);
			}
		});
	}
}