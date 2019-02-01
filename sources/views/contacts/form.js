import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class ContactsForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "form",
			localId: "contactForm",
			autoheight: false,
			elementsConfig: {
				labelWidth: 120
			},
			elements: [
				{
					view:"label",
					localId: "formLabel",
					label: _("Edit contact"), 
					align:"center"
				},
				{
					margin: 50,
					cols: [
						{
							margin: 10,
							rows: [
								{ view: "text", label: _("First name"), name: "FirstName" },
								{ view: "text", label: _("Last name"), name: "LastName" },
								{ view: "datepicker", label: _("Joining date"), name: "StartDate", format: webix.Date.dateToStr("%d %M %Y"), },
								{ view: "combo", label: _("Status"), name: "StatusID", options: { body: { template: "#Value#", data: statuses } } },
								{ view: "text", label: _("Job"), name: "Job" },
								{ view: "text", label: _("Company"), name: "Company" },
								{ view: "text", label: _("Website"), name: "Website" },
								{ view: "textarea", label: _("Address"), name: "Address" }
							]
						},
						{
							margin: 10,
							rows: [
								{ view: "text", label: _("Email"), name: "Email" },
								{ view: "text", label: _("Skype"), name: "Skype" },
								{ view: "text", label: _("Phone"), name: "Phone" },
								{ view: "datepicker", label: _("Birthday"), name: "Birthday", format: webix.Date.dateToStr("%d %M %Y"), },
								{ view: "text", name: "Photo", localId: "Photo", hidden: true },
								{
									margin: 25,
									cols: [
										{
											width: 200,
											height: 200,
											localId: "cPhoto",
											css: "contact_avatar",
											template: contact => {
												return `<img src="${contact.Photo ? contact.Photo : 'https://cs.unc.edu/~csturton/HWSecurityatUNC/images/person.png'}" />`;
											}
										},
										{
											margin: 10,
											rows: [
												{},
												{
													view: "uploader",
													accept: "image/png, image/jpg, image/jpeg",
													value: _("Change photo"),
													autosend: false,
													multiple: false,
													on: {
														onBeforeFileAdd: (uploadedFile) => {
															const reader  = new FileReader();

															reader.onload = (e) => {
																this.$$("cPhoto").setValues({ Photo: e.target.result });
															};
														
															if (uploadedFile) {
																reader.readAsDataURL(uploadedFile.file);
															}
														}
													}
												},
												{
													view: "button", value: _("Delete photo"),
													click: () => {
														webix.confirm({
															title: _("Confirm_titile"),
															callback: (result) => {
																if (result) {
																	this.$$("cPhoto").setValues({ Photo: "" });
																}
															}
														});
													}
												}
											]
										}
									]
								}
							]
						},
						
					]
				},
				{},
				{
					margin: 20,
					cols: [
						{},
						{
							view: "button", value: _("Cancel"), width: 100,
							click: () => {
								webix.confirm({
									title: _("Confirm_titile"),
									callback: (result) => {
										if (result) {
											this.show("contacts.details");
										}
									}
								});
							}
						},
						{
							view: "button", localId: "saveBtn", value: _("Save"), type: "form", width: 80,
							click: () => {
								this.saveForm();
							}
						}
					]
				}
			],
			rules: {
				"FirstName": webix.rules.isNotEmpty,
				"LastName": webix.rules.isNotEmpty,
				"StatusID": webix.rules.isNotEmpty
			}		
		};
	}

	init() {
		const _ = this.app.getService("locale")._;
		contacts.waitData.then(() => {

			const id = this.getParam("id", true);
			const isNew = this.getParam("new", true);
			
			if (isNew) {
				this.$$("formLabel").setValue(_("Add contact"));
				this.$$("saveBtn").setValue(_("Add"));
			}

			if (!isNew && id && contacts.exists(id)) {
				let contactData = webix.copy(contacts.getItem(id));
				let flag = statuses.exists(contactData.StatusID);
				contactData.status = flag ? statuses.getItem(contactData.StatusID).Value : {};

				this.$$("cPhoto").setValues(contactData);
				this.$$("contactForm").setValues(contactData);
			}
		});
	}

	saveForm () {
		let formView = this.$$("contactForm");

		let photoUrl = this.$$("cPhoto").getValues();
		this.$$("Photo").setValue(photoUrl.Photo);
		const values = formView.getValues();
		
		if (formView.validate()) {
			values.id ? contacts.updateItem(values.id, values) : contacts.add(values);
			
			this.show(`/top/contacts.contacts?id=${values.id}/contacts.details`);
			
			formView.clearValidation();
			formView.clear();
		}
	}
}