import { JetView } from "webix-jet";
import ContactsForm from "./form";
import { activities } from "models/activities";
import { activitytypes } from "models/activitytypes";
import { contacts } from "models/contacts";

export default class ActivitiesView extends JetView {
	config() {
		let tabBar = {
			cols: [
				{
					view: "tabbar",
					value: "all",
					optionWidth: 110,
					options: [
						{ "id": "all", "value": "All" },
						{ "id": "overdue", "value": "Overdue" },
						{ "id": "completed", "value": "Completed" },
						{ "id": "today", "value": "Today" },
						{ "id": "tomorrow", "value": "Tomorrow" },
						{ "id": "this week", "value": "This week" },
						{ "id": "this month", "value": "This month" }
					]
				},
				{
					view: "button",
					label: "Add activity",
					type: "icon",
					icon: "fas fa-plus-square",
					width: 100,
					click: () => { this.contForm.showWindow(); }
				}
			]
		};

		let actTable = {
			view: "datatable",
			localId: "actTable",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					width: 30
				},
				{
					id: "TypeID",
					sort: "text",
					header: ["Activity type", { content: "selectFilter" }],
					options: activitytypes
				},
				{
					id: "DueDate",
					header: ["Due date", { content: "datepickerFilter" }],
					sort: "date",
					format: webix.Date.dateToStr("%d %M %y")
				},
				{
					id: "Details",
					sort: "text",
					header: ["Details", { content: "textFilter" }],
					fillspace: true
				},
				{
					id: "ContactID",
					sort: "text",
					header: ["Contact", { content: "selectFilter" }],
					options: contacts
				},
				{
					id: "EditAct",
					header: "",
					template: "{common.editIcon()}",
					width: 50
				},
				{
					id: "RemoveAct",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-pencil": (e, id) => {
					this.contForm.showWindow(id);
				},
				"wxi-trash": function (e, id) {
					webix.confirm({
						title: "Remove this?",
						text: "action cannot be undone",
						callback: function (result) {
							if (result) {
								activities.remove(id);
							}
							return false;
						}
					});
				}
			},
		};

		return {
			rows: [tabBar, actTable]
		};
	}

	init() {
		this.$$("actTable").sync(activities);
		this.contForm = this.ui(ContactsForm);
	}
}