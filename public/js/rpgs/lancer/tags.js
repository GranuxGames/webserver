function appendTags(container, tags, costs, inputOptions = {}) {
  var first = true;

  options = {
    start: [],
    end: [],
    actionCostName: 'Action',
    beforeTags: [],
    afterTags: []
  };
  Object.entries(inputOptions).forEach(([key, value]) => {
    options[key] = value;
  });

  options.start.forEach((element) => {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(element));
    first = false;
  });

  if (costs['sp'] != null) {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(costs['sp'].value + ' SP'));
    first = false;
  }

  options.beforeTags.forEach((element) => {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(element));
    first = false;
  });

  tags.forEach((tag) => {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(tag.type));
    if (tag.value != 0)
      container.appendChild(document.createTextNode(' ' + tag.value));
    first = false;
  })

  options.afterTags.forEach((element) => {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(element));
    first = false;
  });

  if (costs['heat'] != null) {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(costs['heat'].value + ' '));
    var symbol = document.createElement('span');
    symbol.classList.add('lancer-symbol');
    container.appendChild(symbol);
    symbol.appendChild(document.createTextNode('M'));
    container.appendChild(document.createTextNode(' (Self)'));
    first = false;
  }
  if (costs['action'] != null) {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(costs['action'].value.charAt(0).toUpperCase() + costs['action'].value.slice(1) + ' ' + options.actionCostName));
    first = false;
  }

  options.end.forEach((element) => {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(element));
    first = false;
  });
}