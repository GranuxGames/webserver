const DRAG_N_DROP_HTML_IDS = {
  upload_zone: 'upload-zone'
};

class PhoneBookDragNDrop extends DragNDrop {

  constructor() {
    super(document.getElementById(DRAG_N_DROP_HTML_IDS.upload_zone));
  }
  
  onFilesDrop(files) {
    files = files.filter((file) => {
      return getFormat(file.type) != null;
    });
    
    if (files.length < 1)
      return;

    var file = files[0].getAsFile();
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      getFormat(file.type).instance.parse(reader.result.replaceAll('\r\n', '\n'));
    }
  }

}

window.addEventListener('load', () => {
  new PhoneBookDragNDrop();
});