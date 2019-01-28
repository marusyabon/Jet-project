import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import ContactDetails from "./details";

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
							this.setParam("id", id, true);
						}
					},
				},
				{
					view: "button",
					type: "form",
					value: "Add",
					click: () => {
						contacts.add({
							"Name": "",
							"Email": "",
						});
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
				{ 
					$subview: ContactDetails        
				}
			]
		};
	}

	init() {
		this.$$("list").sync(contacts);
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