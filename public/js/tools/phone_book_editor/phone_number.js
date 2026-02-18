const PHONE_NUMBER_TYPE = {
  cell: 'mobile',
  work: 'work',
  home: 'home'
};

class PhoneNumber {

  constructor() {
    this.number = '';
    this.type = PHONE_NUMBER_TYPE.home;
    this.fax = false;
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('TEL:')
        && !entry.startsWith('TEL;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var number = new PhoneNumber();

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
      Object.entries(PHONE_NUMBER_TYPE).forEach((entry) => {
        if (keyProps['type'].includes(entry[0]))
          number.type = entry[1];
      });
      if (keyProps['type'].includes('fax'))
        number.fax = true;
    }

    number.number = value.replaceAll(/\(|\)/gm, ' ').replaceAll(/ +/gm, ' ')
                         .trim();
    if (!number.number.startsWith('+')) {
      if (number.number.startsWith('0'))
        number.number = number.number.substring(1);
      number.number = '+49 ' + number;
    }
    return number;
  }

  toVCF() {
    var text = 'TEL;TYPE=' +
               getKey(PHONE_NUMBER_TYPE, this.type).toUpperCase();
    if (this.fax)
      text += ',FAX';
    text += ':' + this.number;
    return text;
  }

  toXML(index) {
    var text = '\t\t\t\t<number type="' + this.type + '" prio="';
    if (index == 0)
      text += '1';
    else
      text += '0';
    text += '" id="' + index + '">';
    text += this.number.replaceAll(' ', '').replaceAll('+', '00');
    text += '</number>\n';
    return text;
  }

}