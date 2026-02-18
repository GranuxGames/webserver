var caretChangeLock = false;

// gets fired when basically anything happens in the container (since dropping)
// elements is already disabled
function onCaretChange(container) {
  // lock caret so event doesn't fire on caret calculation
  if (caretChangeLock)
    return;
  caretChangeLock = true;

  if (!container.getAttribute('contenteditable') || container.getAttribute('contenteditable') == null)
    return unlockCaret();

  // calculate caret position
  var caret = getCaret(container);
  // return if caret is not in container
  if (caret.start < 0 || caret.end < 0)
    return unlockCaret();

  rebuildMarkdown(container, caret);

  return unlockCaret();
}

function getText(container) {
  var oldSelection = { startNode: window.getSelection().anchorNode,
                       startOffset: window.getSelection().anchorOffset,
                       endNode: window.getSelection().focusNode,
                       endOffset: window.getSelection().focusOffset };
  var range = document.createRange();
  range.selectNodeContents(container);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  toggleHiddenMarkdown(container);
  var text = window.getSelection().toString();
  
  window.getSelection().setBaseAndExtent(oldSelection.startNode,
                                         oldSelection.startOffset,
                                         oldSelection.endNode,
                                         oldSelection.endOffset);
  toggleHiddenMarkdown(container);
  return text;
}

function getTextNodes(container) {
  var children = [];
  var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  while(walker.nextNode()) {
    children.push(walker.currentNode);
  }
  return children;
}

var markdownParser = new MarkdownParser();

function rebuildMarkdown(container, caret, force) {
  if ((!container.getAttribute('contenteditable') || container.getAttribute('contenteditable') == null) && !force)
    return;

  var scrollBefore = container.scrollTop;

  imgToText(container);
  var text = getText(container);
  markdownParser.parse(container, text);

  if (!container.getAttribute('contenteditable') || container.getAttribute('contenteditable') == null) {
    textToImg(container);
    return;
  }

  if (caret.start < 0 || caret.end < 0) {
    window.getSelection().removeAllRanges();
    toggleHiddenMarkdown(container);
    return;
  }

  var range = document.createRange();
  range.selectNodeContents(container);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  toggleHiddenMarkdown(container);

  var lines = container.querySelectorAll('.markdown-line');
  var startNode = null;
  var startOffset = 0;
  var endNode = null;
  var endOffset = 0;
  var currentCaret = 0;

  lines.forEach((line) => {
    var textNodes = getTextNodes(line);
    
    if (textNodes.length <= 0) {
      var br = line.querySelector('br');

      if (currentCaret == caret.start) {
        startNode = br;
        startOffset = 0;
      }
      if (currentCaret == caret.end) {
        endNode = br;
        endOffset = 0;
      }

      currentCaret++;
      return;
    }

    for (var i = 0; i < textNodes.length; i++) {
      if (caret.start >= currentCaret && caret.start <= currentCaret + textNodes[i].textContent.length) {
        startNode = textNodes[i];
        startOffset = caret.start - currentCaret;
      }
      if (caret.end >= currentCaret && caret.end <= currentCaret + textNodes[i].textContent.length) {
        endNode = textNodes[i];
        endOffset = caret.end - currentCaret;
      }
      currentCaret += textNodes[i].textContent.length;
    }
    currentCaret++;
  });
  window.getSelection().setBaseAndExtent(startNode, startOffset,
                                         endNode, endOffset);
  toggleHiddenMarkdown(container);
  container.scrollTo(0, scrollBefore);
}

function unlockCaret() {
  setTimeout(() => {
    caretChangeLock = false;
  }, 0);
}

function getCaret(container) {
  var sel = window.getSelection();
  if (sel == null || sel.rangeCount == 0)
    return { start: -1, end: -1 };
  var range = sel.getRangeAt(0);
  if (range.commonAncestorContainer != container && !container.contains(range.commonAncestorContainer))
    return { start: -1, end: -1 };

  var oldSelection = { startNode: window.getSelection().anchorNode,
                       startOffset: window.getSelection().anchorOffset,
                       endNode: window.getSelection().focusNode,
                       endOffset: window.getSelection().focusOffset };
  window.getSelection().setBaseAndExtent(container,
                                         0,
                                         oldSelection.startNode,
                                         oldSelection.startOffset);
  toggleHiddenMarkdown(container);
  var startOffset = window.getSelection().toString().length;
  window.getSelection().setBaseAndExtent(container,
                                         0,
                                         oldSelection.endNode,
                                         oldSelection.endOffset);
  toggleHiddenMarkdown(container);
  var endOffset = window.getSelection().toString().length;
  window.getSelection().setBaseAndExtent(oldSelection.startNode,
                                         oldSelection.startOffset,
                                         oldSelection.endNode,
                                         oldSelection.endOffset);
  toggleHiddenMarkdown(container);
  
  return { start: startOffset, end: endOffset };
}

window.addEventListener('load', () => {
  document.querySelectorAll('.markdown-container').forEach((markdownContainer) => {
    rebuildMarkdown(markdownContainer, { start: -1, end: -1 }, true);

    markdownContainer.addEventListener('paste', (e) => {
      e.preventDefault();

      if (caretChangeLock)
        return;
      caretChangeLock = true;

      var clipboard = e.clipboardData.getData('text/plain')
                                     .replaceAll('\r', '');

      var caret = getCaret(markdownContainer);
      var text = getText(markdownContainer);

      var caretFirst = Math.min(caret.start, caret.end);
      var caretLast = Math.max(caret.start, caret.end);
      text = text.substring(0, caretFirst) + clipboard + text.substring(caretLast);
      markdownContainer.innerHTML = '';
      text.split('\n').forEach((line) => {
        var div = document.createElement('div');
        if (line.length <= 0)
          div.appendChild(document.createElement('br'));
        else
          div.appendChild(document.createTextNode(line));
        markdownContainer.appendChild(div);
      });
      caret = { start: caretFirst + clipboard.length,
                end: caretFirst + clipboard.length };
      rebuildMarkdown(markdownContainer, caret);

      return unlockCaret();
    });

    markdownContainer.addEventListener('drop', (e) => {
      e.preventDefault();
    });
    
    document.addEventListener('selectionchange', (e) => {
      onCaretChange(markdownContainer);
    });
  });
});

function getLineFromChild(node) {
  while (node != null) {
    if (node.classList.contains('markdown-line'))
      return node;
    node = node.parentElement;
  }
  return null;
}

function textToImg(container) {
  container.querySelectorAll('.markdown-image-text').forEach((n) => {
    var data = {
      name: n.getAttribute('name'),
      img_link: n.getAttribute('src'),
      tooltip: n.getAttribute('tooltip'),
      link: n.getAttribute('link')
    };

    var img = document.createElement('img');
    img.src = data.img_link;
    img.classList.add('markdown-image');
    img.setAttribute('name', data.name);

    if (data.tooltip != null)
      img.title = data.tooltip;
    if (data.link != null) {
      img.setAttribute('link', data.link);
      img.classList.add('markdown-image-link');
      img.addEventListener('click', (e) => {
        window.location.href = data.link;
      });
    }

    n.before(img);
    n.parentElement.removeChild(n);
  });
}

function imgToText(container) {
  container.querySelectorAll('.markdown-image').forEach((n) => {
    var data = {
      name: n.getAttribute('name'),
      img_link: n.getAttribute('src'),
      tooltip: n.getAttribute('title'),
      link: n.getAttribute('link')
    };

    var span = document.createElement('span');
    span.setAttribute('src', data.img_link);
    span.setAttribute('name', data.name);
    if (data.tooltip != null)
      span.setAttribute('tooltip', data.tooltip);
    if (data.link != null)
      span.setAttribute('link', data.link);
    span.classList.add('markdown-image-text');
    line.appendChild(span);

    var text = '![' + data.name +'](' + data.img_link;
    if (data.tooltip != null) {
      text += ' "' + data.tooltip + '"';
    }
    text += ')';
    if (data.link != null) {
      text = '[' + text + '](' + data.link + ')';
    }

    span.appendChild(document.createTextNode(text));

    n.before(span);
    n.parentElement.removeChild(n);
  });
}

function toggleHiddenMarkdown(container) {
  var selection = window.getSelection();
  if (selection.rangeCount <= 0)
    return;
  var range = selection.getRangeAt(0);

  var nodes = getNodesInSelection(container, range.startContainer,
                                  range.endContainer).nodes.filter((node) => {
    return node.classList != null && node.classList.contains('markdown-line');
  });
  nodes = nodes.filter((node, index) => {
    return index == nodes.indexOf(node);
  });

  var additionalNodes = [];
  nodes.forEach((node) => {
    if (node.querySelector('.markdown-code-block') != null) {
      var n = node.previousSibling;
      while (n != null && n.querySelector('.markdown-code-block') != null) {
        if (!additionalNodes.includes(n) && !nodes.includes(n))
          additionalNodes.push(n);
        n = n.previousSibling;
      }
      n = node.nextSibling;
      while (n != null && n.querySelector('.markdown-code-block') != null) {
        if (!additionalNodes.includes(n) && !nodes.includes(n))
          additionalNodes.push(n);
        n = n.nextSibling;
      }
    }
  });
  nodes = nodes.concat(additionalNodes);

  var alreadyDone = [];
  // reset hidden
  container.querySelectorAll('.markdown-hidden-disabled').forEach((node) => {
    if (nodes.includes(getLineFromChild(node))) {
      alreadyDone.push(getLineFromChild(node));
      return;
    }

    node.classList.remove('markdown-hidden-disabled');
    node.classList.add('markdown-hidden');
  });
  // reset invisible
  container.querySelectorAll('.markdown-invisible-disabled').forEach((node) => {
    if (nodes.includes(getLineFromChild(node))) {
      alreadyDone.push(getLineFromChild(node));
      return;
    }
    
    node.classList.remove('markdown-invisible-disabled');
    node.classList.add('markdown-invisible');
  });

  nodes.forEach((node) => {
    if (alreadyDone.includes(node))
      return;

    // disable hidden
    node.querySelectorAll('.markdown-hidden').forEach((n) => {
      n.classList.remove('markdown-hidden');
      n.classList.add('markdown-hidden-disabled');
    });
    // disable invisible
    node.querySelectorAll('.markdown-invisible').forEach((n) => {
      n.classList.remove('markdown-invisible');
      n.classList.add('markdown-invisible-disabled');
    });
  });
}

function getNodesInSelection(node, startNode, endNode, started = false, ended = false) {
  var output = {
    started: started,
    ended: ended,
    nodes: []
  };

  if (node == startNode)
    output.started = true;

  if (output.started)
    output.nodes.push(node);

  var children = [...node.childNodes];
  for (var i = 0; i < children.length; i++) {
    var childOutput = getNodesInSelection(children[i], startNode, endNode, output.started, output.ended);
    output.nodes = output.nodes.concat(childOutput.nodes);
    output.started = childOutput.started;
    output.ended = childOutput.ended;

    if (output.ended)
      break;
  }
  
  if (!started && output.started)
    output.nodes.unshift(node);

  if (node == endNode)
    output.ended = true;

  return output;
}