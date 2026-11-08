class Talent {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-talent');

    this.name = document.createElement('div');
    this.name.classList.add('lancer-talent-name');
    this.html.appendChild(this.name);

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-talent-flavor');
    this.html.appendChild(this.flavor.getHTML());
    
    this.ranks = document.createElement('div');
    this.ranks.classList.add('lancer-talent-ranks');
    this.html.appendChild(this.ranks);
    this.ranksArray = [];
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json, loadChildren = true) {
    var talent = new Talent();
    talent.loadJSON(json, loadChildren);
    return talent;
  }

  loadJSON(json, loadChildren = true) {
    this.json = json;

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.flavor.loadJSON(json.flavor);
    
    if (loadChildren) {
      this.ranks.innerHTML = '';
      this.ranksArray = [];
      json.ranks.forEach((element, index) => {
        element.rank = index + 1;
        var rank = TalentRank.fromJSON(element, loadChildren);
        this.ranksArray.push(rank);
        this.ranks.appendChild(rank.getHTML());
      });
    }
  }

}