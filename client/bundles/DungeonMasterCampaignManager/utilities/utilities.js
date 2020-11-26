

export default class Util {
  static get allowedTypes () {
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
}
