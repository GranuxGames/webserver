class Invasion {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-invasion');

    this.text = new LancerJSONText();
    this.text.getHTML().classList.add('lancer-invasion-text');
    this.html.appendChild(this.text.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-invasion-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var invasion = new Invasion();
    invasion.loadJSON(json);
    return invasion;
  }

  loadJSON(json) {
    this.json = json;

    this.attachments.loadJSON(json.attachments);

    if (json.effect.length <= 0)
      json.effect.push('§key:' + json.name + ':§');
    else if (typeof json.effect[0] == 'string')
      json.effect[0] = '§key:' + json.name + ':§ ' + json.effect[0];
    else
      json.effect.unshift('§key:' + json.name + ':§');
    this.text.loadJSON(json.effect);
  }

}