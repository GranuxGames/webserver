class TextParser {

  constructor() {

  }

  parse(container, text) {
    var lines = text.split('\n');
    lines.forEach((line) => {
      this.parseLine(container, line);
    });
  }

  parseLine(container, text) {
    var div = document.createElement('div');
    div.classList.add('markdown-line');
    container.appendChild(div);

    var textSpan = document.createElement('span');
    textSpan.classList.add('markdown-text');
    div.appendChild(textSpan);

    if (text.length <= 0) {
      textSpan.appendChild(document.createElement('br'));
      return;
    }

    this.parseLineSegment(textSpan, text);
  }

  parseLineSegment(container, text) {
    if (text.length <= 0)
      return;

    var parsers = [
      { regex: /(?<!\\)`.*?(?<!\\)\`/gm, func: this.parseCode.bind(this) }, // code
      { regex: /(?<!\\)\*.*?(?<!\\)\*/gm, func: this.parseItalic.bind(this) }, // italic
      { regex: /(?<!\\)_.*?(?<!\\)_/gm, func: this.parseBold.bind(this) }, // bold
      { regex: /(?<!\\)\[(?:\\\]|[^\]])*\]\([^ \)]*(?: "(?:\\"|[^"])*")?\)/gm, func: this.parseLink.bind(this) } //link
    ].map((parser) => {
      parser.match = [...text.matchAll(parser.regex)];
      if (parser.match.length > 0)
        parser.match = parser.match[0];
      else
        parser.match = null;
      return parser;
    });

    var usedParser = null;
    parsers.forEach((parser) => {
      if (parser.match == null)
        return;

      if (usedParser == null) {
        usedParser = parser;
        return;
      }

      if (parser.match.index < usedParser.match.index)
        usedParser = parser;
    });

    if (usedParser == null)
      return this.parseRawText(container, text);

    if (usedParser.match.index > 0)
      this.parseRawText(container, text.substring(0, usedParser.match.index));

    usedParser.func(container, usedParser.match[0]);

    this.parseLineSegment(container, text.substring(usedParser.match.index + usedParser.match[0].length));
  }

  parseRawText(container, text) {
    var nodes = [];
    [...text.matchAll(/\\./gm)].toReversed().forEach((match) => {
      nodes.unshift(document.createTextNode(text.substring(match.index + 1)));

      var hiddenSpan = document.createElement('span');
      hiddenSpan.classList.add('markdown-hidden');
      hiddenSpan.appendChild(document.createTextNode('\\'));
      nodes.unshift(hiddenSpan);

      text = text.substring(0, match.index);
    });
    nodes.unshift(document.createTextNode(text));

    nodes.forEach((node) => {
      container.appendChild(node);
    })
  }

  parseCode(container, text) {
    var span = document.createElement('span');
    span.classList.add('markdown-code');
    container.appendChild(span);

    var markSpan = document.createElement('span');
    markSpan.classList.add('markdown-invisible');
    markSpan.appendChild(document.createTextNode('`'));

    span.appendChild(markSpan.cloneNode(true));

    this.parseRawText(span, text.substring(1, text.length - 1));
    
    span.appendChild(markSpan.cloneNode(true));
  }

  parseBold(container, text) {
    var span = document.createElement('span');
    span.classList.add('markdown-bold');
    container.appendChild(span);

    var markSpan = document.createElement('span');
    markSpan.classList.add('markdown-hidden');
    markSpan.appendChild(document.createTextNode('_'));

    span.appendChild(markSpan.cloneNode(true));
    
    this.parseLineSegment(span, text.substring(1, text.length - 1));

    span.appendChild(markSpan.cloneNode(true));
  }

  parseItalic(container, text) {
    var span = document.createElement('span');
    span.classList.add('markdown-italic');
    container.appendChild(span);

    var markSpan = document.createElement('span');
    markSpan.classList.add('markdown-hidden');
    markSpan.appendChild(document.createTextNode('*'));

    span.appendChild(markSpan.cloneNode(true));
    
    this.parseLineSegment(span, text.substring(1, text.length - 1));

    span.appendChild(markSpan.cloneNode(true));
  }

  parseLink(container, text) {
    var matches = [...text.matchAll(/(?<!\\)\[((?:\\\]|[^\]])*)\]\(([^ \)]*)(?: "((?:\\"|[^"])*)")?\)/gm)];
    var match = matches[0];
    var data = {
      name: match[1],
      link: match[2],
      tooltip: match[3]
    };

    var span = document.createElement('span');
    span.classList.add('markdown-link');
    container.appendChild(span);

    var hiddenSpan = document.createElement('span');
    hiddenSpan.classList.add('markdown-hidden');
    
    hiddenSpan.appendChild(document.createTextNode('['));
    span.appendChild(hiddenSpan.cloneNode(true));

    var a = document.createElement('a');
    a.href = data.link;
    if (data.tooltip != null)
      a.title = data.tooltip;
    span.appendChild(a);
    a.appendChild(document.createTextNode(data.name));

    hiddenSpan.innerHTML = '';
    var text = '](' + data.link;
    if (data.tooltip != null)
      text += ' "' + data.tooltip + '"';
    text += ')';
    hiddenSpan.append(document.createTextNode(text));
    span.appendChild(hiddenSpan.cloneNode(true));
  }

}