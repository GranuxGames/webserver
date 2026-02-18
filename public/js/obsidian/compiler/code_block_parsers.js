class CodeBlockParsers {

  constructor() {
    this.defaultParser = new DefaultCodeBlockParser();
    this.parsers = [];
  }

  parse(container, text) {
    var lines = text.split('\n');
    var name = lines[0].substring(3);
    for (var i = 0; i < this.parsers.length; i++) {
      if (this.parsers[i].canParse(name)) {
        this.parsers[i].parse(container, text);
        return;
      }
    }
    this.defaultParser.parse(container, text);
  }

}