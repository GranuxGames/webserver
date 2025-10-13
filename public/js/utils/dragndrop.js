class DragNDrop {

  constructor(dropZone) {
    this.dropZone = dropZone;

    this.dropZone.addEventListener('dragover', this.onDragOver.bind(this));
    this.dropZone.addEventListener('dragenter', this.onDragEnter.bind(this));
    this.dropZone.addEventListener('dragleave', this.onDragLeave.bind(this));
    this.dropZone.addEventListener('drop', this.onDrop.bind(this));
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDragEnter(e) {
    if (e.fromElement != null)
      return;

    e.preventDefault();
    this.dropZone.style.opacity = 1;
  }

  onDragLeave(e) {
    if (e.fromElement != null)
      return;

    e.preventDefault();
    this.dropZone.style.opacity = 0;
  }

  onDrop(e) {
    e.preventDefault();
    this.dropZone.style.opacity = 0;

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