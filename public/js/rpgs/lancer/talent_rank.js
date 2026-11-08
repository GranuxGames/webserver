class TalentRank {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-talent-rank');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-talent-rank-header');
    this.html.appendChild(this.header);

    this.rank = document.createElement('div');
    this.rank.classList.add('lancer-talent-rank-rank');
    this.header.appendChild(this.rank);

    this.header.appendChild(document.createTextNode(' '));

    this.name = document.createElement('div');
    this.name.classList.add('lancer-talent-rank-name');
    this.header.appendChild(this.name);

    this.effect = new LancerJSONText();
    this.effect.getHTML().classList.add('lancer-talent-rank-effect');
    this.html.appendChild(this.effect.getHTML());

    this.attachments = new Attachments();
    this.attachments.getHTML().classList.add('lancer-reaction-attachments');
    this.html.appendChild(this.attachments.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json, loadChildren = true) {
    var talentRank = new TalentRank();
    talentRank.loadJSON(json, loadChildren);
    return talentRank;
  }

  loadJSON(json, loadChildren = true) {
    this.json = json;

    this.attachments.loadJSON(json.attachments, loadChildren);

    this.rank.innerHTML = '';
    this.rank.appendChild(document.createTextNode(String.fromCharCode('N'.charCodeAt(0) - 1 + json.rank)));

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.effect.setCustomContent(this.attachments);
    this.effect.loadJSON(json.effect);
  }

}