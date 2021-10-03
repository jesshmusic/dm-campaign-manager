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

const COLUMNS = {
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
  [ItemType.armor]: [
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
  [ItemType.weapon]: [
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
  ],
};

export const useData = (props: ItemsPageProps) => {
  const { getItems, items, itemType } = props;

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
        cost: item.cost,
        damage: item.damage,
        name: item.name,
        properties: item.properties,
        rarity: item.rarity,
        requiresAttunement:
          item.requiresAttunement !== '' ? item.requiresAttunement : '-',
        slug: item.slug,
        speed: item.speed,
        stealth: item.stealth,
        strength: item.strength,
        vehicleCategory: item.vehicleCategory,
        weight: item.weight ? `${item.weight} lb.` : '-',
      };
    });
  }, [items]);

  const columns = React.useMemo(() => COLUMNS[itemType], []);

  return {
    columns,
    data,
  };
};
