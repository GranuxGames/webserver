class QuickAction {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-quick-action');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-quick-action-header');
    this.html.appendChild(this.header);

    this.name = document.createElement('div');
    this.name.classList.add('lancer-quick-action-name');
    this.header.appendChild(this.name);

    this.type = document.createElement('div');
    this.type.classList.add('lancer-quick-action-type');
    this.header.appendChild(this.type);
    this.type.appendChild(document.createTextNode('Quick Action'));

    this.body = document.createElement('div');
    this.body.classList.add('lancer-quick-action-body');
    this.html.appendChild(this.body);

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-quick-action-effect');
    this.body.appendChild(this.effect.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-quick-action-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var quickAction = new QuickAction();
    quickAction.loadJSON(json);
    return quickAction;
  }

  loadJSON(json) {
    this.json = json;

    this.attachments.loadJSON(json.attachments);

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));
    
    this.type.innerHTML = '';
    appendTags(this.type, json.tags, json.cost, ['Quick Action']);

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);
  }

}