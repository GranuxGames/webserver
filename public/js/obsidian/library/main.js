const MAIN_HTML_IDS = {
  button_new: 'button-new-note'
};

window.addEventListener('load', () => {
  document.getElementById(MAIN_HTML_IDS.button_new).addEventListener('click', () => {
    console.log('new');
  });
});