class DNDItem {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-item');

    this.image = new DNDItemImage();
    this.html.appendChild(this.image.getHTML());

    this.header = new DNDItemHeader();
    this.html.appendChild(this.header.getHTML());

    var separator = document.createElement('div');
    separator.classList.add('dnd-item-separator');
    this.html.appendChild(separator);

    this.body = new DNDItemBody();
    this.html.appendChild(this.body.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var item = new DNDItem();
    item.loadJSON(json);
    return item;
  }

  loadJSON(json) {
    this.image.loadJSON(json);
    this.header.loadJSON(json);
    this.body.loadJSON(json);
  }

}

class DNDItemImage {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-item-image-container');

    this.img = document.createElement('img');
    this.img.classList.add('dnd-item-image');
    this.html.appendChild(this.img);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    if (json.image != '')
      this.img.src = '/resources/imgs/dynamic/rpgs/dnd/items/' + json.image;
  }

}

class DNDItemHeader {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-item-header');

    this.name = document.createElement('span');
    this.name.classList.add('dnd-item-name');
    this.html.appendChild(this.name);

    this.line1 = document.createElement('div');
    this.line1.classList.add('dnd-item-header-line');
    this.html.appendChild(this.line1);

    this.type = document.createElement('span');

    this.text4 = document.createTextNode(' (');

    this.attributes = document.createElement('span');

    this.text5 = document.createTextNode(')');

    this.text1 = document.createTextNode(', ');

    this.rarity = document.createElement('span');

    this.text2 = document.createTextNode(' (requires ');

    this.requirements = document.createElement('span');

    this.text3 = document.createTextNode(')');

    this.line2 = document.createElement('div');
    this.line2.classList.add('dnd-item-header-line');
    this.html.appendChild(this.line2);

    this.price = document.createElement('span');
    this.line2.appendChild(this.price);

    this.line2.appendChild(document.createTextNode(', '));

    this.weight = document.createElement('span');
    this.line2.appendChild(this.weight);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.line1.innerHTML = '';

    this.type.innerHTML = '';
    this.type.appendChild(document.createTextNode(json.type));
    this.line1.appendChild(this.type);

    var combined = [];
    if (json.subtype.length > 0)
      combined.push(json.subtype + ((json.bonus.length > 0)?(' ' + json.bonus):('')));
    combined = combined.concat(json.attributes);
    if (combined.length > 0) {
      this.line1.appendChild(this.text4);

      this.attributes.innerHTML = '';
      this.attributes.appendChild(document.createTextNode(combined.join(', ')));
      this.line1.appendChild(this.attributes);

      if (json.bonus.length > 0)
        this.attributes.appendChild(document.createTextNode(' ' + json.bonus));

      this.line1.appendChild(this.text5);
    }
    
    this.line1.appendChild(this.text1);

    this.rarity.innerHTML = '';
    this.rarity.appendChild(document.createTextNode(json.rarity));
    this.line1.appendChild(this.rarity);

    if (json.requirements.length > 0) {
      this.line1.appendChild(this.text2);

      this.requirements.innerHTML = '';
      this.requirements.appendChild(document.createTextNode(json.requirements.join(', ')));
      this.line1.appendChild(this.requirements);

      this.line1.appendChild(this.text3);
    }

    this.price.innerHTML = '';
    this.price.appendChild(document.createTextNode(json.price));

    this.weight.innerHTML = '';
    this.weight.appendChild(document.createTextNode(json.weight));
  }

}

class DNDItemBody {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-item-body');

    this.description = new JSONText();
    this.description.getHTML().classList.add('dnd-item-description');
    this.html.appendChild(this.description.getHTML());

    this.effects = document.createElement('div');
    this.effects.classList.add('dnd-item-effects');
    this.html.appendChild(this.effects);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.description.loadJSON(json.description);

    this.effects.innerHTML = '';
    json.effects.forEach((effect) => {
      var element = new DNDItemEffect();
      element.loadJSON(effect);
      this.effects.appendChild(element.getHTML());
    });
  }

}

class DNDItemEffect {

  constructor() {
    this.text = new JSONText();
    this.text.getHTML().classList.add('dnd-item-effect');

    this.name = document.createElement('span');
    this.name.classList.add('dnd-item-effect-name');
  }

  getHTML() {
    return this.text.getHTML();
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name + ': '));

    this.text.loadJSON(json.description);

    if (this.text.getHTML().children.length <= 0) {
      this.text.getHTML().appendChild(this.name);
      return;
    }
    
    if (this.text.getHTML().firstChild.classList.contains('.json-text-line')) {
      this.text.getHTML().firstChild.firstChild.firstChild.before(this.name);
      return;
    }

    this.text.getHTML().firstChild.firstChild.before(this.name);
  }

}