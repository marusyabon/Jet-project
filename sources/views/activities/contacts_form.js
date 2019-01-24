import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activitytypes } from "models/activitytypes";

export default class ContactsForm extends JetView {
	config() {

		return {
			view: "window",
			head: "Add activity",
			localId: "formPopup",
			width: 600,
			height: 400,
			position:"center",
			body: {
				view: "form",
				localId: "formView",
				elements: [
					{ view: "textarea", label: "Details", name: "Details" },
					{ view: "combo", label: "Type", name: "TypeID", options: { body: { template: "#Value#", data: activitytypes } } },
					{ view: "combo", label: "Contact", name: "ContactID", options: { body: { template: "#FirstName# #LastName#", data: contacts } } },
					{
						margin: 20,
						cols: [
							{
								view: "datepicker",
								value: new Date(),
								name: "_Date",
								localId: "_Date",
								label: "Date",
								format: "%d %M %y"
							},
							{
								view: "datepicker",
								type: "time",
								label: "Time",
								localId: "_Time",
								name: "_Time",
								format: "%H:%i"
							},
						]
					},
					{
						view: "checkbox",
						name: "State",
						label: "Completed"
					},
					{
						margin: 20,
						cols: [
							{
								view: "button", value: "Add", type: "form", localId: "saveBtn",
								click: () => {
									this.saveForm();
								}
							},
							{
								view: "button", value: "Cancel",
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
		let formView = this.$$("formView");
		formView.clearValidation();
		formView.clear();

		if (id && activities.exists(id)) {
			this.$$("saveBtn").setValue("Save");
			this.$$("formPopup").getHead().setHTML("Edit activity");

			let values = webix.copy(activities.getItem(id));


			let dateTime = new Date(values.DueDate);

			values._Date = dateTime;
			values._Time = dateTime;

			formView.setValues(values);
		} 
		
		this.getRoot().show();
	}

	saveForm() {
		let formView = this.$$("formView");
		const values = formView.getValues();

		let timeFormat = webix.Date.dateToStr("%H:%i");
		let dateFormat = webix.Date.dateToStr("%Y-%m-%d");

		values.DueDate =  dateFormat(values._Date) + " " + timeFormat(values._Time);

		if (formView.validate()) {
			values.id ? activities.updateItem(values.id, values) : activities.add(values);
			
			formView.clearValidation();
			formView.clear();
			this.$$("formPopup").hide();
		}
	}
}