class Contact {

  constructor() {
    this.addresses = [];
    this.birthday = null;
    this.categories = null;
    this.emails = [];
    this.fullName = null;
    this.name = null;
    this.note = null;
    this.organization = null;
    this.photo = null;
    this.rev = (new Date()).toISOString().replaceAll('-', '')
                           .replaceAll(':', '').replaceAll(/\.[0-9]{3}/gm, '');
    this.numbers = [];
    this.title = null;
    this.uid = null;
    this.url = null;
    this.version = '4.0';
  }

  setAttribute(type, value) {
    if (type == Address)
      this.addresses.push(value);
    else if (type == Birthday)
      this.birthday = value;
    else if (type == Categories)
      this.categories = value;
    else if (type == Email)
      this.emails.push(value);
    else if (type == FullName)
      this.fullName = value;
    else if (type == Name)
      this.name = value;
    else if (type == Note)
      this.note = value;
    else if (type == Organization)
      this.organization = value;
    else if (type == Photo)
      this.photo = value;
    else if (type == PhoneNumber)
      this.numbers.push(value);
    else if (type == Title)
      this.title = value;
    else if (type == UID)
      this.uid = value;
    else if (type == URL)
      this.url = value;
  }

  splitTo75(line) {
    if (line.length <= 0)
      return line;
    var text = line[0];
    line = line.substring(1);
    var lines = [];
    for (var i = 0; i < line.length; i += 74) {
      var start = i;
      var end = Math.min(i + 74, line.length);
      lines.push(line.substring(start, end));
    }
    text += lines.join('\n ');
    return text;
  }

  toVCF() {
    var text = this.splitTo75('BEGIN:VCARD');
    if (this.addresses.length > 0) {
      text += '\n' + this.addresses.map((address) => {
        return this.splitTo75(address.toVCF());
      }).join('\n');
    }
    if (this.birthday != null)
      text += '\n' + this.splitTo75(this.birthday.toVCF());
    if (this.categories != null)
      text += '\n' + this.splitTo75(this.categories.toVCF());
    if (this.emails.length > 0) {
      text += '\n' + this.emails.map((email) => {
        return this.splitTo75(email.toVCF());
      }).join('\n');
    }
    if (this.fullName != null)
      text += '\n' + this.splitTo75(this.fullName.toVCF());
    if (this.name != null)
      text += '\n' + this.splitTo75(this.name.toVCF());
    if (this.note != null)
      text += '\n' + this.splitTo75(this.note.toVCF());
    if (this.organization != null)
      text += '\n' + this.splitTo75(this.organization.toVCF());
    if (this.photo != null)
      text += '\n' + this.splitTo75(this.photo.toVCF());
    text += '\n' + this.splitTo75('REV:' + this.rev);
    if (this.numbers.length > 0) {
      text += '\n' + this.numbers.map((number) => {
        return this.splitTo75(number.toVCF());
      }).join('\n');
    }
    if (this.title != null)
      text += '\n' + this.splitTo75(this.title.toVCF());
    if (this.uid != null)
      text += '\n' + this.splitTo75(this.uid.toVCF());
    if (this.url != null)
      text += '\n' + this.splitTo75(this.url.toVCF());
    text += '\n' + this.splitTo75('VERSION:' + this.version);
    text += '\n' + this.splitTo75('END:VCARD');
    return text;
  }

  toXML(index) {
    var text = '\t\t<contact>\n';
    text += '\t\t\t<category>0</category>\n';
    if (this.fullName != null)
      text += this.fullName.toXML();
    if (this.numbers.length > 0) {
      text += '\t\t\t<telephony nid="' + this.numbers.length + '">\n';
      this.numbers.sort((a, b) => {
        if (a.type == PHONE_NUMBER_TYPE.home
            && b.type != PHONE_NUMBER_TYPE.home)
          return -1;
        if (a.type != PHONE_NUMBER_TYPE.home
            && b.type == PHONE_NUMBER_TYPE.home)
          return 1;
        
        if (a.type == PHONE_NUMBER_TYPE.cell
            && b.type != PHONE_NUMBER_TYPE.cell)
          return -1;
        if (a.type != PHONE_NUMBER_TYPE.cell
            && b.type == PHONE_NUMBER_TYPE.cell)
          return 1;
        
        return 0;
      }).forEach((number, index) => {
        text += number.toXML(index);
      });
      text += '\t\t\t</telephony>\n';
    }
    if (this.emails.length > 0) {
      text += '\t\t\t<services nid="' + this.emails.length + '">\n';
      this.emails.forEach((email, index) => {
        text += email.toXML(index);
      });
      text += '\t\t\t</services>\n';
    }
    text += '\t\t\t<setup />\n';
    text += '\t\t\t<features doorphone="0" />\n';
    text += '\t\t\t<mod_time>' + (Math.floor(Date.now() / 1000))
            + '</mod_time>\n';
    text += '\t\t\t<uniqueid>' + index + '</uniqueid>\n';
    text += '\t\t</contact>\n';
    return text;
  }

}

function getKey(dict, value) {
  for (var entry of Object.entries(dict)) {
    if (entry[1] == value)
      return entry[0];
  }
  return null;
}