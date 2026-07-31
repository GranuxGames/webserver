class Attachments {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-attachments');
    this.html.classList.add('lancer-minified');

    this.attachments = [];

    this.attachmentTypes = {
      'corebonus': CoreBonus,
      'coresystem': CoreSystem,
      'frame': Frame,
      'freeaction': FreeAction,
      'fullaction': FullAction,
      'invasion': Invasion,
      'licenserank': LicenseRank,
      'license': License,
      'manufacturer': Manufacturer,
      'quickaction': QuickAction,
      'reaction': Reaction,
      'system': System,
      'talentrank': TalentRank,
      'talent': Talent,
      'tech': Tech,
      'trait': Trait,
      'weapon': Weapon
    }
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var attachments = new Attachments();
    attachments.loadJSON(attachments);
    return attachments;
  }

  loadJSON(json) {
    this.json = json;

    this.html.innerHTML = '';
    this.attachments = [];
    json.references.forEach((element) => {
      if (this.attachmentTypes[element.element_type] == null)
        return;

      var attachment = new this.attachmentTypes[element.element_type]();

      attachment.getHTML().classList.add('lancer-attachment');
      this.html.appendChild(attachment.getHTML());
      attachment.loadJSON(element);
      this.attachments.push(attachment);
    });
    json.inline.forEach((element) => {
      if (this.attachmentTypes[element.element_type] == null)
        return;

      var attachment = new this.attachmentTypes[element.element_type]();
      attachment.loadJSON(element);
      this.attachments.push(attachment);
    })
  }

}