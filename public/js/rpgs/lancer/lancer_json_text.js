class LancerJSONText extends JSONText {

  constructor() {
    super();
    this.html.classList.add('lancer-json-text');
  }

  parseMiscTag(span, text) {
    if (text.startsWith('key:')) {
      text = text.substring(4);
      span.classList.add('lancer-json-text-keyword');
      return text;
    }
    if (text.startsWith('damage:')) {
      text = text.substring(7);
      var symbol = null;
      if (text == 'kinetic')
        symbol = 'I';
      else if (text == 'explosion')
        symbol = 'J';
      else if (text == 'energy')
        symbol = 'K';
      else if (text == 'burn')
        symbol = 'L';
      else if (text == 'heat')
        symbol = 'M';
      if (symbol != null) {
        span.classList.add('lancer-symbol');
        span.appendChild(document.createTextNode(symbol));
        return '';
      }
      span.classList.add('lancer-error');
      return '_UNKNOWN DAMAGE TYPE:' + text + '_';
    }
    if (text.startsWith('bonus:')) {
      text = text.substring(6);
      var bonus = Number.parseInt(text);
      if (Number.isNaN(bonus)) {
        span.classList.add('lancer-error');
        return '_BONUS NEEDS TO BE AN INTEGER:' + text + '_';
      }
      if (bonus == 0) {
        span.classList.add('lancer-error');
        return '_BONUS CAN NOT BE 0:' + text + '_';
      }
      span.classList.add('json-text-bold');
      span.appendChild(document.createTextNode('+' + Math.abs(bonus) + ' '));
      var symbol = document.createElement('span');
      symbol.classList.add('lancer-symbol');
      span.appendChild(symbol);
      symbol.appendChild(document.createTextNode(bonus<0?'B':'A'));
      return '';
    }
    if (text.startsWith('range:')) {
      text = text.substring(6);
      var range = Number.parseInt(text);
      if (Number.isNaN(range)) {
        span.classList.add('lancer-error');
        return '_RANGES NEEDS TO BE AN INTEGER:' + text + '_';
      }
      if (range < 0) {
        span.classList.add('lancer-error');
        return '_RANGES MUST BE POSITIVE:' + text + '_';
      }
      var symbol = document.createElement('span');
      symbol.classList.add('lancer-symbol');
      span.appendChild(symbol);
      symbol.appendChild(document.createTextNode('C'));
      if (range > 0)
        span.appendChild(document.createTextNode(' ' + range));
      span.classList.add('json-text-bold');
      return '';
    }
    if (text.startsWith('threat:')) {
      text = text.substring(7);
      var threat = Number.parseInt(text);
      if (Number.isNaN(threat)) {
        span.classList.add('lancer-error');
        return '_THREAT NEEDS TO BE AN INTEGER:' + text + '_';
      }
      if (threat < 0) {
        span.classList.add('lancer-error');
        return '_THREAT MUST BE POSITIVE:' + text + '_';
      }
      var symbol = document.createElement('span');
      symbol.classList.add('lancer-symbol');
      span.appendChild(symbol);
      symbol.appendChild(document.createTextNode('D'));
      if (threat > 0)
        span.appendChild(document.createTextNode(' ' + threat));
      span.classList.add('json-text-bold');
      return '';
    }
    if (text.startsWith('line:')) {
      text = text.substring(5);
      var line = Number.parseInt(text);
      if (Number.isNaN(line)) {
        span.classList.add('lancer-error');
        return '_LINE NEEDS TO BE AN INTEGER:' + text + '_';
      }
      if (line < 0) {
        span.classList.add('lancer-error');
        return '_LINE MUST BE POSITIVE:' + text + '_';
      }
      var symbol = document.createElement('span');
      symbol.classList.add('lancer-symbol');
      span.appendChild(symbol);
      symbol.appendChild(document.createTextNode('E'));
      if (line > 0)
        span.appendChild(document.createTextNode(' ' + line));
      span.classList.add('json-text-bold');
      return '';
    }
    if (text.startsWith('cone:')) {
      text = text.substring(5);
      var cone = Number.parseInt(text);
      if (Number.isNaN(cone)) {
        span.classList.add('lancer-error');
        return '_CONE NEEDS TO BE AN INTEGER:' + text + '_';
      }
      if (cone < 0) {
        span.classList.add('lancer-error');
        return '_CONE MUST BE POSITIVE:' + text + '_';
      }
      var symbol = document.createElement('span');
      symbol.classList.add('lancer-symbol');
      span.appendChild(symbol);
      symbol.appendChild(document.createTextNode('F'));
      if (cone > 0)
        span.appendChild(document.createTextNode(' ' + cone));
      span.classList.add('json-text-bold');
      return '';
    }
    if (text.startsWith('blast:')) {
      text = text.substring(6);
      var blast = Number.parseInt(text);
      if (Number.isNaN(blast)) {
        span.classList.add('lancer-error');
        return '_BLAST NEEDS TO BE AN INTEGER:' + text + '_';
      }
      if (blast < 0) {
        span.classList.add('lancer-error');
        return '_BLAST MUST BE POSITIVE:' + text + '_';
      }
      var symbol = document.createElement('span');
      symbol.classList.add('lancer-symbol');
      span.appendChild(symbol);
      symbol.appendChild(document.createTextNode('G'));
      if (blast > 0)
        span.appendChild(document.createTextNode(' ' + blast));
      span.classList.add('json-text-bold');
      return '';
    }
    if (text.startsWith('burst:')) {
      text = text.substring(6);
      var burst = Number.parseInt(text);
      if (Number.isNaN(burst)) {
        span.classList.add('lancer-error');
        return '_BURST NEEDS TO BE AN INTEGER:' + text + '_';
      }
      if (burst < 0) {
        span.classList.add('lancer-error');
        return '_BURST MUST BE POSITIVE:' + text + '_';
      }
      var symbol = document.createElement('span');
      symbol.classList.add('lancer-symbol');
      span.appendChild(symbol);
      symbol.appendChild(document.createTextNode('H'));
      if (burst > 0)
        span.appendChild(document.createTextNode(' ' + burst));
      span.classList.add('json-text-bold');
      return '';
    }

    var parts = text.split(':');
    if (parts.length == 2) {
      var id = Number.parseInt(parts[1]);
      if (!Number.isNaN(id)) {
        var type = parts[0];
        for (var attachment of this.customContent.attachments) {
          if (attachment.json.element_type == type && attachment.json.id == id) {
            span.addEventListener('click', () => {
              attachment.getHTML().scrollIntoView({ behavior: "smooth", block: 'nearest' });
            });
            span.classList.add('lancer-attachment-link');
            return '_' + attachment.json.name + '_';
          }
        }
      }
    }

    span.classList.add('lancer-error');
    return '_UNRECOGNIZED TAG "' + text + '"_';
  }

  parseMiscElement(container, element) {
    for (var attachment of this.customContent.attachments) {
      if (attachment.json.element_type == element.type && attachment.json.id == element.id) {
        attachment.getHTML().classList.add('lancer-inline-element');
        container.appendChild(attachment.getHTML());
        return;
      }
    }
  }

}