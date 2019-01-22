import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactDetails extends JetView {
	config() {
		let contactTitle = {
			view: "label",
			css: "contact_title",
			localId: "contactTitle"
		};

		let buttons = {
			cols: [
				{
					view: "button",
					label: "Delete",
					type: "icon",
					icon: "fas fa-trash-alt",
					inputWidth: 100
				},
				{
					view: "button",
					label: "Edit",
					type: "icon",
					icon: "fas fa-edit",
					inputWidth: 100
				}
			]
		};

		let contactAvatar = {
			rows: [
				{
					width: 200,
					height: 200,
					css: { "background-color": "grey" }
				},
				{
					view: "label",
					css: "contact_status",
					localId: "contactStatus",
					align: "center"
				}
			]
		};

		let contactInfo = {
			localId: "contactInfo",
			template: contact => {
				return (
					`<div class="col icon_p">
						<p><i class="fas fa-envelope"></i>${contact.Email}</p>
						<p><i class="fab fa-skype"></i>${contact.Skype}</p>
						<p><i class="fas fa-tag"></i>${contact.Job}</p>
						<p><i class="fas fa-briefcase"></i>${contact.Company}</p>
					</div>
					<div class="col icon_p">
						<p><i class="fas fa-calendar-alt"></i>${contact.Birthday}</p>
						<p><i class="fas fa-map-marker-alt"></i>${contact.Address}</p>
					</div>`
				);
			}
		};

		return {
			rows: [
				{
					cols: [contactTitle, {}, buttons]
				},
				{
					cols: [contactAvatar, contactInfo]
				},
				{}

			]
		};
	}

	init() {

	}
	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id");
			if (id && contacts.exists(id)) {
				let contactData = webix.copy(contacts.getItem(id));
				contactData.status = statuses.getItem(contactData.StatusID).Value;

				this.$$("contactTitle").setValue(contactData.FirstName + " " + contactData.LastName);
				this.$$("contactInfo").setValues(contactData);
				this.$$("contactStatus").setValue(contactData.status);


			}
		});
	}
}