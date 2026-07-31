class Weapon {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-weapon');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-weapon-header');
    this.html.appendChild(this.header);

    this.name = document.createElement('div');
    this.name.classList.add('lancer-weapon-name');
    this.header.appendChild(this.name);

    this.tags = document.createElement('div');
    this.tags.classList.add('lancer-weapon-tags');
    this.header.appendChild(this.tags);

    this.damage = document.createElement('div');
    this.damage.classList.add('lancer-weapon-damage');
    this.header.appendChild(this.damage);

    this.body = document.createElement('div');
    this.body.classList.add('lancer-weapon-body');
    this.html.appendChild(this.body);

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-weapon-effect');
    this.body.appendChild(this.effect.getHTML());

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-weapon-flavor');
    this.body.appendChild(this.flavor.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-weapon-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var weapon = new Weapon();
    weapon.loadJSON(json);
    return weapon;
  }

  loadJSON(json) {
    this.json = json;

    this.attachments.loadJSON(json.attachments);

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.tags.innerHTML = '';
    var tags = [];
    if (json.cost > 0)
      tags.push(json.cost + ' SP');
    if (json.size == 1)
      tags.push('Auxiliary ');
    if (json.size == 2)
      tags.push('Main ');
    if (json.size == 3)
      tags.push('Heavy ');
    if (json.size == 4)
      tags.push('Superheavy ');
    tags[tags.length - 1] += json.type;
    appendTags(this.tags, json.tags, json.cost, tags);

    this.damage.innerHTML = '';
    json.range.forEach((range) => {
      this.damage.appendChild(document.createTextNode('['));
      var symbol = null;
      if (range.range_id == 1)
        symbol = 'D';
      if (range.range_id == 2)
        symbol = 'H';
      if (range.range_id == 3)
        symbol = 'C';
      if (range.range_id == 4)
        symbol = 'E';
      if (range.range_id == 5)
        symbol = 'F';
      if (range.range_id == 6)
        symbol = 'G';
      var symbolSpan = document.createElement('span');
      symbolSpan.classList.add('lancer-symbol');
      symbolSpan.appendChild(document.createTextNode(symbol));
      this.damage.appendChild(symbolSpan);
      this.damage.appendChild(document.createTextNode(' ' + range.value));
      this.damage.appendChild(document.createTextNode(']'));
    });
    this.damage.appendChild(document.createTextNode('['));
    json.damage.forEach((damage, index) => {
      if (index > 0)
        this.damage.appendChild(document.createTextNode(' + '));
      var dice = DiceCalc.parse(damage.value);
      this.damage.appendChild(document.createTextNode(damage.value + ' (' + dice.calcAverage() + ') '));
      damage.types.forEach((type, i) => {
        if (i > 0)
          this.damage.appendChild(document.createTextNode('/'));
        var symbol = null;
        if (type.type_id == 1)
          symbol = 'I';
        if (type.type_id == 2)
          symbol = 'J';
        if (type.type_id == 3)
          symbol = 'K';
        if (type.type_id == 4)
          symbol = 'L';
        if (type.type_id == 5)
          symbol = 'M';
        var symbolSpan = document.createElement('span');
        symbolSpan.classList.add('lancer-symbol');
        symbolSpan.appendChild(document.createTextNode(symbol));
        this.damage.appendChild(symbolSpan);
      });
    });
    this.damage.appendChild(document.createTextNode(']'));

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);

    this.flavor.setCustomContent(this.attachments);
    this.flavor.loadJSON(json.flavor);
  }

}