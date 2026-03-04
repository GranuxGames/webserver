class Library {

  constructor(objectFetchAddress, imgAddress, DNDClass, detailsAddress, list, headers) {
    this.objectFetchAddress = objectFetchAddress;
    this.imgAddress = imgAddress;
    this.DNDClass = DNDClass;
    this.detailsAddress = detailsAddress;

    document.getElementById('search-header-container-collapse')
            .addEventListener('click', () => {
      document.getElementById('search-header-container').classList.toggle('collapsed');
    });

    document.getElementById('search-header-container-random')
            .addEventListener('click', () => {
      var row = this.randomize();
      window.open(this.detailsAddress + row.id, '_blank').focus();
    });

    this.list = list;

    var bodyPadding = window.getComputedStyle(document.documentElement).getPropertyValue('--body-padding');
    var headerPadding = window.getComputedStyle(document.documentElement).getPropertyValue('--search-header-padding');
    var headerHeight = window.getComputedStyle(document.documentElement).getPropertyValue('--search-header-height');
    
    this.media = document.createElement('style');
    document.body.appendChild(this.media);
    this.media.innerHTML = '';
    
    var minSize = '0em';
    var maxSize = bodyPadding + ' + ' + headerHeight + ' + ' + headerHeight + ' + ' + bodyPadding;
    this.headers = headers;
    this.headers.forEach((headerSetting, index) => {
      var div = document.createElement('div');
      div.id = 'search-body-header-' + index;
      div.appendChild(document.createTextNode(headerSetting.title));
      document.getElementById('search-body-header-container').appendChild(div);

      this.media.innerHTML += ':has(> .search-' + index + ') {';
      if (index == headers.length - 1) {
        div.style.flex = '1 1 ' + headerSetting.size;
        this.media.innerHTML += 'flex: 1 1 ' + headerSetting.size;
      } else {
        div.style.flex = '0 0 ' + headerSetting.size;
        this.media.innerHTML += 'flex: 0 0 ' + headerSetting.size;
      }
      this.media.innerHTML += '}';


      if (index == 0) {
        maxSize += ' + ' + headerSetting.size;
      } else {
        maxSize += ' + ' + headerPadding + ' + ' + headerSetting.size;

        this.media.innerHTML += '@media (min-width : calc(' + minSize + ')) and (max-width : calc(' + maxSize + ')) {';
        this.media.innerHTML += ':has(> .search-' + (index - 1) + ') {';
        this.media.innerHTML += 'flex: 1 0 0 !important;';
        this.media.innerHTML += '}';
        this.media.innerHTML += '#search-body-header-' + (index - 1) +' {';
        this.media.innerHTML += 'flex: 1 0 0 !important;';
        this.media.innerHTML += '}';

        [...Array(this.headers.length).keys()].filter((i) => {
          return i >= index; 
        }).forEach((i) => {
          this.media.innerHTML += ':has(> .search-' + i + ') {';
          this.media.innerHTML += 'display: none;';
          this.media.innerHTML += '}';
          this.media.innerHTML += '#search-body-header-' + i + ' {';
          this.media.innerHTML += 'display: none;';
          this.media.innerHTML += '}';
        });

        this.media.innerHTML += '}';

        minSize = maxSize;
      }
    });

    this.filters = [];

    this.onFilterChanged();
  }

  getFiltered() {
    var rows = structuredClone(this.list);
    this.filters.forEach((filter) => {
      rows = filter.filter(rows);
    });
    return rows;
  }

  weightedRandom(rows) {
    var i;
    
    for (i = 1; i < rows.length; i++)
        rows[i].random_weight += rows[i - 1].random_weight;
    
    var random = Math.random() * rows[rows.length - 1].random_weight;
    
    for (i = 0; i < rows.length; i++)
        if (rows[i].random_weight > random)
            break;
    
    return rows[i];
  }

  randomize() {
    var rows = this.getFiltered();
    return rows[Math.floor(Math.random() * rows.length)];
  }

  addFilter(filter) {
    document.getElementById('search-header-container-collapse').before(filter.container);
    filter.addChangeListener(this.onFilterChanged.bind(this));
    this.filters.push(filter);
  }

  onFilterChanged() {
    var rows = this.getFiltered();
    var container = document.getElementById('search-body-container');
    container.innerHTML = '';
    rows.toSorted((a, b) => {
      return a.name.localeCompare(b.name);
    }).toSorted((a, b) => {
      return b.score - a.score;
    }).forEach((row) => {
      container.appendChild(this.generateResultRow(row));
    })
  }

  generateResultRow(row) {
    var result = document.createElement('div');
    result.classList.add('search-result');

    var resultHeader = document.createElement('div');
    resultHeader.classList.add('search-result-header');
    result.appendChild(resultHeader);

    var div = document.createElement('div');
    resultHeader.appendChild(div);

    var img = document.createElement('img');
    img.classList.add('search-image');
    img.src = this.imgAddress + row.image;
    div.appendChild(img);

    this.headers.forEach((header, index) => {
      var text = this.concatTexts(row, header.text);
      var subtext = this.concatTexts(row, header.subtext);

      div = document.createElement('div');
      resultHeader.appendChild(div);

      var textElement = document.createElement('div');
      textElement.classList.add('search-' + index);
      div.appendChild(textElement);

      if (text.length <= 0)
        textElement.appendChild(document.createTextNode('——'));
      else
        textElement.appendChild(document.createTextNode(text));

      if (subtext.length > 0) {
        var subtextElement = document.createElement('div');
        subtextElement.classList.add('search-subtext');
        div.appendChild(subtextElement);

        subtextElement.appendChild(document.createTextNode(subtext));
      }
    });

    div = document.createElement('div');
    resultHeader.appendChild(div);

    var toggle = document.createElement('div');
    toggle.classList.add('search-toggle');
    div.appendChild(toggle);

    toggle.appendChild(document.createTextNode('+'));

    var resultBody = document.createElement('div');
    resultBody.classList.add('search-result-body');
    resultBody.classList.add('collapsed');
    result.appendChild(resultBody);

    var loadingObject = false;
    var dndObject = null;

    resultHeader.addEventListener('click', () => {
      var collapsed = true;
      if (resultBody.classList.contains('collapsed'))
        collapsed = false;
      resultBody.classList.toggle('collapsed');

      toggle.innerHTML = '';
      toggle.appendChild(document.createTextNode(collapsed?'+':'-'));
      resultBody.style.display = collapsed?'none':'';

      if (!collapsed) {
        result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

        if (!loadingObject) {
          loadingObject = true;
          fetch(this.objectFetchAddress, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: row.id })
          }).then((object) => { return object.json(); })
          .then((object) => { return object.result; })
          .then((object) => {
            dndObject = this.DNDClass.fromJSON(object);
            resultBody.append(dndObject.getHTML());

            var detailsButton = document.createElement('a');
            detailsButton.classList.add('search-result-details-button');
            dndObject.getHTML().appendChild(detailsButton);
            detailsButton.addEventListener('click', () => {
              window.open(this.detailsAddress + row.id, '_blank').focus();
            });

            detailsButton.appendChild(document.createTextNode('VIEW DETAILS'));

            result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          });
        }
      }
    });

    return result;
  }

  concatTexts(row, text) {
    return text.map((textPart) => {
      return textPart.map((textElement) => {
        return [row[textElement]].flat().join(', ');
      }).filter((textElement) => {
        return textElement.length > 0;
      }).join(' ');
    }).filter((textPart) => {
      return textPart.length > 0;
    }).join(', ');
  }

}

class LibraryStringSearch extends StringSearch {

  constructor(property, placeholder = '', header = '') {
    super(placeholder, header);

    this.property = property;
  }

  filter(rows) {
    if (this.getValue() == '')
      return rows;

    return rows.filter((row) => {
      return row[this.property].toLowerCase().includes(this.getValue().toLowerCase());
    });
  }

}

class LibrarySingleListSearch extends ListSearch {

  constructor(property, url = null, placeholder = '', header = '') {
    super(placeholder, header);

    this.property = property;

    if (url == null)
      return;

    fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then((result) => { return result.json(); })
      .then((result) => { return result.result; })
      .then((result) => {
        this.values = result;
      });
  }

  filter(rows) {
    if (this.getValue().length <= 0)
      return rows;

    return rows.filter((row) => {
      return this.getValue().map((property) => { return property.toLowerCase(); }).includes(row[this.property].toLowerCase());
    });
  }

}

class LibraryBoolSearch extends LibrarySingleListSearch {
  
  constructor(property, header = '') {
    super(property, null, 'Yes, No', header);

    this.values = ['Yes', 'No'];
  }

  filter(rows) {
    if (this.getValue().length <= 0)
      return rows;

    return rows.filter((row) => {
      return this.getValue().map((property) => { return property.toLowerCase(); }).includes(row[this.property]?'yes':'no');
    });
  }

}

class LibraryMultiListSearch extends ListSearch {

  constructor(property, url = null, placeholder = '', header = '') {
    super(placeholder, header);
    
    this.property = property;

    if (url == null)
      return;

    fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then((result) => { return result.json(); })
      .then((result) => { return result.result; })
      .then((result) => {
        this.values = result;
      });
  }

  filter(rows) {
    if (this.getValue().length <= 0)
      return rows;

    return rows.map((row) => {
      row.currentScore = 0;
      if (row.score == null)
        row.score = 0;

      this.getValue().forEach((value) => {
        if (row[this.property].map((property) => { return property.toLowerCase(); }).includes(value.toLowerCase()))
          row.currentScore += 1;
      });
      row.score += row.currentScore;

      return row;
    }).filter((row) => {
      return row.currentScore != 0;
    });
  }

}

class LibraryRangeSearch extends RangeSearch {

  constructor(property, header = '') {
    super(header);

    this.property = property;
  }

  getConvertedValue(value) {
    return value;
  }

  getValue() {
    var value = super.getValue();
    value = [value[0].toLowerCase(), value[1].toLowerCase()];
    value = [this.getConvertedValue(value[0]), this.getConvertedValue(value[1])];

    return value;
  }

  filter(rows) {
    var value = this.getValue();
    if (value[0] == -1 && value[1] == -1)
      return rows;

    return rows.filter((row) => {
      if (value[0] != -1 && this.getConvertedValue(row[this.property]) < value[0])
        return false;
      if (value[1] != -1 && this.getConvertedValue(row[this.property]) > value[1])
        return false;
      return true;
    });
  }

}