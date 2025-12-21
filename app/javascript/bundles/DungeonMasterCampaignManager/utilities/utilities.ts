// Item type values - matches ItemType enum in use-data.ts
// Defined here to avoid circular dependency
const ItemTypeValues = {
  all: 'All',
  armor: 'ArmorItem',
  gear: 'GearItem',
  magic: 'MagicItem',
  magicArmor: 'MagicArmorItem',
  magicWeapon: 'MagicWeaponItem',
  tool: 'ToolItem',
  vehicle: 'VehicleItem',
  weapon: 'WeaponItem',
} as const;

export const allowedTypes = [
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

export const numToWords = [
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

export const indexToLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

export const getNumberWithOrdinal = (num: number): string => {
  const ordinal = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  return num + (ordinal[(value - 20) % 10] ?? ordinal[value] ?? ordinal[0]);
};

export const camelize = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const isMobileWidth = (): boolean => {
  const { innerWidth: width } = window;
  return width < 960;
};

export const numberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const itemPages = [
  {
    path: '/app/items',
    itemType: ItemTypeValues.all,
    pageTitle: 'All Equipment and Items',
  },
  {
    path: '/app/items/armor',
    itemType: ItemTypeValues.armor,
    pageTitle: 'Armor',
  },
  {
    path: '/app/items/gear',
    itemType: ItemTypeValues.gear,
    pageTitle: 'Adventuring Gear',
  },
  {
    path: '/app/items/magic-items',
    itemType: ItemTypeValues.magic,
    pageTitle: 'Magic Items',
  },
  {
    path: '/app/items/magic-armor',
    itemType: ItemTypeValues.magicArmor,
    pageTitle: 'Magic Armor',
  },
  {
    path: '/app/items/magic-weapons',
    itemType: ItemTypeValues.magicWeapon,
    pageTitle: 'Magic Weapons',
  },
  {
    path: '/app/items/tools',
    itemType: ItemTypeValues.tool,
    pageTitle: 'Tools',
  },
  {
    path: '/app/items/vehicles',
    itemType: ItemTypeValues.vehicle,
    pageTitle: 'Vehicles and Mounts',
  },
  {
    path: '/app/items/weapons',
    itemType: ItemTypeValues.weapon,
    pageTitle: 'Weapons',
  },
];

// Default export for backwards compatibility
const Util = {
  allowedTypes,
  numToWords,
  indexToLetter,
  getNumberWithOrdinal,
  camelize,
  isMobileWidth,
  numberWithCommas,
  itemPages,
};

export default Util;
