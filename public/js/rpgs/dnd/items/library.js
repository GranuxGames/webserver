searchElements = {};
items = null;

window.addEventListener('load', async () => {
  document.getElementById('search-header-container-collapse').addEventListener('click', () => {
    document.getElementById('search-header-container').classList.toggle('collapsed');
  });

  items = await fetch("/rpgs/dnd/api/list-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  items = await items.json();
  items = items.items;

  searchElements.name = document.querySelector('#search-name-input-container > input');
  searchElements.name.addEventListener('input', onFiltersChanged);

  var raritiesSearch = new ListSearch('Common, Uncommon, ...', 'Item Rarity');
  document.getElementById('search-name-input-container').after(raritiesSearch.container);
  fetch("/rpgs/dnd/api/list-item-rarities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.rarities })
  .then((values) => {
    raritiesSearch.values = values;
  });
  searchElements.rarities = raritiesSearch;
  raritiesSearch.addChangeListener(onFiltersChanged);

  var typesSearch = new ListSearch('Weapon, Potion, ...', 'Item Type');
  raritiesSearch.container.after(typesSearch.container);
  fetch("/rpgs/dnd/api/list-item-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.types })
  .then((values) => {
    typesSearch.values = values;
  });
  searchElements.types = typesSearch;
  typesSearch.addChangeListener(onFiltersChanged);

  var subtypesSearch = new ListSearch('Sword, Spear, ...', 'Subtype');
  typesSearch.container.after(subtypesSearch.container);
  fetch("/rpgs/dnd/api/list-item-subtypes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.subtypes })
  .then((values) => {
    subtypesSearch.values = values;
  });
  searchElements.subtypes = subtypesSearch;
  subtypesSearch.addChangeListener(onFiltersChanged);

  var attributesSearch = new ListSearch('Arcane Focus, ...', 'Attributes');
  subtypesSearch.container.after(attributesSearch.container);
  fetch("/rpgs/dnd/api/list-item-attributes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.attributes })
  .then((values) => {
    attributesSearch.values = values;
  });
  searchElements.attributes = attributesSearch;
  attributesSearch.addChangeListener(onFiltersChanged);

  var bonusesSearch = new ListSearch('+1, +2, ...', 'Bonus');
  attributesSearch.container.after(bonusesSearch.container);
  fetch("/rpgs/dnd/api/list-item-bonuses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.bonuses })
  .then((values) => {
    bonusesSearch.values = values;
  });
  searchElements.bonuses = bonusesSearch;
  bonusesSearch.addChangeListener(onFiltersChanged);

  var requirementsSearch = new ListSearch('attunement, ...', 'Requirements');
  bonusesSearch.container.after(requirementsSearch.container);
  fetch("/rpgs/dnd/api/list-item-requirements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.requirements })
  .then((values) => {
    requirementsSearch.values = values;
  });
  searchElements.requirements = requirementsSearch;
  requirementsSearch.addChangeListener(onFiltersChanged);

  var tagsSearch = new ListSearch('Buff, Magic, ...', 'Tags');
  requirementsSearch.container.after(tagsSearch.container);
  fetch("/rpgs/dnd/api/list-item-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.tags })
  .then((values) => {
    tagsSearch.values = values;
  });
  searchElements.tags = tagsSearch;
  tagsSearch.addChangeListener(onFiltersChanged);

  searchElements.price = {
    min: document.querySelector('#search-price-input-container .search-input-min'),
    max: document.querySelector('#search-price-input-container .search-input-max')
  };
  searchElements.price.min.addEventListener('input', onFiltersChanged);
  searchElements.price.max.addEventListener('input', onFiltersChanged);

  searchElements.weight = {
    min: document.querySelector('#search-weight-input-container .search-input-min'),
    max: document.querySelector('#search-weight-input-container .search-input-max')
  };
  searchElements.weight.min.addEventListener('input', onFiltersChanged);
  searchElements.weight.max.addEventListener('input', onFiltersChanged);

  onFiltersChanged();
});

function convertToCP(value) {
  value = value.trim().toLowerCase();
  var num = Number.parseInt(value);

  // assume unitless number is in GP
  if (!Number.isNaN(num) && ('' + num) == value)
    return num * 100;

  var mult = 1;

  if (value.endsWith('cp')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 1;
  } else if (value.endsWith('sp')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 10;
  } else if (value.endsWith('ep')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 50;
  } else if (value.endsWith('gp')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 100;
  } else if (value.endsWith('pp')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 1000;
  } else {
    return -1;
  }

  if (Number.isNaN(num))
    return -1;

  return num * mult;
}

function convertToDr(value) {
  value = value.trim().toLowerCase();
  var num = Number.parseInt(value);

  // assume value is in lbs
  if (!Number.isNaN(num) && ('' + num) == value)
    return num * 256;

  var mult = 1;

  if (value.endsWith('dr')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 1;
  } else if (value.endsWith('drs') || value.endsWith('dr.')) {
    num = Number.parseInt(value.substring(0, value.length - 3).trim());
    mult = 1;
  } else if (value.endsWith('drs.')) {
    num = Number.parseInt(value.substring(0, value.length - 4).trim());
    mult = 1;
  } else if (value.endsWith('oz')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 16;
  } else if (value.endsWith('ozs') || value.endsWith('oz.')) {
    num = Number.parseInt(value.substring(0, value.length - 3).trim());
    mult = 16;
  } else if (value.endsWith('ozs.')) {
    num = Number.parseInt(value.substring(0, value.length - 4).trim());
    mult = 16;
  } else if (value.endsWith('lb')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 256;
  } else if (value.endsWith('lbs') || value.endsWith('lb.')) {
    num = Number.parseInt(value.substring(0, value.length - 3).trim());
    mult = 256;
  } else if (value.endsWith('lbs.')) {
    num = Number.parseInt(value.substring(0, value.length - 4).trim());
    mult = 256;
  } else if (value.endsWith('st')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 3584;
  } else if (value.endsWith('sts') || value.endsWith('st.')) {
    num = Number.parseInt(value.substring(0, value.length - 3).trim());
    mult = 3584;
  } else if (value.endsWith('sts.')) {
    num = Number.parseInt(value.substring(0, value.length - 4).trim());
    mult = 3584;
  } else if (value.endsWith('qr')) {
    num = Number.parseInt(value.substring(0, value.length - 2).trim());
    mult = 7168;
  } else if (value.endsWith('qrs') || value.endsWith('qr.') || value.endsWith('qtr')) {
    num = Number.parseInt(value.substring(0, value.length - 3).trim());
    mult = 7168;
  } else if (value.endsWith('qrs.') || value.endsWith('qtr.')) {
    num = Number.parseInt(value.substring(0, value.length - 4).trim());
    mult = 7168;
  } else if (value.endsWith('qtrs.')) {
    num = Number.parseInt(value.substring(0, value.length - 5).trim());
    mult = 7168;
  } else if (value.endsWith('cwt')) {
    num = Number.parseInt(value.substring(0, value.length - 3).trim());
    mult = 28672;
  } else if (value.endsWith('cwts') || value.endsWith('cwt.')) {
    num = Number.parseInt(value.substring(0, value.length - 4).trim());
    mult = 28672;
  } else if (value.endsWith('cwts.')) {
    num = Number.parseInt(value.substring(0, value.length - 5).trim());
    mult = 28672;
  } else if (value.endsWith('ton')) {
    num = Number.parseInt(value.substring(0, value.length - 3).trim());
    mult = 573440;
  } else if (value.endsWith('tons') || value.endsWith('ton.')) {
    num = Number.parseInt(value.substring(0, value.length - 4).trim());
    mult = 573440;
  } else if (value.endsWith('tons.')) {
    num = Number.parseInt(value.substring(0, value.length - 5).trim());
    mult = 573440;
  } else {
    return -1;
  }

  if (Number.isNaN(num))
    return -1;

  return num * mult;
}

function onFiltersChanged() {
  var name = searchElements.name.value;
  var rarities = searchElements.rarities.selectedValues;
  var types = searchElements.types.selectedValues;
  var subtypes = searchElements.subtypes.selectedValues;
  var attributes = searchElements.attributes.selectedValues;
  var bonuses = searchElements.bonuses.selectedValues;
  var requirements = searchElements.requirements.selectedValues;
  var tags = searchElements.tags.selectedValues;
  var priceMin = searchElements.price.min.value;
  priceMin = convertToCP(priceMin);
  var priceMax = searchElements.price.max.value;
  priceMax = convertToCP(priceMax);
  var weightMin = searchElements.weight.min.value;
  weightMin = convertToDr(weightMin);
  var weightMax = searchElements.weight.max.value;
  weightMax = convertToDr(weightMax);
  
  var container = document.getElementById('search-body-container');
  while (container.children.length > 0)
    container.removeChild(container.firstChild);
  items.filter((item) => {
    if (!item.name.toLowerCase().includes(name.toLowerCase()))
      return false;

    if (rarities.length > 0 && !rarities.includes(item.rarity))
      return false;

    if (types.length > 0 && !types.includes(item.type))
      return false;

    if (subtypes.length > 0 && !subtypes.includes(item.subtype))
      return false;

    for (var attribute of attributes) {
      if (!item.attributes.includes(attribute))
        return false;
    }

    if (bonuses.length > 0 && !bonuses.includes(item.bonus))
      return false;

    for (var requirement of requirements) {
      if (!item.requirements.includes(requirement))
        return false;
    }

    for (var tag of tags) {
      if (!item.tags.includes(tag))
        return false;
    }

    var itemPrice = convertToCP(item.price);
    if (priceMin >= 0 && itemPrice < priceMin)
      return false;
    if (priceMax >= 0 && itemPrice > priceMax)
      return false;

    var itemWeight = convertToDr(item.weight);
    if (weightMin >= 0 && itemWeight < weightMin)
      return false;
    if (weightMax >= 0 && itemWeight > weightMax)
      return false;

    return true;
  })/*.toSorted((item1, item2) => {
    return item1.name.localeCompare(item2.name);
  })*/.forEach((item) => {
    var result = generateResult(item);
    container.appendChild(result);
  });
}

function generateResult(row) {
  var result = document.createElement('div');
  result.classList.add('search-result');

  var resultHeader = document.createElement('div');
  resultHeader.classList.add('search-result-header');
  result.appendChild(resultHeader);

  var d1 = document.createElement('div');
  resultHeader.appendChild(d1);

  var img = document.createElement('img');
  img.classList.add('search-image');
  img.src = '/resources/imgs/dynamic/rpgs/dnd/items/' + row.image;
  d1.appendChild(img);

  var d2 = document.createElement('div');
  resultHeader.appendChild(d2);

  var searchName = document.createElement('div');
  searchName.classList.add('search-name');
  d2.appendChild(searchName);

  searchName.appendChild(document.createTextNode(row.name));

  var searchRarity = document.createElement('div');
  searchRarity.classList.add('search-rarity');
  searchRarity.classList.add('search-rarity-' + row.rarity.replaceAll(' ', '-').toLowerCase());
  d2.appendChild(searchRarity);

  searchRarity.appendChild(document.createTextNode(row.rarity));

  var d3 = document.createElement('div');
  resultHeader.appendChild(d3);

  var searchType = document.createElement('div');
  searchType.classList.add('search-type');
  d3.appendChild(searchType);

  searchType.appendChild(document.createTextNode(row.type));

  var searchAttributes = document.createElement('div');
  searchAttributes.classList.add('search-attributes');
  d3.appendChild(searchAttributes);

  var combined = [];
  if (row.subtype.length > 0)
    combined.push(row.subtype + ((row.bonus.length > 0)?(' ' + row.bonus):('')));
  combined = combined.concat(row.attributes);
  if (combined.length > 0)
    searchAttributes.appendChild(document.createTextNode(combined.join(', ')));

  var d4 = document.createElement('div');
  resultHeader.appendChild(d4);

  var searchRequirements = document.createElement('div');
  searchRequirements.classList.add('search-requirements');
  d4.appendChild(searchRequirements);

  if (row.requirements.length <= 0)
    searchRequirements.appendChild(document.createTextNode('——'));
  else
    searchRequirements.appendChild(document.createTextNode(row.requirements.join(', ')));

  var d5 = document.createElement('div');
  resultHeader.appendChild(d5);

  var searchTags = document.createElement('div');
  searchTags.classList.add('search-tags');
  d5.appendChild(searchTags);

  if (row.tags.length <= 0)
    searchTags.appendChild(document.createTextNode('——'));
  else
    searchTags.appendChild(document.createTextNode(row.tags).join(', '));

  var d6 = document.createElement('div');
  resultHeader.appendChild(d6);

  var toggle = document.createElement('div');
  toggle.classList.add('search-toggle');
  d6.appendChild(toggle);

  toggle.appendChild(document.createTextNode('+'));

  var resultBody = document.createElement('div');
  resultBody.classList.add('search-result-body');
  resultBody.classList.add('search-result-body-collapsed');
  result.appendChild(resultBody);

  var loadingItem = false;
  var dndItem = null;

  resultHeader.addEventListener('click', () => {
    var collapsed = true;
    if (resultBody.classList.contains('search-result-body-collapsed'))
      collapsed = false;
    resultBody.classList.toggle('search-result-body-collapsed');
    
    toggle.innerHTML = '';
    if (collapsed) {
      toggle.appendChild(document.createTextNode('+'));
      resultBody.style.display = 'none';
    } else {
      toggle.appendChild(document.createTextNode('-'));
      resultBody.style.display = '';
      result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

      if (!loadingItem) {
        loadingItem = true;
        fetch("/rpgs/dnd/api/get-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: row.id })
        }).then((item) => { return item.json() })
        .then((item) => { return item.item })
        .then((item) => {
          dndItem = DNDItem.fromJSON(item);
          resultBody.appendChild(dndItem.getHTML());
          
          var detailsButton = document.createElement('a');
          detailsButton.classList.add('search-result-details-button');
          dndItem.getHTML().appendChild(detailsButton);
          detailsButton.addEventListener('click', () => {
            window.open('/rpgs/dnd/items/' + row.id, '_blank').focus();
            // window.location.href = '/rpgs/dnd/items/' + row.id;
          });

          detailsButton.appendChild(document.createTextNode('VIEW DETAILS'));

          result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      }
    }
  });

  return result;
}