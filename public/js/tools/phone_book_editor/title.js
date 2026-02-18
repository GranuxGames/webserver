class Title {

  constructor() {
    this.value = '';
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('TITLE:')
        && !entry.startsWith('TITLE;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var title = new Title();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    title.value = value;

    return title;
  }

  toVCF() {
    return 'TITLE:' + this.value;
  }

}