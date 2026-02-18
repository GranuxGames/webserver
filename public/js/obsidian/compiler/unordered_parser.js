class UnorderedParser {

  constructor() {

  }

  parse(container, text) {
    var lines = text.split('\n');

    var blocks = [];
    lines.forEach((line) => {
      var numLineReg = /^- /g;
      var matches = [...line.matchAll(numLineReg)];
      if (matches.length > 0) {
        blocks.push({
          lines: [line.substring(matches[0][0].length)]
        });
      } else {
        blocks[blocks.length - 1].lines.push(line.substring(1));
      }
    });

    blocks.forEach((block) => {
      var subContainer = document.createElement('div');
      markdownParser.parse(subContainer, block.lines.join('\n'));

      [...subContainer.children].forEach((child, index) => {
        child.style.setProperty('--indent',
          Number.parseInt(child.style.getPropertyValue('--indent') | '0') + 1);
        
        var initialSpan = document.createElement('span');
        initialSpan.classList.add('markdown-unordered');
        if (index == 0) {
          initialSpan.classList.add('markdown-unordered-point');
          initialSpan.classList.add('markdown-invisible');
          initialSpan.appendChild(document.createTextNode('- '));
        } else {
          initialSpan.classList.add('markdown-unordered-tab');
          initialSpan.appendChild(document.createTextNode('\t'));
        }

        if (child.firstChild == null)
          child.appendChild(initialSpan);
        else
          child.firstChild.before(initialSpan);
        container.appendChild(child);
      });
    });
  }

}