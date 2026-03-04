const _PATH = require('path');
const _DATABASE = require(_PATH.join(global.__path.src, 'database', 'database'));



class DNDDatabase extends _DATABASE.Database {

  /**
   * Creates an instance of UserDatabase.
   *
   * @constructor
   */
  constructor() {
    super(_PATH.join('rpgs', 'dnd', 'dnd.db'));
  }

  async listItemNames() {
    var table = await this.query('SELECT Items.ItemID AS id, Items.Name AS name FROM Items');
    table = table.map((row) => {
      row.name = row.name.replace(/\s|\//g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      return row;
    });
    return table;
  }

  async listItemRarities() {
    var table = await this.query('SELECT DISTINCT ItemRarities.Name AS rarity FROM Items INNER JOIN ItemRarities ON Items.ItemRarityID = ItemRarities.ItemRarityID');
    table = table.map((row) => {
      return row.rarity;
    });
    return table;
  }

  async listItemTypes() {
    var table = await this.query('SELECT DISTINCT ItemTypes.Name AS type FROM Items INNER JOIN ItemTypes ON Items.ItemTypeID = ItemTypes.ItemTypeID');
    table = table.map((row) => {
      return row.type;
    });
    return table;
  }

  async listItemSubtypes() {
    var table = await this.query('Select DISTINCT Items.Subtype AS subtype FROM Items WHERE Items.Subtype <> ""');
    table = table.map((row) => {
      return row.subtype;
    });
    return table;
  }

  async listItemAttributes() {
    var table = await this.query('Select DISTINCT Items.Attributes AS attributes FROM Items WHERE Items.Attributes <> "[]"');
    table = table.map((row) => {
      return JSON.parse(row.attributes);
    }).flat();
    return [...new Set(table)];
  }

  async listItemBonuses() {
    var table = await this.query('Select DISTINCT Items.Bonus AS bonus FROM Items WHERE Items.Bonus <> ""');
    table = table.map((row) => {
      return row.bonus;
    }).flat();
    return [...new Set(table)];
  }

  async listItemRequirements() {
    var table = await this.query('Select DISTINCT Items.Requirements AS requirements FROM Items WHERE Items.Requirements <> "[]"');
    table = table.map((row) => {
      return JSON.parse(row.requirements);
    }).flat();
    return [...new Set(table)];
  }

  async listItemTags() {
    var table = await this.query('Select DISTINCT Items.Tags AS tags FROM Items WHERE Items.Tags <> "[]"');
    table = table.map((row) => {
      return JSON.parse(row.tags);
    }).flat();
    return [...new Set(table)];
  }

  async listItems() {
    var table = await this.query('SELECT Items.ItemID AS id, Items.Name AS name, Items.Image as image, Items.ItemTypeID AS type_id, ItemTypes.Name AS type, Items.Subtype AS subtype, Items.Attributes AS attributes, Items.Bonus AS bonus, Items.ItemRarityID AS rarity_id, ItemRarities.Name AS rarity, Items.Requirements AS requirements, Items.Price AS price, Items.Weight AS weight, Items.Tags AS tags FROM Items INNER JOIN ItemRarities ON Items.ItemRarityID = ItemRarities.ItemRarityID INNER JOIN ItemTypes ON Items.ItemTypeID = ItemTypes.ItemTypeID');
    table = table.map((row) => {
      row.attributes = JSON.parse(row.attributes);
      row.requirements = JSON.parse(row.requirements);
      row.tags = JSON.parse(row.tags);
      return row;
    });
    return table;
  }

  async getItem(id) {
    var item = await this.queryFirst('SELECT Items.ItemID AS id, Items.Name AS name, Items.Image as image, Items.ItemTypeID AS type_id, ItemTypes.Name AS type, Items.Subtype AS subtype, Items.Attributes AS attributes, Items.Bonus AS bonus, Items.ItemRarityID AS rarity_id, ItemRarities.Name AS rarity, Items.Requirements AS requirements, Items.Price AS price, Items.Weight AS weight, Items.Description AS description, Items.Effects AS effects, Items.Notes AS notes, Items.Tags AS tags FROM Items INNER JOIN ItemRarities ON Items.ItemRarityID = ItemRarities.ItemRarityID INNER JOIN ItemTypes ON Items.ItemTypeID = ItemTypes.ItemTypeID WHERE Items.ItemID = ?', [id]);
    if (item == null)
      return null;
    item.attributes = JSON.parse(item.attributes);
    item.requirements = JSON.parse(item.requirements);
    item.description = JSON.parse(item.description);
    item.effects = JSON.parse(item.effects);
    item.notes = JSON.parse(item.notes);
    item.tags = JSON.parse(item.tags);
    return item;
  }

  async listCreatureNames() {
    var table = await this.query('SELECT Creatures.CreatureID AS id, Creatures.Name AS name FROM Creatures');
    table = table.map((row) => {
      row.name = row.name.replace(/\s|\//g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      return row;
    });
    return table;
  }

  async listCreatureSizes() {
    var table = await this.query('SELECT DISTINCT CreatureSizes.Name AS size FROM Creatures INNER JOIN CreatureSizes ON Creatures.CreatureSizeID = CreatureSizes.CreatureSizeID');
    table = table.map((row) => {
      return row.size;
    });
    return table;
  }

  async listCreatureTypes() {
    var table = await this.query('SELECT DISTINCT CreatureTypes.Name AS type FROM Creatures INNER JOIN CreatureTypes ON Creatures.CreatureTypeID = CreatureTypes.CreatureTypeID');
    table = table.map((row) => {
      return row.type;
    });
    return table;
  }

  async listCreatureSubtypes() {
    var table = await this.query('SELECT DISTINCT Creatures.Subtype AS subtype FROM Creatures WHERE Creatures.Subtype <> ""');
    table = table.map((row) => {
      return row.subtype;
    });
    return table;
  }

  async listCreatureAlignments() {
    var table = await this.query('SELECT DISTINCT Creatures.Alignment AS alignment FROM Creatures WHERE Creatures.Alignment <> ""');
    table = table.map((row) => {
      return row.alignment;
    });
    return table;
  }

  async listCreatureArmorClasses() {
    var table = await this.query('SELECT DISTINCT Creatures.ArmorClass AS ac FROM Creatures');
    table = table.map((row) => {
      return row.ac;
    });
    return table;
  }

  async listCreatureSpeeds() {
    var table = await this.query('SELECT Creatures.Speed AS speed FROM Creatures');
    table = table.map((row) => {
      return Object.keys(JSON.parse(row.speed));
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureSaves() {
    var table = await this.query('SELECT Creatures.SavingThrows AS saves FROM Creatures');
    table = table.map((row) => {
      return Object.keys(JSON.parse(row.saves));
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureSkills() {
    var table = await this.query('SELECT Creatures.Skills AS skills FROM Creatures');
    table = table.map((row) => {
      return Object.keys(JSON.parse(row.skills));
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureDamageResistances() {
    var table = await this.query('SELECT Creatures.DamageResistances AS damage_resistances FROM Creatures');
    table = table.map((row) => {
      return JSON.parse(row.damage_resistances);
    }).flat();
    return [...new Set(table)];
  }
  
  async listCreatureDamageVulnerabilities() {
    var table = await this.query('SELECT Creatures.DamageVulnerabilities AS damage_vulnerabilities FROM Creatures');
    table = table.map((row) => {
      return JSON.parse(row.damage_vulnerabilities);
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureDamageImmunities() {
    var table = await this.query('SELECT Creatures.DamageImmunities AS damage_immunities FROM Creatures');
    table = table.map((row) => {
      return JSON.parse(row.damage_immunities);
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureConditionImmunities() {
    var table = await this.query('SELECT Creatures.ConditionImmunities AS condition_immunities FROM Creatures');
    table = table.map((row) => {
      return JSON.parse(row.condition_immunities);
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureSenses() {
    var table = await this.query('SELECT Creatures.Senses AS senses FROM Creatures');
    table = table.map((row) => {
      return Object.keys(JSON.parse(row.senses));
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureLanguages() {
    var table = await this.query('SELECT Creatures.Languages AS languages FROM Creatures');
    table = table.map((row) => {
      return JSON.parse(row.languages);
    }).flat();
    return [...new Set(table)];
  }

  async listCreatureChallengeRatings() {
    var table = await this.query('SELECT DISTINCT Creatures.ChallengeRating AS cr FROM Creatures');
    table = table.map((row) => {
      return row.cr;
    });
    return table;
  }

  async listCreatureHabitats() {
    var table = await this.query('SELECT DISTINCT Creatures.Habitat as habitat FROM Creatures WHERE Creatures.Habitat <> ""');
    table = table.map((row) => {
      return row.habitat;
    });
    return table;
  }

  async listCreatureTags() {
    var table = await this.query('SELECT Creatures.Tags AS tags FROM Creatures WHERE Creatures.Tags <> "[]"');
    table = table.map((row) => {
      return JSON.parse(row.tags);
    }).flat();
    return [...new Set(table)];
  }

  async listCreatures() {
    var table = await this.query('SELECT Creatures.CreatureID AS id, Creatures.Name AS name, Creatures.Image AS image, Creatures.CreatureSizeID AS size_id, CreatureSizes.Name AS size, Creatures.CreatureTypeID AS type_id, CreatureTypes.Name AS type, Creatures.Subtype AS subtype, Creatures.Alignment AS alignment, Creatures.ArmorClass AS ac, Creatures.HitPoints AS hp, Creatures.Speed AS speed, Creatures.SavingThrows AS saves, Creatures.Skills AS skills, Creatures.DamageVulnerabilities AS damage_vulnerabilities, Creatures.DamageResistances AS damage_resistances, Creatures.DamageImmunities AS damage_immunities, Creatures.ConditionImmunities AS condition_immunities, Creatures.Senses AS senses, Creatures.Languages AS languages, Creatures.ChallengeRating AS cr, Creatures.LegendaryActions AS legendary, Creatures.Lair AS lair, Creatures.Habitat AS habitat, Creatures.Tags AS tags FROM Creatures INNER JOIN CreatureTypes ON Creatures.CreatureTypeID = CreatureTypes.CreatureTypeID INNER JOIN CreatureSizes ON Creatures.CreatureSizeID = CreatureSizes.CreatureSizeID');
    table = table.map((row) => {
      row.speed = Object.keys(JSON.parse(row.speed));
      row.saves = Object.keys(JSON.parse(row.saves));
      row.skills = Object.keys(JSON.parse(row.skills));
      row.damage_vulnerabilities = JSON.parse(row.damage_vulnerabilities);
      row.damage_resistances = JSON.parse(row.damage_resistances);
      row.damage_immunities = JSON.parse(row.damage_immunities);
      row.condition_immunities = JSON.parse(row.condition_immunities);
      row.senses = Object.keys(JSON.parse(row.senses));
      row.languages = JSON.parse(row.languages);
      row.legendary = JSON.parse(row.legendary);
      row.legendary = row.legendary.description.length > 0 || row.legendary.effects.length > 0;
      row.lair = JSON.parse(row.lair);
      row.lair = row.lair.description.length > 0 || row.lair.actions.length > 0 || row.lair.effects.length > 0;
      row.tags = JSON.parse(row.tags);
      return row;
    });
    return table;
  }

  async getCreature(id) {
    var creature = await this.queryFirst('SELECT Creatures.BonusActions AS bonus_actions, Creatures.CreatureID AS id, Creatures.Name AS name, Creatures.Image AS image, CreatureSizes.Name AS size, CreatureTypes.Name AS type, Creatures.Subtype AS subtype, Creatures.Alignment AS alignment, Creatures.ArmorClass AS ac, Creatures.Armor AS armor, Creatures.HitPoints AS hp, Creatures.Speed AS speed, CONCAT("{""str"": ", Creatures.Strength, ", ""dex"": ", Creatures.Dexterity, ", ""con"": ", Creatures.Constitution, ", ""int"": ", Creatures.Intelligence, ", ""wis"": ", Creatures.Wisdom, ", ""cha"": ", Creatures.Charisma, "}") AS stats, Creatures.SavingThrows AS saves, Creatures.Skills AS skills, Creatures.DamageVulnerabilities AS damage_vulnerabilities, Creatures.DamageResistances AS damage_resistances, Creatures.DamageImmunities AS damage_immunities, Creatures.ConditionImmunities AS condition_immunities, Creatures.Senses AS senses, Creatures.Languages AS languages, Creatures.ChallengeRating AS cr, Creatures.ProficiencyBonus AS proficiency, Creatures.Traits AS traits, Creatures.Actions AS actions, Creatures.Reactions AS reactions, Creatures.LegendaryActions AS legendary_actions, Creatures.Description AS description, Creatures.Lair AS lair, Creatures.Habitat AS habitat, Creatures.Tags AS tags FROM Creatures INNER JOIN CreatureTypes ON Creatures.CreatureTypeID = CreatureTypes.CreatureTypeID INNER JOIN CreatureSizes ON Creatures.CreatureSizeID = CreatureSizes.CreatureSizeID WHERE Creatures.CreatureID = ?', [id]);
    if (creature == null)
      return null;
    creature.armor = JSON.parse(creature.armor);
    creature.speed = JSON.parse(creature.speed);
    creature.stats = JSON.parse(creature.stats);
    creature.saves = JSON.parse(creature.saves);
    creature.skills = JSON.parse(creature.skills);
    creature.damage_vulnerabilities = JSON.parse(creature.damage_vulnerabilities);
    creature.damage_resistances = JSON.parse(creature.damage_resistances);
    creature.damage_immunities = JSON.parse(creature.damage_immunities);
    creature.condition_immunities = JSON.parse(creature.condition_immunities);
    creature.senses = JSON.parse(creature.senses);
    creature.languages = JSON.parse(creature.languages);
    creature.traits = JSON.parse(creature.traits);
    creature.actions = JSON.parse(creature.actions);
    creature.bonus_actions = JSON.parse(creature.bonus_actions);
    creature.reactions = JSON.parse(creature.reactions);
    creature.legendary_actions = JSON.parse(creature.legendary_actions);
    creature.description = JSON.parse(creature.description);
    creature.lair = JSON.parse(creature.lair);
    creature.tags = JSON.parse(creature.tags);
    return creature;
  }

  async listSpellNames() {
    var table = await this.query('SELECT Spells.SpellID AS id, Spells.Name AS name FROM Spells');
    table = table.map((row) => {
      row.name = row.name.replace(/\s|\//g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      return row;
    });
    return table;
  }

  async listSpellLevels() {
    var table = await this.query('SELECT DISTINCT Spells.Level AS level FROM Spells');
    table = table.map((row) => {
      if (row.level == 0)
        return 'Cantrip';
      if (row.level % 10 == 1)
        return row.level + 'st';
      if (row.level % 10 == 2)
        return row.level + 'nd';
      if (row.level % 10 == 3)
        return row.level + 'rd';
      return row.level + 'th';
    });
    return table;
  }

  async listSpellSchools() {
    var table = await this.query('SELECT DISTINCT SpellSchools.Name AS school FROM Spells INNER JOIN SpellSchools ON Spells.SpellSchoolID = SpellSchools.SpellSchoolID');
    table = table.map((row) => {
      return row.school;
    });
    return table;
  }

  async listSpellCastingTimes() {
    var table = await this.query('SELECT DISTINCT Spells.CastingTime AS casting_time FROM Spells');
    table = table.map((row) => {
      return JSON.parse(row.casting_time).type;
    });
    return [...new Set(table)];
  }

  async listSpellClasses() {
    var table = await this.query('SELECT DISTINCT Spells.Classes AS classes FROM Spells');
    table = table.map((row) => {
      return JSON.parse(row.classes);
    }).flat();
    return [...new Set(table)];
  }

  async listSpellSaves() {
    var table = await this.query('SELECT DISTINCT SpellSaves.Name AS save FROM Spells INNER JOIN SpellSaves ON Spells.SpellSaveID = SpellSaves.SpellSaveID');
    table = table.map((row) => {
      return row.save;
    });
    return [...new Set(table)];
  }

  async listSpellAttacks() {
    var table = await this.query('SELECT DISTINCT SpellAttackTypes.Name AS attack FROM Spells INNER JOIN SpellAttackTypes ON Spells.SpellAttackTypeID = SpellAttackTypes.SpellAttackTypeID');
    table = table.map((row) => {
      return row.attack;
    });
    return [...new Set(table)];
  }

  async listSpellDamageTypes() {
    var table = await this.query('SELECT DISTINCT Spells.DamageTypes AS damage FROM Spells');
    table = table.map((row) => {
      return JSON.parse(row.damage);
    }).flat();
    return [...new Set(table)];
  }

  async listSpellConditions() {
    var table = await this.query('SELECT DISTINCT Spells.Conditions AS conditions FROM Spells');
    table = table.map((row) => {
      return JSON.parse(row.conditions);
    }).flat();
    return [...new Set(table)];
  }

  async listSpellComponents() {
    var table = await this.query('SELECT DISTINCT Spells.Components AS components FROM Spells');
    table = table.map((row) => {
      return JSON.parse(row.components).map((component) => {
        return component.type;
      });
    }).flat();
    return [...new Set(table)];
  }

  async listSpellTags() {
    var table = await this.query('SELECT DISTINCT Spells.Tags AS tags FROM Spells');
    table = table.map((row) => {
      return JSON.parse(row.tags);
    }).flat();
    return [...new Set(table)];
  }

  async listSpells() {
    var table = await this.query('SELECT Spells.Ritual AS ritual, Spells.Concentration AS concentration, Spells.Conditions AS conditions, Spells.Classes AS classes, Spells.SpellID AS id, Spells.Name AS name, Spells.Image AS image, Spells.Level AS level, SpellSchools.Name AS school, Spells.Components AS components, Spells.CastingTime AS casting_time, Spells.Duration AS duration, Spells.Range AS range, Spells.Area AS area, SpellAttackTypes.Name AS attack, SpellSaves.Name AS save, Spells.DamageTypes AS damage, Spells.Effect AS effect, Spells.Tags AS tags FROM Spells INNER JOIN SpellSchools ON Spells.SpellSchoolID = SpellSchools.SpellSchoolID INNER JOIN SpellSaves ON Spells.SpellSaveID = SpellSaves.SpellSaveID INNER JOIN SpellAttackTypes ON Spells.SpellAttackTypeID = SpellAttackTypes.SpellAttackTypeID');
    table = table.map((row) => {
      if (row.level == 0)
        row.level = 'Cantrip';
      else if (row.level % 10 == 1)
        row.level = row.level + 'st';
      else if (row.level % 10 == 2)
        row.level = row.level + 'nd';
      else if (row.level % 10 == 3)
        row.level = row.level + 'rd';
      else
        row.level = row.level + 'th';

      row.components = JSON.parse(row.components);
      row.subname = row.school + ' • ' + row.components.map((component) => {
        if (component.type == 'verbal')
          return 'V';
        if (component.type == 'somatic')
          return 'S';
        if (component.type == 'material')
          return 'M';
        return '';
      }).join(', ');
      row.component_types = row.components.map((component) => {
        return component.type;
      });

      row.casting_time = JSON.parse(row.casting_time).type;

      row.range_area = row.range;
      if (row.area.length > 0)
        row.range_area += ' (' + row.area + ')';

      row.damage = JSON.parse(row.damage);
      row.damage_effect = [];
      if (row.damage.length == 1)
        row.damage_effect.push(row.damage[0])
      else if (row.damage.length > 1)
        row.damage_effect.push(row.damage[0] + ' (...)');
      if (row.effect.length > 0)
        row.damage_effect.push(row.effect);
      row.damage_effect = row.damage_effect.join(', ');

      row.tags = JSON.parse(row.tags);
      row.classes = JSON.parse(row.classes);
      row.conditions = JSON.parse(row.conditions);
      row.ritual = row.ritual != 0;
      row.concentration = row.concentration != 0;

      return row;
    });
    return table;
  }

  async getSpell(id) {
    var spell = await this.queryFirst('SELECT Spells.SpellID AS id, Spells.Name AS name, Spells.Image AS image, Spells.Level AS level, Spells.SpellSchoolID AS school_id, SpellSchools.Name AS school, Spells.Ritual AS ritual, Spells.Concentration AS concentration, Spells.CastingTime AS casting_time, Spells.Duration AS duration, Spells.Range AS range, Spells.Area AS area, Spells.SpellSaveID AS save_id, SpellSaves.Name AS save, Spells.SpellAttackTypeID AS attack_id, SpellAttackTypes.Name AS attack, Spells.DamageTypes AS damage, Spells.Conditions AS conditions, Spells.Components AS components, Spells.Description AS description, Spells.HigherLevels AS higher, Spells.Notes AS notes, Spells.Tags AS tags, Spells.Classes AS classes, Spells.Effect AS effect FROM Spells INNER JOIN SpellSchools ON Spells.SpellSchoolID = SpellSchools.SpellSchoolID INNER JOIN SpellSaves ON Spells.SpellSaveID = SpellSaves.SpellSaveID INNER JOIN SpellAttackTypes ON Spells.SpellAttackTypeID = SpellAttackTypes.SpellAttackTypeID WHERE Spells.SpellID = ?', [id]);
    if (spell == null)
      return null;
    spell.damage = JSON.parse(spell.damage);
    spell.conditions = JSON.parse(spell.conditions);
    spell.components = JSON.parse(spell.components);
    spell.description = JSON.parse(spell.description);
    spell.higher = JSON.parse(spell.higher);
    spell.notes = JSON.parse(spell.notes);
    spell.tags = JSON.parse(spell.tags);
    spell.classes = JSON.parse(spell.classes);
    spell.ritual = spell.ritual != 0;
    spell.concentration = spell.concentration != 0;
    spell.casting_time = JSON.parse(spell.casting_time);
    return spell;
  }

}

DNDDatabase.instance = new DNDDatabase();

module.exports.DNDDatabase = DNDDatabase;