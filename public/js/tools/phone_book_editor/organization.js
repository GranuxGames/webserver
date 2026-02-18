class Organization {

  constructor() {
    this.org = '';
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('ORG:')
        && !entry.startsWith('ORG;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var org = new Organization();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    org.org = value;

    return org;
  }

  toVCF() {
    return 'ORG:' + this.org;
  }

}