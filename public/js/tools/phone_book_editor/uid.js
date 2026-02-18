class UID {

  constructor() {
    this.uid = '';
  }
  
  static parsableVCF(entry) {
    if (!entry.startsWith('UID:')
        && !entry.startsWith('UID;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var uid = new UID();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    uid.uid = value;

    return uid;
  }

  toVCF() {
    return 'UID:' + this.uid;
  }

}