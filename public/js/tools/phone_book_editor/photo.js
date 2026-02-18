var photoPromises = [];

class Photo {

  constructor() {
    this.image = null;
  }

  static parsableVCF(entry) {
    if (!entry.startsWith('PHOTO:')
        && !entry.startsWith('PHOTO;'))
      return false;
    return true;
  }

  static parseVCF(entry) {
    var photo = new Photo();

    var key = entry.split(':')[0].toLowerCase();
    var value = entry.substring(key.length + 1);

    var keyProps = {};
    var keyParts = key.split(';');
    for (var keyPart of keyParts) {
      var keyKey = keyPart.split('=')[0];
      var keyValue = keyPart.substring(keyKey.length + 1);

      keyProps[keyKey] = keyValue;
    }

    if (Object.keys(keyProps).includes('value')) {
      if (keyProps['value'] == 'uri') {
        var promise = new Promise((resolve) => {
          photo.image = new Image();
          photo.image.onload = () => {
            resolve();
          }
          photo.image.src = value.replaceAll('\\', '');
        });
        photoPromises.push(promise);
      }
    } else if (Object.keys(keyProps).includes('encoding')
        && Object.keys(keyProps).includes('type')) {
      var uri = '';
      if (keyProps['type'] == 'jpeg' || keyProps['type'] == 'image/jpeg')
        uri = 'data:image/jpeg;';
      if (keyProps['encoding'] == 'b')
        uri += 'base64,';
      uri += value;
      var promise = new Promise((resolve) => {
        photo.image = new Image();
        photo.image.onload = () => {
          resolve();
        }
        photo.image.src = uri;
      });
      photoPromises.push(promise);
    }

    return photo;
  }

  toVCF() {
    var canvas = document.createElement('canvas');
    canvas.width = this.image.naturalWidth;
    canvas.height = this.image.naturalHeight;
    canvas.getContext('2d').drawImage(this.image, 0, 0);
    var uri = canvas.toDataURL('image/jpeg');
    return 'PHOTO;VALUE=URI:' + uri.replaceAll(',', '\\,');
  }

}