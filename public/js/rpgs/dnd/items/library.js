class ItemLibrary extends Library {

  constructor(list) {
    super('/rpgs/dnd/api/get-item', '/resources/imgs/dynamic/rpgs/dnd/items/', DNDItem, '/rpgs/dnd/items/', list,
          [{title: 'NAME',         size: '25em', text: [['name']],         subtext: [['rarity']]},
           {title: 'TYPE',         size: '8em',  text: [['type']],         subtext: [['subtype', 'bonus'], ['attributes']]},
           {title: 'REQUIREMENTS', size: '13em', text: [['requirements']], subtext: []},
           {title: 'TAGS',         size: '13em', text: [['tags']],         subtext: []}]);
    
    this.addFilter(new NameSearch());
    this.addFilter(new RaritySearch());
    this.addFilter(new TypeSearch());
    this.addFilter(new SubtypeSearch());
    this.addFilter(new AttributesSearch());
    this.addFilter(new BonusSearch());
    this.addFilter(new RequirementsSearch());
    this.addFilter(new TagsSearch());
    this.addFilter(new PriceSearch());
    this.addFilter(new WeightSearch());
  }

  generateResultRow(row) {
    var result = super.generateResultRow(row);

    result.querySelector('.search-0').parentElement.classList.add('search-rarity-' + row.rarity.toLowerCase().split(' ').join('-'));

    return result;
  }

}

class NameSearch extends LibraryStringSearch {

  constructor() {
    super('name', 'Item Name');
  }

}

class RaritySearch extends LibrarySingleListSearch {

  constructor() {
    super('rarity', '/rpgs/dnd/api/list-item-rarities', 'Common, Uncommon, ...', 'Rarity');
  }

}

class TypeSearch extends LibrarySingleListSearch {

  constructor() {
    super('type', '/rpgs/dnd/api/list-item-types', 'Weapon, Potion, ...', 'Type');
  }

}

class SubtypeSearch extends LibrarySingleListSearch {

  constructor() {
    super('subtype', '/rpgs/dnd/api/list-item-subtypes', 'Sword, Spear, ...', 'Subtype');
  }

}

class AttributesSearch extends LibraryMultiListSearch {

  constructor() {
    super('attributes', '/rpgs/dnd/api/list-item-attributes', 'Arcane Focus, ...', 'Attributes');
  }

}

class BonusSearch extends LibrarySingleListSearch {

  constructor() {
    super('bonus', '/rpgs/dnd/api/list-item-bonuses', '+1, +2, ...', 'Bonus');
  }

}

class RequirementsSearch extends LibraryMultiListSearch {

  constructor() {
    super('requirements', '/rpgs/dnd/api/list-item-requirements', 'Attunement, ...', 'Requirements');
  }

}

class TagsSearch extends LibraryMultiListSearch {

  constructor() {
    super('tags', '/rpgs/dnd/api/list-item-tags', 'Buff, Magic, ...', 'Buffs');
  }

}

class PriceSearch extends LibraryRangeSearch {

  constructor() {
    super('price', 'Price');
  }

  getConvertedValue(value) {
    value = value.trim().toLowerCase();

    if (value.length <= 0)
      return -1;

    var number = value.match(/^-?(\d+\.?\d*|\d*\.?\d+)/gm);
    if (number == null)
      return -1;
    number = number[0];

    value = value.substring(number.length).trim();
    number = Number.parseFloat(number);

    if (value.match(/cp$/gm))
      return number * 1;
    else if (value.match(/sp$/gm))
      return number * 10;
    else if (value.match(/ep$/gm))
      return number * 50;
    else if (value.match(/gp$/gm))
      return number * 100;
    else if (value.match(/pp$/gm))
      return number * 1000;

    return number * 100;
  }

}

class WeightSearch extends LibraryRangeSearch {

  constructor() {
    super('weight', 'Weight');
  }
  
  getConvertedValue(value) {
    value = value.trim().toLowerCase();

    if (value.length <= 0)
      return -1;

    var number = value.match(/^-?(\d+\.?\d*|\d*\.?\d+)/gm);
    if (number == null)
      return -1;
    number = number[0];

    value = value.substring(number.length).trim();
    number = Number.parseFloat(number);

    if (value.match(/(dr|dr\.|drs|drs\.)$/gm))
      return number * 1;
    else if (value.match(/(oz|oz\.|ozs|ozs\.)$/gm))
      return number * 16;
    else if (value.match(/(lb|lb\.|lbs|lbs\.)$/gm))
      return number * 256;
    else if (value.match(/(st|st\.|sts|sts\.)$/gm))
      return number * 3584;
    else if (value.match(/(qr|qr\.|qrs|qrs\.|qtr|qtr\.|qtrs|qtrs\.)$/gm))
      return number * 7168;
    else if (value.match(/(cwt|cwt\.|cwts|cwts\.)$/gm))
      return number * 28672;
    else if (value.match(/(ton|ton\.|tons|tons\.)$/gm))
      return number * 573440;

    return number * 256;
  }

}

window.addEventListener('load', async () => {
  var list = await fetch("/rpgs/dnd/api/list-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  list = await list.json();
  list = list.result;

  new ItemLibrary(list);
});