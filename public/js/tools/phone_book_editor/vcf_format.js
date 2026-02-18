const ENTRY_TYPES = [
  Address,
  Birthday,
  Categories,
  Email,
  FullName,
  Name,
  Note,
  Organization,
  Photo,
  PhoneNumber,
  Title,
  UID,
  URL
]

var phoneBook = null;

class VCFFormat extends FileFormat {

  static instance = new VCFFormat();

  constructor() {
    super('text/x-vcard');
  }

  async parse(text) {
    document.getElementById('state').innerHTML = 'loading';

    text = text.replaceAll(/\n +/gm, '');

    var regex = /^([^:\n]+):([^\n]*)/gm;
    var matches = [...text.matchAll(regex)];

    var book = new PhoneBook();
    
    matches.forEach((match) => {
      if (match[0] == 'BEGIN:VCARD') {
        book.contacts.push(new Contact());
        return;
      }

      for (var EntryType of ENTRY_TYPES) {
        if (!EntryType.parsableVCF(match[0]))
          continue;
        var value = EntryType.parseVCF(match[0]);
        if (value != null) {
          book.contacts[book.contacts.length - 1]
              .setAttribute(EntryType, value);
          break;
        }
      }
    });

    await Promise.all(photoPromises);
    
    phoneBook = book;

    document.getElementById('state').innerHTML = 'loaded';
  }

}