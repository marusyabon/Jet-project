import {JetView} from "webix-jet";
import { activities } from "models/activities";
import { activitytypes } from "models/activitytypes";
import ActivitiesForm from "../activities/form";

export default class ActivitiesTable extends JetView {
	config() {

		let _table = {
			id: "Activities",
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
								return false;
							}
						}
					});
				}
			}
		};

		let _button = {
			view: "button",
			label: "Add activity",
			type: "icon",
			css: "btn",
			icon: "fas fa-plus-square",
			width: 100,
			click: () => { this.actForm.showWindow(); }
		};

		return {
			rows: [
				_table,
				{ cols: [ {}, _button ] }
			]
		};
	}

	init() {
		this.actForm = this.ui(ActivitiesForm);
	}

	urlChange(view, url) {
        activities.waitData.then(() => {
			let id = this.getParam("id", true);
			let dTable = view.queryView("datatable");

            if (id) {
				dTable.sync(activities, () => {
					dTable.filter((item) => {
						return item.ContactID == id;
					})
				});
            }
        });
    }
};
