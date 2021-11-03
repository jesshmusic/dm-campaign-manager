import { ItemType } from '../pages/items/use-data';

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
      'html'
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
      'nineteen'
    ];
  }

  static get indexToLetter() {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  }

  static getNumberWithOrdinal(num) {
    const ordinal = ['th', 'st', 'nd', 'rd'];
    const value = num % 100;
    return num + (ordinal[(value - 20) % 10] || ordinal[value] || ordinal[0]);
  }

  static camelize(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  static isMobileWidth(): boolean {
    const { innerWidth: width } = window;
    return width < 960;
  }

  static numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static get itemPages() {
    return [
      {
        path: '/app/items',
        itemType: ItemType.all,
        pageTitle: 'All Equipment and Items'
      },
      {
        path: '/app/items/armor/',
        itemType: ItemType.armor,
        pageTitle: 'Armor'
      },
      {
        path: '/app/items/gear/',
        itemType: ItemType.gear,
        pageTitle: 'Adventuring Gear'
      },
      {
        path: '/app/items/magic-items/',
        itemType: ItemType.magic,
        pageTitle: 'Magic Items'
      },
      {
        path: '/app/items/magic-armor/',
        itemType: ItemType.magicArmor,
        pageTitle: 'Magic Armor'
      },
      {
        path: '/app/items/magic-weapons/',
        itemType: ItemType.magicWeapon,
        pageTitle: 'Magic Weapons'
      },
      {
        path: '/app/items/tools/',
        itemType: ItemType.tool,
        pageTitle: 'Tools'
      },
      {
        path: '/app/items/vehicles/',
        itemType: ItemType.vehicle,
        pageTitle: 'Vehicles and Mounts'
      },
      {
        path: '/app/items/weapons/',
        itemType: ItemType.weapon,
        pageTitle: 'Weapons'
      }
    ];
  }
}
