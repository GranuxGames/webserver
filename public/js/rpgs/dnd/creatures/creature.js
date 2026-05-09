class DNDCreature {
  
  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature');
    this.html.classList.add('dnd-object');
    if (isMobile())
      this.html.classList.add('mobile');

    this.main = document.createElement('div');
    this.main.classList.add('dnd-creature-main');
    this.html.appendChild(this.main);

    this.image = new DNDCreatureImage();
    this.main.appendChild(this.image.getHTML());

    this.header = new DNDCreatureHeader();
    this.main.appendChild(this.header.getHTML());

    this.traits = new DNDCreatureTraits();
    this.main.appendChild(this.traits.getHTML());

    this.actions = new DNDCreatureActions();
    this.main.appendChild(this.actions.getHTML());

    this.bonusActions = new DNDCreatureBonusAction();
    this.main.appendChild(this.bonusActions.getHTML());

    this.reactions = new DNDCreatureReactions();
    this.main.appendChild(this.reactions.getHTML());

    this.legendaryActions = new DNDCreatureLegendaryActions();
    this.main.appendChild(this.legendaryActions.getHTML());

    this.extra = document.createElement('div');
    this.extra.classList.add('dnd-creature-extra');
    this.html.appendChild(this.extra);

    this.description = new DNDCreatureDescription();
    this.extra.appendChild(this.description.getHTML());

    this.lair = new DNDCreatureLair();
    this.extra.appendChild(this.lair.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var creature = new DNDCreature();
    creature.loadJSON(json);
    return creature;
  }
  
  loadJSON(json) {
    this.image.loadJSON(json);
    this.header.loadJSON(json);
    this.traits.loadJSON(json);
    this.actions.loadJSON(json);
    this.bonusActions.loadJSON(json);
    this.reactions.loadJSON(json);
    this.legendaryActions.loadJSON(json);
    this.description.loadJSON(json);
    this.lair.loadJSON(json);
  }

}

class DNDCreatureImage {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-image-container');

    this.img = document.createElement('img');
    this.img.classList.add('dnd-creature-image');
    this.html.appendChild(this.img);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    if (json.image != '')
      this.img.src = '/resources/imgs/dynamic/rpgs/dnd/creatures/' + json.image;
  }

}

class DNDCreatureHeader {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-header');

    this.description = new DNDCreatureHeaderDescription();
    this.html.appendChild(this.description.getHTML());

    var separator = document.createElement('div');
    separator.classList.add('dnd-creature-header-separator');
    this.html.appendChild(separator.cloneNode(true));

    this.stats = new DNDCreatureHeaderStats();
    this.html.appendChild(this.stats.getHTML());

    this.html.appendChild(separator.cloneNode(true));

    this.abilities = new DNDCreatureHeaderAbilities();
    this.html.appendChild(this.abilities.getHTML());

    this.html.appendChild(separator.cloneNode(true));

    this.skills = new DNDCreatureHeaderSkills();
    this.html.appendChild(this.skills.getHTML());

    this.html.appendChild(separator.cloneNode(true));
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.description.loadJSON(json);
    this.stats.loadJSON(json);
    this.abilities.loadJSON(json);
    this.skills.loadJSON(json);
  }

}

class DNDCreatureHeaderDescription {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-header-description');

    this.name = document.createElement('div');
    this.name.classList.add('dnd-creature-name');
    this.html.appendChild(this.name);

    this.typeLine = document.createElement('div');
    this.typeLine.classList.add('dnd-creature-type-line');
    this.html.appendChild(this.typeLine);

    this.size = document.createElement('span');

    this.type = document.createElement('span');

    this.subtypePart = document.createElement('span');
    
    this.subtypePart.appendChild(document.createTextNode(' ('));
    this.subtype = document.createElement('span');
    this.subtypePart.appendChild(this.subtype);
    this.subtypePart.appendChild(document.createTextNode(')'));

    this.alignmentPart = document.createElement('span');

    this.alignmentPart.appendChild(document.createTextNode(', '));
    this.alignment = document.createElement('span');
    this.alignmentPart.appendChild(this.alignment);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name));

    this.typeLine.innerHTML = '';

    this.size.innerHTML = '';
    this.size.appendChild(document.createTextNode(json.size));
    this.typeLine.appendChild(this.size);
    
    this.typeLine.appendChild(document.createTextNode(' '));

    this.type.innerHTML = '';
    this.type.appendChild(document.createTextNode(json.type));
    this.typeLine.appendChild(this.type);

    if (json.subtype != '') {
      this.subtype.innerHTML = '';
      this.subtype.appendChild(document.createTextNode(json.subtype));
      this.typeLine.appendChild(this.subtypePart);
    }

    if (json.alignment != '') {
      this.alignment.innerHTML = '';
      this.alignment.appendChild(document.createTextNode(json.alignment));
      this.typeLine.appendChild(this.alignmentPart);
    }
  }

}

class DNDCreatureHeaderStats {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-header-stats');

    var part = document.createElement('div');

    var partHeader = document.createElement('span');
    partHeader.classList.add('dnd-creature-header-line-header');
    part.appendChild(partHeader);

    var partValue = document.createElement('span');
    partValue.classList.add('dnd-creature-header-line-value');
    part.appendChild(partValue);

    this.ac = part.cloneNode(true);
    this.ac.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Armor Class '));
    this.html.appendChild(this.ac);

    this.hp = part.cloneNode(true);
    this.hp.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Hit Points '));
    this.html.appendChild(this.hp);

    this.speed = part.cloneNode(true);
    this.speed.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Speed '));
    this.html.appendChild(this.speed);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    var acString = '' + json.ac;
    if (json.armor.length > 0)
      acString += ' (' + json.armor.join(', ') + ')';
    this.ac.querySelector('.dnd-creature-header-line-value').innerHTML = '';
    this.ac.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(acString));

    var hpString = '' + DiceCalc.parse(json.hp).calcAverage() + ' (' + json.hp + ')';
    this.hp.querySelector('.dnd-creature-header-line-value').innerHTML = '';
    this.hp.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(hpString));

    this.speed.querySelector('.dnd-creature-header-line-value').innerHTML = '';
    this.speed.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.speed).sort((a, b) => {
        if (a[0] == 'move')
          return -1;
        if (b[0] == 'move')
          return 1;
        return a[0].localeCompare(b[0]);
      }).map((entry) => {
        var out = '';
        if (entry[0] != 'move')
          out += entry[0] + ' ';
        out += entry[1];
        return out;
      }).join(', ')));
  }

}

class DNDCreatureHeaderAbilities {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-header-abilities');

    var ability = document.createElement('div');
    ability.classList.add('dnd-creature-ability');

    var header = document.createElement('div');
    header.classList.add('dnd-creature-ability-header');
    ability.appendChild(header);

    var score = document.createElement('div');
    score.classList.add('dnd-creature-ability-score');
    ability.appendChild(score);

    this.str = ability.cloneNode(true);
    this.str.querySelector('.dnd-creature-ability-header').appendChild(document.createTextNode('STR'));
    this.html.appendChild(this.str);

    this.dex = ability.cloneNode(true);
    this.dex.querySelector('.dnd-creature-ability-header').appendChild(document.createTextNode('DEX'));
    this.html.appendChild(this.dex);

    this.con = ability.cloneNode(true);
    this.con.querySelector('.dnd-creature-ability-header').appendChild(document.createTextNode('CON'));
    this.html.appendChild(this.con);

    this.int = ability.cloneNode(true);
    this.int.querySelector('.dnd-creature-ability-header').appendChild(document.createTextNode('INT'));
    this.html.appendChild(this.int);

    this.wis = ability.cloneNode(true);
    this.wis.querySelector('.dnd-creature-ability-header').appendChild(document.createTextNode('WIS'));
    this.html.appendChild(this.wis);

    this.cha = ability.cloneNode(true);
    this.cha.querySelector('.dnd-creature-ability-header').appendChild(document.createTextNode('CHA'));
    this.html.appendChild(this.cha);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.str.querySelector('.dnd-creature-ability-score').innerHTML = '';
    this.str.querySelector('.dnd-creature-ability-score').appendChild(document.createTextNode('' + json.stats.str + ' (' + (json.stats.str >= 10?'+':'') + Math.floor((json.stats.str - 10) / 2) + ')'));
    
    this.dex.querySelector('.dnd-creature-ability-score').innerHTML = '';
    this.dex.querySelector('.dnd-creature-ability-score').appendChild(document.createTextNode('' + json.stats.dex + ' (' + (json.stats.dex >= 10?'+':'') + Math.floor((json.stats.dex - 10) / 2) + ')'));
    
    this.con.querySelector('.dnd-creature-ability-score').innerHTML = '';
    this.con.querySelector('.dnd-creature-ability-score').appendChild(document.createTextNode('' + json.stats.con + ' (' + (json.stats.con >= 10?'+':'') + Math.floor((json.stats.con - 10) / 2) + ')'));
    
    this.int.querySelector('.dnd-creature-ability-score').innerHTML = '';
    this.int.querySelector('.dnd-creature-ability-score').appendChild(document.createTextNode('' + json.stats.int + ' (' + (json.stats.int >= 10?'+':'') + Math.floor((json.stats.int - 10) / 2) + ')'));
    
    this.wis.querySelector('.dnd-creature-ability-score').innerHTML = '';
    this.wis.querySelector('.dnd-creature-ability-score').appendChild(document.createTextNode('' + json.stats.wis + ' (' + (json.stats.wis >= 10?'+':'') + Math.floor((json.stats.wis - 10) / 2) + ')'));
    
    this.cha.querySelector('.dnd-creature-ability-score').innerHTML = '';
    this.cha.querySelector('.dnd-creature-ability-score').appendChild(document.createTextNode('' + json.stats.cha + ' (' + (json.stats.cha >= 10?'+':'') + Math.floor((json.stats.cha - 10) / 2) + ')'));
  }
  
}

const CRS = {
  '0': 10,
  '0.125': 25,
  '0.25': 50,
  '0.5': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000
};

class DNDCreatureHeaderSkills {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-header-skills');

    var part = document.createElement('div');

    var partHeader = document.createElement('span');
    partHeader.classList.add('dnd-creature-header-line-header');
    part.appendChild(partHeader);

    var partValue = document.createElement('span');
    partValue.classList.add('dnd-creature-header-line-value');
    part.appendChild(partValue);

    this.saves = part.cloneNode(true);
    this.saves.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Saving Throws '));

    this.skills = part.cloneNode(true);
    this.skills.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Skills '));

    this.damageVulnerabilities = part.cloneNode(true);
    this.damageVulnerabilities.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Damage Vulnerabilities '));

    this.damageResistances = part.cloneNode(true);
    this.damageResistances.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Damage Resistances '));

    this.damageImmunities = part.cloneNode(true);
    this.damageImmunities.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Damage Immunities'));

    this.conditionImmunities = part.cloneNode(true);
    this.conditionImmunities.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Condition Immunities'));

    this.senses = part.cloneNode(true);
    this.senses.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Senses '));

    this.languages = part.cloneNode(true);
    this.languages.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Languages '));

    this.challenge = part.cloneNode(true);
    this.challenge.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Challenge '));

    this.proficiency = part.cloneNode(true);
    this.proficiency.querySelector('.dnd-creature-header-line-header').appendChild(document.createTextNode('Proficiency Bonus '));
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (Object.keys(json.saves).length > 0) {
      this.html.appendChild(this.saves);
      this.saves.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.saves.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.saves).map((entry) => {
          var out = '';
          out += entry[0] + ' ';
          if (entry[1] >= 0)
            out += '+';
          out += entry[1];
          return out;
        }).join(', ')));
    }

    if (Object.keys(json.skills).length > 0) {
      this.html.appendChild(this.skills);
      this.skills.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.skills.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.skills).map((entry) => {
          var out = '';
          out += entry[0] + ' ';
          if (entry[1] >= 0)
            out += '+';
          out += entry[1];
          return out;
        }).join(', ')));
    }

    if (Object.keys(json.damage_vulnerabilities).length > 0) {
      this.html.appendChild(this.damageVulnerabilities);
      this.damageVulnerabilities.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.damageVulnerabilities.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.damage_vulnerabilities).map((entry) => {
          var out = '';
          out += entry[0] + ' ';
          if (entry[1] >= 0)
            out += '+';
          out += entry[1];
          return out;
        }).join(', ')));
    }

    if (Object.keys(json.damage_resistances).length > 0) {
      this.html.appendChild(this.damageResistances);
      this.damageResistances.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.damageResistances.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.damage_resistances).map((entry) => {
          var out = '';
          out += entry[0] + ' ';
          if (entry[1] >= 0)
            out += '+';
          out += entry[1];
          return out;
        }).join(', ')));
    }

    if (Object.keys(json.damage_immunities).length > 0) {
      this.html.appendChild(this.damageImmunities);
      this.damageImmunities.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.damageImmunities.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.damage_immunities).map((entry) => {
          var out = '';
          out += entry[0] + ' ';
          if (entry[1] >= 0)
            out += '+';
          out += entry[1];
          return out;
        }).join(', ')));
    }

    if (Object.keys(json.condition_immunities).length > 0) {
      this.html.appendChild(this.conditionImmunities);
      this.conditionImmunities.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.conditionImmunities.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.condition_immunities).map((entry) => {
          var out = '';
          out += entry[0] + ' ';
          if (entry[1] >= 0)
            out += '+';
          out += entry[1];
          return out;
        }).join(', ')));
    }

    if (Object.keys(json.senses).length > 0) {
      this.html.appendChild(this.senses);
      this.senses.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.senses.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(Object.entries(json.senses).map((entry) => {
          var out = '';
          out += entry[0] + ' ' + entry[1];
          return out;
        }).join(', ')));
    }

    if (Object.keys(json.languages).length > 0) {
      this.html.appendChild(this.languages);
      this.languages.querySelector('.dnd-creature-header-line-value').innerHTML = '';
      this.languages.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(json.languages.join(', ')));
    }

    this.html.appendChild(this.challenge);
    var crString = '' + json.cr + ' (' + ('' + CRS['' + json.cr]).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XP)';
    this.challenge.querySelector('.dnd-creature-header-line-value').innerHTML = '';
    this.challenge.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode(crString));

    this.html.appendChild(this.proficiency);
    this.proficiency.querySelector('.dnd-creature-header-line-value').innerHTML = '';
    this.proficiency.querySelector('.dnd-creature-header-line-value').appendChild(document.createTextNode('+' + json.proficiency));
  }
  
}

class DNDCreatureTraits {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-traits');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-creature-section-header');
    this.header.appendChild(document.createTextNode('Traits'));

    this.traits = document.createElement('div');
    this.traits.classList.add('dnd-creature-traits-body');
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (json.traits.length <= 0)
      return;

    this.html.appendChild(this.header);
    this.html.appendChild(this.traits);
    json.traits.forEach((trait) => {
      var element = new DNDCreatureTrait();
      element.loadJSON(trait);
      this.traits.appendChild(element.getHTML());
    });
  }

}

class DNDCreatureTrait {

  constructor() {
    this.text = new JSONText();
    this.text.getHTML().classList.add('dnd-creature-trait');

    this.name = document.createElement('span');
    this.name.classList.add('dnd-creature-trait-name');
  }

  getHTML() {
    return this.text.getHTML();
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name + '. '));

    this.text.loadJSON(json.description);

    if (this.text.getHTML().children.length <= 0) {
      this.text.getHTML().appendChild(this.name);
      return;
    }

    if (this.text.getHTML().firstChild.classList.contains('.json-text-line')) {
      this.text.getHTML().firstChild.firstChild.firstChild.before(this.name);
      return;
    }

    this.text.getHTML().firstChild.firstChild.before(this.name);
  }

}

class DNDCreatureActions {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-actions');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-creature-section-header');
    this.header.appendChild(document.createTextNode('Actions'));

    this.actions = document.createElement('div');
    this.actions.classList.add('dnd-creature-actions-body');
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (json.actions.length <= 0)
      return;

    this.html.appendChild(this.header);
    this.html.appendChild(this.actions);
    json.actions.forEach((action) => {
      var element = new DNDCreatureAction();
      element.loadJSON(action);
      this.actions.appendChild(element.getHTML());
    });
  }

}

class DNDCreatureAction {

  constructor() {
    this.text = new JSONText();
    this.text.getHTML().classList.add('dnd-creature-action');

    this.name = document.createElement('span');
    this.name.classList.add('dnd-creature-action-name');
  }

  getHTML() {
    return this.text.getHTML();
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name + '. '));

    if (json.type == 'attack') {
      if (json.description.length <= 0)
        json.description.push('');
      json.description[0] = '*' + json.attack_type + ':* ' + json.attack + ' *Hit:* ' + json.description[0];
    }
    this.text.loadJSON(json.description);

    if (this.text.getHTML().children.length <= 0) {
      this.text.getHTML().appendChild(this.name);
      return;
    }

    if (this.text.getHTML().firstChild.classList.contains('.json-text-line')) {
      this.text.getHTML().firstChild.firstChild.firstChild.before(this.name);
      return;
    }

    this.text.getHTML().firstChild.firstChild.before(this.name);
  }

}

class DNDCreatureBonusActions {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-bonus-actions');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-creature-section-header');
    this.header.appendChild(document.createTextNode('Bonus Actions'));

    this.bonusActions = document.createElement('div');
    this.bonusActions.classList.add('dnd-creature-bonus-actions-body');
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (json.bonus_actions.length <= 0)
      return;

    this.html.appendChild(this.header);
    this.html.appendChild(this.bonusActions);
    json.bonus_actions.forEach((bonus_action) => {
      var element = new DNDCreatureBonusAction();
      element.loadJSON(bonus_action);
      this.bonusActions.appendChild(element.getHTML());
    });
  }

}

class DNDCreatureBonusAction {

  constructor() {
    this.text = new JSONText();
    this.text.getHTML().classList.add('dnd-creature-bonus-action');

    this.name = document.createElement('span');
    this.name.classList.add('dnd-creature-bonus-action-name');
  }

  getHTML() {
    return this.text.getHTML();
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name + '. '));

    if (json.type == 'attack') {
      if (json.description.length <= 0)
        json.description.push('');
      json.description[0] = '*' + json.attack_type + ':* ' + json.attack + ' *Hit:* ' + json.description[0];
    }
    this.text.loadJSON(json.description);

    if (this.text.getHTML().children.length <= 0) {
      this.text.getHTML().appendChild(this.name);
      return;
    }

    if (this.text.getHTML().firstChild.classList.contains('.json-text-line')) {
      this.text.getHTML().firstChild.firstChild.firstChild.before(this.name);
      return;
    }

    this.text.getHTML().firstChild.firstChild.before(this.name);
  }

}

class DNDCreatureReactions {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-reactions');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-creature-section-header');
    this.header.appendChild(document.createTextNode('Reactions'));

    this.reactions = document.createElement('div');
    this.reactions.classList.add('dnd-creature-reactions-body');
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (json.reactions.length <= 0)
      return;

    this.html.appendChild(this.header);
    this.html.appendChild(this.reactions);
    json.reactions.forEach((reaction) => {
      var element = new DNDCreatureReaction();
      element.loadJSON(reaction);
      this.reactions.appendChild(element.getHTML());
    });
  }

}

class DNDCreatureReaction {

  constructor() {
    this.text = new JSONText();
    this.text.getHTML().classList.add('dnd-creature-reaction');

    this.name = document.createElement('span');
    this.name.classList.add('dnd-creature-reaction-name');
  }

  getHTML() {
    return this.text.getHTML();
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name + '. '));

    this.text.loadJSON(json.description);

    if (this.text.getHTML().children.length <= 0) {
      this.text.getHTML().appendChild(this.name);
      return;
    }

    if (this.text.getHTML().firstChild.classList.contains('.json-text-line')) {
      this.text.getHTML().firstChild.firstChild.firstChild.before(this.name);
      return;
    }

    this.text.getHTML().firstChild.firstChild.before(this.name);
  }

}

class DNDCreatureLegendaryActions {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-legendary-actions');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-creature-section-header');
    this.header.appendChild(document.createTextNode('Legendary Actions'));

    this.legendaryActionsDescription = new JSONText();
    this.legendaryActionsDescription.getHTML().classList.add('dnd-creature-legendary-actions-description');

    this.legendaryActions = document.createElement('div');
    this.legendaryActions.classList.add('dnd-creature-legendary-actions-body');
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (json.legendary_actions.effects.length <= 0)
      return;

    this.html.appendChild(this.header);

    this.legendaryActionsDescription.loadJSON(json.legendary_actions.description);
    this.html.appendChild(this.legendaryActionsDescription.getHTML());

    this.html.appendChild(this.legendaryActions);
    json.legendary_actions.effects.forEach((legendaryAction) => {
      var element = new DNDCreatureLegendaryAction();
      element.loadJSON(legendaryAction);
      this.legendaryActions.appendChild(element.getHTML());
    });
  }

}

class DNDCreatureLegendaryAction {

  constructor() {
    this.text = new JSONText();
    this.text.getHTML().classList.add('dnd-creature-legendary-action');

    this.name = document.createElement('span');
    this.name.classList.add('dnd-creature-legendary-action-name');
  }

  getHTML() {
    return this.text.getHTML();
  }

  loadJSON(json) {
    this.name.innerHTML = '';
    this.name.appendChild(document.createTextNode(json.name + '. '));

    this.text.loadJSON(json.description);

    if (this.text.getHTML().children.length <= 0) {
      this.text.getHTML().appendChild(this.name);
      return;
    }

    if (this.text.getHTML().firstChild.classList.contains('.json-text-line')) {
      this.text.getHTML().firstChild.firstChild.firstChild.before(this.name);
      return;
    }

    this.text.getHTML().firstChild.firstChild.before(this.name);
  }

}

class DNDCreatureDescription {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-description-container');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-creature-section-header');
    this.header.appendChild(document.createTextNode('Description'));

    this.description = new JSONText();
    this.description.getHTML().classList.add('dnd-creature-description');
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (json.description.length <= 0)
      return;

    this.html.appendChild(this.header);

    this.description.loadJSON(json.description);
    this.html.appendChild(this.description.getHTML());
  }

}

class DNDCreatureLair {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-creature-lair-container');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-creature-section-header');
    this.header.appendChild(document.createTextNode('Lair'));

    this.description = new JSONText();
    this.description.getHTML().classList.add('dnd-creature-lair-description');

    this.actionsHeader = document.createElement('div');
    this.actionsHeader.classList.add('dnd-creature-section-header-2');
    this.actionsHeader.appendChild(document.createTextNode('Lair Actions'));

    this.actions = new JSONText();
    this.actions.getHTML().classList.add('dnd-creature-lair-actions');

    this.effectsHeader = document.createElement('div');
    this.effectsHeader.classList.add('dnd-creature-section-header-2');
    this.effectsHeader.appendChild(document.createTextNode('Regional Effects'));

    this.effects = new JSONText();
    this.effects.getHTML().classList.add('dnd-creature-regional-effects');
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.html.innerHTML = '';

    if (json.lair.description.length <= 0 && json.lair.actions.length <= 0 && json.lair.effects.length <= 0)
      return;

    this.html.appendChild(this.header);

    if (json.lair.description.length > 0) {
      this.description.loadJSON(json.lair.description);
      this.html.appendChild(this.description.getHTML());
    }

    if (json.lair.actions.length > 0) {
      this.html.appendChild(this.actionsHeader);
      this.actions.loadJSON(json.lair.actions);
      this.html.appendChild(this.actions.getHTML());
    }

    if (json.lair.effects.length > 0) {
      this.html.appendChild(this.effectsHeader);
      this.effects.loadJSON(json.lair.effects);
      this.html.appendChild(this.effects.getHTML());
    }
  }

}