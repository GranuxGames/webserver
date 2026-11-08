class Manufacturer {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-manufacturer');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-manufacturer-header');
    this.html.appendChild(this.header);

    this.name = document.createElement('div');
    this.name.classList.add('lancer-manufacturer-name');
    this.header.appendChild(this.name);

    this.motd = document.createElement('div');
    this.motd.classList.add('lancer-manufacturer-motd');
    this.header.appendChild(this.motd);

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-manufacturer-flavor');
    this.html.appendChild(this.flavor.getHTML());

    this.headerAbbreviations = [];
    this.coreBonusHeader = document.createElement('div');
    this.coreBonusHeader.classList.add('lancer-manufacturer-core-bonus-header');
    this.html.appendChild(this.coreBonusHeader);
    this.headerAbbreviations.push(document.createElement('span'));
    this.coreBonusHeader.appendChild(this.headerAbbreviations[this.headerAbbreviations.length - 1]);
    this.coreBonusHeader.appendChild(document.createTextNode(' Core Bonuses'));

    this.coreBoni = document.createElement('div');
    this.coreBoni.classList.add('lancer-manufacturer-core-boni');
    this.html.appendChild(this.coreBoni);
    this.coreBoniArray = [];

    this.weaponsHeader = document.createElement('div');
    this.weaponsHeader.classList.add('lancer-manufacturer-weapons-header');
    this.html.appendChild(this.weaponsHeader);
    this.headerAbbreviations.push(document.createElement('span'));
    this.weaponsHeader.appendChild(this.headerAbbreviations[this.headerAbbreviations.length - 1]);
    this.weaponsHeader.appendChild(document.createTextNode(' Mech Weapons'));

    this.weapons = document.createElement('div');
    this.weapons.classList.add('lancer-manufacturer-weapons');
    this.html.appendChild(this.weapons);
    this.weaponsArray = [];

    this.systemsHeader = document.createElement('div');
    this.systemsHeader.classList.add('lancer-manufacturer-systems-header');
    this.html.appendChild(this.systemsHeader);
    this.headerAbbreviations.push(document.createElement('span'));
    this.systemsHeader.appendChild(this.headerAbbreviations[this.headerAbbreviations.length - 1]);
    this.systemsHeader.appendChild(document.createTextNode(' Systems'));

    this.systems = document.createElement('div');
    this.systems.classList.add('lancer-manufacturer-systems');
    this.html.appendChild(this.systems);
    this.systemsArray = [];

    this.licenses = document.createElement('div');
    this.licenses.classList.add('lancer-manufacturer-licenses');
    this.html.appendChild(this.licenses);
    this.licensesArray = [];
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json, loadChildren = true) {
    var manufacturer = new Manufacturer();
    manufacturer.loadJSON(json, loadChildren);
    return manufacturer;
  }

  loadJSON(json, loadChildren = true) {
    this.json = json;
    
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.headerAbbreviations.forEach((abr) => {
      abr.innerHTML = '';
      abr.appendChild(document.createTextNode(json.abbreviation));
    });

    this.motd.innerHTML = '';
    this.motd.appendChild(document.createTextNode(json.motd));

    this.flavor.loadJSON(json.flavor);

    this.coreBonusHeader.style.display = 'none';
    if (loadChildren) {
      this.coreBoni.innerHTML = '';
      this.coreBoniArray = [];
      json.core_bonuss.forEach((coreBonus) => {
        var bonus = CoreBonus.fromJSON(coreBonus, loadChildren);
        this.coreBoniArray.push(bonus);
        this.coreBoni.appendChild(bonus.getHTML());
      });
      if (json.core_bonuss.length > 0)
        this.coreBonusHeader.style.display = '';
    }

    this.weaponsHeader.style.display = 'none';
    if (loadChildren) {
      this.weapons.innerHTML = '';
      this.weaponsArray = [];
      json.weapons.forEach((element) => {
        var weapon = Weapon.fromJSON(element, loadChildren);
        this.weaponsArray.push(weapon);
        this.weapons.appendChild(weapon.getHTML());
      });
      if (json.weapons.length > 0)
        this.weaponsHeader.style.display = '';
    }

    this.systemsHeader.style.display = 'none';
    if (loadChildren) {
      this.systems.innerHTML = '';
      this.systemsArray = [];
      json.systems.forEach((element) => {
        var system = System.fromJSON(element, loadChildren);
        this.systemsArray.push(system);
        this.systems.appendChild(system.getHTML());
      });
      if (json.systems.length > 0)
        this.systemsHeader.style.display = '';
    }

    if (loadChildren) {
      this.licenses.innerHTML = '';
      this.licensesArray = [];
      json.licenses.forEach((license) => {
        license.manufacturer = json.abbreviation;
        var lic = License.fromJSON(license, loadChildren);
        this.licensesArray.push(lic);
        this.licenses.appendChild(lic.getHTML());
      });
    }
  }

}