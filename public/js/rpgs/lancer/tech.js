class Tech {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-tech');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-tech-header');
    this.html.appendChild(this.header);

    this.name = document.createElement('div');
    this.name.classList.add('lancer-tech-name');
    this.header.appendChild(this.name);

    this.tags = document.createElement('div');
    this.tags.classList.add('lancer-tech-tags');
    this.header.appendChild(this.tags);

    this.body = document.createElement('div');
    this.body.classList.add('lancer-tech-body');
    this.html.appendChild(this.body);

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-tech-effect');
    this.body.appendChild(this.effect.getHTML());

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-tech-flavor');
    this.body.appendChild(this.flavor.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-tech-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var tech = new Tech();
    tech.loadJSON(json);
    return tech;
  }

  loadJSON(json) {
    this.json = json;

    this.attachments.loadJSON(json.attachments);

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.tags.innerHTML = '';
    appendTags(this.tags, json.tags, json.cost, [], [], 'Tech');

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);

    this.flavor.setCustomContent(this.attachments);
    this.flavor.loadJSON(json.flavor);
  }

}