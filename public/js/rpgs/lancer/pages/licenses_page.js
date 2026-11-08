licenses = [];

const REWARD_TYES = {
  system: 'System',
  weapon: 'Weapon',
  tech: 'Tech',
  frame: 'Frame'
};

class Reward {

  constructor(type) {
    this.type = type;

    this.container = document.createElement('div');
    this.container.classList.add('lancer-licenses-reward');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-licenses-reward-header');
    this.container.appendChild(this.header);

    var search = new StringSearch('Search...');
    this.header.appendChild(search.container);

    var typeSelect = document.createElement('select');
    Object.entries(REWARD_TYES).forEach(([type, name]) => {
      var typeOption = document.createElement('option');
      typeOption.value = type;
      typeOption.appendChild(document.createTextNode(name));
      typeSelect.appendChild(typeOption);

      if (name == this.type)
        typeSelect.value = type;
    });
    typeSelect.addEventListener('change', () => {
      var reward = new REWARD_CLASSES[typeSelect.value];
      this.getHTML().before(reward.getHTML());
      this.getHTML().parentElement.removeChild(this.getHTML());
    });
    this.header.appendChild(typeSelect);

    this.body = document.createElement('div');
    this.body.classList.add('lancer-licenses-reward-body');
    this.container.appendChild(this.body);
  }

  getHTML() {
    return this.container;
  }

}

class SystemReward extends Reward {

  constructor() {
    super(REWARD_TYES.system);

    this.container.classList.add('lancer-licenses-reward-system');

    console.log('System Reward');

    this.type = new ListSearch('Active, Passive, ...', 'System Type');
    this.type.values = Object.entries(STATICS.system_types).map(([key, value]) => {
      return value.name;
    });
    this.body.appendChild(this.type.container);

    this.tags = new ListSearch('Unique, Reliable, ...', 'Tags');
    this.tags.values = Object.entries(STATICS.tags).map(([key, value]) => {
      return value.name;
    });
    this.body.appendChild(this.tags.container);

    console.log(STATICS);

    // system type
    // tags
    // activation time (quick action, full action, ...)
    // sp cost
  }

}

class WeaponReward extends Reward {

  constructor() {
    super(REWARD_TYES.weapon);

    this.container.classList.add('lancer-licenses-reward-weapon');

    console.log('Weapon Reward');

    // weapon type
    // sp cost
    // size
    // tags
    // ranges (range, threat, burst, ...)
    // damage types
  }

}

class TechReward extends Reward {

  constructor() {
    super(REWARD_TYES.tech);

    this.container.classList.add('lancer-licenses-reward-tech');

    console.log('Tech Reward');

    // tech type
    // sp cost
    // activation time (quick action, full action, ...)
    // tags
  }

}

class FrameReward extends Reward {

  constructor() {
    super(REWARD_TYES.frame);

    this.container.classList.add('lancer-licenses-reward-frame');

    console.log('Frame Reward');
  }

}

const REWARD_CLASSES = {
  system: SystemReward,
  weapon: WeaponReward,
  tech: TechReward,
  frame: FrameReward
};

var STATICS;

window.addEventListener('load', () => {
  var searchContainer = document.querySelector('#lancer-licenses-page-search-container');
  var search = new StringSearch('Search...');
  search.container.classList.add('diagonal-border');
  searchContainer.prepend(search.container);

  var rewardsContainer = document.querySelector('#lancer-licenses-page-rewards-container');

  var rewardsAddButton = document.querySelector('#lancer-licenses-page-rewards-add');
  rewardsAddButton.addEventListener('click', () => {
    var reward = new SystemReward();
    rewardsAddButton.before(reward.getHTML());
  });



  fetch('/rpgs/lancer/api/fetch-statics', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((object) => { return object.json(); })
  .then((object) => { return object.result; })
  .then((object) => {
    STATICS = object;
  });

  fetch('/rpgs/lancer/api/fetch-manufacturers', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((object) => { return object.json(); })
  .then((object) => { return object.result; })
  .then((object) => {
    object = object.map((manufacturer) => {
      manufacturer.licenses = manufacturer.licenses.filter((license) => {
        return license.ranks.length > 0;
      });
      return manufacturer;
    }).filter((manufacturer) => {
      return manufacturer.licenses.length > 0;
    }).map((manufacturer) => {
      manufacturer.licenses = manufacturer.licenses.map((license) => {
        license.name = manufacturer.abbreviation + ' ' + license.frames[0].name;
        return license;
      });
      return manufacturer.licenses;
    }).flat().map((license) => {
      license.level = getLicenseLevel(license.id);
      return license;
    }).sort((licenseA, licenseB) => {
      return licenseB.level - licenseA.level;
    });

    object.forEach((licenseJSON) => {
      var license = License.fromJSON(licenseJSON);
      document.getElementById('lancer-licenses-page-licenses').appendChild(license.getHTML());
      licenses.push(license);

      var header = document.createElement('div');
      header.classList.add('lancer-licenses-page-license-header');
      license.getHTML().insertBefore(header, license.ranks);

      var levelSetter = (i) => {
        license.level = i % (license.ranksArray.length + 1);
        license.getHTML().classList.forEach((className) => {
          if (className.startsWith('lancer-licenses-page-license-level-'))
            license.getHTML().classList.remove(className);
        });
        license.getHTML().classList.add('lancer-licenses-page-license-level-' + license.level);
        
        setLicenseLevel(license.json.id, license.level);
      };

      var headerContainer = document.createElement('div');
      header.appendChild(headerContainer);
      headerContainer.appendChild(document.createTextNode(licenseJSON.name));

      var licenseExpander = document.createElement('div');
      licenseExpander.classList.add('lancer-licenses-page-license-expander');
      header.appendChild(licenseExpander);

      header.addEventListener('click', () => {
        license.getHTML().classList.toggle('collapsed');
      });
      license.getHTML().classList.add('collapsed');

      var selector = document.createElement('div');
      selector.classList.add('lancer-licenses-page-selector');
      header.appendChild(selector);

      for (let i = 0; i < license.ranksArray.length; i++) {
        var selectorLevel = document.createElement('div');
        selectorLevel.classList.add('lancer-license-page-selector-level');
        selector.appendChild(selectorLevel);

        selectorLevel.addEventListener('click', (e) => {
          e.stopPropagation();

          if (license.level == i + 1)
            levelSetter(0);
          else
            levelSetter(i + 1);
        });

        var selectorLevelInner = document.createElement('div');
        selectorLevel.appendChild(selectorLevelInner);
      }

      license.header.parentElement.removeChild(license.header);
      license.frames.parentElement.removeChild(license.frames);

      var frames = document.createElement('div');
      frames.classList.add('lancer-licenses-page-frames');
      frames.classList.add('lancer-minified');
      license.ranksArray[1].getHTML().appendChild(frames);

      license.framesArray.forEach((frame) => {
        frames.appendChild(frame.getHTML());
      });

      license.ranksArray.forEach((rank) => {
        var header = rank.header;

        var container = document.createElement('div');
        header.appendChild(container);
        container.appendChild(rank.rank);
        container.appendChild(rank.rewardNames);

        var expander = document.createElement('div');
        expander.classList.add('lancer-licenses-page-license-rank-expander');
        header.appendChild(expander);

        rank.getHTML().classList.add('collapsed');
        header.addEventListener('click', () => {
          rank.getHTML().classList.toggle('collapsed');
        });
      });

      levelSetter(licenseJSON.level);
    });
  });
});