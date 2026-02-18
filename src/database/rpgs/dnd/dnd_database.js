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

}

DNDDatabase.instance = new DNDDatabase();

module.exports.DNDDatabase = DNDDatabase;