class Birthday {

  constructor() {
    this.date = new Date();
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('BDAY:')
        && !entry.startsWith('BDAY;')
        && !entry.startsWith('X-MS-SPOUSE:')
        && !entry.startsWith('X-MS-SPOUSE;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var birthday = new Birthday();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    var dateParts = null;

    if (Object.keys(keyProps).includes('value')) {
      if (keyProps['value'] == 'text') {
        dateParts = value.split('.');
      } else if (keyProps['value'] == 'date') {
        dateParts = [value.substring(6, 8),
                     value.substring(4, 6),
                     value.substring(0, 4)];
      }
    } else if (Object.keys(keyProps).includes('X-MS-SPOUSE')) {
      dateParts = value.split('.');
    }

    if (dateParts == null) {
      dateParts = value.split('-');
      if (dateParts.length > 1) {
        dateParts = dateParts.reverse()
      } else {
        dateParts = [value.substring(6, 8),
                     value.substring(4, 6),
                     value.substring(0, 4)];
      }
    }
    
    var date = new Date();
    date.setFullYear(parseInt(dateParts[2]));
    date.setMonth(parseInt(dateParts[1]) - 1);
    date.setDate(parseInt(dateParts[0]));
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    birthday.date = date;

    return birthday;
  }

  toVCF() {
    return 'BDAY:' + ('' + this.date.getFullYear()).padStart(4, '0')
                   + ('' + (this.date.getMonth() + 1)).padStart(2, '0')
                   + ('' + this.date.getDate()).padStart(2, '0');
  }

}