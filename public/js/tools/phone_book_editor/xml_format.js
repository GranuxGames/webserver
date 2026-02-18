class XMLFormat extends FileFormat {

  static instance = new XMLFormat();

  constructor() {
    super('text/xml');
  }

  async parse(text) {
    console.log('xml');
    return null;
  }

}