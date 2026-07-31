class License {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-license');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-license-header');
    this.html.appendChild(this.header);

    this.manufacturer = document.createElement('div');
    this.manufacturer.classList.add('lancer-license-manufacturer');
    this.header.appendChild(this.manufacturer);

    this.frames = document.createElement('div');
    this.frames.classList.add('lancer-license-frames');
    this.html.appendChild(this.frames);
    this.framesArray = [];

    this.ranks = document.createElement('div');
    this.ranks.classList.add('lancer-license-ranks');
    this.html.appendChild(this.ranks);
    this.ranksArray = [];
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var license = new License();
    license.loadJSON(json);
    return license;
  }

  loadJSON(json) {
    this.json = json;

    this.manufacturer.innerHTML = '';
    this.manufacturer.appendChild(document.createTextNode(json.manufacturer));

    this.frames.innerHTML = '';
    this.framesArray = [];
    json.frames.forEach((frame) => {
      var fram = Frame.fromJSON(frame);
      this.framesArray.push(fram);
      this.frames.appendChild(fram.getHTML());
    });

    this.ranks.innerHTML = '';
    this.ranksArray = [];
    json.ranks.forEach((element, index) => {
      element.rank = index + 1;
      var rank = LicenseRank.fromJSON(element);
      this.ranksArray.push(rank);
      this.ranks.appendChild(rank.getHTML());
    });
  }

}