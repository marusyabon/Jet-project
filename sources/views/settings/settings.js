import { JetView } from "webix-jet";
import DataTable from "./dtable";
import { activitytypes } from "models/activitytypes";
import { statuses } from "models/statuses";

export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();
		const _ = this.app.getService("locale")._;

		let switcher = {
			rows: [
				{
					view: "segmented", multiview: true, value: lang, name: "lang",
					options: [
						{ id: "en", value: "EN", width: 40 },
						{ id: "ru", value: "RU", width: 40 }
					],
					click: () => this.toggleLanguage(),
				},
				{ height: 30 }
			]
		}

		return {
			rows: [
				switcher,
				{
					cols: [
						{
							$subview: new DataTable(this.app, "", activitytypes, _("Activity types"))
						},
						{
							$subview: new DataTable(this.app, "", statuses, _("Statuses"))
						}
					]
				}
			]
		};
	}
	toggleLanguage() {
		const langs = this.app.getService("locale");
		const button = this.getRoot().queryView({ name: "lang" });
		const value = button.getValue();
		langs.setLang(value);
	}
}