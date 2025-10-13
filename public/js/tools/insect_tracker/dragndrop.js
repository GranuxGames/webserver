const DRAG_N_DROP_HTML_IDS = {
  upload_zone: 'upload-zone'
};

class ImageDragNDrop extends DragNDrop {

  constructor() {
    super(document.getElementById(DRAG_N_DROP_HTML_IDS.upload_zone));
  }
  
  onFilesDrop(files) {
    files = files.filter((file) => {
      return file.type.startsWith('image');
    });
    
    if (files.length < 1)
      return;

    var file = files[0].getAsFile();


    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      var img = new Image();
      img.src = reader.result;
      img.onload = () => {
        trackerCanvasScreen.addImage(img);
      }
    };
  }

}

window.addEventListener('load', () => {
  new ImageDragNDrop();
});