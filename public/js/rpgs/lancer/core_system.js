class CoreSystem {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-core-system');

    this.name = document.createElement('div');
    this.name.classList.add('lancer-core-system-name');
    this.html.appendChild(this.name);

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-core-system-flavor');
    this.html.appendChild(this.flavor.getHTML());

    this.systems = document.createElement('div');
    this.systems.classList.add('lancer-core-system-systems');
    this.html.appendChild(this.systems);
    this.systemsArray = [];
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var coreSystem = new CoreSystem();
    coreSystem.loadJSON(json);
    return coreSystem;
  }

  loadJSON(json) {
    this.json = json;

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.flavor.loadJSON(json.flavor);

    this.systems.innerHTML = '';
    this.systemsArray = [];
    json.systems.forEach((element) => {
      var system = null;
      if (element.element_type == 'system')
        system = System.fromJSON(element);
      else if (element.element_type == 'tech')
        system = Tech.fromJSON(element);
      else if (element.element_type == 'weapon') {
        var integratedMountHeader = document.createElement('div');
        integratedMountHeader.classList.add('lancer-core-system-integrated-mount-header');
        this.systems.appendChild(integratedMountHeader);
        integratedMountHeader.appendChild(document.createTextNode('Integrated Mount: '));

        var integratedMountName = document.createElement('span');
        integratedMountName.classList.add('lancer-core-system-integrated-mount-name');
        integratedMountHeader.appendChild(integratedMountName);
        integratedMountName.appendChild(document.createTextNode(element.name));

        system = Weapon.fromJSON(element);
      }
      if (element == null)
        return;
      this.systemsArray.push(system);
      this.systems.appendChild(system.getHTML());
    });
  }

}