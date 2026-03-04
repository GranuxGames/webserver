class SpellLibrary extends Library {

  constructor(list) {
    super('/rpgs/dnd/api/get-spell', '/resources/imgs/dynamic/rpgs/dnd/spells/', DNDSpell, '/rpgs/dnd/spells/', list,
          [{title: 'LEVEL',         size: '3em',  text: [['level']],         subtext: []},
           {title: 'NAME',          size: '13em', text: [['name']],          subtext: [['subname']]},
           {title: 'CASTING TIME',  size: '7em',  text: [['casting_time']],  subtext: []},
           {title: 'DURATION',      size: '7em',  text: [['duration']],      subtext: []},
           {title: 'RANGE/AREA',    size: '10em', text: [['range']],         subtext: [['area']]},
           {title: 'DAMAGE/EFFECT', size: '8em',  text: [['damage_effect']], subtext: []},
           {title: 'TAGS',          size: '13em', text: [['tags']],          subtext: []}]);
    
    this.addFilter(new NameSearch());
    this.addFilter(new LevelSearch());
    this.addFilter(new SchoolSearch());
    this.addFilter(new CastingTimeSearch());
    this.addFilter(new ClassesSearch());
    this.addFilter(new SaveSearch());
    this.addFilter(new AttackSearch());
    this.addFilter(new DamageSearch());
    this.addFilter(new ConditionsSearch());
    this.addFilter(new ComponentSearch());
    this.addFilter(new ConcentrationSearch());
    this.addFilter(new RitualSearch());
    this.addFilter(new TagsSearch());
  }

  randomize() {
    var rows = this.getFiltered();
    var levels = [];
    rows = rows.map((row) => {
      var level = row.level;
      if (level == 'Cantrip')
        level = 0;
      else
        level = Number.parseInt(row.level);
      row.level_number = level;
      if (!levels.includes(level))
        levels.push(level);
      return row;
    });
    levels = levels.map((level) => {
      var row = {'level': level};
      row.random_weight = Math.round(Math.pow(1.3, 9 - row.level));
      return row;
    }).filter((row) => {
      return row.level != 0;
    });
    var level = this.weightedRandom(levels);
    rows = rows.filter((row) => {
      return row.level_number == level.level;
    });

    return rows[Math.floor(Math.random() * rows.length)];
  }

}

class NameSearch extends LibraryStringSearch {

  constructor() {
    super('name', 'Spell Name');
  }

}

class LevelSearch extends LibrarySingleListSearch {

  constructor() {
    super('level', '/rpgs/dnd/api/list-spell-levels', '1st, 2nd, ...', 'Level');
  }

}

class SchoolSearch extends LibrarySingleListSearch {

  constructor() {
    super('school', '/rpgs/dnd/api/list-spell-schools', 'Necromancy, Evocation, ...', 'School');
  }

}

class CastingTimeSearch extends LibrarySingleListSearch {

  constructor() {
    super('casting_time', '/rpgs/dnd/api/list-spell-casting-times', '1 Action, 1 Reaction, ...', 'Casting Time');
  }

}

class ClassesSearch extends LibraryMultiListSearch {

  constructor() {
    super('classes', '/rpgs/dnd/api/list-spell-classes', 'Sorcerer, Wizard, ...', 'Classes');
  }

}

class SaveSearch extends LibrarySingleListSearch {

  constructor() {
    super('save', '/rpgs/dnd/api/list-spell-saves', 'Constitution, Dexterity, ...', 'Save Required');
  }

}

class AttackSearch extends LibrarySingleListSearch {

  constructor() {
    super('attack', '/rpgs/dnd/api/list-spell-attacks', 'Melee, Ranged, ...', 'Attack Type');
  }

}

class DamageSearch extends LibraryMultiListSearch {

  constructor() {
    super('damage', '/rpgs/dnd/api/list-spell-damage-types', 'Acid, Fire, ...', 'Damage Types');
  }

}

class ConditionsSearch extends LibraryMultiListSearch {

  constructor() {
    super('condition', '/rpgs/dnd/api/list-spell-conditions', 'Stunned, Restrained, ...', 'Conditions');
  }

}

class ComponentSearch extends LibraryMultiListSearch {

  constructor() {
    super('component_types', '/rpgs/dnd/api/list-spell-components', 'Material, Verbal, ...', 'Components');
  }

}

class ConcentrationSearch extends LibraryBoolSearch {

  constructor() {
    super('concentration', 'Concentration');
  }

}

class RitualSearch extends LibraryBoolSearch {

  constructor() {
    super('ritual', 'Ritual');
  }

}

class TagsSearch extends LibraryMultiListSearch {

  constructor() {
    super('tags', '/rpgs/dnd/api/list-spell-tags', 'Damage, Buff, ...', 'Tags');
  }

}

window.addEventListener('load', async () => {
  var list = await fetch("/rpgs/dnd/api/list-spells", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  list = await list.json();
  list = list.result;

  new SpellLibrary(list);
});