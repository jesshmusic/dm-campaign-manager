import { ItemsPageProps, ItemSummary } from '../../utilities/types';
import React from 'react';

export enum ItemType {
  all = 'All',
  armor = 'ArmorItem',
  gear = 'GearItem',
  magic = 'MagicItem',
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
    case   'uncommon':
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

export const useData = (props: ItemsPageProps) => {
  const { getItems, items, itemType } = props;

  const columnValues = {
    [ItemType.all]: [
      {
        Header: 'Item',
        accessor: 'name'
      },
      {
        Header: 'Weight',
        accessor: 'weight'
      },
      {
        Header: 'Cost',
        accessor: 'cost'
      }
    ],
    [ItemType.armor]: [
      {
        Header: 'Armor',
        accessor: 'name'
      },
      {
        Header: 'Type',
        accessor: 'armorType'
      },
      {
        Header: 'Cost',
        accessor: 'cost'
      },
      {
        Header: 'Armor Class (AC)',
        accessor: 'armorClass'
      },
      {
        Header: 'Strength',
        accessor: 'strength'
      },
      {
        Header: 'Stealth',
        accessor: 'stealth'
      },
      {
        Header: 'Weight',
        accessor: 'weight'
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
          []
        )
      }
    ],
    [ItemType.gear]: [
      {
        Header: 'Item',
        accessor: 'name'
      },
      {
        Header: 'Weight',
        accessor: 'weight'
      },
      {
        Header: 'Cost',
        accessor: 'cost'
      }
    ],
    [ItemType.magic]: [
      {
        Header: 'Name',
        accessor: 'name'
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
          []
        )
      },
      {
        Header: 'Attunement?',
        accessor: 'requiresAttunement'
      }
    ],
    [ItemType.tool]: [
      {
        Header: 'Item',
        accessor: 'name'
      },
      {
        Header: 'Weight',
        accessor: 'weight'
      },
      {
        Header: 'Cost',
        accessor: 'cost'
      }
    ],
    [ItemType.vehicle]: [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Cost',
        accessor: 'cost'
      },
      {
        Header: 'Category',
        accessor: 'vehicleCategory'
      },
      {
        Header: 'Speed',
        accessor: 'speed'
      },
      {
        Header: 'Capacity',
        accessor: 'capacity'
      },
      {
        Header: 'Weight',
        accessor: 'weight'
      }
    ],
    [ItemType.weapon]: [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Cost',
        accessor: 'cost'
      },
      {
        Header: 'Damage',
        accessor: 'damage'
      },
      {
        Header: 'Weight',
        accessor: 'weight'
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
          []
        )
      },
      {
        Header: 'Properties',
        accessor: 'properties'
      }
    ]
  };

  React.useEffect(() => {
    getItems(itemType);
  }, []);

  const data = React.useMemo(() => {
    return items.map((item: ItemSummary) => {
      return {
        armorClass: item.armorClass,
        armorType: item.armorType,
        capacity: item.capacity,
        contents: item.contents,
        cost: item.rarity && item.rarity !== '-' ? `~${item.cost}` : item.cost,
        damage: item.damage,
        name: item.name,
        properties: item.properties,
        rarity: item.rarity || '-',
        requiresAttunement:
          item.requiresAttunement !== '' ? item.requiresAttunement : '-',
        slug: item.slug,
        speed: item.speed,
        stealth: item.stealth,
        strength: item.strength,
        vehicleCategory: item.vehicleCategory,
        weight: item.weight ? `${item.weight} lb.` : '-'
      };
    });
  }, [items]);

  const columns = React.useMemo(() => columnValues[itemType], []);

  return {
    columns,
    data
  };
};
