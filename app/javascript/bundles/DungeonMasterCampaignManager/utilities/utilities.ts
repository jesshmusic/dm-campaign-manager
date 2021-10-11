export default class Util {
  static get allowedTypes() {
    return [
      'paragraph',
      'text',
      'emphasis',
      'strong',
      'link',
      'blockquote',
      'delete',
      'list',
      'listItem',
      'heading',
      'code',
      'thematicBreak',
      'table',
      'tableHead',
      'tableBody',
      'tableRow',
      'tableCell',
      'html',
    ];
  }

  static get numToWords() {
    return [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
  }

  static get indexToLetter() {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  }

  static camelize(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  static isMobileWidth(): boolean {
    const { innerWidth: width } = window;
    return width < 720;
  }
}
