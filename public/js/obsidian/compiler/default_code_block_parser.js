class DefaultCodeBlockParser extends CodeBlockParser {

  constructor() {
    super('*');
  }

  parse(container, text) {
    var lines = text.split('\n');

    var startLine = document.createElement('div');
    startLine.classList.add('markdown-line');
    container.appendChild(startLine);

    var startSpan = document.createElement('span');
    startSpan.classList.add('markdown-code-block');
    startSpan.classList.add('markdown-text');
    startSpan.classList.add('markdown-code-block-outer');
    startLine.appendChild(startSpan);

    var ticks = document.createElement('span');
    ticks.classList.add('markdown-code-block-ticks');
    ticks.classList.add('markdown-invisible');
    ticks.appendChild(document.createTextNode('```'));

    startSpan.appendChild(ticks.cloneNode(true));

    var name = document.createElement('span');
    name.classList.add('markdown-code-block-name');
    startSpan.appendChild(name);

    name.appendChild(document.createTextNode(lines[0].substring(3)));

    for (var i = 1; i < lines.length - 1; i++) {
      var line = document.createElement('div');
      line.classList.add('markdown-line');
      container.appendChild(line);
      
      var lineSpan = document.createElement('span');
      lineSpan.classList.add('markdown-code-block');
      lineSpan.classList.add('markdown-text');
      line.appendChild(lineSpan);

      if (lines[i].length <= 0)
        lineSpan.appendChild(document.createElement('br'));
      else
        lineSpan.appendChild(document.createTextNode(lines[i]));
    }

    var endLine = document.createElement('div');
    endLine.classList.add('markdown-line');
    container.appendChild(endLine);

    var endSpan = document.createElement('span');
    endSpan.classList.add('markdown-code-block');
    endSpan.classList.add('markdown-text');
    endSpan.classList.add('markdown-code-block-outer');
    endLine.appendChild(endSpan);

    endSpan.appendChild(ticks.cloneNode(true));
  }

  canParse(name) {
    return true;
  }

}