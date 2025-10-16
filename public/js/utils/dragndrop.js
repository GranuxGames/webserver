class DragNDrop {

  constructor(dropZone) {
    this.dropZone = dropZone;
    this.dropZone.style.display = 'none';

    document.body.addEventListener('dragover', this.onDragOver.bind(this));
    document.body.addEventListener('dragenter', this.onDragEnter.bind(this));
    document.body.addEventListener('dragleave', this.onDragLeave.bind(this));
    document.body.addEventListener('drop', this.onDrop.bind(this));
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDragEnter(e) {
    if (e.fromElement != null)
      return;

    e.preventDefault();
    this.dropZone.style.display = 'block';
  }

  onDragLeave(e) {
    if (e.fromElement != null)
      return;

    e.preventDefault();
    this.dropZone.style.display = 'none';
  }

  onDrop(e) {
    e.preventDefault();
    this.dropZone.style.display = 'none';

    var files = [...e.dataTransfer.items];
    files = files.filter((file) => {
      return file.kind == 'file';
    });

    if (files.length <= 0)
      return;

    this.onFilesDrop(files);
  }

  onFilesDrop(files) {}

}