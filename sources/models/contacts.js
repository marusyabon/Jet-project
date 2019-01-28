export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init(obj) {
			obj.value = obj.FirstName + " " + obj.LastName;

			let dateFormat = webix.Date.strToDate("%d-%m-%Y %H:%i");

			obj.StartDate = dateFormat(obj.StartDate);
			obj.Birthday = dateFormat(obj.Birthday);
		},

		$save(obj) {
			let dateFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

			obj.StartDate = dateFormat(obj.StartDate);
			obj.Birthday = dateFormat(obj.Birthday);
		}
	}
});