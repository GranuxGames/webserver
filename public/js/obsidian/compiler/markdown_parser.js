class MarkdownParser {

  constructor() {
    this.codeBlockParsers = new CodeBlockParsers();
    this.blockQuoteParser = new BlockQuoteParser();
    this.orderedParser = new OrderedParser();
    this.tasksParser = new TasksParser();
    this.unorderedParser = new UnorderedParser();
    this.imageParser = new ImageParser();
    this.headerParser = new HeaderParser();
    this.textParser = new TextParser();
  }

  parse(container, text) {
    container.innerHTML = '';
    this.parseMarkdown(container, text);
    this.setCSSChildNumber(container);
  }

  setCSSChildNumber(container) {
    [...container.children].forEach((child) => {
      child.style.setProperty('--child-number', [...container.children].indexOf(child) + 1);
      this.setCSSChildNumber(child);
    });
  }

  parseMarkdown(container, text) {
    if (this.parseCodeBlocks(container, text))
      return;

    if (this.parseBlockQuotes(container, text))
      return;

    if (this.parseOrdered(container, text))
      return;

    if (this.parseTasks(container, text))
      return;

    if (this.parseUnordered(container, text))
      return;

    if (this.parseImages(container, text))
      return;

    if (this.parseHeaders(container, text))
      return;

    this.textParser.parse(container, text);
  }

  parseCodeBlocks(container, text) {
    var regex = /^```([^ \n]*)\n(?:.*\n)*^```$\n?/gm;
    return this.parseRegex(container, text, regex, this.codeBlockParsers);
  }

  parseBlockQuotes(container, text) {
    var regex = /(?:^> .*\n?)+/gm;
    return this.parseRegex(container, text, regex, this.blockQuoteParser);
  }

  parseOrdered(container, text) {
    var regex = /(?:^[0-9]+\. .*\n?(?:^\t.*\n?)*)+/gm;
    return this.parseRegex(container, text, regex, this.orderedParser);
  }

  parseTasks(container, text) {
    var regex = /(?:^- \[(?:x| )\] .*\n?(?:^\t.*\n?)*)+/gm;
    return this.parseRegex(container, text, regex, this.tasksParser);
  }

  parseUnordered(container, text) {
    var regex = /(?:^- .*\n?(?:^\t.*\n?)*)+/gm;
    return this.parseRegex(container, text, regex, this.unorderedParser);
  }

  parseImages(container, text) {
    var regex = /(?:^!\[[^\]\n]*\]\([^ \n]*(?: \"[^\n]*\")?\)$\n?)|(?:^\[!\[[^\]\n]*\]\([^ \n]*(?: \"[^\n]*\")?\)\]\([^\n]*\)$\n?)/gm;
    return this.parseRegex(container, text, regex, this.imageParser);
  }

  parseHeaders(container, text) {
    var regex = /^#{1,6} .*$\n?/gm;
    return this.parseRegex(container, text, regex, this.headerParser);
  }

  parseRegex(container, text, regex, parser) {
    var matches = [...text.matchAll(regex)];
    if (matches.length <= 0)
      return false;

    var startIndex = 0;
    matches.forEach((match) => {
      var segment = text.substring(startIndex, match.index);
      startIndex = match.index + match[0].length;
      if (segment.length > 0)
        this.parseMarkdown(container, segment.substring(0, segment.length - 1));
      if (match[0].endsWith('\n'))
        match[0] = match[0].substring(0, match[0].length - 1);
      parser.parse(container, match[0]);
    });
    if (startIndex < text.length)
      this.parseMarkdown(container, text.substring(startIndex));

    return true;
  }

}