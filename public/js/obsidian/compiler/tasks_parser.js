class TasksParser {

  constructor() {

  }

  parse(container, text) {
    var lines = text.split('\n');

    var blocks = [];
    lines.forEach((line) => {
      var taskLineReg = /^- \[(x| )\] /g;
      var matches = [...line.matchAll(taskLineReg)];
      if (matches.length > 0) {
        blocks.push({
          check: (matches[0][1] == 'x'),
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
        initialSpan.classList.add('markdown-task');
        if (index == 0) {
          initialSpan.classList.add('markdown-task-checkmark');
          initialSpan.classList.add('markdown-invisible');
          if (block.check)
            initialSpan.classList.add('markdown-task-checked');
          initialSpan.addEventListener('click', (e) => {
            e.preventDefault();
            if (initialSpan.classList.contains('markdown-task-checked')) {
              initialSpan.classList.remove('markdown-task-checked');
              initialSpan.innerHTML = '';
              initialSpan.appendChild(document.createTextNode('- [ ] '));
            } else {
              initialSpan.classList.add('markdown-task-checked');
              initialSpan.innerHTML = '';
              initialSpan.appendChild(document.createTextNode('- [x] '));
            }
          });
          initialSpan.appendChild(document.createTextNode('- [' + (block.check?'x':' ') + '] '));
        } else {
          initialSpan.classList.add('markdown-task-tab');
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