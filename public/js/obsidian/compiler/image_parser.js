class ImageParser {

  constructor() {

  }

  parse(container, text) {
    var data = {
      name: null,
      img_link: null,
      tooltip: null,
      link: null
    };
    if (text.startsWith('!')) {
      var reg = /^!\[([^\]]*)\]\(([^ \)]*)(?: "([^"]*)")?\)$/gm;
      var matches = [...text.matchAll(reg)];
      data.name = matches[0][1];
      data.img_link = matches[0][2];
      data.tooltip = matches[0][3];
    } else {
      var reg = /^\[!\[([^\]]*)\]\(([^ \)]*)(?: "([^"]*)")?\)\]\(([^\)]*)\)$/gm;
      var matches = [...text.matchAll(reg)];
      data.name = matches[0][1];
      data.img_link = matches[0][2];
      data.tooltip = matches[0][3];
      data.link = matches[0][4];
    }

    var line = document.createElement('div');
    line.classList.add('markdown-line');
    container.appendChild(line);

    var span = document.createElement('span');
    span.setAttribute('src', data.img_link);
    span.setAttribute('name', data.name);
    if (data.tooltip != null)
      span.setAttribute('tooltip', data.tooltip);
    if (data.link != null)
      span.setAttribute('link', data.link);
    span.classList.add('markdown-image-text');
    line.appendChild(span);

    span.appendChild(document.createTextNode(text));

    // var img = document.createElement('img');
    // img.src = data.img_link;
    // img.classList.add('markdown-image');
    // line.appendChild(img);
    // img.setAttribute('name', data.name);

    // if (data.tooltip != null)
    //   img.title = data.tooltip;
    // if (data.link != null) {
    //   img.setAttribute('link', data.link);
    //   img.classList.add('markdown-image-link');
    //   img.addEventListener('click', (e) => {
    //     window.location.href = data.link;
    //   });
    // } 
  }

}