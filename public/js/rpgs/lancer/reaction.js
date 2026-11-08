class Reaction {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-reaction');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-reaction-header');
    this.html.appendChild(this.header);

    this.name = document.createElement('div');
    this.name.classList.add('lancer-reaction-name');
    this.header.appendChild(this.name);

    this.type = document.createElement('div');
    this.type.classList.add('lancer-reaction-type');
    this.header.appendChild(this.type);

    this.body = document.createElement('div');
    this.body.classList.add('lancer-reaction-body');
    this.html.appendChild(this.body);

    this.trigger = new LancerJSONText();
    this.trigger.getHTML().classList.add('lancer-reaction-trigger');
    this.body.appendChild(this.trigger.getHTML());

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-reaction-effect');
    this.body.appendChild(this.effect.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-reaction-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json, loadChildren = true) {
    var reaction = new Reaction();
    reaction.loadJSON(json, loadChildren);
    return reaction;
  }

  loadJSON(json, loadChildren = true) {
    this.json = json;

    this.attachments.loadJSON(json.attachments, loadChildren);

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.type.innerHTML = '';
    var type = ['Reaction'];
    if (json.frequency.type != 'any')
      type.push(json.frequency.frequency + '/' + json.frequency.type);
    appendTags(this.type, json.tags, json.cost, { start: type });

    if (json.trigger.length < 0)
      json.trigger.push('_Trigger:_');
    else if (typeof json.trigger[0] == 'string')
      json.trigger[0] = '_Trigger:_ ' + json.trigger[0];
    else
      json.unshift('_Trigger:_');
    this.trigger.loadJSON(json.trigger, this.attachments);

    if (json.effect.length < 0)
      json.effect.push('_Effect:_');
    else if (typeof json.effect[0] == 'string')
      json.effect[0] = '_Effect:_ ' + json.effect[0];
    else
      json.unshift('_Effect:_');
    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);
  }

}