class PhoneBook {

  constructor() {
    this.contacts = [];
  }

  toVCF() {
    return this.contacts.map((contact) => {
      return contact.toVCF();
    }).join('\n');
  }

  toXML() {
    return '<phonebooks>\n' +
           '\t<phonebook>\n' +
           this.contacts.map((contact, index) => {
            return contact.toXML(index);
           }).join('') +
           '\t</phonebook>\n' +
           '</phonebooks>';
  }

}