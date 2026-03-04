class RangeSearch {

  constructor(header = '') {
    this.container = document.createElement('div');
    this.container.classList.add('range-search-container');
    this.container.classList.add('search-container');

    if (header.length > 0) {
      this.header = document.createElement('div');
      this.header.classList.add('range-search-header');
      this.header.classList.add('search-header');
      this.container.appendChild(this.header);

      this.header.appendChild(document.createTextNode(header));
    }

    this.body = document.createElement('div');
    this.body.classList.add('range-search-body');
    this.container.appendChild(this.body);

    this.body.appendChild(document.createTextNode('From'));

    this.min = document.createElement('input');
    this.min.classList.add('range-search-input-min');
    this.min.classList.add('range-search-input');
    this.min.classList.add('search-input');
    this.min.type = 'text';
    this.min.placeholder = 'Minimum';
    this.min.addEventListener('input', this.onInput.bind(this));
    this.body.appendChild(this.min);

    this.body.appendChild(document.createTextNode('To'));

    this.max = document.createElement('input');
    this.max.classList.add('range-search-input-max');
    this.max.classList.add('range-search-input');
    this.max.classList.add('search-input');
    this.max.type = 'text';
    this.max.placeholder = 'Maximum';
    this.max.addEventListener('input', this.onInput.bind(this));
    this.body.appendChild(this.max);

    this.changeListeners = [];
  }

  addChangeListener(listener) {
    this.changeListeners.push(listener);
  }

  onInput() {
    this.changeListeners.forEach((listener) => {
      listener([this.min.value, this.max.value]);
    })
  }

  filter(rows) {
    return rows.map((row) => {
      row.score = 0;
      return row;
    });
  }

  getValue() {
    return [this.min.value, this.max.value];
  }

}