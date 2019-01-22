import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";

export default class MyApp extends JetApp {
	constructor(config) {		
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top/contacts"
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE) {

	webix.ready(() => {
		webix.debug({events: true, size:true});
		
		const app = new MyApp();
		app.use(plugins.Locale);
		app.render(); 
	});
}