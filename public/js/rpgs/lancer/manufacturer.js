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

    this.coreBoni = document.createElement('div');
    this.coreBoni.classList.add('lancer-manufacturer-core-boni');
    this.html.appendChild(this.coreBoni);
    this.coreBoniArray = [];

    this.licenses = document.createElement('div');
    this.licenses.classList.add('lancer-manufacturer-licenses');
    this.html.appendChild(this.licenses);
    this.licensesArray = [];
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var manufacturer = new Manufacturer();
    manufacturer.loadJSON(json);
    return manufacturer;
  }

  loadJSON(json) {
    this.json = json;
    
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.motd.innerHTML = '';
    this.motd.appendChild(document.createTextNode(json.motd));

    this.flavor.loadJSON(json.flavor);

    this.coreBoni.innerHTML = '';
    this.coreBoniArray = [];
    json.core_bonuss.forEach((coreBonus) => {
      var bonus = CoreBonus.fromJSON(coreBonus);
      this.coreBoniArray.push(bonus);
      this.coreBoni.appendChild(bonus.getHTML());
    });

    this.licenses.innerHTML = '';
    this.licensesArray = [];
    json.licenses.forEach((license) => {
      license.manufacturer = json.abbreviation;
      var lic = License.fromJSON(license);
      this.licensesArray.push(lic);
      this.licenses.appendChild(lic.getHTML());
    });

    console.log(json);
  }

}

var manufacturers = [];

window.addEventListener('load', () => {
  fetch('/rpgs/lancer/api/fetch-manufacturers', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((object) => { return object.json(); })
  .then((object) => { return object.result; })
  .then((object) => {
    object.forEach((json) => {
      var talent = Talent.fromJSON(json);
      document.body.appendChild(talent.getHTML());
    });
    // object.forEach((json) => {
    //   var reaction = Reaction.fromJSON(json);
    //   document.body.appendChild(reaction.getHTML());
    // });
    // manufacturers = object.map((json) => {
    //   var manufacturer = Manufacturer.fromJSON(json);
    //   document.body.appendChild(manufacturer.getHTML());
    //   return manufacturer;
    // });
  });
});