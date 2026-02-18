class FileFormat {

  constructor(fileType) {
    this.fileType = fileType;
  }

  async parse(text) {
    return null;
  }

}

function getFormat(type) {
  var formats = [XMLFormat, VCFFormat];
  
  for (format of formats) {
    if (format.instance.fileType == type)
      return format;
  }

  return null;
}