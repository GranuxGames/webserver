class ListSearch {

  constructor(placeholder = '', header = '') {
    this.values = [];

    this.container = document.createElement('div');
    this.container.classList.add('list-search-container');

    if (header.length > 0) {
      this.header = document.createElement('div');
      this.header.classList.add('list-search-header');
      this.container.appendChild(this.header);

      this.header.appendChild(document.createTextNode(header));
    }

    this.valuesContainer = document.createElement('div');
    this.valuesContainer.classList.add('list-search-selectors');
    this.container.appendChild(this.valuesContainer);

    this.input = document.createElement('input');
    this.input.classList.add('list-search-input');
    this.input.type = 'text';
    this.input.placeholder = placeholder;
    this.valuesContainer.appendChild(this.input);
    this.input.addEventListener('focusin', this.onFocus.bind(this));
    this.input.addEventListener('focusout', this.onNoFocus.bind(this));
    this.input.addEventListener('input', this.updateDropdown.bind(this));
    this.input.addEventListener('keydown', this.onArrowPress.bind(this));
    this.input.addEventListener('keydown', this.onEnterPress.bind(this));

    this.dropdown = null;
    this.selectedElement = null;

    this.selectedValues = [];

    this.changeListeners = [];
  }

  addChangeListener(listener) {
    this.changeListeners.push(listener);
  }

  onFocus() {
    if (this.dropdown != null)
      return;

    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('list-search-dropdown');
    this.container.appendChild(this.dropdown);

    this.updateDropdown();
  }

  onNoFocus() {
    if (this.dropdown == null)
      return;

    this.dropdown.parentElement.removeChild(this.dropdown);
    this.dropdown = null;
    this.selectedElement = null;
  }

  onArrowPress(e) {
    if (e.key != 'ArrowUp' && e.key != 'ArrowDown')
      return;

    e.preventDefault();

    var change = -1;
    if (e.key == 'ArrowDown')
      change = 1;

    if (this.selectedElement == null)
      return;
    
    this.switchSelected(this.selectedElement + change);
  }

  onEnterPress(e) {
    if (e.key != 'Enter')
      return;

    e.preventDefault();

    if (this.selectedElement == null)
      return;

    this.selectCurrentValue();
  }

  updateDropdown() {
    if (this.dropdown == null)
      return;

    var values = this.values.filter((value) => {
      return value.toLowerCase().includes(this.input.value.toLowerCase());
    }).filter((value) => {
      return !this.selectedValues.includes(value);
    });

    while (this.dropdown.children.length > 0)
      this.dropdown.removeChild(this.dropdown.firstChild);

    if (values.length <= 0) {
      var element = document.createElement('div');
      element.classList.add('list-search-dropdown-empty');
      this.dropdown.appendChild(element);

      element.appendChild(document.createTextNode('No Matches Found'));
      this.selectedElement = null;

      return;
    }

    values.toSorted().forEach((value, index) => {
      var element = document.createElement('div');
      element.classList.add('list-search-dropdown-value');
      element.title = value;
      this.dropdown.appendChild(element);

      element.appendChild(document.createTextNode(value));

      if (index == 0)
        element.classList.add('list-search-dropdown-value-selected');

      element.addEventListener('mouseover', () => {
        this.switchSelected(index);
      });
      element.addEventListener('mousedown', () => {
        this.selectCurrentValue();
      })
    });
    this.selectedElement = 0;
  }

  switchSelected(index) {
    if (this.dropdown == null)
      return;

    if (this.selectedElement == null)
      return;

    index = (index + this.dropdown.children.length) % this.dropdown.children.length;

    this.dropdown.children[this.selectedElement].classList.remove('list-search-dropdown-value-selected');
    this.selectedElement = index;
    this.dropdown.children[index].classList.add('list-search-dropdown-value-selected');
    this.dropdown.children[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  selectCurrentValue() {
    var value = this.dropdown.children[this.selectedElement].innerHTML;
    this.input.blur();

    var element = document.createElement('div');
    element.classList.add('list-search-value');
    this.input.before(element);

    var deleteButton = document.createElement('div');
    deleteButton.classList.add('list-search-value-delete');
    element.appendChild(deleteButton);

    element.appendChild(document.createTextNode(value));
    this.selectedValues.push(value);

    element.addEventListener('click', () => {
      this.selectedValues = this.selectedValues.filter((selectedValue) => {
        return selectedValue != value;
      })
      element.parentElement.removeChild(element);
      this.changeListeners.forEach((listener) => {
        listener(this.selectedValues);
      })
    });
    
    this.changeListeners.forEach((listener) => {
      listener(this.selectedValues);
    })
  }

}