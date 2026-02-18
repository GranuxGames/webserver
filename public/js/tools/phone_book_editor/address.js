const ADDRESS_TYPE = {
  home: 'home',
  work: 'work'
};

class Address {

  constructor() {
    this.type = ADDRESS_TYPE.home;
    this.address = [];
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('ADR:')
        && !entry.startsWith('ADR;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var address = new Address();

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
      Object.entries(ADDRESS_TYPE).forEach((entry) => {
        if (keyProps['type'].includes(entry[0]))
          address.type = entry[1];
      });
    }

    address.address = value.split(';');

    return address;
  }

  toVCF() {
    return 'ADR;TYPE=' + getKey(ADDRESS_TYPE, this.type).toUpperCase() + ':'
           + this.address.join(';');
  }

}