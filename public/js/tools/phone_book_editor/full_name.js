class FullName {

  constructor() {
    this.name = null;
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('FN:')
        && !entry.startsWith('FN;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var name = new FullName();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    name.name = value;

    return name;
  }

  toVCF() {
    return 'FN:' + this.name;
  }

  toXML() {
    return '\t\t\t<person>\n' +
           '\t\t\t\t<realName>' + this.name + '</realName>\n' +
           '\t\t\t</person>\n';
  }

}