import {JetView} from "webix-jet";
import { files } from "models/files";

export default class FilesTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		let _table = {
			view: "datatable",
			select: true,
			autoConfig: true,
			columns: [
				{
					id: "FileName",
					header: _("Name"),
					sort: "text",
					fillspace: true
				},
				{
					id: "FileDate",
					sort: "date",
					header: _("Change Date"),
					format:function(val){ 
						return webix.Date.dateToStr("%d %M %y")(val);
					}
				},
				{
					id: "FileSize",
					sort: "int",
					header: _("Size")
				},
				{
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
							}
							return false;
						}
					});
				}
			}
		};

		let _button = { 
			view: "uploader", 
			label: _("Upload file"),
			localId: "fileUploader",
			type: "icon",
			icon: "fas fa-cloud-upload-alt",
			css: "uploader",
			width: 160,
			autosend: false,
			on: {
				"onBeforeFileAdd": (upload) => {
					let file = upload.file;
					let fileObj = {
						id: file.id,
						ContactID: this.getParam("id", true),
						FileName: file.name,
						FileDate: file.lastModifiedDate,
						FileSize: file.size
						// FileSize: `${file.size} kb`
					};
					files.add(fileObj);
				},
				"onFileUploadError": () => {
					webix.message("Uploading failed");
				}
			}
		};

		return {
			rows: [
				_table,
				{ cols: [ {}, _button, {} ] }
			]
		};
	}

	init() {
		this.on(this.app, "onContactDelete", () => {
			let id = this.getParam("id", true);

			let filesToRemove = files.find((item) => item.ContactID == id);
			filesToRemove.forEach((item) => {
				files.remove(item.id);
			});
		});
	}

	urlChange(view) {
		files.waitData.then(() => {
			let id = this.getParam("id", true);
			let dTable = view.queryView("datatable");

			if (id) {
				dTable.sync(files, () => {
					dTable.filter((item) => {
						return item.ContactID == id;
					});
				});
			}
		});
	}
}
