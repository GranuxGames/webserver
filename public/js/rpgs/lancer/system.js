class System {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-system');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-system-header');
    this.html.appendChild(this.header);

    this.name = document.createElement('div');
    this.name.classList.add('lancer-system-name');
    this.header.appendChild(this.name);

    this.tags = document.createElement('div');
    this.tags.classList.add('lancer-system-tags');
    this.header.appendChild(this.tags);

    this.body = document.createElement('div');
    this.body.classList.add('lancer-system-body');
    this.html.appendChild(this.body);

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-system-effect');
    this.body.appendChild(this.effect.getHTML());

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-system-flavor');
    this.body.appendChild(this.flavor.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-system-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var system = new System();
    system.loadJSON(json);
    return system;
  }

  loadJSON(json) {
    this.json = json;

    this.attachments.loadJSON(json.attachments);

    this.html.classList.forEach((className) => {
      if (className.startsWith('lancer-system-'))
        this.html.classList.remove(className);
    });
    this.html.classList.add('lancer-system-' + json.type.toLowerCase());

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.tags.innerHTML = '';
    appendTags(this.tags, json.tags, json.cost);

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);

    this.flavor.setCustomContent(this.attachments);
    this.flavor.loadJSON(json.flavor);
  }

}