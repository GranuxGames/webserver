class StringSearch {

  constructor(placeholder = '', header = '') {
    this.container = document.createElement('div');
    this.container.classList.add('string-search-container');
    this.container.classList.add('search-container');

    if (header.length > 0) {
      this.header = document.createElement('div');
      this.header.classList.add('string-search-header');
      this.header.classList.add('search-header');
      this.container.appendChild(this.header);

      this.header.appendChild(document.createTextNode(header));
    }

    this.input = document.createElement('input');
    this.input.classList.add('string-search-input');
    this.input.classList.add('search-input');
    this.input.type = 'text';
    this.input.placeholder = placeholder;
    this.input.addEventListener('input', this.onInput.bind(this));
    this.container.appendChild(this.input);

    this.changeListeners = [];
  }

  addChangeListener(listener) {
    this.changeListeners.push(listener);
  }

  onInput() {
    this.changeListeners.forEach((listener) => {
      listener(this.input.value);
    })
  }

  filter(rows) {
    return rows.map((row) => {
      row.score = 0;
      return row;
    });
  }

  getValue() {
    return this.input.value;
  }

}