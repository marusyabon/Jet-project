import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";
import ActivitiesTable from "./activities";
import FilesTable from "./files";

export default class ContactDetails extends JetView {
    config() {
        let contactTitle = {
            view: "label",
            css: "contact_title",
            localId: "contactTitle"
        };

        let buttons = {
            cols: [
                {
                    view: "button",
                    label: "Delete",
                    type: "icon",
                    icon: "fas fa-trash-alt",
                    width: 100,
                    click: () => {
                        this.removeContact();
                    }
                },
                {
                    view: "button",
                    label: "Edit",
                    type: "icon",
                    icon: "fas fa-edit",
                    width: 100,
                    click: () => {
                        let id = this.getParam("id", true);
                        this.show(`/top/contacts.contacts?id=${id}/contacts.form`);
                    }
                }
            ]
        };

        let contactCard = {
            localId: "contactCard",
            minHeight: 270,
            template: contact => {
                return (
                    `<div class="col contact_card">
                        <div class="contact_avatar" style="background-image: url(${contact.Photo ? contact.Photo : "https://cs.unc.edu/~csturton/HWSecurityatUNC/images/person.png"});"></div>
                        <p class="contact_status">${contact.status}</p>
                    </div>
                        <div class="col icon_p">
                        <p><i class="fas fa-envelope"></i>${contact.Email}</p>
                        <p><i class="fab fa-skype"></i>${contact.Skype}</p>
                        <p><i class="fas fa-tag"></i>${contact.Job}</p>
                        <p><i class="fas fa-briefcase"></i>${contact.Company}</p>
                    </div>
                    <div class="col icon_p">
                        <p><i class="fas fa-calendar-alt"></i>${contact.Birthday}</p>
                        <p><i class="fas fa-map-marker-alt"></i>${contact.Address}</p>
                    </div>`
                );  
            }
        };

        return {
            rows: [
                {
                    cols: [contactTitle, {}, buttons]
                },
                {
                    height: 10
                },
                contactCard,
                {
                    rows:[
                        {
                          view:"tabbar",
                          value: 'Activities', 
                          multiview:true, 
                          optionWidth: 150,
                          options: [
                            { value: 'Activities',  id: 'Activities'},
                            { value: 'Files',  id: 'Files'}
                          ]
                        },    
                        {   id:"mymultiview",
                            cells:[
                                ActivitiesTable,                       
                                FilesTable
                            ]
                         }
                       ]
                }
            ]
        };
    }

    urlChange() {
        webix.promise.all([
            contacts.waitData,
            statuses.waitData
        ]).then(() => {
            let id = this.getParam("id", true);
            if (id && contacts.exists(id)) {
                let contactData = webix.copy(contacts.getItem(id));
                contactData.status = statuses.getItem(contactData.StatusID).Value;

                this.$$("contactTitle").setValue(contactData.FirstName + " " + contactData.LastName);
                this.$$("contactCard").setValues(contactData);
            }
        });
    }

    removeContact() {
        webix.confirm({
            title: "Remove this?",
            text: "action cannot be undone",
            callback: (result) => {
                if (result) {
                    this.app.callEvent("onContactDelete");
                      
                    let id = this.getParam("id", true);
                    contacts.remove(id);
                }
            }
        });
    }
}