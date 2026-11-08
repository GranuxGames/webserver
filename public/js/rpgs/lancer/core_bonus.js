class CoreBonus {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-core-bonus');

    this.name = document.createElement('div');
    this.name.classList.add('lancer-core-bonus-name');
    this.html.appendChild(this.name);

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-core-bonus-flavor');
    this.html.appendChild(this.flavor.getHTML());

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-core-bonus-effect');
    this.html.appendChild(this.effect.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-core-bonus-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json, loadChildren = true) {
    var coreBonus = new CoreBonus();
    coreBonus.loadJSON(json, loadChildren);
    return coreBonus;
  }

  loadJSON(json, loadChildren = true) {
    this.json = json;

    this.attachments.loadJSON(json.attachments, loadChildren);

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.flavor.setCustomContent(this.attachments);
    this.flavor.loadJSON(json.flavor);

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);
  }

}