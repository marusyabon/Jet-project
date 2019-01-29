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
					width: 100
				},
				{
					view: "button",
					label: "Edit",
					type: "icon",
					icon: "fas fa-edit",
					width: 100
				}
			]
		};

		let contactCard = {
			localId: "contactCard",
			template: contact => {
				return (
					`<div class="col contact_card">
						<div class="contact_avatar" style="background-image: url(${contact.Photo ? contact.Photo : "https://cs.unc.edu/~csturton/HWSecurityatUNC/images/person.png"});"></div>
						<p class="contact_status">${contact.status}</p>
					</div>
						<div class="col icon_p">
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
					height: 10
				},
				contactCard,
				{}

			]
		};
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
                
				let format = webix.Date.dateToStr("%d-%m-%Y");
				contactData.Birthday = format(contactData.Birthday);

				this.$$("contactTitle").setValue(contactData.FirstName + " " + contactData.LastName);
				this.$$("contactCard").setValues(contactData);
			}
		});
	}
}