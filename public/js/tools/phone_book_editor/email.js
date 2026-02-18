const EMAIL_TYPE = {
  home: 'private',
  work: 'work'
};

class Email {

  constructor() {
    this.type = EMAIL_TYPE.home;
    this.email = '';
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('EMAIL:')
        && !entry.startsWith('EMAIL;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var email = new Email();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    if (Object.keys(keyProps).includes('type')) {
      Object.entries(EMAIL_TYPE).forEach((entry) => {
        if (keyProps['type'].includes(entry[0]))
          email.type = entry[1];
      });
    }

    email.email = value;

    return email;
  }

  toVCF() {
    return 'EMAIL;TYPE=' + getKey(EMAIL_TYPE, this.type).toUpperCase() + ':'
           + this.email;
  }

  toXML(index) {
    var text = '\t\t\t\t<email classifier="' + this.type + '" id="' + index;
    text += '">' + this.email + '</email>\n';
    return text;
  }

}