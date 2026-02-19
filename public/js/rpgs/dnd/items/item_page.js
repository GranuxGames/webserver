window.addEventListener('load', () => {
  var item = DNDItem.fromJSON(itemJSON);
  document.getElementById('item-container').appendChild(item.getHTML());
});