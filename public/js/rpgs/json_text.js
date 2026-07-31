class JSONText {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('json-text');
    this.customContent = {};
  }

  createNewJSONText() {
    return new this.constructor();
  }

  getHTML() {
    return this.html;
  }

  setCustomContent(customContent) {
    this.customContent = customContent;
  }

  parseMiscTag(container, text) {
    return text;
  }

  parseMiscElement(container, element) {}

  loadJSON(json) {
    this.html.innerHTML = '';

    this.parseElements(this.html, json);
  }

  parseElements(container, elements) {
    elements.forEach((element) => {
      if (typeof element == 'string')
        return this.parseParagraph(container, element);
      if (element.type == 'table')
        return this.parseTable(container, element);
      if (element.type == 'unordered')
        return this.parseUnordered(container, element);
      this.parseMiscElement(container, element);
    });
  }

  parseUnordered(container, element) {
    element.rows.forEach((row) => {
      var rowElement = document.createElement('div');
      rowElement.classList.add('json-text-unordered-element');
      container.appendChild(rowElement);

      var text = this.createNewJSONText();
      text.setCustomContent(this.customContent);
      text.loadJSON(row);
      rowElement.appendChild(text.getHTML());
    });
  }

  parseTable(container, element) {
    var name = document.createElement('div');
    name.classList.add('json-text-table-name');
    container.appendChild(name);
    name.appendChild(document.createTextNode(element.name));

    var table = document.createElement('table');
    table.classList.add('json-text-table');
    container.appendChild(table);

    element.rows.forEach((row) => {
      var rowElement = document.createElement('tr');
      rowElement.classList.add('json-text-table-row');
      table.appendChild(rowElement);

      row.forEach((cell, i) => {
        var cellElement = document.createElement('td');
        cellElement.classList.add('json-text-table-cell');
        cellElement.classList.add('json-text-table-' + element.alignment[i] + '-adjust');
        rowElement.appendChild(cellElement);

        var text = this.createNewJSONText();
        text.setCustomContent(this.customContent);
        text.loadJSON(cell);
        cellElement.appendChild(text.getHTML());
      });
    });
  }

  parseParagraph(container, line) {
    var div = document.createElement('div');
    div.classList.add('json-text-line');
    container.appendChild(div);

    if (line.length <= 0)
      return div.appendChild(document.createElement('br'));

    this.parseText(div, line);
  }

  parseText(container, line) {
    if (line.length <= 0)
      return;

    var textParser = [
      { regex: /(?<!\\)\*(?:\\\*|[^\*])*(?<!\\)\*/gm, parser: this.parseItalic.bind(this) }, // italic
      { regex: /(?<!\\)_(?:\\_|[^_])*(?<!\\)_/gm, parser: this.parseBold.bind(this) }, // bold
      { regex: /(?<!\\)\$(?:\\\$|[^\$])*(?<!\\)\$/gm, parser: this.parseDice.bind(this) }, // dice
      { regex: /(?<!\\)\[(?:\\\]|[^\]])*(?<!\\)\]\((?:\\\)|[^\)])*(?<!\\)\)/gm, parser: this.parseLink.bind(this) }, // links
      { regex: /(?<!\\)\§(?:\\\§|[^\§])*(?<!\\)\§/gm, parser: this.parseCustomTag.bind(this) }, // dice
    ].map((parser) => {
      parser.match = [...line.matchAll(parser.regex)];
      if (parser.match.length <= 0)
        parser.match = null;
      else
        parser.match = parser.match[0];
      return parser;
    }).filter((parser) => {
      return parser.match != null;
    }).toSorted((a, b) => {
      return a.match.index - b.match.index;
    });

    if (textParser.length <= 0)
      return this.parseString(container, line);

    var parser = textParser[0];

    var textBefore = line.substring(0, parser.match.index);
    if (textBefore.length > 0)
      this.parseString(container, textBefore);

    parser.parser(container, parser.match[0]);

    this.parseText(container, line.substring(parser.match.index + parser.match[0].length));
  }

  parseCustomTag(container, text) {
    var span = document.createElement('span');
    span.classList.add('json-text-custom');
    container.appendChild(span);

    text = text.substring(1, text.length - 1);
    text = this.parseMiscTag(span, text);

    this.parseText(span, text);
  }

  parseString(container, text) {
    var startIndex = 0;
    [...text.matchAll(/\\./gm)].forEach((match) => {
      if (startIndex != match.index)
        container.appendChild(document.createTextNode(text.substring(startIndex, match.index - startIndex)));

      startIndex = match.index + 1;
    });
    container.appendChild(document.createTextNode(text.substring(startIndex)));
  }

  parseLink(container, text) {
    var parts = [...text.matchAll(/^\[((?:\\\]|[^\]])*)(?<!\\)\]\(((?:\\\)|[^\)])*)(?<!\\)\)$/gm)][0];
    var a = document.createElement('a');
    a.classList.add('json-text-link');
    container.appendChild(a);
    a.href = parts[2];

    this.parseText(a, parts[1]);
  }

  parseItalic(container, text) {
    var span = document.createElement('span');
    span.classList.add('json-text-italic');
    container.appendChild(span);

    this.parseText(span, text.substring(1, text.length - 1));
  }

  parseBold(container, text) {
    var span = document.createElement('span');
    span.classList.add('json-text-bold');
    container.appendChild(span);

    this.parseText(span, text.substring(1, text.length - 1));
  }

  parseDice(container, text) {
    var span = document.createElement('span');
    span.classList.add('json-text-dice');
    container.appendChild(span);

    var diceString = text.substring(1, text.length - 1);
    var dice = DiceCalc.parse(diceString);
    span.appendChild(document.createTextNode(diceString + ' (' + dice.calcAverage() + ')'));
  }

}