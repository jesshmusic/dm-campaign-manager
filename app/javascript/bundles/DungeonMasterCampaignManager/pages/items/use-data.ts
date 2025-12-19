import {
  ItemInfoBlock,
  ItemPageProps,
  ItemProps,
  ItemsPageProps,
  ItemSummary,
} from '../../utilities/types';
import React from 'react';
import Util from '../../utilities/utilities';
import { useEdition } from '../../contexts/EditionContext';

export enum ItemType {
  all = 'All',
  armor = 'ArmorItem',
  gear = 'GearItem',
  magic = 'MagicItem',
  magicArmor = 'MagicArmorItem',
  magicWeapon = 'MagicWeaponItem',
  tool = 'ToolItem',
  vehicle = 'VehicleItem',
  weapon = 'WeaponItem',
}

const getRarityValue = (rarity: string): number => {
  switch (rarity) {
    case '-':
      return 0;
    case 'common':
      return 1;
    case 'uncommon':
      return 2;
    case 'rare':
      return 3;
    case 'very rare':
      return 4;
    case 'legendary':
      return 6;
    case 'artifact':
      return 10;
    default:
      return 15;
  }
};

const armorColumn = [
  {
    Header: 'Armor',
    accessor: 'name',
  },
  {
    Header: 'Type',
    accessor: 'armorType',
  },
  {
    Header: 'Cost',
    accessor: 'cost',
  },
  {
    Header: 'Armor Class (AC)',
    accessor: 'armorClass',
  },
  {
    Header: 'Strength',
    accessor: 'strength',
  },
  {
    Header: 'Stealth',
    accessor: 'stealth',
  },
  {
    Header: 'Weight',
    accessor: 'weight',
  },
];

const weaponColumn = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Cost',
    accessor: 'cost',
  },
  {
    Header: 'Damage',
    accessor: 'damage',
  },
  {
    Header: 'Weight',
    accessor: 'weight',
  },
  {
    Header: 'Properties',
    accessor: 'properties',
  },
];

export const useData = (props: ItemsPageProps) => {
  const { getItems, items, itemType } = props;
  const { isEdition2014 } = useEdition();

  // Weapon columns with mastery only for 2024 edition
  const weaponColumnsWithMastery = React.useMemo(
    () => [
      ...weaponColumn,
      ...(isEdition2014
        ? []
        : [
            {
              Header: 'Mastery',
              accessor: 'mastery',
            },
          ]),
    ],
    [isEdition2014],
  );

  const columnValues = {
    [ItemType.all]: [
      {
        Header: 'Item',
        accessor: 'name',
      },
      {
        Header: 'Weight',
        accessor: 'weight',
      },
      {
        Header: 'Cost',
        accessor: 'cost',
      },
    ],
    [ItemType.armor]: [...armorColumn],
    [ItemType.magicArmor]: [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Rarity',
        accessor: 'rarity',
        sortType: React.useMemo(
          () => (rowA, rowB, columnId) => {
            const a = getRarityValue(rowA.values[columnId]);
            const b = getRarityValue(rowB.values[columnId]);
            return a > b ? 1 : -1;
          },
          [],
        ),
      },
      {
        Header: 'Attunement?',
        accessor: 'requiresAttunement',
      },
    ],
    [ItemType.gear]: [
      {
        Header: 'Item',
        accessor: 'name',
      },
      {
        Header: 'Weight',
        accessor: 'weight',
      },
      {
        Header: 'Cost',
        accessor: 'cost',
      },
    ],
    [ItemType.magic]: [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Rarity',
        accessor: 'rarity',
        sortType: React.useMemo(
          () => (rowA, rowB, columnId) => {
            const a = getRarityValue(rowA.values[columnId]);
            const b = getRarityValue(rowB.values[columnId]);
            return a > b ? 1 : -1;
          },
          [],
        ),
      },
      {
        Header: 'Attunement?',
        accessor: 'requiresAttunement',
      },
    ],
    [ItemType.tool]: [
      {
        Header: 'Item',
        accessor: 'name',
      },
      {
        Header: 'Weight',
        accessor: 'weight',
      },
      {
        Header: 'Cost',
        accessor: 'cost',
      },
    ],
    [ItemType.vehicle]: [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Cost',
        accessor: 'cost',
      },
      {
        Header: 'Category',
        accessor: 'vehicleCategory',
      },
      {
        Header: 'Speed',
        accessor: 'speed',
      },
      {
        Header: 'Capacity',
        accessor: 'capacity',
      },
      {
        Header: 'Weight',
        accessor: 'weight',
      },
    ],
    [ItemType.magicWeapon]: [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Rarity',
        accessor: 'rarity',
        sortType: React.useMemo(
          () => (rowA, rowB, columnId) => {
            const a = getRarityValue(rowA.values[columnId]);
            const b = getRarityValue(rowB.values[columnId]);
            return a > b ? 1 : -1;
          },
          [],
        ),
      },
      {
        Header: 'Attunement?',
        accessor: 'requiresAttunement',
      },
    ],
    [ItemType.weapon]: [...weaponColumnsWithMastery],
  };

  const onSearch = (searchTerm: string) => {
    getItems(itemType, searchTerm);
  };

  React.useEffect(() => {
    getItems(itemType);
  }, [itemType]);

  const data = React.useMemo(() => {
    return items.map((item: ItemSummary) => {
      return {
        armorClass: item.armorClass,
        armorType: item.armorType,
        capacity: item.capacity,
        contents: item.contents,
        cost:
          item.rarity && item.rarity !== '-'
            ? item.cost
              ? `~${item.cost}`
              : 'Varies'
            : item.cost || '-',
        damage: item.damage || '-',
        mastery: item.mastery || '-',
        name: item.name,
        properties: item.properties || '-',
        rarity: item.rarity || '-',
        requiresAttunement: item.requiresAttunement !== '' ? item.requiresAttunement : '-',
        slug: item.slug,
        speed: item.speed,
        stealth: item.stealth,
        strength: item.strength,
        vehicleCategory: item.vehicleCategory,
        weight: item.weight ? `${item.weight} lb.` : '-',
      };
    });
  }, [items]);

  const columns = React.useMemo(() => columnValues[itemType], [itemType, isEdition2014]);

  return {
    columns,
    data,
    onSearch,
  };
};

export const singleItemUseData = (_props: ItemPageProps) => {
  const getCostString = (cost?: { quantity: number; unit: string }) => {
    return cost ? `${Util.numberWithCommas(cost.quantity)} ${cost.unit}` : 'N/A';
  };
  const getItemParentInfo = (item: ItemProps): ItemInfoBlock => {
    switch (item.category) {
      case 'Armor':
        return {
          parentTitle: 'Armor',
          parentUrl: '/app/items/armor',
          subtitle: `${item.armorType} ${item.armorType !== 'Shield' ? ' armor' : ''}`,
          infoBlock: [
            { title: 'Armor Class', desc: item.armorClass || '' },
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      case 'Weapon':
        return {
          parentTitle: 'Weapons',
          parentUrl: '/app/items/weapons',
          subtitle: `${item.categoryRange} Weapon`,
          infoBlock: [
            { title: 'Damage', desc: item.damage || '' },
            { title: 'Properties', desc: item.properties || '' },
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      case 'Adventuring Gear':
        return {
          parentTitle: 'Adventuring Gear',
          parentUrl: '/app/items/gear',
          subtitle: item.gearCategory || '',
          infoBlock: [
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      case 'Mounts and Vehicles':
        return {
          parentTitle: 'Mounts & Vehicles',
          parentUrl: '/app/items/vehicles',
          subtitle: item.vehicleCategory || '',
          infoBlock: [
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      case 'Magic Item':
        return {
          parentTitle: 'Magic Items',
          parentUrl: '/app/items/magic-items',
          subtitle: `${item.magicItemType}, ${item.rarity} ${
            item.requiresAttunement &&
            item.requiresAttunement !== '' &&
            `(${item.requiresAttunement})`
          }`,
          infoBlock: [
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      case 'Magic Armor Item':
        return {
          parentTitle: 'Magic Armor',
          parentUrl: '/app/items/magic-armor',
          subtitle: `${item.armorType} ${item.armorType !== 'Shield' ? ' armor' : ''}, ${
            item.rarity
          } ${
            item.requiresAttunement &&
            item.requiresAttunement !== '' &&
            `(${item.requiresAttunement})`
          }`,
          infoBlock: [
            { title: 'Armor Class', desc: item.armorClass || '' },
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      case 'Magic Weapon Item':
        return {
          parentTitle: 'Magic Weapons',
          parentUrl: '/app/items/magic-weapons',
          subtitle: `${item.categoryRange} Weapon, ${item.rarity} ${
            item.requiresAttunement &&
            item.requiresAttunement !== '' &&
            `(${item.requiresAttunement})`
          }`,
          infoBlock: [
            { title: 'Damage', desc: item.damage || '' },
            { title: 'Properties', desc: item.properties || '' },
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      case 'Tools':
        return {
          parentTitle: 'Tools',
          parentUrl: '/app/items/tools',
          subtitle: item.toolCategory || '',
          infoBlock: [
            {
              title: 'Cost',
              desc: getCostString(item.cost),
            },
          ],
        };
      default:
        return {
          parentTitle: 'All Items',
          parentUrl: '/app/items',
          subtitle: `Not found`,
          infoBlock: [],
        };
    }
  };

  return {
    getItemParentInfo,
  };
};
