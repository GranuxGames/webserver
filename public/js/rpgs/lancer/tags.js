function appendTags(container, tags, costs, start = [], end = [], actionCostName = 'Action') {
  var first = true;

  start.forEach((element) => {
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

  tags.forEach((tag) => {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(tag.type));
    if (tag.value != 0)
      container.appendChild(document.createTextNode(' ' + tag.value));
    first = false;
  })

  if (costs['heat'] != null) {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(costs['heat'].value + ' '));
    var symbol = document.createElement('span');
    symbol.classList.add('lancer-symbol');
    container.appendChild(symbol);
    symbol.appendChild('M');
    container.appendChild(document.createTextNode(' (Self)'));
    first = false;
  }
  if (costs['action'] != null) {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(costs['action'].value.charAt(0).toUpperCase() + costs['action'].value.slice(1) + ' ' + actionCostName));
    first = false;
  }

  end.forEach((element) => {
    if (!first)
      container.appendChild(document.createTextNode(', '));
    container.appendChild(document.createTextNode(element));
    first = false;
  });
}