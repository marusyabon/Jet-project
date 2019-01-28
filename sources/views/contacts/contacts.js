import {JetView} from "webix-jet";
import {contacts} from "models/contacts";

export default class ContactsView extends JetView {
	config() {
		let userInfo = "<div class='user_icon'></div><p class='user_name'>#FirstName# #LastName#</p><p class='user_email'>#Email#</p>";
		let list = {
			rows: [
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
					value: "Add",
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
        })
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