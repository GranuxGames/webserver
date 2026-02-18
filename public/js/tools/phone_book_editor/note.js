class Note {

  constructor() {
    this.note = '';
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('NOTE:')
        && !entry.startsWith('NOTE;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var note = new Note();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    note.note = value.replaceAll('\\n', '\n');

    return note;
  }

  toVCF() {
    return 'NOTE:' + this.note.replaceAll('\n', '\\n');
  }

}