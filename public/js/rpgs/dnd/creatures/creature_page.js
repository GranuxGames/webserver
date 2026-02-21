window.addEventListener('load', () => {
  var creature = DNDCreature.fromJSON(creatureJSON);
  document.getElementById('creature-container').appendChild(creature.getHTML());
});