class Frame {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-frame');

    this.name = document.createElement('div');
    this.name.classList.add('lancer-frame-name');
    this.html.appendChild(this.name);

    this.role = document.createElement('div');
    this.role.classList.add('lancer-frame-role');
    this.html.appendChild(this.role);

    this.flavor = new LancerJSONText();
    this.flavor.getHTML().classList.add('lancer-frame-flavor');
    this.html.appendChild(this.flavor.getHTML());

    this.image = document.createElement('img');
    this.image.classList.add('lancer-frame-image');
    this.html.appendChild(this.image);

    this.description = document.createElement('div');
    this.description.classList.add('lancer-frame-description');
    this.html.appendChild(this.description);

    this.descriptionStats = document.createElement('div');
    this.descriptionStats.classList.add('lancer-frame-description-stats');
    this.description.appendChild(this.descriptionStats);

    this.descriptionStatsHeader = document.createElement('div');
    this.descriptionStatsHeader.classList.add('lancer-frame-description-stats-header');
    this.descriptionStats.appendChild(this.descriptionStatsHeader);
    this.descriptionStatsHeader.appendChild(document.createTextNode('Core Stats'));

    this.descriptionStatsStats = document.createElement('div');
    this.descriptionStatsStats.classList.add('lancer-frame-description-stats-stats');
    this.descriptionStats.appendChild(this.descriptionStatsStats);

    this.descriptionStatsStatsLeft = document.createElement('div');
    this.descriptionStatsStatsLeft.classList.add('lancer-frame-description-stats-stats-left');
    this.descriptionStatsStats.appendChild(this.descriptionStatsStatsLeft);

    this.size = document.createElement('div');
    this.size.classList.add('lancer-frame-size');
    this.size.classList.add('lancer-frame-stat');
    this.descriptionStatsStatsLeft.appendChild(this.size);
    this.size.appendChild(document.createTextNode('Size:'));
    
    this.sizeValue = document.createElement('div');
    this.sizeValue.classList.add('lancer-frame-size-value')
    this.sizeValue.classList.add('lancer-frame-stat-value');
    this.size.appendChild(this.sizeValue);

    this.armor = document.createElement('div');
    this.armor.classList.add('lancer-frame-armor');
    this.armor.classList.add('lancer-frame-stat');
    this.descriptionStatsStatsLeft.appendChild(this.armor);
    this.armor.appendChild(document.createTextNode('Armor:'));
    
    this.armorValue = document.createElement('div');
    this.armorValue.classList.add('lancer-frame-armor-value')
    this.armorValue.classList.add('lancer-frame-stat-value');
    this.armor.appendChild(this.armorValue);



    this.hull = document.createElement('div');
    this.hull.classList.add('lancer-frame-hull');
    this.hull.classList.add('lancer-frame-stats-indent');
    this.descriptionStatsStatsLeft.appendChild(this.hull);

    this.hullHeader = document.createElement('div');
    this.hullHeader.classList.add('lancer-frame-hull-header');
    this.hullHeader.classList.add('lancer-frame-stats-indent-header');
    this.hull.appendChild(this.hullHeader);
    this.hullHeader.appendChild(document.createTextNode('Hull'));
    
    this.hp = document.createElement('div');
    this.hp.classList.add('lancer-frame-hp');
    this.hp.classList.add('lancer-frame-stat');
    this.hull.appendChild(this.hp);
    this.hp.appendChild(document.createTextNode('HP:'));
    
    this.hpValue = document.createElement('div');
    this.hpValue.classList.add('lancer-frame-hp-value')
    this.hpValue.classList.add('lancer-frame-stat-value');
    this.hp.appendChild(this.hpValue);
    
    this.repairCap = document.createElement('div');
    this.repairCap.classList.add('lancer-frame-repair-cap');
    this.repairCap.classList.add('lancer-frame-stat');
    this.hull.appendChild(this.repairCap);
    this.repairCap.appendChild(document.createTextNode('Repair Cap:'));
    
    this.repairCapValue = document.createElement('div');
    this.repairCapValue.classList.add('lancer-frame-repair-cap-value')
    this.repairCapValue.classList.add('lancer-frame-stat-value');
    this.repairCap.appendChild(this.repairCapValue);


    
    this.agility = document.createElement('div');
    this.agility.classList.add('lancer-frame-agility');
    this.agility.classList.add('lancer-frame-stats-indent');
    this.descriptionStatsStatsLeft.appendChild(this.agility);

    this.agilityHeader = document.createElement('div');
    this.agilityHeader.classList.add('lancer-frame-agilty-header');
    this.agilityHeader.classList.add('lancer-frame-stats-indent-header');
    this.agility.appendChild(this.agilityHeader);
    this.agilityHeader.appendChild(document.createTextNode('Agility'));
    
    this.evasion = document.createElement('div');
    this.evasion.classList.add('lancer-frame-evasion');
    this.evasion.classList.add('lancer-frame-stat');
    this.agility.appendChild(this.evasion);
    this.evasion.appendChild(document.createTextNode('Evasion:'));
    
    this.evasionValue = document.createElement('div');
    this.evasionValue.classList.add('lancer-frame-evasion-value')
    this.evasionValue.classList.add('lancer-frame-stat-value');
    this.evasion.appendChild(this.evasionValue);
    
    this.speed = document.createElement('div');
    this.speed.classList.add('lancer-frame-speed');
    this.speed.classList.add('lancer-frame-stat');
    this.agility.appendChild(this.speed);
    this.speed.appendChild(document.createTextNode('Speed:'));
    
    this.speedValue = document.createElement('div');
    this.speedValue.classList.add('lancer-frame-speed-value')
    this.speedValue.classList.add('lancer-frame-stat-value');
    this.speed.appendChild(this.speedValue);



    

    this.descriptionStatsStatsRight = document.createElement('div');
    this.descriptionStatsStatsRight.classList.add('lancer-frame-description-stats-stats-right');
    this.descriptionStatsStats.appendChild(this.descriptionStatsStatsRight);

    this.saveTarget = document.createElement('div');
    this.saveTarget.classList.add('lancer-frame-save-target');
    this.saveTarget.classList.add('lancer-frame-stat');
    this.descriptionStatsStatsRight.appendChild(this.saveTarget);
    this.saveTarget.appendChild(document.createTextNode('Save Target:'));
    
    this.saveTargetValue = document.createElement('div');
    this.saveTargetValue.classList.add('lancer-frame-save-target-value')
    this.saveTargetValue.classList.add('lancer-frame-stat-value');
    this.saveTarget.appendChild(this.saveTargetValue);

    this.sensors = document.createElement('div');
    this.sensors.classList.add('lancer-frame-sensors');
    this.sensors.classList.add('lancer-frame-stat');
    this.descriptionStatsStatsRight.appendChild(this.sensors);
    this.sensors.appendChild(document.createTextNode('Sensors:'));
    
    this.sensorsValue = document.createElement('div');
    this.sensorsValue.classList.add('lancer-frame-sensors-value')
    this.sensorsValue.classList.add('lancer-frame-stat-value');
    this.sensors.appendChild(this.sensorsValue);



    this.systems = document.createElement('div');
    this.systems.classList.add('lancer-frame-systems');
    this.systems.classList.add('lancer-frame-stats-indent');
    this.descriptionStatsStatsRight.appendChild(this.systems);

    this.systemsHeader = document.createElement('div');
    this.systemsHeader.classList.add('lancer-frame-systems-header');
    this.systemsHeader.classList.add('lancer-frame-stats-indent-header');
    this.systems.appendChild(this.systemsHeader);
    this.systemsHeader.appendChild(document.createTextNode('Systems'));
    
    this.eDefense = document.createElement('div');
    this.eDefense.classList.add('lancer-frame-e-defense');
    this.eDefense.classList.add('lancer-frame-stat');
    this.systems.appendChild(this.eDefense);
    this.eDefense.appendChild(document.createTextNode('E-Defense:'));
    
    this.eDefenseValue = document.createElement('div');
    this.eDefenseValue.classList.add('lancer-frame-e-defense-value')
    this.eDefenseValue.classList.add('lancer-frame-stat-value');
    this.eDefense.appendChild(this.eDefenseValue);
    
    this.techAttack = document.createElement('div');
    this.techAttack.classList.add('lancer-frame-tech-attack');
    this.techAttack.classList.add('lancer-frame-stat');
    this.systems.appendChild(this.techAttack);
    this.techAttack.appendChild(document.createTextNode('Tech Attack:'));
    
    this.techAttackValue = document.createElement('div');
    this.techAttackValue.classList.add('lancer-frame-tech-attack-value')
    this.techAttackValue.classList.add('lancer-frame-stat-value');
    this.techAttack.appendChild(this.techAttackValue);
    
    this.sp = document.createElement('div');
    this.sp.classList.add('lancer-frame-sp');
    this.sp.classList.add('lancer-frame-stat');
    this.systems.appendChild(this.sp);
    this.sp.appendChild(document.createTextNode('SP:'));
    
    this.spValue = document.createElement('div');
    this.spValue.classList.add('lancer-frame-sp-value')
    this.spValue.classList.add('lancer-frame-stat-value');
    this.sp.appendChild(this.spValue);


    
    this.engineering = document.createElement('div');
    this.engineering.classList.add('lancer-frame-engineering');
    this.engineering.classList.add('lancer-frame-stats-indent');
    this.descriptionStatsStatsRight.appendChild(this.engineering);

    this.engineeringHeader = document.createElement('div');
    this.engineeringHeader.classList.add('lancer-frame-engineering-header');
    this.engineeringHeader.classList.add('lancer-frame-stats-indent-header');
    this.engineering.appendChild(this.engineeringHeader);
    this.engineeringHeader.appendChild(document.createTextNode('Engineering'));
    
    this.heatCap = document.createElement('div');
    this.heatCap.classList.add('lancer-frame-heat-cap');
    this.heatCap.classList.add('lancer-frame-stat');
    this.engineering.appendChild(this.heatCap);
    this.heatCap.appendChild(document.createTextNode('Heat Cap:'));
    
    this.heatCapValue = document.createElement('div');
    this.heatCapValue.classList.add('lancer-frame-heat-cap-value')
    this.heatCapValue.classList.add('lancer-frame-stat-value');
    this.heatCap.appendChild(this.heatCapValue);



    this.traitsHeader = document.createElement('div');
    this.traitsHeader.classList.add('lancer-frame-traits-header');
    this.descriptionStats.appendChild(this.traitsHeader);
    this.traitsHeader.appendChild(document.createTextNode('Traits'));

    this.traits = document.createElement('div');
    this.traits.classList.add('lancer-frame-traits');
    this.descriptionStats.appendChild(this.traits);
    this.traitsArray = [];



    this.mountsHeader = document.createElement('div');
    this.mountsHeader.classList.add('lancer-frame-mounts-header');
    this.descriptionStats.appendChild(this.mountsHeader);
    this.mountsHeader.appendChild(document.createTextNode('Mounts'));

    this.mounts = document.createElement('div');
    this.mounts.classList.add('lancer-frame-mounts');
    this.descriptionStats.appendChild(this.mounts);



    this.descriptionSeparator = document.createElement('div');
    this.descriptionSeparator.classList.add('lancer-frame-description-separator');
    this.description.appendChild(this.descriptionSeparator);

    this.descriptionCore = document.createElement('div');
    this.descriptionCore.classList.add('lancer-frame-description-core');
    this.description.appendChild(this.descriptionCore);

    this.descriptionCoreHeader = document.createElement('div');
    this.descriptionCoreHeader.classList.add('lancer-frame-description-core-header');
    this.descriptionCore.appendChild(this.descriptionCoreHeader);
    this.descriptionCoreHeader.appendChild(document.createTextNode('Core System'));

    this.coreSystem = new CoreSystem();
    this.coreSystem.getHTML().classList.add('lancer-frame-core-system');
    this.descriptionCore.appendChild(this.coreSystem.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var frame = new Frame();
    frame.loadJSON(json);
    return frame;
  }

  loadJSON(json) {
    this.json = json;

    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.role.innerHTML = '';
    this.role.appendChild(document.createTextNode(json.role));

    this.flavor.loadJSON(json.flavor);

    this.image.src = '/resources/imgs/rpgs/lancer/frames/' + json.image;

    this.sizeValue.innerHTML = '';
    this.sizeValue.appendChild(document.createTextNode(json.stats.size));

    this.armorValue.innerHTML = '';
    this.armorValue.appendChild(document.createTextNode(json.stats.armor));

    this.hpValue.innerHTML = '';
    this.hpValue.appendChild(document.createTextNode(json.stats.hp));

    this.repairCapValue.innerHTML = '';
    this.repairCapValue.appendChild(document.createTextNode(json.stats.repair_cap));

    this.evasionValue.innerHTML = '';
    this.evasionValue.appendChild(document.createTextNode(json.stats.evasion));

    this.speedValue.innerHTML = '';
    this.speedValue.appendChild(document.createTextNode(json.stats.speed));

    this.saveTargetValue.innerHTML = '';
    this.saveTargetValue.appendChild(document.createTextNode(json.stats.save_target));

    this.sensorsValue.innerHTML = '';
    this.sensorsValue.appendChild(document.createTextNode(json.stats.sensors));

    this.eDefenseValue.innerHTML = '';
    this.eDefenseValue.appendChild(document.createTextNode(json.stats.e_defense));

    this.techAttackValue.innerHTML = '';
    this.techAttackValue.appendChild(document.createTextNode(json.stats.tech_attack));

    this.spValue.innerHTML = '';
    this.spValue.appendChild(document.createTextNode(json.stats.sp));

    this.heatCapValue.innerHTML = '';
    this.heatCapValue.appendChild(document.createTextNode(json.stats.heat_cap));

    this.traits.innerHTML = '';
    this.traitsArray = [];
    json.traits.forEach((trait) => {
      var trai = Trait.fromJSON(trait);
      this.traitsArray.push(trai);
      this.traits.appendChild(trai.getHTML());
    });

    this.mounts.innerHTML = '';
    json.mounts.forEach((mount) => {
      var mnt = document.createElement('div');
      mnt.classList.add('lancer-frame-mount');
      this.mounts.appendChild(mnt);

      if (JSON.stringify(mount) == JSON.stringify([[2]]))
        mnt.appendChild(document.createTextNode('Main/Aux'));
      else if (JSON.stringify(mount) == JSON.stringify([[3]]))
        mnt.appendChild(document.createTextNode('Heavy'));
      else if (JSON.stringify(mount) == JSON.stringify([[1, 1]]))
        mnt.appendChild(document.createTextNode('Aux/Aux'));
      else if (JSON.stringify(mount) == JSON.stringify([[2, 1], [1, 1]]))
        mnt.appendChild(document.createTextNode('Main/Aux'));
      else if (JSON.stringify(mount) == JSON.stringify([[2], [1, 1]]))
        mnt.appendChild(document.createTextNode('Flex'));
      mnt.appendChild(document.createElement('br'));
      mnt.appendChild(document.createTextNode('Mount'));
    });

    this.coreSystem.loadJSON(json.core);
  }

}