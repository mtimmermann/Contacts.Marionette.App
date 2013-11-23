

var db = require('mongojs').connect('localhost/contact-list', ['contacts']);

var contacts = [];
var contactsRaw = [
{"city": "New York", "picture": null, "description": "", "firstName": "(George) Babe", "phone1_note": "", "lastName": "Ruth", "region": "New York", "phone1": "555-123-1234", "email1_note": "", "country": "USA", "email1": "babe.ruth@yankees.com"
},
{"city": "Chicago", "picture": null, "description": "", "firstName": "(Shoeless) Joe", "phone1_note": "", "lastName": "Jackson", "region": "Illinois", "phone1": "555-123-1235", "email1_note": "", "country": "USA", "email1": "joe.jackson@whitesox.com"
},
{"city": "New York", "picture": null, "description": "", "firstName": "Lou", "phone1_note": "", "lastName": "Gehrig", "region": "Colorado", "phone1": "555-123-1236", "email1_note": "", "country": "USA", "id": "email1": "lou.gherig@yankees.com"
}
];

// Strip out any ids that were included in the raw list
for (var i=0; i<contactsRaw.length; i++) {
    var contact = contactsRaw[i];
    delete contact.id;
    delete contact._id;
    contacts.push(contact);
}

db.contacts.insert(contacts, function(err, doc) {
    console.log('err: '+ err);
    console.log('doc: '+ doc);
    if (err) {
        process.exit(code = 1);    
    }
    process.exit(code = 0);
});
