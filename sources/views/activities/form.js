import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activitytypes } from "models/activitytypes";

export default class ActivitiesForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "window",
			localId: "formPopup",
			head: _("Add activity"),
			width: 600,
			height: 400,
			position:"center",
			body: {
				view: "form",
				localId: "formView",
				elements: [
					{ view: "textarea", label: _("Details"), name: "Details" },
					{ view: "combo", label: _("Type"), name: "TypeID", options: { body: { template: "#Value#", data: activitytypes } } },
					{ view: "combo", label: _("Contact"), name: "ContactID", localId: "ContactID", options: { body: { template: "#FirstName# #LastName#", data: contacts } } },
					{
						margin: 20,
						cols: [
							{
								view: "datepicker",
								value: new Date(),
								name: "_Date",
								localId: "_Date",
								label: _("Date")
							},
							{
								view: "datepicker",
								type: "time",
								label: _("Time"),
								localId: "_Time",
								name: "_Time"
							},
						]
					},
					{
						view: "checkbox",
						name: "State",
						label: _("Completed")
					},
					{
						margin: 20,
						cols: [
							{
								view: "button", type: "form", localId: "saveBtn",
								click: () => {
									this.saveForm();
								}
							},
							{
								view: "button", value: _("Cancel"),
								click: () => {
									this.getRoot().hide();
								}
							}
						]
					}
				],
				rules: {
					"Details": webix.rules.isNotEmpty,
					"TypeID": webix.rules.isNotEmpty,
					"ContactID": webix.rules.isNotEmpty,
				},
			}
		};
	}

	showWindow(id) {
		const _ = this.app.getService("locale")._;

		let formView = this.$$("formView");
		formView.clearValidation();
		formView.clear();

		if (id && activities.exists(id)) {
			this.$$("saveBtn").setValue(_("Save"));
			this.$$("formPopup").getHead().setHTML(_("Edit activity"));

			let values = webix.copy(activities.getItem(id));

			let dateTime = values.DueDate;

			values._Date = dateTime;
			values._Time = dateTime;

			formView.setValues(values);
		}

		else {
			this.$$("saveBtn").setValue(_("Add"));
			this.$$("formPopup").getHead().setHTML(_("Add activity"));

			// check if contact card is open

			let _contactId = this.getParam("id", true);
			if (_contactId) {
				this.$$("ContactID").setValue(_contactId);
				this.$$("ContactID").disable();
			}
		}
		
		this.getRoot().show();
	}

	saveForm() {
		let formView = this.$$("formView");
		const values = formView.getValues();
		
		let h = values._Time.getHours(),
			m = values._Time.getMinutes();
			
		values.DueDate = values._Date;
		values.DueDate.setHours(h, m);


		if (formView.validate()) {
			values.id ? activities.updateItem(values.id, values) : activities.add(values);
			
			formView.clearValidation();
			formView.clear();
			this.$$("formPopup").hide();
		}
	}
}