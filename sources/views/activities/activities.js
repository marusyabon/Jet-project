import { JetView } from "webix-jet";
import ActivitiesForm from "./form";
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
					localId: "actFilter",
					optionWidth: 110,
					options: [
						{ "id": "all", "value": "All" },
						{ "id": "overdue", "value": "Overdue" },
						{ "id": "completed", "value": "Completed" },
						{ "id": "today", "value": "Today" },
						{ "id": "tomorrow", "value": "Tomorrow" },
						{ "id": "thisWeek", "value": "This week" },
						{ "id": "thisMonth", "value": "This month" }
					],
					on: {
						"onChange":  () => {
							this.$$("actTable").filterByAll();

							this.$$("actTable").filter((obj) => {
								let filter = this.$$("actFilter").getValue();
								return this.actFiltering(obj, filter);								
							});
						}
					}
				},
				{
					view: "button",
					label: "Add activity",
					type: "icon",
					icon: "fas fa-plus-square",
					width: 100,
					click: () => { this.actForm.showWindow(); }
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
					this.actForm.showWindow(id);
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
		this.actForm = this.ui(ActivitiesForm);
	}

	actFiltering(obj, filter) {
		let today = new Date(),
			day = webix.Date.datePart(today),
			week = webix.Date.weekStart(today),
			month = webix.Date.monthStart(today),
			tomorrow = webix.Date.add(day, 1, "day", true);

		let actDate = obj.DueDate,
			actDay = webix.Date.datePart(actDate),
			actWeek = webix.Date.weekStart(actDate),
			actMonth = webix.Date.monthStart(actDate);

		switch(filter) {
			case 'overdue':  return obj.State == 0 && actDate < today;
			case 'completed': return obj.State == 1;
			case 'today': return webix.Date.equal(day, actDay);
			case 'tomorrow': return webix.Date.equal(tomorrow, actDay);
			case 'thisWeek': return webix.Date.equal(week, actWeek);
			case 'thisMonth':  return webix.Date.equal(month, actMonth);
			default: return true;
		}
	}
}