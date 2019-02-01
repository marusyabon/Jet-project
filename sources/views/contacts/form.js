import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class ContactsForm extends JetView {
	config() {
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
					label: "Edit contact", 
					align:"center"
				},
				{
					margin: 50,
					cols: [
						{
							margin: 10,
							rows: [
								{ view: "text", label: "First name", name: "FirstName" },
								{ view: "text", label: "Last name", name: "LastName" },
								{ view: "datepicker", label: "Joining date", name: "StartDate", format: webix.Date.dateToStr("%d %M %Y"), },
								{ view: "combo", label: "Status", name: "StatusID", options: { body: { template: "#Value#", data: statuses } } },
								{ view: "text", label: "Job", name: "Job" },
								{ view: "text", label: "Company", name: "Company" },
								{ view: "text", label: "Website", name: "Website" },
								{ view: "textarea", label: "Address", name: "Address" }
							]
						},
						{
							margin: 10,
							rows: [
								{ view: "text", label: "Email", name: "Email" },
								{ view: "text", label: "Skype", name: "Skype" },
								{ view: "text", label: "Phone", name: "Phone" },
								{ view: "datepicker", label: "Birthday", name: "Birthday", format: webix.Date.dateToStr("%d %M %Y"), },
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
													value: "Change photo",
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
													view: "button", value: "Delete photo",
													click: () => {
														webix.confirm({
															title: "Are you shure?",
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
							view: "button", value: "Cancel", width: 100,
							click: () => {
								webix.confirm({
									title: "Are you shure?",
									callback: (result) => {
										if (result) {
											this.show("contacts.details");
										}
									}
								});
							}
						},
						{
							view: "button", localId: "saveBtn", value: "Save", type: "form", width: 80,
							click: () => {
								this.saveForm();
							}
						}
					]
				}
			],
			rules: {
				"FirstName": webix.rules.isNotEmpty,
				"LastName": webix.rules.isNotEmpty
			}		
		};
	}

	init() {
		contacts.waitData.then(() => {
			const id = this.getParam("id", true);
			const isNew = this.getParam("new", true);
			
			if (isNew) {
				this.$$("formLabel").setValue("Add contact");
				this.$$("saveBtn").setValue("Add");
			}

			if (!isNew && id && contacts.exists(id)) {
				let contactData = webix.copy(contacts.getItem(id));
				contactData.status = statuses.getItem(contactData.StatusID).Value;

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
			
			formView.clearValidation();
			formView.clear();
			this.show(`/top/contacts.contacts?id=${values.id}/contacts.details`);
		}
	}
}