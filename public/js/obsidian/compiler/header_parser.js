class HeaderParser {

  constructor() {

  }

  parse(container, text) {
    var div = document.createElement('div');
    div.classList.add('markdown-line');
    container.appendChild(div);

    var reg = /^#+ /gm;
    var matches = [...text.matchAll(reg)];

    var span = document.createElement('span');
    span.classList.add('markdown-header');
    span.classList.add('markdown-header-' + (matches[0][0].length - 1));
    span.classList.add('markdown-text');
    div.appendChild(span);

    var initialSpan = document.createElement('span');
    initialSpan.classList.add('markdown-hidden');
    initialSpan.classList.add('markdown-header-initial');
    span.appendChild(initialSpan);

    initialSpan.appendChild(document.createTextNode(matches[0][0]));

    var textSpan = document.createElement('span');
    span.appendChild(textSpan);

    textSpan.appendChild(document.createTextNode(text.substring(matches[0][0].length)));
  }

}