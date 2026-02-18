const URL_TYPE = {
  work: 'work'
};

class URL {

  constructor() {
    this.url = '';
    this.type = URL_TYPE.work;
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('URL:')
        && !entry.startsWith('URL;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var url = new URL();

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
      Object.entries(URL_TYPE).forEach((entry) => {
        if (keyProps['type'].includes(entry[1]))
          url.type = entry[1];
      });
    }

    url.url = value;

    return url;
  }

  toVCF() {
    return 'URL;TYPE=' + this.type.toUpperCase() + ';VALUE=URI:' + this.url;
  }

}