class Categories {

  constructor() {
    this.categories = [];
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('CATEGORIES:')
        && !entry.startsWith('CATEGORIES;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var categories = new Categories();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    categories.categories = value.split(',');

    return categories;
  }

  toVCF() {
    return 'CATEGORIES:' + this.categories.join(',');
  }

}