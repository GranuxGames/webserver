var searchElements = {};
var creatures = null;

window.addEventListener('load', async () => {
  document.getElementById('search-header-container-collapse').addEventListener('click', () => {
    document.getElementById('search-header-container').classList.toggle('collapsed');
  });

  creatures = await fetch("/rpgs/dnd/api/list-creatures", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  creatures = await creatures.json();
  creatures = creatures.creatures;

  searchElements.name = document.querySelector('#search-name-input-container > input');
  searchElements.name.addEventListener('input', onFiltersChanged);

  var typesSearch = new ListSearch('Humanoid, Dragon, ...', 'Type');
  document.getElementById('search-name-input-container').after(typesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    typesSearch.values = values;
  });
  searchElements.types = typesSearch;
  typesSearch.addChangeListener(onFiltersChanged);

  var subtypesSearch = new ListSearch('Fiend, Angel, ...', 'Subtype');
  typesSearch.container.after(subtypesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-subtypes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    subtypesSearch.values = values;
  });
  searchElements.subtypes = subtypesSearch;
  subtypesSearch.addChangeListener(onFiltersChanged);

  searchElements.cr = {
    min: document.querySelector('#search-cr-input-container .search-input-min'),
    max: document.querySelector('#search-cr-input-container .search-input-max')
  };
  searchElements.cr.min.addEventListener('input', onFiltersChanged);
  searchElements.cr.max.addEventListener('input', onFiltersChanged);

  var sizesSearch = new ListSearch('Small, Medium, ...', 'Size');
  document.getElementById('search-cr-input-container').after(sizesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-sizes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    sizesSearch.values = values;
  });
  searchElements.sizes = sizesSearch;
  sizesSearch.addChangeListener(onFiltersChanged);

  var habitatsSearch = new ListSearch('Mountains, ...', 'Habitat');
  sizesSearch.container.after(habitatsSearch.container);
  fetch("/rpgs/dnd/api/list-creature-habitats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    habitatsSearch.values = values;
  });
  searchElements.habitats = habitatsSearch;
  habitatsSearch.addChangeListener(onFiltersChanged);

  var alignmentsSearch = new ListSearch('chaotic neutral, ...', 'Alignment');
  habitatsSearch.container.after(alignmentsSearch.container);
  fetch("/rpgs/dnd/api/list-creature-alignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    alignmentsSearch.values = values;
  });
  searchElements.alignments = alignmentsSearch;
  alignmentsSearch.addChangeListener(onFiltersChanged);

  var sensesSearch = new ListSearch('Darkvision, Blindsight, ...', 'Senses');
  document.getElementById('search-hp-input-container').after(sensesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-senses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    sensesSearch.values = values;
  });
  searchElements.sensed = sensesSearch;
  sensesSearch.addChangeListener(onFiltersChanged);

  var savesSearch = new ListSearch('Con, Dex, ...', 'Save Proficiencies');
  sensesSearch.container.after(savesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-saves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    savesSearch.values = values;
  });
  searchElements.saves = savesSearch;
  savesSearch.addChangeListener(onFiltersChanged);

  var skillsSearch = new ListSearch('Acrobatics, Athletics, ...', 'Skill Proficiencies');
  savesSearch.container.after(skillsSearch.container);
  fetch("/rpgs/dnd/api/list-creature-skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    skillsSearch.values = values;
  });
  searchElements.skills = skillsSearch;
  skillsSearch.addChangeListener(onFiltersChanged);

  var legendarySearch = new ListSearch('Yes, No', 'Legendary');
  skillsSearch.container.after(legendarySearch.container);
  legendarySearch.values = ['Yes', 'No'];
  searchElements.legendary = legendarySearch;
  legendarySearch.addChangeListener(onFiltersChanged);

  var lairSearch = new ListSearch('Yes, No', 'Lair');
  legendarySearch.container.after(lairSearch.container);
  lairSearch.values = ['Yes', 'No'];
  searchElements.lair = lairSearch;
  lairSearch.addChangeListener(onFiltersChanged);

  var vulnerabilitiesSearch = new ListSearch('Fire, Piercing, ...', 'Vulnerabilities');
  lairSearch.container.after(vulnerabilitiesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-damage-vulnerabilities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    vulnerabilitiesSearch.values = values;
  });
  searchElements.damage_vulnerabilities = vulnerabilitiesSearch;
  vulnerabilitiesSearch.addChangeListener(onFiltersChanged);

  var resistancesSearch = new ListSearch('Fire, Piercing, ...', 'Resistances');
  vulnerabilitiesSearch.container.after(resistancesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-damage-resistances", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    resistancesSearch.values = values;
  });
  searchElements.damage_resistances = resistancesSearch;
  resistancesSearch.addChangeListener(onFiltersChanged);

  var immunitiesSearch = new ListSearch('Fire, Piercing, ...', 'Immunities');
  resistancesSearch.container.after(immunitiesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-damage-immunities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    immunitiesSearch.values = values;
  });
  searchElements.damage_immunities = immunitiesSearch;
  immunitiesSearch.addChangeListener(onFiltersChanged);

  var conditionImmunitiesSearch = new ListSearch('Stunned, Restrained, ...', 'Condition Immunities');
  immunitiesSearch.container.after(conditionImmunitiesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-condition-immunities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    conditionImmunitiesSearch.values = values;
  });
  searchElements.condition_immunities = conditionImmunitiesSearch;
  conditionImmunitiesSearch.addChangeListener(onFiltersChanged);

  var languagesSearch = new ListSearch('Common, Dwarvish, ...', 'Languages');
  conditionImmunitiesSearch.container.after(languagesSearch.container);
  fetch("/rpgs/dnd/api/list-creature-languages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    languagesSearch.values = values;
  });
  searchElements.languages = languagesSearch;
  languagesSearch.addChangeListener(onFiltersChanged);

  var movementSearch = new ListSearch('Fly, Climb, ...', 'Movement Types');
  languagesSearch.container.after(movementSearch.container);
  fetch("/rpgs/dnd/api/list-creature-speeds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    movementSearch.values = values;
  });
  searchElements.movement = movementSearch;
  movementSearch.addChangeListener(onFiltersChanged);

  var tagsSearch = new ListSearch('Swarm, Cultist, ...', 'Tags');
  movementSearch.container.after(tagsSearch.container);
  fetch("/rpgs/dnd/api/list-creature-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((values) => { return values.json() })
  .then((values) => { return values.table })
  .then((values) => {
    tagsSearch.values = values;
  });
  searchElements.tags = tagsSearch;
  tagsSearch.addChangeListener(onFiltersChanged);

  onFiltersChanged();
});

function onFiltersChanged() {
  var container = document.getElementById('search-body-container');
  creatures.forEach((creature) => {
    var result = generateResult(creature);
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
  img.src = '/resources/imgs/dynamic/rpgs/dnd/creatures/' + row.image;
  d1.appendChild(img);

  var d2 = document.createElement('div');
  resultHeader.appendChild(d2);

  var searchCR = document.createElement('div');
  searchCR.classList.add('search-cr');
  d2.appendChild(searchCR);

  if (row.cr == 0.125)
    searchCR.appendChild(document.createTextNode('1/8'));
  else if (row.cr == 0.25)
    searchCR.appendChild(document.createTextNode('1/4'));
  else if (row.cr == 0.5)
    searchCR.appendChild(document.createTextNode('1/2'))
  else
    searchCR.appendChild(document.createTextNode(row.cr));

  var d3 = document.createElement('div');
  resultHeader.appendChild(d3);

  var searchName = document.createElement('div');
  searchName.classList.add('search-name');
  d3.appendChild(searchName);

  searchName.appendChild(document.createTextNode(row.name));

  var d4 = document.createElement('div');
  resultHeader.appendChild(d4);

  var searchType = document.createElement('div');
  searchType.classList.add('search-type');
  d4.appendChild(searchType);

  searchType.appendChild(document.createTextNode(row.type));

  if (row.subtype.length > 0) {
    var searchSubtype = document.createElement('div');
    searchSubtype.classList.add('search-subtype');
    d4.appendChild(searchSubtype);

    searchSubtype.appendChild(document.createTextNode(row.subtype));
  }

  var d5 = document.createElement('div');
  resultHeader.appendChild(d5);
  
  var searchSize = document.createElement('div');
  searchSize.classList.add('search-size');
  d5.appendChild(searchSize);

  searchSize.appendChild(document.createTextNode(row.size));

  var d6 = document.createElement('div');
  resultHeader.appendChild(d6);
  
  var searchAlignment = document.createElement('div');
  searchAlignment.classList.add('search-alignment');
  d6.appendChild(searchAlignment);

  searchAlignment.appendChild(document.createTextNode(row.alignment));

  var d7 = document.createElement('div');
  resultHeader.appendChild(d7);

  var searchHabitat = document.createElement('div');
  searchHabitat.classList.add('search-habitat');
  d7.appendChild(searchHabitat);

  if (row.habitat.length <= 0)
    searchHabitat.appendChild(document.createTextNode('——'));
  else
    searchHabitat.appendChild(document.createTextNode(row.habitat));

  var d8 = document.createElement('div');
  resultHeader.appendChild(d8);

  var searchTags = document.createElement('div');
  searchTags.classList.add('search-tags');
  d8.appendChild(searchTags);

  if (row.tags.length <= 0)
    searchTags.appendChild(document.createTextNode('——'));
  else
    searchTags.appendChild(document.createTextNode(row.tags.join(', ')));

  var d9 = document.createElement('div');
  resultHeader.appendChild(d9);

  var toggle = document.createElement('div');
  toggle.classList.add('search-toggle');
  d9.appendChild(toggle);

  toggle.appendChild(document.createTextNode('+'));

  var resultBody = document.createElement('div');
  resultBody.classList.add('search-result-body');
  resultBody.classList.add('search-result-body-collapsed');
  result.appendChild(resultBody);

  var loadingCreature = false;
  var dndCreature = null;

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

      if (!loadingCreature) {
        loadingCreature = true;
        fetch("/rpgs/dnd/api/get-creature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: row.id })
        }).then((creature) => { return creature.json(); })
        .then((creature) => { return creature.creature; })
        .then((creature) => {
          dndCreature = DNDCreature.fromJSON(creature);
          resultBody.append(dndCreature.getHTML());

          var detailsButton = document.createElement('a');
          detailsButton.classList.add('search-result-details-button');
          dndCreature.getHTML().append(detailsButton);
          detailsButton.addEventListener('click', () => {
            window.open('/rpgs/dnd/creatures/' + row.id, '_blank').focus();
          });

          detailsButton.appendChild(document.createTextNode('VIEW DETAILS'));

          result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      }
    }
  });

  return result;
}