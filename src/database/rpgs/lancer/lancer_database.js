const _PATH = require('path');
const _DATABASE = require(_PATH.join(global.__path.src, 'database', 'database'));



class LancerDatabase extends _DATABASE.Database {

  /**
   * Creates an instance of LancerDatabase.
   *
   * @constructor
   */
  constructor() {
    super(_PATH.join('rpgs', 'lancer', 'lancer.db'));

    this.fetchFunctions = {
      'corebonus': this.fetchCoreBonus.bind(this),
      'coresystem': this.fetchCoreSystem.bind(this),
      'frame': this.fetchFrame.bind(this),
      'freeaction': this.fetchFreeAction.bind(this),
      'fullaction': this.fetchFullAction.bind(this),
      'invasion': this.fetchInvasion.bind(this),
      'licenserank': this.fetchLicenseRank.bind(this),
      'license': this.fetchLicense.bind(this),
      'manufacturer': this.fetchManufacturer.bind(this),
      'quickaction': this.fetchQuickAction.bind(this),
      'reaction': this.fetchReaction.bind(this),
      'system': this.fetchSystem.bind(this),
      'talentrank': this.fetchTalentRank.bind(this),
      'talent': this.fetchTalent.bind(this),
      'tech': this.fetchTech.bind(this),
      'trait': this.fetchTrait.bind(this),
      'weapon': this.fetchWeapon.bind(this)
    }
  }

  // TODO: fix potential infinite loop of attachments (maybe pass a dict of visited nodes throughout all requests?)
  async getAttachments(text) {
    var attachments = { references: [], inline: [] };
    var regex = new RegExp("§(" + Object.keys(this.fetchFunctions).join('|') + "):(\\d+)§", "gm");

    if (Array.isArray(text)) {
      for (var element of text) {
        var at = await this.getAttachments(element);
        attachments.references = attachments.references.concat(at.references);
        attachments.inline = attachments.inline.concat(at.inline);
      }
      return attachments;
    }

    if (typeof text == 'object') {
      if (text.id != null && text.type != null && this.fetchFunctions[text.type] != null) {
        attachments.inline.push(await this.fetchFunctions[text.type](text.id));
        return attachments;
      }

      for (var element of Object.keys(text).concat(Object.values(text))) {
        var at = await this.getAttachments(element);
        attachments.references = attachments.references.concat(at.references);
        attachments.inline = attachments.inline.concat(at.inline);
      }
      return attachments;
    }

    var matches = text.matchAll(regex);
    for (var match of matches) {
      if (this.fetchFunctions[match[1]] == null)
        continue;

      attachments.references.push(await this.fetchFunctions[match[1]](Number.parseInt(match[2])));
    }
    return attachments;
  }

  async handleCoreBonus(row) {
    var coreBonus = {};
    coreBonus.element_type = 'corebonus';
    coreBonus.id = row.ID;
    coreBonus.manufacturer_id = row.ManufacturerID;
    coreBonus.name = row.Name;
    coreBonus.flavor = JSON.parse(row.Flavor);
    coreBonus.effect = JSON.parse(row.Effect);
    coreBonus.attachments = await this.getAttachments(coreBonus.effect);
    return coreBonus;
  }

  async fetchCoreBonus(id) {
    var coreBonus = await this.queryFirst('SELECT * FROM CoreBonus WHERE CoreBonus.ID == ?', [id]);
    coreBonus = await this.handleCoreBonus(coreBonus);
    return coreBonus;
  }

  async fetchCoreBonussByManufacturerID(id) {
    var coreBonuss = await this.query('SELECT * FROM CoreBonus WHERE CoreBonus.ManufacturerID == ?', [id]);
    coreBonuss = await Promise.all(coreBonuss.map(async (coreBonus) => {
      return await this.handleCoreBonus(coreBonus);
    }));
    return coreBonuss;
  }

  async fetchCoreBonuss() {
    var coreBonuss = await this.query('SELECT * FROM CoreBonus');
    coreBonuss = await Promise.all(coreBonuss.map(async (coreBonus) => {
      return await this.handleCoreBonus(coreBonus);
    }));
    return coreBonuss;
  }

  async handleCoreSystem(row) {
    var coreSystem = {};
    coreSystem.element_type = 'coresystem';
    coreSystem.id = row.ID;
    coreSystem.frame_id = row.FrameID;
    coreSystem.name = row.Name;
    coreSystem.flavor = JSON.parse(row.Flavor);
    coreSystem.systems = await Promise.all(JSON.parse(row.Systems).map(async (system) => {
      if (system.type == 'system')
        return await this.fetchSystem(system.value);
      if (system.type == 'weapon')
        return await this.fetchWeapon(system.value);
      if (system.type == 'tech')
        return await this.fetchTech(system.value);
      return null;
    }));
    return coreSystem;
  }

  async fetchCoreSystem(id) {
    var coreSystem = await this.queryFirst('SELECT * FROM CoreSystems WHERE CoreSystems.ID == ?', [id]);
    coreSystem = await this.handleCoreSystem(coreSystem);
    return coreSystem;
  }

  async fetchCoreSystemByFrameID(id) {
    var coreSystem = await this.queryFirst('SELECT * FROM CoreSystems WHERE CoreSystems.FrameID == ?', [id]);
    coreSystem = await this.handleCoreSystem(coreSystem);
    return coreSystem;
  }

  async fetchCoreSystems() {
    var coreSystems = await this.query('SELECT * FROM CoreSystems');
    coreSystems = await Promise.all(coreSystems.map(async (coreSystem) => {
      return await this.handleCoreSystem(coreSystem);
    }));
    return coreSystems;
  }

  async handleFrame(row) {
    var frame = {};
    frame.element_type = 'frame';
    frame.id = row.ID;
    frame.name = row.Name;
    frame.role_id = row.RoleID;
    frame.role = row.Role;
    frame.flavor = JSON.parse(row.Flavor);
    frame.image = row.Image;
    frame.stats = {
      size: row.Size,
      armor: row.Armor,
      save_target: row.SaveTarget,
      sensors: row.Sensors,
      hp: row.HP,
      repair_cap: row.RepairCap,
      evasion: row.Evasion,
      speed: row.Speed,
      e_defense: row.EDefense,
      tech_attack: row.TechAttack,
      sp: row.SP,
      heat_cap: row.HeatCap
    };
    frame.mounts = JSON.parse(row.Mounts);
    frame.traits = await this.fetchTraitsByFrameID(frame.id);
    frame.core = await this.fetchCoreSystemByFrameID(frame.id);
    return frame;
  }

  async fetchFrame(id) {
    var frame = await this.queryFirst('SELECT Frames.*, Roles.Name AS Role FROM Frames INNER JOIN Roles ON Frames.RoleID == Roles.ID WHERE Frames.ID == ?', [id]);
    frame = await this.handleFrame(frame);
    return frame;
  }

  async fetchFramesByLicenseID(id) {
    var frames = await this.query('SELECT Frames.*, Roles.Name AS Role FROM Frames INNER JOIN Roles ON Frames.RoleID == Roles.ID WHERE Frames.LicenseID == ?', [id]);
    frames = await Promise.all(frames.map(async (frame) => {
      return await this.handleFrame(frame);
    }));
    return frames;
  }

  async fetchFrames() {
    var frames = await this.query('SELECT Frames.*, Roles.Name AS Role FROM Frames INNER JOIN Roles ON Frames.RoleID == Roles.ID');
    frames = await Promise.all(frames.map(async (frame) => {
      return await this.handleFrame(frame);
    }));
    return frames;
  }

  async handleFreeAction(row) {
    var tags = await this.query('SELECT * FROM Tags');
    tags = this.tableToDict(tags);
    var freeAction = {};
    freeAction.element_type = 'freeaction';
    freeAction.id = row.ID;
    freeAction.name = row.Name;
    freeAction.tags = JSON.parse(row.Tags).map((tag) => {
      return {
        type_id: tag.type,
        type: tags[tag.type].Name,
        value: tag.value
      };
    });
    freeAction.cost = this.tableToDict(JSON.parse(row.Cost), 'type');
    freeAction.effect = JSON.parse(row.Effect);
    freeAction.attachments = await this.getAttachments(freeAction.effect);
    return freeAction;
  }

  async fetchFreeAction(id) {
    var freeAction = await this.queryFirst('SELECT * FROM FreeActions WHERE FreeActions.ID == ?', [id]);
    freeAction = await this.handleFreeAction(freeAction);
    return freeAction;
  }

  async fetchFreeActions() {
    var freeActions = await this.query('SELECT * FROM FreeActions');
    freeActions = await Promise.all(freeActions.map(async (freeAction) => {
      return await this.handleFreeAction(freeAction);
    }));
    return freeActions;
  }

  async handleFullAction(row) {
    var tags = await this.query('SELECT * FROM Tags');
    tags = this.tableToDict(tags);
    var fullAction = {};
    fullAction.element_type = 'fullaction';
    fullAction.id = row.ID;
    fullAction.name = row.Name;
    fullAction.tags = JSON.parse(row.Tags).map((tag) => {
      return {
        type_id: tag.type,
        type: tags[tag.type].Name,
        value: tag.value
      };
    });
    fullAction.cost = this.tableToDict(JSON.parse(row.Cost), 'type');
    fullAction.effect = JSON.parse(row.Effect);
    fullAction.attachments = await this.getAttachments(fullAction.effect);
    return fullAction;
  }

  async fetchFullAction(id) {
    var fullAction = await this.queryFirst('SELECT * FROM FullActions WHERE FullActions.ID == ?', [id]);
    fullAction = await this.handleFullAction(fullAction);
    return fullAction;
  }

  async fetchFullActions() {
    var fullActions = await this.query('SELECT * FROM FullActions');
    fullActions = await Promise.all(fullActions.map(async (fullAction) => {
      return await this.handleFullAction(fullAction);
    }));
    return fullActions;
  }

  async handleInvasion(row) {
    var invasion = {};
    invasion.element_type = 'invasion';
    invasion.id = row.ID;
    invasion.name = row.Name;
    invasion.effect = JSON.parse(row.Effect);
    invasion.attachments = await this.getAttachments(invasion.effect);
    return invasion;
  }

  async fetchInvasion(id) {
    var invasion = await this.queryFirst('SELECT * FROM Invasions WHERE Invasions.ID == ?', [id]);
    invasion = await this.handleInvasion(invasion);
    return invasion;
  }

  async fetchInvasions() {
    var invasions = await this.query('SELECT * FROM Invasions');
    invasions = await Promise.all(invasions.map(async (invasion) => {
      return await this.handleInvasion(invasion);
    }));
    return invasions;
  }

  async handleLicenseRank(row) {
    var licenseRank = {};
    licenseRank.element_type = 'licenserank';
    licenseRank.id = row.ID;
    licenseRank.license_id = row.LicenseID;
    licenseRank.rewards = await Promise.all(JSON.parse(row.Values).map(async (reward) => {
      if (reward.type == 'weapon')
        return await this.fetchWeapon(reward.value);
      if (reward.type == 'system')
        return await this.fetchSystem(reward.value);
      if (reward.type == 'tech')
        return await this.fetchTech(reward.value);
      return null;
    }));
    return licenseRank;
  }

  async fetchLicenseRank(id) {
    var licenseRank = await this.queryFirst('SELECT * FROM LicenseRanks WHERE LicenseRanks.ID == ?', [id]);
    licenseRank = await this.handleLicenseRank(licenseRank);
    return licenseRank;
  }

  async fetchLicenseRanksByLicenseID(id) {
    var licenseRanks = await this.query('SELECT * FROM LicenseRanks WHERE LicenseRanks.LicenseID == ?', [id]);
    licenseRanks = licenseRanks.sort((licenseRankA, licenseRankB) => {
      return licenseRankA.Rank - licenseRankB.Rank;
    });
    licenseRanks = await Promise.all(licenseRanks.map(async (licenseRank) => {
      return await this.handleLicenseRank(licenseRank);
    }));
    return licenseRanks;
  }

  async handleLicense(row) {
    var license = {};
    license.element_type = 'license';
    license.id = row.ID;
    license.frames = await this.fetchFramesByLicenseID(license.id);
    license.ranks = await this.fetchLicenseRanksByLicenseID(license.id);
    return license;
  }

  async fetchLicense(id) {
    var license = await this.queryFirst('SELECT * FROM Licenses WHERE Licenses.ID == ?', [id]);
    license = await this.handleLicense(license);
    return license;
  }

  async fetchLicensesByManufacturerID(id) {
    var licenses = await this.query('SELECT * FROM Licenses WHERE Licenses.ManufacturerID == ?', [id]);
    licenses = await Promise.all(licenses.map(async (license) => {
      return await this.handleLicense(license);
    }));
    return licenses;
  }

  async fetchLicenses() {
    var licenses = await this.query('SELECT * FROM Licenses');
    licenses = await Promise.all(licenses.map(async (license) => {
      return await this.handleLicense(license);
    }));
    return licenses;
  }

  async handleManufacturer(row) {
    var manufacturer = {};
    manufacturer.element_type = 'manufacturer';
    manufacturer.id = row.ID;
    manufacturer.name = row.Name;
    manufacturer.abbreviation = row.Abbreviation;
    manufacturer.motd = row.MOTD;
    manufacturer.flavor = JSON.parse(row.Flavor);
    manufacturer.core_bonuss = await this.fetchCoreBonussByManufacturerID(manufacturer.id);
    manufacturer.licenses = await this.fetchLicensesByManufacturerID(manufacturer.id);
    return manufacturer;
  }

  async fetchManufacturer(id) {
    var manufacturer = await this.queryFirst('SELECT * FROM Manufacturers WHERE Manufacturers.ID == ?', [id]);
    manufacturer = await this.handleManufacturer(manufacturer);
    return manufacturer;
  }

  async fetchManufacturers() {
    var manufacturers = await this.query('SELECT * FROM Manufacturers');
    manufacturers = await Promise.all(manufacturers.map(async (manufacturer) => {
      return await this.handleManufacturer(manufacturer);
    }));
    return manufacturers;
  }

  async handleQuickAction(row) {
    var tags = await this.query('SELECT * FROM Tags');
    tags = this.tableToDict(tags);
    var quickAction = {};
    quickAction.element_type = 'quickaction';
    quickAction.id = row.ID;
    quickAction.name = row.Name;
    quickAction.tags = JSON.parse(row.Tags).map((tag) => {
      return {
        type_id: tag.type,
        type: tags[tag.type].Name,
        value: tag.value
      };
    });
    quickAction.cost = this.tableToDict(JSON.parse(row.Cost), 'type');
    quickAction.effect = JSON.parse(row.Effect);
    quickAction.attachments = await this.getAttachments(quickAction.effect);
    return quickAction;
  }

  async fetchQuickAction(id) {
    var quickAction = await this.queryFirst('SELECT * FROM QuickActions WHERE QuickActions.ID == ?', [id]);
    quickAction = await this.handleQuickAction(quickAction);
    return quickAction;
  }

  async fetchQuickActions() {
    var quickActions = await this.query('SELECT * FROM QuickActions');
    quickActions = await Promise.all(quickActions.map(async (quickAction) => {
      return await this.handleQuickAction(quickAction);
    }));
    return quickActions;
  }

  async handleReaction(row) {
    var tags = await this.query('SELECT * FROM Tags');
    tags = this.tableToDict(tags);
    var reaction = {};
    reaction.element_type = 'reaction';
    reaction.id = row.ID;
    reaction.name = row.Name;
    reaction.frequency = JSON.parse(row.Frequency);
    reaction.tags = JSON.parse(row.Tags).map((tag) => {
      return {
        type_id: tag.type,
        type: tags[tag.type].Name,
        value: tag.value
      };
    });
    reaction.cost = this.tableToDict(JSON.parse(row.Cost), 'type');
    reaction.trigger = JSON.parse(row.Trigger);
    reaction.effect = JSON.parse(row.Effect);
    reaction.attachments = (await this.getAttachments(reaction.trigger.concat(reaction.effect)));
    return reaction;
  }

  async fetchReaction(id) {
    var reaction = await this.queryFirst('SELECT * FROM Reactions WHERE Reactions.ID == ?', [id]);
    reaction = await this.handleReaction(reaction);
    return reaction;
  }

  async fetchReactions() {
    var reactions = await this.query('SELECT * FROM Reactions');
    reactions = await Promise.all(reactions.map(async (reaction) => {
      return await this.handleReaction(reaction);
    }));
    return reactions;
  }

  async handleSystem(row) {
    var tags = await this.query('SELECT * FROM Tags');
    tags = this.tableToDict(tags);
    var system = {};
    system.element_type = 'system';
    system.id = row.ID;
    system.type_id = row.SystemTypeID;
    system.type = row.Type;
    system.name = row.Name;
    system.tags = JSON.parse(row.Tags).map((tag) => {
      return {
        type_id: tag.type,
        type: tags[tag.type].Name,
        value: tag.value
      };
    });
    system.cost = this.tableToDict(JSON.parse(row.Cost), 'type');
    system.effect = JSON.parse(row.Effect);
    system.attachments = await this.getAttachments(system.effect);
    system.flavor = JSON.parse(row.Flavor);
    return system;
  }

  async fetchSystem(id) {
    var system = await this.queryFirst('SELECT Systems.*, SystemTypes.Name AS Type FROM Systems INNER JOIN SystemTypes ON Systems.SystemTypeID == SystemTypes.ID WHERE Systems.ID == ?', [id]);
    system = await this.handleSystem(system);
    return system;
  }

  async fetchSystems() {
    var systems = await this.query('SELECT Systems.*, SystemTypes.Name AS Type FROM Systems INNER JOIN SystemTypes ON Systems.SystemTypeID == SystemTypes.ID');
    systems = await Promise.all(systems.map(async (system) => {
      return await this.handleSystem(system);
    }));
    return systems;
  }

  async handleTalentRank(row) {
    var talentRank = {};
    talentRank.element_type = 'talentrank';
    talentRank.id = row.ID;
    talentRank.talent_id = row.TalentID;
    talentRank.name = row.Name;
    talentRank.effect = JSON.parse(row.Effect);
    talentRank.attachments = await this.getAttachments(talentRank.effect);
    return talentRank;
  }

  async fetchTalentRank(id) {
    var talentRank = await this.queryFirst('SELECT * FROM TalentRanks WHERE TalentRanks.ID == ?', [id]);
    talentRank = await this.handleTalentRank(talentRank);
    return talentRank;
  }

  async fetchTalentRanksByTalentID(id) {
    var talentRanks = await this.query('SELECT * FROM TalentRanks WHERE TalentRanks.TalentID == ?', [id]);
    talentRanks = talentRanks.sort((talentRankA, talentRankB) => {
      return talentRankA.Rank - talentRankB.Rank;
    });
    talentRanks = await Promise.all(talentRanks.map(async (talentRank) => {
      return await this.handleTalentRank(talentRank);
    }));
    return talentRanks;
  }

  async handleTalent(row) {
    var talent = {};
    talent.element_type = 'talent';
    talent.id = row.ID;
    talent.name = row.Name;
    talent.flavor = JSON.parse(row.Flavor);
    talent.ranks = await this.fetchTalentRanksByTalentID(talent.id);
    return talent;
  }

  async fetchTalent(id) {
    var talent = await this.queryFirst('SELECT * FROM Talents WHERE Talents.ID == ?', [id]);
    talent = await this.handleTalent(talent);
    return talent;
  }

  async fetchTalents() {
    var talents = await this.query('SELECT * FROM Talents');
    talents = await Promise.all(talents.map(async (talent) => {
      return await this.handleTalent(talent);
    }));
    return talents;
  }

  async handleTech(row) {
    var tags = await this.query('SELECT * FROM Tags');
    tags = this.tableToDict(tags);
    var tech = {};
    tech.element_type = 'tech';
    tech.id = row.ID;
    tech.type_id = row.TechTypeID;
    tech.type = row.Type;
    tech.name = row.Name;
    tech.tags = JSON.parse(row.Tags).map((tag) => {
      return {
        type_id: tag.type,
        type: tags[tag.type].Name,
        value: tag.value
      };
    });
    tech.cost = this.tableToDict(JSON.parse(row.Cost), 'type');
    tech.effect = JSON.parse(row.Effect);
    tech.attachments = await this.getAttachments(tech.effect);
    tech.flavor = JSON.parse(row.Flavor);
    return tech;
  }

  async fetchTech(id) {
    var tech = await this.queryFirst('SELECT Techs.*, TechTypes.Name AS Type FROM Techs INNER JOIN TechTypes ON Techs.TechTypeID == TechTypes.ID WHERE Techs.ID == ?', [id]);
    tech = await this.handleTech(tech);
    return tech;
  }

  async fetchTechs() {
    var techs = await this.query('SELECT Techs.*, TechTypes.Name AS Type FROM Techs INNER JOIN TechTypes ON Techs.TechTypeID == TechTypes.ID');
    techs = await Promise.all(techs.map(async (tech) => {
      return await this.handleTech(tech);
    }));
    return techs;
  }

  async handleTrait(row) {
    var trait = {};
    trait.element_type = 'trait';
    trait.id = row.ID;
    trait.frame_id = row.FrameID;
    trait.name = row.Name;
    trait.effect = JSON.parse(row.Effect);
    trait.attachments = await this.getAttachments(trait.effect);
    return trait;
  }

  async fetchTrait(id) {
    var trait = await this.queryFirst('SELECT * FROM Traits WHERE Traits.ID == ?', [id]);
    trait = await this.handleTrait(trait);
    return trait;
  }

  async fetchTraitsByFrameID(id) {
    var traits = await this.query('SELECT * FROM Traits WHERE Traits.FrameID == ?', [id]);
    traits = await Promise.all(traits.map(async (trait) => {
      return await this.handleTrait(trait);
    }));
    return traits;
  }

  async handleWeapon(row) {
    var tags = await this.query('SELECT * FROM Tags');
    tags = this.tableToDict(tags);
    var ranges = await this.query('SELECT * FROM Ranges');
    ranges = this.tableToDict(ranges);
    var damageTypes = await this.query('SELECT * FROM DamageTypes');
    damageTypes = this.tableToDict(damageTypes);
    var weapon = {};
    weapon.element_type = 'weapon';
    weapon.id = row.ID;
    weapon.name = row.Name;
    weapon.cost = this.tableToDict(JSON.parse(row.Cost), 'type');
    weapon.size = row.Size;
    weapon.type_id = row.WeaponTypeID;
    weapon.type = row.Type;
    weapon.tags = JSON.parse(row.Tags).map((tag) => {
      return {
        type_id: tag.type,
        type: tags[tag.type].Name,
        value: tag.value
      };
    });
    weapon.range = JSON.parse(row.Range).map((range) => {
      return {
        range_id: range.type,
        range: ranges[range.type].Name,
        value: range.value
      }
    });
    weapon.damage = JSON.parse(row.Damage).map((damage) => {
      return {
        types: damage.types.map((type) => {
          return {
            type_id: type,
            type: damageTypes[type].Name
          };
        }),
        value: damage.value
      };
    });
    weapon.effect = JSON.parse(row.Effect);
    weapon.attachments = await this.getAttachments(weapon.effect);
    weapon.flavor = JSON.parse(row.Flavor);
    return weapon;
  }

  async fetchWeapon(id) {
    var weapon = await this.queryFirst('SELECT Weapons.*, WeaponTypes.Name AS Type FROM Weapons INNER JOIN WeaponTypes ON Weapons.WeaponTypeID == WeaponTypes.ID WHERE Weapons.ID == ?', [id]);
    weapon = await this.handleWeapon(weapon);
    return weapon;
  }

  async fetchWeapons() {
    var weapons = await this.query('SELECT Weapons.*, WeaponTypes.Name AS Type FROM Weapons INNER JOIN WeaponTypes ON Weapons.WeaponTypeID == WeaponTypes.ID');
    weapons = await Promise.all(weapons.map(async (weapon) => {
      return await this.handleWeapon(weapon);
    }));
    return weapons;
  }

}

LancerDatabase.instance = new LancerDatabase();

module.exports.LancerDatabase = LancerDatabase;