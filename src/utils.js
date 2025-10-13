/**
 * A function to fix an object using a template object. The template dictates
 * which keys should be in the object. If a key is in the template but not in
 * the object, it is filled with the template's value.
 * 
 * @param {object} obj The object to fix.
 * @param {object} template The template to fix the object with.
 * 
 * @returns {object} An object fixed with the template object.
 */
function fixObject(obj, template) {
  var fixed = {};
  Object.keys(template).forEach((key) => {
    if (obj[key] == null)
      fixed[key] = template[key];
    else if (obj[key].constructor == Object
        && template[key].constructor == Object)
      fixed[key] = fixObject(obj[key], template[key]);
    else
      fixed[key] = obj[key];
  });
  return fixed;
}

/**
 * A function to check if the provided (sub-) url is valid. It cannot end with
 * / or contain a //. It is also fixed using the encodeURI function of strings.
 * 
 * @param {string} url The url to check.
 * 
 * @returns {boolean} A value of true if the (sub-) url is valid.
 * 
 * @throws {Error} Error in case the provided (sub-) url is invalid.
 */
function checkURL(url) {
  if (url.includes('//'))
    throw new Error('URL can not contain //');

  if (url.startsWith('/'))
    throw new Error('URL can not start with /');

  if (url.endsWith('/'))
    throw new Error('URL can not end with /');

  if (url != encodeURI(url))
    throw new Error('URL must be url safe\nTry ' + encodeURI(url) + ' instead');

  return true;
}

/**
 * Converts the current date into a string of the format YYYY/MM/dd HH:mm:ss.
 * 
 * @returns {string} The current date time as a string.
 */
function getDateTimeString() {
  var date = new Date();
  var string = '' + date.getFullYear();
  string += '/' + ('' + (date.getMonth() + 1)).padStart(2, '0');
  string += '/' + ('' + date.getDate()).padStart(2, '0');
  string += ' ' + ('' + date.getHours()).padStart(2, '0');
  string += ':' + ('' + date.getMinutes()).padStart(2, '0');
  string += ':' + ('' + date.getSeconds()).padStart(2, '0');
  return string;
}

module.exports.fixObject = fixObject;
module.exports.checkURL = checkURL;
module.exports.getDateTimeString = getDateTimeString;