class FullAction {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-full-action');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-full-action-header');
    this.html.appendChild(this.header);

    this.name = document.createElement('div');
    this.name.classList.add('lancer-full-action-name');
    this.header.appendChild(this.name);

    this.type = document.createElement('div');
    this.type.classList.add('lancer-full-action-type');
    this.header.appendChild(this.type);
    this.type.appendChild(document.createTextNode('Full Action'));

    this.body = document.createElement('div');
    this.body.classList.add('lancer-full-action-body');
    this.html.appendChild(this.body);

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-full-action-effect');
    this.body.appendChild(this.effect.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-full-action-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json, loadChildren = true) {
    var fullAction = new FullAction();
    fullAction.loadJSON(json, loadChildren);
    return fullAction;
  }

  loadJSON(json, loadChildren = true) {
    this.json = json;

    this.attachments.loadJSON(json.attachments, loadChildren);

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));
    
    this.type.innerHTML = '';
    appendTags(this.type, json.tags, json.cost, { start: ['Full Action'] });

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);
  }

}