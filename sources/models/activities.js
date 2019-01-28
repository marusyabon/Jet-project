export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$change(obj) {
			let dateFormat = webix.Date.strToDate("%d-%m-%Y %H:%i");

			obj.DueDate = dateFormat(obj.DueDate);
		}
	}
});