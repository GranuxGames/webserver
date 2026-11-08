class LicenseRank {

  constructor() {
    this.json = null;

    this.html = document.createElement('div');
    this.html.classList.add('lancer-license-rank');

    this.header = document.createElement('div');
    this.header.classList.add('lancer-license-rank-header');
    this.html.appendChild(this.header);

    this.rank = document.createElement('div');
    this.rank.classList.add('lancer-license-rank-rank');
    this.header.appendChild(this.rank);

    this.rewardNames = document.createElement('div');
    this.rewardNames.classList.add('lancer-license-rank-reward-names');
    this.header.appendChild(this.rewardNames);

    this.rewards = document.createElement('div');
    this.rewards.classList.add('lancer-license-rank-rewards');
    this.html.appendChild(this.rewards);
    this.rewardsArray = [];
  }

  getHTML() {
    return this.html;
  }

  static fromJSON(json, loadChildren = true) {
    var licenseRank = new LicenseRank();
    licenseRank.loadJSON(json, loadChildren);
    return licenseRank;
  }

  loadJSON(json, loadChildren = true) {
    this.json = json;

    this.html.classList.forEach((className) => {
      if (className.startsWith('lancer-license-rank-'))
        this.html.classList.remove(className);
    });
    this.html.classList.add('lancer-license-rank-' + json.rank);

    this.rank.innerHTML = '';
    this.rank.appendChild(document.createTextNode('License ' + ''.padStart(json.rank, 'I') + ':'));

    this.rewardNames.innerHTML = '';
    this.rewardNames.appendChild(document.createTextNode(json.rewards.map((reward) => {
      return reward.name;
    }).join(', ')));

    if (loadChildren) {
      this.rewards.innerHTML = '';
      this.rewardsArray = [];
      json.rewards.forEach((element) => {
        var reward = null;
        if (element.element_type == 'weapon')
          reward = Weapon.fromJSON(element, loadChildren);
        if (element.element_type == 'system')
          reward = System.fromJSON(element, loadChildren);
        if (element.element_type == 'tech')
          reward = Tech.fromJSON(element, loadChildren);
        this.rewardsArray.push(reward);
        this.rewards.appendChild(reward.getHTML());
      });
    }
  }

}