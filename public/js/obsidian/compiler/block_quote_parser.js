class BlockQuoteParser {

  constructor() {

  }

  parse(container, text) {
    var lines = text.split('\n');

    var subLines = lines.map((line) => {
      return line.substring(2);
    });

    var subContainer = document.createElement('div');
    markdownParser.parse(subContainer, subLines.join('\n'));

    [...subContainer.children].forEach((child) => {
      child.style.setProperty('--indent',
        Number.parseInt(child.style.getPropertyValue('--indent') | '0') + 1);
      var blockQuoteSpan = document.createElement('span');
      blockQuoteSpan.classList.add('markdown-block-quote');
      blockQuoteSpan.classList.add('markdown-invisible');

      blockQuoteSpan.appendChild(document.createTextNode('> '));

      if (child.firstChild == null)
        child.appendChild(blockQuoteSpan);
      else
        child.firstChild.before(blockQuoteSpan);
      container.appendChild(child);
    });
  }

}