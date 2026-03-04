class DNDSpell {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell');
    this.html.classList.add('dnd-object');
    if (isMobile())
      this.html.classList.add('mobile');

    this.header = new DNDSpellHeader();
    this.html.appendChild(this.header.getHTML());

    this.stats = new DNDSpellStats();
    this.html.appendChild(this.stats.getHTML());

    this.body = new DNDSpellBody();
    this.html.appendChild(this.body.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json) {
    var spell = new DNDSpell();
    spell.loadJSON(json);
    return spell;
  }

  loadJSON(json) {
    this.header.loadJSON(json);
    this.stats.loadJSON(json);
    this.body.loadJSON(json);
  }

}

class DNDSpellHeader {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell-header');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-spell-name');
    this.html.appendChild(this.header);

    this.level = document.createElement('div');
    this.level.classList.add('dnd-spell-level');
    this.html.appendChild(this.level);
  }

  getHTML() {
    return this.html;
  }

  getNumberSuffix(number) {
    if (number % 10 == 1)
      return 'st';
    if (number % 10 == 2)
      return 'nd';
    if (number % 10 == 3)
      return 'rd';
    return 'th';
  }

  loadJSON(json) {
    this.header.innerHTML = '';
    this.header.appendChild(document.createTextNode(json.name));

    this.level.innerHTML = '';
    var levelText = json.school;
    if (json.level <= 0)
      levelText += ' cantrip';
    else
      levelText = json.level + this.getNumberSuffix(json.level) +'-level ' + levelText + ' Spell';
    if (json.ritual)
      levelText += ' (ritual)';
    this.level.appendChild(document.createTextNode(levelText));
  }

}

class DNDSpellStats {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell-stats');

    var statLine = document.createElement('div');
    statLine.classList.add('dnd-spell-stat');

    var statLineHeader = document.createElement('a');
    statLineHeader.classList.add('dnd-spell-stat-header');
    statLine.appendChild(statLineHeader);

    var statLineValue = document.createElement('a');
    statLineValue.classList.add('dnd-spell-stat-value');
    statLine.appendChild(statLineValue);

    this.castingTime = statLine.cloneNode(true);
    this.castingTime.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Casting Time: '));
    this.html.appendChild(this.castingTime);

    this.range = statLine.cloneNode(true);
    this.range.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Range: '));
    this.html.appendChild(this.range);

    this.components = statLine.cloneNode(true);
    this.components.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Components: '));
    this.html.appendChild(this.components);

    this.duration = statLine.cloneNode(true);
    this.duration.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Duration: '));
    this.html.appendChild(this.duration);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.castingTime.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.castingTime.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(json.casting_time.type + json.casting_time.info));

    var rangeValue = json.range;
    if (json.area.length > 0)
      rangeValue += ' (' + json.area + ')';
    this.range.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.range.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(rangeValue));

    var componentsValue = json.components.map((component) => {
      if (component.type == 'verbal')
        return 'V';
      if (component.type == 'somatic')
        return 'S';
      if (component.type == 'material')
        return 'M (' + component.values.join(', ') + ')';
      return '';
    }).join(', ');
    this.components.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.components.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(componentsValue));

    var durationValue = json.duration;
    if (json.concentration)
      durationValue = 'Concentration, up to ' + durationValue.toLowerCase();
    this.duration.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.duration.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(durationValue));
  }

}

class DNDSpellBody {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell-body');

    this.description = new JSONText();
    this.description.getHTML().classList.add('dnd-spell-description');
    this.html.appendChild(this.description.getHTML());

    this.higher = new JSONText();
    this.higher.getHTML().classList.add('dnd-spell-higher');
    this.html.appendChild(this.higher.getHTML());

    this.notes = new JSONText();
    this.notes.getHTML().classList.add('dnd-spell-notes');
    this.html.appendChild(this.notes.getHTML());
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    if (json.description.length <= 0 && this.description.getHTML().parentElement != null)
      this.description.getHTML().parentElement.removeChild(this.description.getHTML());
    else
      this.description.loadJSON(json.description);

    if (json.higher.length <= 0 && this.higher.getHTML().parentElement != null) {
      this.higher.getHTML().parentElement.removeChild(this.higher.getHTML());
    } else {
      var higherValue = json.higher;
      if (typeof higherValue[0] == 'string')
        higherValue[0] = '*_At Higher Levels. _*' + higherValue[0];
      else
        higherValue.unshift('*_At Higher Levels. _*');
      this.higher.loadJSON(json.higher);
    }
    
    if (json.notes.length <= 0 && this.notes.getHTML().parentElement != null)
      this.notes.getHTML().parentElement.removeChild(this.notes.getHTML());
    else
      this.notes.loadJSON(json.notes);
  }

}