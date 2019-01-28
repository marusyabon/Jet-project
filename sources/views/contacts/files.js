import {JetView} from "webix-jet";

import { files } from "models/files";

export default class FilesTable extends JetView {
	config() {

		let _table = {
			id: "Files",
			view: "datatable",
			select: true,
			columns: [
				{
					id: "RemoveAct",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": function (e, id) {
					webix.confirm({
						title: "Remove this?",
						text: "action cannot be undone",
						callback: function (result) {
							if (result) {
								files.remove(id);
								return false;
							}
						}
					});
				}
			}
		};

		let _button = {
			view: "button",
			label: "Upload file",
			type: "icon",
			css: "btn",
			icon: "fas fa-cloud-upload-alt",
			width: 100,
			// click: () => { this.actForm.showWindow(); }
		};

		return {
			rows: [
				_table,
				{ cols: [ {}, _button, {} ] }
			]
		};
	}

	init() {
		// this.actForm = this.ui(ActivitiesForm);
	}

	urlChange(view, url) {
        files.waitData.then(() => {
			let id = this.getParam("id", true);
			let dTable = view.queryView("datatable");

            if (id) {
				dTable.sync(files, () => {
					dTable.filter((item) => {
						return item.ContactID == id;
					})
				});
            }
        });
    }
};
