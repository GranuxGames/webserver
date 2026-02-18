

window.addEventListener('load', () => {
  document.getElementById('save-vcf').addEventListener('click', () => {
    if (phoneBook == null)
      return;
    download('phonebook.vcf', phoneBook.toVCF(), 'utf-8', 'text/xml');
  });
  document.getElementById('save-xml').addEventListener('click', () => {
    if (phoneBook == null)
      return;
    download('phonebook.xml', phoneBook.toXML(), 'windows-1252', 'text/x-vcard');
  });
});

function encodeWin1252(str) {
  const map = new Map([
    [0x20AC, 0x80], [0x201A, 0x82], [0x0192, 0x83], [0x201E, 0x84],
    [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02C6, 0x88],
    [0x2030, 0x89], [0x0160, 0x8A], [0x2039, 0x8B], [0x0152, 0x8C],
    [0x017D, 0x8E], [0x2018, 0x91], [0x2019, 0x92], [0x201C, 0x93],
    [0x201D, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
    [0x02DC, 0x98], [0x2122, 0x99], [0x0161, 0x9A], [0x203A, 0x9B],
    [0x0153, 0x9C], [0x017E, 0x9E], [0x0178, 0x9F],
  ]);

  const bytes = [];
  for (const ch of str) {
    const cp = ch.codePointAt(0);

    if ((cp >= 0x00 && cp <= 0x7F) || (cp >= 0xA0 && cp <= 0xFF)) {
      bytes.push(cp);
      continue;
    }

    const b = map.get(cp);
    if (b !== undefined) {
      bytes.push(b);
      continue;
    }

    bytes.push(0x3F);
  }

  return new Uint8Array(bytes);
}

function download(fileName, text, encoding = 'utf-8', mime = 'text/plain') {
  var bytes;
  if (encoding == 'utf-8')
    bytes = new TextEncoder().encode(text);
  else if (encoding == 'windows-1252')
    bytes = encodeWin1252(text);

  var fileData = new Blob([bytes], { type: mime + ';charset=' + encoding });
  if (window.navigator && window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(fileData, fileName);
  else {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    var fileURL = window.URL.createObjectURL(fileData);
    a.href = fileURL;
    a.download = fileName;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(fileURL);
  }
}