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
      row.name = row.name.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
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
      row.name = row.name.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
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
    var creature = await this.queryFirst('SELECT Creatures.CreatureID AS id, Creatures.Name AS name, Creatures.Image AS image, CreatureSizes.Name AS size, CreatureTypes.Name AS type, Creatures.Subtype AS subtype, Creatures.Alignment AS alignment, Creatures.ArmorClass AS ac, Creatures.Armor AS armor, Creatures.HitPoints AS hp, Creatures.Speed AS speed, CONCAT("{""str"": ", Creatures.Strength, ", ""dex"": ", Creatures.Dexterity, ", ""con"": ", Creatures.Constitution, ", ""int"": ", Creatures.Intelligence, ", ""wis"": ", Creatures.Wisdom, ", ""cha"": ", Creatures.Charisma, "}") AS stats, Creatures.SavingThrows AS saves, Creatures.Skills AS skills, Creatures.DamageVulnerabilities AS damage_vulnerabilities, Creatures.DamageResistances AS damage_resistances, Creatures.DamageImmunities AS damage_immunities, Creatures.ConditionImmunities AS condition_immunities, Creatures.Senses AS senses, Creatures.Languages AS languages, Creatures.ChallengeRating AS cr, Creatures.ProficiencyBonus AS proficiency, Creatures.Traits AS traits, Creatures.Actions AS actions, Creatures.Reactions AS reactions, Creatures.LegendaryActions AS legendary_actions, Creatures.Description AS description, Creatures.Lair AS lair, Creatures.Habitat AS habitat, Creatures.Tags AS tags FROM Creatures INNER JOIN CreatureTypes ON Creatures.CreatureTypeID = CreatureTypes.CreatureTypeID INNER JOIN CreatureSizes ON Creatures.CreatureSizeID = CreatureSizes.CreatureSizeID WHERE Creatures.CreatureID = ?', [id]);
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
    creature.reactions = JSON.parse(creature.reactions);
    creature.legendary_actions = JSON.parse(creature.legendary_actions);
    creature.description = JSON.parse(creature.description);
    creature.lair = JSON.parse(creature.lair);
    creature.tags = JSON.parse(creature.tags);
    return creature;
  }

}

DNDDatabase.instance = new DNDDatabase();

module.exports.DNDDatabase = DNDDatabase;