function createLancerStorage() {
  if (window.localStorage.getItem('/rpgs/lancer') == null)
    window.localStorage.setItem('/rpgs/lancer', JSON.stringify({}));
}

function createLancerLicensesStorage() {
  var lancer = JSON.parse(window.localStorage.getItem('/rpgs/lancer'));
  if (lancer.licenses == null)
    lancer.licenses = {};
  return lancer;
}

function setLicenseLevel(id, level) {
  this.createLancerStorage();

  var lancer = createLancerLicensesStorage();

  if (level == 0)
    delete lancer.licenses[id];
  else
    lancer.licenses[id] = level;

  window.localStorage.setItem('/rpgs/lancer', JSON.stringify(lancer));
}

function getLicenseLevel(id) {
  this.createLancerStorage();

  var lancer = createLancerLicensesStorage();

  if (lancer.licenses[id] == null)
    return 0;
  
  return lancer.licenses[id];
}