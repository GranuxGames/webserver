window.addEventListener('load', () => {
  var spell = DNDSpell.fromJSON(spellJSON);
  document.getElementById('dnd-object-container').appendChild(spell.getHTML());
});