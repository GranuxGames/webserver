class CreatureLibrary extends Library {

  constructor(list) {
    super('/rpgs/dnd/api/get-creature', '/resources/imgs/dynamic/rpgs/dnd/creatures/', DNDCreature, '/rpgs/dnd/creatures/', list,
          [{title: 'CR',        size: '2em',  text: [['cr']],        subtext: []},
           {title: 'NAME',      size: '20em', text: [['name']],      subtext: []},
           {title: 'TYPE',      size: '8em',  text: [['type']],      subtext: [['subtype']]},
           {title: 'SIZE',      size: '8em',  text: [['size']],      subtext: []},
           {title: 'ALIGNMENT', size: '8em',  text: [['alignment']], subtext: []},
           {title: 'HABITAT',   size: '8em',  text: [['habitat']],   subtext: []},
           {title: 'TAGS',      size: '13em', text: [['tags']],      subtext: []}]);
    
    this.addFilter(new NameSearch());
    this.addFilter(new TypeSearch());
    this.addFilter(new SubtypeSearch());
    this.addFilter(new CRSearch());
    this.addFilter(new SizeSearch());
    this.addFilter(new HabitatSearch());
    this.addFilter(new AlignmentSearch());
    this.addFilter(new ACSearch());
    this.addFilter(new HPSearch());
    this.addFilter(new SensesSearch());
    this.addFilter(new SavesSearch());
    this.addFilter(new SkillsSearch());
    this.addFilter(new LegendarySearch());
    this.addFilter(new LairSearch());
    this.addFilter(new DamageVulnerabilitiesSearch());
    this.addFilter(new DamageResistancesSearch());
    this.addFilter(new DamageImmunitiesSearch());
    this.addFilter(new ConditionImmunitiesSearch());
    this.addFilter(new LanguagesSearch());
    this.addFilter(new MovementTypesSearch());
    this.addFilter(new TagsSearch());
  }

}

class NameSearch extends LibraryStringSearch {

  constructor() {
    super('name', 'Creature Name');
  }

}

class TypeSearch extends LibrarySingleListSearch {

  constructor() {
    super('type', '/rpgs/dnd/api/list-creature-types', 'Humanoid, Dragon, ...', 'Type');
  }

}

class SubtypeSearch extends LibrarySingleListSearch {

  constructor() {
    super('subtype', '/rpgs/dnd/api/list-creature-subtypes', 'Fiend, Angel, ...', 'Subtype');
  }

}

class CRSearch extends LibraryRangeSearch {

  constructor() {
    super('cr', 'Challenge Rating');
  }

  getConvertedValue(value) {
    value = ('' + value).trim().toLowerCase();

    if (value.length <= 0)
      return -1;

    var number = value.match(/^-?(\d+\.?\d*|\d*\.?\d+)/gm);
    if (number == null)
      return -1;
    number = number[0];

    return Number.parseFloat(number);
  }

}

class SizeSearch extends LibrarySingleListSearch {

  constructor() {
    super('size', '/rpgs/dnd/api/list-creature-sizes', 'Small, Medium, ...', 'Size');
  }

}

class HabitatSearch extends LibrarySingleListSearch {

  constructor() {
    super('habitat', '/rpgs/dnd/api/list-creature-habitats', 'Mountains, Forests, ...', 'Habitat');
  }

}

class AlignmentSearch extends LibrarySingleListSearch {

  constructor() {
    super('alignment', '/rpgs/dnd/api/list-creature-alignments', 'Chaotic Neutral, ...', 'Alignment');
  }

}

class ACSearch extends LibraryRangeSearch {

  constructor() {
    super('ac', 'Armor Class');
  }

  getConvertedValue(value) {
    value = ('' + value).trim().toLowerCase();

    if (value.length <= 0)
      return -1;

    var number = value.match(/^-?(\d+\.?\d*|\d*\.?\d+)/gm);
    if (number == null)
      return -1;
    number = number[0];

    return Number.parseFloat(number);
  }

}

class HPSearch extends LibraryRangeSearch {

  constructor() {
    super('hp', 'Average Hit Points');
  }

  getConvertedValue(value) {
    value = DiceCalc.parse(value).calcAverage();

    if (isNaN(value))
      return -1;

    return value;
  }

}

class SensesSearch extends LibraryMultiListSearch {

  constructor() {
    super('senses', '/rpgs/dnd/api/list-creature-senses', 'Darkvision, Blindsight, ...', 'Senses');
  }

}

class SavesSearch extends LibraryMultiListSearch {

  constructor() {
    super('saves', '/rpgs/dnd/api/list-creature-saves', 'Con, Dex, ...', 'Save Proficiencies');
  }

}

class SkillsSearch extends LibraryMultiListSearch {

  constructor() {
    super('skills', '/rpgs/dnd/api/list-creature-skills', 'Acrobatics, Athlestics, ...', 'Skill Proficiencies');
  }

}

class LegendarySearch extends LibraryBoolSearch {

  constructor() {
    super('legendary', 'Legendary');
  }

}

class LairSearch extends LibraryBoolSearch {

  constructor() {
    super('lair', 'Lair');
  }

}

class DamageVulnerabilitiesSearch extends LibraryMultiListSearch {

  constructor() {
    super('damage_vulnerabilities', '/rpgs/dnd/api/list-creature-damage-vulnerabilities', 'Fire, Piercing, ...', 'Vulnerabilities');
  }

}

class DamageResistancesSearch extends LibraryMultiListSearch {

  constructor() {
    super('damage_resistances', '/rpgs/dnd/api/list-creature-damage-resistances', 'Fire, Piercing, ...', 'Resistances');
  }

}

class DamageImmunitiesSearch extends LibraryMultiListSearch {

  constructor() {
    super('damage_immunities', '/rpgs/dnd/api/list-creature-damage-immunities', 'Fire, Piercing, ...', 'Immunities');
  }

}

class ConditionImmunitiesSearch extends LibraryMultiListSearch {

  constructor() {
    super('condition_immunities', '/rpgs/dnd/api/list-creature-condition-immunities', 'Stunned, Restrained, ...', 'Condition Immunities');
  }

}

class LanguagesSearch extends LibraryMultiListSearch {

  constructor() {
    super('languages', '/rpgs/dnd/api/list-creature-languages', 'Common, Dwarvish, ...', 'Languages');
  }

}

class MovementTypesSearch extends LibraryMultiListSearch {

  constructor() {
    super('speed', '/rpgs/dnd/api/list-creature-speeds', 'Fly, Climb, ...', 'Movement Types');
  }

}

class TagsSearch extends LibraryMultiListSearch {

  constructor() {
    super('tags', '/rpgs/dnd/api/list-creature-tags', 'Swarm, Cultist, ...', 'Tags');
  }

}

window.addEventListener('load', async () => {
  var list = await fetch("/rpgs/dnd/api/list-creatures", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  list = await list.json();
  list = list.result;

  new CreatureLibrary(list);
});