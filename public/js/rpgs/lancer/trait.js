class Trait {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-trait');

    this.name = document.createElement('div');
    this.name.classList.add('lancer-trait-name');
    this.html.appendChild(this.name);

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-trait-effect');
    this.html.appendChild(this.effect.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-trait-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var trait = new Trait();
    trait.loadJSON(json);
    return trait;
  }

  loadJSON(json) {
    this.json = json;

    this.attachments.loadJSON(json.attachments);

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);
  }

}