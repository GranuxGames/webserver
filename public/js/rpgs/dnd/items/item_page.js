window.addEventListener('load', () => {
  var item = DNDItem.fromJSON(itemJSON);
  document.getElementById('dnd-object-container').appendChild(item.getHTML());
});