var modifying = false;
var creature;

class CustomDropdownInput {

  constructor(element, options) {
    this.element = element;
    this.element.classList.add('custom-dropdown-input');
    this.element.classList.add('custom-input');
    this.dropdown = null;
    this.setOptions(options);

    var openListener = (e) => {
      e.stopPropagation();

      this.open();

      this.element.removeEventListener('click', openListener);
      document.addEventListener('click', closeListener);
    };

    var closeListener = (e) => {
      e.stopPropagation();

      this.close();

      document.removeEventListener('click', closeListener);
      this.element.addEventListener('click', openListener);
    }

    this.element.addEventListener('click', openListener);
  }

  open() {
    if (this.dropdown != null)
      return;

    this.element.classList.add('open');

    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('custom-dropdown-input-elements');
    this.element.appendChild(this.dropdown);

    this.options.forEach((option, index) => {
      var optionElement = document.createElement('div');
      optionElement.classList.add('custom-dropdown-input-element');
      this.dropdown.appendChild(optionElement);
      optionElement.appendChild(document.createTextNode(option));
      optionElement.addEventListener('click', () => {
        this.setSelected(index);
      });
    });
  }

  close() {
    if (this.dropdown == null)
      return;

    this.element.classList.remove('open');

    this.dropdown.parentElement.removeChild(this.dropdown);
    this.dropdown = null;
  }

  setOptions(options) {
    this.options = options;
    if (this.options.length <= 0)
      this.setSelected(-1);
    else
      this.setSelected(0);
  }

  setSelected(selected) {
    if (selected >= this.options.length || selected < 0)
      this.selected = -1;
    else
      this.selected = selected;

    this.close();

    this.element.innerHTML = '';
    if (this.selected != -1)
      this.element.appendChild(document.createTextNode(this.options[this.selected]));
  }

  getSelected() {
    return this.selected;
  }

  setValue(value) {
    if (!this.options.includes(value))
      this.setSelected(-1);
    else
      this.setSelected(this.options.indexOf(value));
  }

  getValue() {
    return this.options[this.selected];
  }

}

class CustomStringInput {

  constructor(element, placeholder = '', allowLineBreaks = false) {
    this.lastValidContent = '';

    this.element = element;
    this.element.classList.add('custom-string-input');
    this.element.classList.add('custom-input');

    this.element.setAttribute('contenteditable', 'plaintext-only');
    this.element.setAttribute('placeholder', placeholder);

    this.element.addEventListener('focusout', () => {
      this.element.scrollLeft = 0;
    });

    this.element.addEventListener('beforeinput', (e) => {
      if (!allowLineBreaks && ['insertParagraph', 'insertLineBreak'].includes(e.inputType)) {
        e.preventDefault();
        return;
      }
    });

    this.element.addEventListener('input', () => {
      if (!allowLineBreaks && /[\r\n\u2028\u2029]/.test(this.element.textContent))
        this.element.textContent = this.element.textContent.replace(/[\r\n\u2028\u2029]+/g, ' ');
    });

    this.element.addEventListener('keydown', (e) => {
      if (!allowLineBreaks && e.key == 'Enter') {
        e.preventDefault();
        return;
      }
    });

    this.element.addEventListener('paste', (e) => {
      e.preventDefault();

      var text = e.clipboardData.getData('text/plain');

      if (!allowLineBreaks) {
        text = text.replace(/[\r\n\u2028\u2029]+/g, ' ');
      }

      var selection = window.getSelection();
      if (!selection.rangeCount)
        return;

      var range = selection.getRangeAt(0);
      range.deleteContents();

      var node = document.createTextNode(text);
      range.insertNode(node);

      range.setStartAfter(node);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
    });

    this.element.addEventListener('focusin', () => {
      this.lastValidContent = this.element.textContent;
    });

    this.element.addEventListener('focusout', () => {
      this.setValue(this.element.textContent);
    });

    this.setValue(this.element.textContent);
  }

  validateString(text) {
    return true;
  }

  setValue(value) {
    this.element.innerHTML = '';
    
    if (this.validateString(value))
      this.lastValidContent = value;

    this.element.appendChild(document.createTextNode(this.lastValidContent));
  }

  getValue() {
    return this.element.textContent;
  }

}

class CustomDiceInput extends CustomStringInput {

  constructor(element, placeholder = '') {
    super(element, placeholder, false);
  }

  validateString(text) {
    return DiceCalc.parse(text) != null;
  }

  getValue() {
    return DiceCalc.parse(super.getValue());
  }

}

class CustomNumberInput extends CustomStringInput {

  constructor(element, placeholder = '', allowNegative = true, allowFloat = true) {
    super(element, placeholder, false);

    this.allowNegative = allowNegative;
    this.allowFloat = allowFloat;
  }

  validateString(text) {
    text = '' + text;
    if (!this.allowNegative && text.startsWith('-'))
      return false;
    if (!this.allowFloat && text.includes('.'))
      return false;
    return /^-?[0-9]*\.?[0-9]*?([0-9]e-?[0-9]*\.?[0-9]+)?$/g.test(text);
  }

  parseFloat(text) {
    var sign = 1;

    if (text.startsWith('-')) {
      text = text.substring(1);
      sign = -1;
    }

    var parts = [text, '']
    if (text.includes('.'))
      parts = text.split('.');

    var numbers = parts.map((part) => {
      var out = 0;
      for (var digit of part)
        out = out * 10 + digit.charCodeAt(0) - 48;
      return out;
    });

    if (numbers[1] == 0)
      return numbers[0] * sign;

    return (numbers[0] + numbers[1] * 10 ** (-parts[1].length)) *sign;
  }

  getValue() {
    var value = super.getValue();

    var parts = [value, ''];
    if (value.includes('e'))
      parts = value.split('e');

    parts = parts.map((part) => {
      return this.parseFloat(part);
    });

    if (parts[1] == 0)
      return parts[0];

    return parts[0] * 10 ** parts[1];
  }

}

class CustomStringInputWithSuggestion {

  constructor(element, options, placeholder = '') {
    this.element = element;

    this.element.classList.add('custom-string-input-with-suggestions');
    this.element.classList.add('custom-input');

    this.stringInputElement = document.createElement('div');
    this.stringInput = new CustomStringInput(this.stringInputElement, placeholder, false);
    element.appendChild(this.stringInputElement);

    this.dropdown = null;

    this.stringInputElement.addEventListener('focusin', () => {
      this.open();
    });

    this.stringInputElement.addEventListener('focusout', () => {
      this.close();
    });

    this.stringInputElement.addEventListener('input', () => {
      this.generateSuggestions();
    });

    this.stringInputElement.addEventListener('keydown', (e) => {
      var filteredOptions = this.filterOptions();
      
      if (e.key == 'ArrowUp') {
        if (filteredOptions.length > 0) {
          if (this.selectedIndex < 0)
            this.setSelected(filteredOptions.length - 1)
          else
            this.setSelected(this.selectedIndex - 1);
        }
        e.preventDefault();
      } else if (e.key == 'ArrowDown') {
        if (filteredOptions.length > 0) {
          if (this.selectedIndex >= filteredOptions.length - 1)
            this.setSelected(-1);
          else
            this.setSelected(this.selectedIndex + 1);
        }
        e.preventDefault();
      } else if (e.key == 'Enter') {
        if (this.selectedIndex != -1)
          this.selectValue(this.options[filteredOptions[this.selectedIndex]]);
        else
          this.selectValue(this.stringInput.getValue());
        e.preventDefault();
      }
    });

    this.setOptions(options);
  }

  selectValue(value) {
    this.setValue(value);
    this.stringInputElement.blur();
  }

  open() {
    if (this.dropdown != null)
      return;

    this.element.classList.add('open');

    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('custom-string-input-with-suggestions-elements');
    this.element.appendChild(this.dropdown);

    this.generateSuggestions();
  }

  generateSuggestions() {
    if (this.dropdown == null)
      return;

    this.dropdown.innerHTML = '';

    this.filterOptions().forEach((optionIndex, index) => {
      var optionElement = document.createElement('div');
      optionElement.classList.add('custom-string-input-with-suggestions-element');
      this.dropdown.appendChild(optionElement);
      optionElement.appendChild(document.createTextNode(this.options[optionIndex]));

      optionElement.addEventListener('mouseenter', () => {
        this.setSelected(index);
      });

      optionElement.addEventListener('mousedown', () => {
        this.selectValue(this.options[optionIndex]);
      });
    });

    this.setSelected(-1);
  }

  close() {
    if (this.dropdown == null)
      return;

    this.element.classList.remove('open');

    this.dropdown.parentElement.removeChild(this.dropdown);
    this.dropdown = null;
  }

  setOptions(options) {
    this.close();
    this.options = options;
  }

  setSelected(index) {
    if (index < 0)
      this.selectedIndex = -1;
    else if (index >= this.filterOptions().length)
      this.selectedIndex = -1;
    else
      this.selectedIndex = index;

    this.dropdown.childNodes.forEach((child) => {
      child.classList.remove('selected');
    })

    if (this.selectedIndex < 0)
      return;

    this.dropdown.childNodes[index].classList.add('selected');
    this.dropdown.childNodes[index].scrollIntoView();
  }

  filterOptions() {
    return this.options.map((option, index) => {
      return index;
    }).filter((index) => {
      return this.filterOption(this.options[index], this.stringInput.getValue());
    });
  }

  filterOption(option, value) {
    for (var part of value.split(' ')) {
      if (!option.toLowerCase().includes(part.toLowerCase()))
        return false;
    }
    return true;
  }

  getValue() {
    return this.stringInput.getValue();
  }

  setValue(value) {
    return this.stringInput.setValue(value);
  }

}

class CustomMultiSelectInput extends CustomStringInputWithSuggestion {

  constructor(element, options, placeholder = '', newValuesAllowed = false, allowDuplicates = false) {
    super(element, options, placeholder);

    this.newValuesAllowed = newValuesAllowed;
    this.allowDuplicates = allowDuplicates;

    this.element.classList.add('custom-multi-select-input');

    this.valuesContainer = document.createElement('div');
    this.valuesContainer.classList.add('custom-multi-select-input-values');
    this.element.insertBefore(this.valuesContainer, this.element.firstChild);

    this.values = [];
    this.valueGetter = [];
    this.valueSetter = [];
  }

  selectValue(value) {
    if (value.length <= 0)
      return false;

    if (!this.newValuesAllowed && !this.options.includes(value))
      return false;

    if (!this.allowDuplicates && this.values.includes(value))
      return false;

    this.values.push(value);
    var [valueElement, removeElement, valueGetter, valueSetter] = this.generateValueElement(value);
    this.valuesContainer.appendChild(valueElement);
    this.valueGetter.push(valueGetter);
    this.valueSetter.push(valueSetter);
    removeElement.addEventListener('click', () => {
      this.values.splice([...this.valuesContainer.childNodes].indexOf(valueElement), 1);
      this.valueGetter.splice([...this.valuesContainer.childNodes].indexOf(valueElement), 1);
      this.valueSetter.splice([...this.valuesContainer.childNodes].indexOf(valueElement), 1);
      valueElement.parentElement.removeChild(valueElement);
    });

    this.stringInput.setValue('');
    this.generateSuggestions();

    return true;
  }

  generateValueElement(value) {
    var valueElement = document.createElement('div');
    valueElement.classList.add('custom-multi-select-input-value');
    valueElement.appendChild(document.createTextNode(value));

    return [valueElement, valueElement, () => { return value; }, (value) => {
      valueElement.innerHTML = '';
      valueElement.appendChild(document.createTextNode(value));
    }];
  }

  getValue() {
    return this.valueGetter.map((getter) => { return getter(); });
  }

  setValue(values) {
    this.valuesContainer.innerHTML = '';

    this.values = [];

    return values.map((value, index) => {
      return { value: value, index: index };
    }).filter((value) => {
      return this.selectValue(value.value);
    }).map((value) => {
      return value.index;
    });
  }

  filterOption(option, value) {
    return super.filterOption(option, value) && !this.values.includes(option);
  }

}

class CustomListInput extends CustomMultiSelectInput {

  constructor(element, options, placeholder = '', newValuesAllowed = false, allowDuplicates = false, defaultElementBuilder = null) {
    super(element, Object.keys(options), placeholder, newValuesAllowed, allowDuplicates);

    this.builder = options;

    this.defaultElementBuilder = defaultElementBuilder;
  }

  generateValueElement(value) {
    if (Object.keys(this.builder).includes(value) && this.builder[value] != null)
      return this.builder[value](value);
    if (this.defaultElementBuilder == null)
      return super.generateValueElement(value);
    return this.defaultElementBuilder(value);
  }

  setValue(values) {
    var indices = super.setValue(values.map((value) => { return value.type; }));

    for (var i = 0; i < indices.length; i++) {
      this.valueSetter[i](values[indices[i]]);
    }
  }

}

class CustomButtonInput {

  constructor(element, label = '', callback = () => { console.error('Custom Button callback not defined'); }) {
    this.element = element;
    this.element.classList.add('custom-button-input');
    this.element.classList.add('custom-input');

    this.element.appendChild(document.createTextNode(label));

    this.element.addEventListener('click', () => {
      callback();
    });
  }

}

class CustomCheckboxInput extends CustomButtonInput {

  constructor(element) {
    super(element, '', () => {
      this.setValue(!this.getValue());
    });

    this.element.classList.add('custom-checkbox-input');

    this.setValue(false);
  }

  getValue() {
    return this.checked;
  }

  setValue(value) {
    this.checked = value;

    if (value)
      this.element.classList.add('checked');
    else
      this.element.classList.remove('checked');
  }

}

class CustomInputHeader {

  constructor(element, title) {
    this.element = element;
    this.element.classList.add('custom-input-header');
    this.setTitle(title);
  }

  setTitle(title) {
    this.element.innerHTML = '';
    this.element.appendChild(document.createTextNode(title));
  }

}

class CustomInputBuilder {
  
  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('dnd-modify-input');

    this.headers = [];

    this.inputs = {};

    this.input = null;
    this.element = null;
  }

  withClass(clazz) {
    if (this.element == null)
      this.container.classList.add(clazz);
    else
      this.element.classList.add(clazz);

    return this;
  }

  withTitle(tooltip) {
    if (this.element == null)
      this.container.title = tooltip;
    else
      this.element.title = tooltip;

    return this;
  }

  addHeader(title) {
    var headerElement = document.createElement('div');
    this.container.appendChild(headerElement);

    var header = new CustomInputHeader(headerElement, title);

    this.headers.push(header);
    this.input = null;
    this.element = headerElement;

    return this;
  }

  addButton(id, label = '', callback = () => { console.error('Custom Button callback not defined'); }) {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomButtonInput(inputElement, label, callback);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = null;
    this.element = inputElement;

    return this;
  }

  addCheckbox(id) {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomCheckboxInput(inputElement);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addNumberInput(id, placeholder = '', allowNegative = false, allowFloat = false) {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomNumberInput(inputElement, placeholder, allowNegative, allowFloat);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addStringInput(id, placeholder = '', allowLineBreaks = false) {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomStringInput(inputElement, placeholder, allowLineBreaks);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addDiceInput(id, placeholder = '') {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomDiceInput(inputElement, placeholder);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addDropdownInput(id, options) {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomDropdownInput(inputElement, options);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addStringWithSuggestionsInput(id, options, placeholder = '') {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomStringInputWithSuggestion(inputElement, options, placeholder);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addMultiSelectInput(id, options, placeholder = '', newValuesAllowed = false, allowDuplicates = false) {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomMultiSelectInput(inputElement, options, placeholder, newValuesAllowed, allowDuplicates);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addListInput(id, options, placeholder = '', newValuesAllowed = false, allowDuplicates = false, defaultElementBuilder = null) {
    var inputElement = document.createElement('div');
    this.container.appendChild(inputElement);

    var input = new CustomListInput(inputElement, options, placeholder, newValuesAllowed, allowDuplicates, defaultElementBuilder);

    this.inputs[id] = { element: inputElement, input: input };
    this.input = input;
    this.element = inputElement;

    return this;
  }

  addBuilder(builder) {
    var build = builder.build(this.container);
    Object.entries(build.inputs).forEach((id, input) => {
      this.inputs[id] = input;
    });

    this.input = null;
    this.element = build.container;

    return this;
  }

  build(parent) {
    parent.appendChild(this.container);

    return new CustomBuiltInput(this);
  }

  buildInto(parent) {
    while (this.container.childNodes.length > 0)
      parent.appendChild(this.container.childNodes[0]);

    this.container = parent;

    return new CustomBuiltInput(this);
  }

}

class CustomBuiltInput {

  constructor(builder) {
    this.container = builder.container;
    this.headers = builder.headers;
    this.inputs = builder.inputs;
  }

}

window.addEventListener('load', () => {
  var container = document.createElement('div');
  container.id = 'dnd-modify-inputs';
  document.body.appendChild(container);

  var nameInput = new CustomInputBuilder()
    .addHeader('Name')
    .addStringInput('name', 'Creature Name')
    .build(container);

  var sizeInput = new CustomInputBuilder()
    .addHeader('Size')
    .addDropdownInput('size', ['Small', 'Medium', 'Large'])
    .build(container);

  var typeInput = new CustomInputBuilder()
    .addHeader('Type')
    .addStringWithSuggestionsInput('type', ['Dragon', 'Humanoid', 'Construct', 'Undead', 'Monstrosity', 'Beast'], 'Dragon, Humanoid, ...')
    .build(container);

  var subtypeInput = new CustomInputBuilder()
    .addHeader('Subtype')
    .addStringWithSuggestionsInput('Subtype', ['dwarf', 'elf', 'half-elf'], 'dwarf, elf, ...')
    .build(container);

  var alignmentInput = new CustomInputBuilder()
    .addHeader('Alignment')
    .addDropdownInput('ethicality', ['none', 'lawful', 'non-lawful', 'neutral', 'non-neutral', 'chaotic', 'non-chaotic', 'any'])
    .addDropdownInput('morality', ['none', 'good', 'non-good', 'neutral', 'non-neutral', 'evil', 'non-chaotic', 'any'])
    .build(container);

  var armorClassInput = new CustomInputBuilder()
    .addHeader('Armor Class')
    .addNumberInput('armor_class', 'Armor Class', false, false)
    .build(container);

  var armorTypesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Armor Types')
    .addMultiSelectInput('armor_types', ['breastplate', '+2 shield', 'natural armor'], 'natural armor, breastplate, ...', true, false)
    .build(container);

  var hpInput = new CustomInputBuilder()
    .addHeader('Hit Points')
    .addDiceInput('hp', 'Hit Points')
    .build(container);

  var speedsInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Speeds')
    .addListInput('speeds', { move: null, fly: null, climb: null, swim: null }, 'move, fly, ...', true, false, (value) => {
      var valueElement = document.createElement('div');
      valueElement.classList.add('custom-list-input-value');
      valueElement.classList.add('dnd-speed-input');

      var input = new CustomInputBuilder()
        .addHeader(value)
        .addNumberInput('speed', 'Speed', false, false)
        .addDropdownInput('unit', ['ft', 'mi'])
        .addButton('remove', 'Remove', () => {})
        .buildInto(valueElement);

      return [valueElement, input.inputs['remove'].element, () => {
        return { type: value, speed: input.inputs['speed'].input.getValue(), unit: input.inputs['unit'].input.getValue() };
      }, (value) => {
        input.headers[0].setTitle(value.type);
        input.inputs['speed'].input.setValue(value.speed);
        input.inputs['unit'].input.setValue(value.unit);
      }];
    }).build(container);

  var statsInput = new CustomInputBuilder()
    .addHeader('Ability Scores')
    .addBuilder(new CustomInputBuilder()
      .addHeader('STR')
      .addNumberInput('str', '', false, false))
    .withClass('dnd-ability-score-input')
    .addBuilder(new CustomInputBuilder()
      .addHeader('DEX')
      .addNumberInput('dex', '', false, false))
    .withClass('dnd-ability-score-input')
    .addBuilder(new CustomInputBuilder()
      .addHeader('CON')
      .addNumberInput('con', '', false, false))
    .withClass('dnd-ability-score-input')
    .addBuilder(new CustomInputBuilder()
      .addHeader('INT')
      .addNumberInput('int', '', false, false))
    .withClass('dnd-ability-score-input')
    .addBuilder(new CustomInputBuilder()
      .addHeader('WIS')
      .addNumberInput('wis', '', false, false))
    .withClass('dnd-ability-score-input')
    .addBuilder(new CustomInputBuilder()
      .addHeader('CHA')
      .addNumberInput('cha', '', false, false))
    .withClass('dnd-ability-score-input')
    .build(container);

  var savesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Saving Throws')
    .addListInput('saves', { Str: null, Dex: null, Con: null, Int: null, Wis: null, Cha: null }, 'Int, Dex, ...', false, false, (value) => {
      var valueElement = document.createElement('div');
      valueElement.classList.add('custom-list-input-value');
      valueElement.classList.add('dnd-save-input');

      var input = new CustomInputBuilder()
        .addHeader(value)
        .addNumberInput('save', 'Save', true, false)
        .addButton('remove', 'Remove', () => {})
        .buildInto(valueElement);

      return [valueElement, input.inputs['remove'].element, () => {
        return { type: value, save: input.inputs['save'].input.getValue() };
      }, (value) => {
        input.headers[0].setTitle(value.type);
        input.inputs['save'].input.setValue(value.save);
      }];
    }).build(container);

  var skillsInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Skills')
    .addListInput('skills', { Perception: null, Stealth: null, Intimidation: null, Persuasion: null }, 'Athletics, Acrobatics, ...', false, false, (value) => {
      var valueElement = document.createElement('div');
      valueElement.classList.add('custom-list-input-value');
      valueElement.classList.add('dnd-skill-input');

      var input = new CustomInputBuilder()
        .addHeader(value)
        .addNumberInput('skill', 'Skill', true, false)
        .addButton('remove', 'Remove', () => {})
        .buildInto(valueElement);

      return [valueElement, input.inputs['remove'].element, () => {
        return { type: value, skill: input.inputs['skill'].input.getValue() };
      }, (value) => {
        input.headers[0].setTitle(value.type);
        input.inputs['skill'].input.setValue(value.skill);
      }];
    }).build(container);

  var damangeVulnerabilitiesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Damage Vulnerabilities')
    .addMultiSelectInput('vulnerabilies', ['slashing', 'bludgeoning', 'piercing'], 'bludgeoning, piercing, ...', true, false)
    .build(container);

  var damangeResistancesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Damage Resistances')
    .addMultiSelectInput('resistances', ['slashing', 'bludgeoning', 'piercing'], 'bludgeoning, piercing, ...', true, false)
    .build(container);

  var damangeImmunitiesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Damage Immunities')
    .addMultiSelectInput('immunities', ['slashing', 'bludgeoning', 'piercing'], 'bludgeoning, piercing, ...', true, false)
    .build(container);

  var conditionImmunitiesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Condition Immunities')
    .addMultiSelectInput('immunities', ['frightened', 'exhaustion', 'blinded'], 'frightened, stunned, ...', false, false)
    .build(container);

  var sensesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Senses')
    .addListInput('senses', { darkvision: null, blindsight: null, truesight: null }, 'darkvision, blindvision, ...', true, false, (value) => {
      var valueElement = document.createElement('div');
      valueElement.classList.add('custom-list-input-value');
      valueElement.classList.add('dnd-sense-input');

      var input = new CustomInputBuilder()
        .addHeader(value)
        .addNumberInput('distance', 'Distance', false, false)
        .addDropdownInput('unit', ['ft', 'mi'])
        .addCheckbox('blind')
        .withTitle('blind beyond this radius?')
        .addButton('remove', 'Remove', () => {})
        .buildInto(valueElement);

      return [valueElement, input.inputs['remove'].element, () => {
        return { type: value, distance: input.inputs['distance'].input.getValue(), unit: input.inputs['unit'].input.getValue(), blind: input.inputs['blind'].input.getValue() };
      }, (value) => {
        input.headers[0].setTitle(value.type);
        input.inputs['distance'].input.setValue(value.distance);
        input.inputs['unit'].input.setValue(value.unit);
        input.inputs['blind'].input.setValue(value.blind);
      }];
    }).build(container);

  var languagesInput = new CustomInputBuilder()
    .withClass('dnd-vertical-input-container')
    .addHeader('Armor Types')
    .addMultiSelectInput('armor_types', ['breastplate', '+2 shield', 'natural armor'], 'natural armor, breastplate, ...', true, false)
    .build(container);









  document.getElementById('modify-button').addEventListener('click', () => {
    switchMode();
    loadCreature();
  });

  document.getElementById('cancel-button').addEventListener('click', () => {
    switchMode();
    loadCreature();
  });

  document.getElementById('save-button').addEventListener('click', () => {
    // save element
    location.reload();
  });

  loadCreature();
});

function switchMode() {
  if (modifying) {
    document.querySelector('#switch-mode-buttons > div:nth-child(1)').style.display = null;
    document.querySelector('#switch-mode-buttons > div:nth-child(2)').style.display = 'none';
  } else {
    document.querySelector('#switch-mode-buttons > div:nth-child(1)').style.display = 'none';
    document.querySelector('#switch-mode-buttons > div:nth-child(2)').style.display = null;
  }

  modifying = !modifying;
}

function loadCreature() {
  document.getElementById('creature-container').innerHTML = '';
  
  if (!modifying) {
    creature = DNDCreature.fromJSON(creatureJSON);
    document.getElementById('creature-container').appendChild(creature.getHTML());
    return;
  }


}