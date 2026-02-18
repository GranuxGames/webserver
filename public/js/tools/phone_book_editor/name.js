class Name {

  constructor() {
    this.name = [];
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('N:')
        && !entry.startsWith('N;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var name = new Name();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    name.name = value.split(';');

    return name;
  }

  toVCF() {
    return 'N:' + this.name.join(';');
  }

}