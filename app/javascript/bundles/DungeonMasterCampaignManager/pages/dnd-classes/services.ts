import { DndClassLevel } from '../../utilities/types';
import Util from '../../utilities/utilities';

export const buildLevelColumns = (levels: DndClassLevel[]) => {
  const columns: Array<{ Header: string; accessor: string }> = [
    { Header: 'Level', accessor: 'level' },
    { Header: 'Proficiency Bonus', accessor: 'profBonus' },
    { Header: 'Features', accessor: 'featureString' },
  ];
  levels[0].classSpecifics.forEach((classSpecific) => {
    if (classSpecific.name === 'Creating Spell Slots') {
      return;
    }
    const specCol = {
      Header: classSpecific.name,
      accessor: Util.camelize(classSpecific.name),
    };
    if (columns.indexOf(specCol) === -1) {
      columns.push(specCol);
    }
  });
  if (levels[19].spellcasting) {
    const spells = levels[19].spellcasting;
    if (spells.cantripsKnown) {
      columns.push({
        Header: 'Cantrips',
        accessor: 'spellcasting.cantripsKnown',
      });
    }
    if (spells.spellSlotsLevel1) {
      columns.push({
        Header: '1',
        accessor: 'spellcasting.spellSlotsLevel1',
      });
    }
    if (spells.spellSlotsLevel2) {
      columns.push({
        Header: '2',
        accessor: 'spellcasting.spellSlotsLevel2',
      });
    }
    if (spells.spellSlotsLevel3) {
      columns.push({
        Header: '3',
        accessor: 'spellcasting.spellSlotsLevel3',
      });
    }
    if (spells.spellSlotsLevel4) {
      columns.push({
        Header: '4',
        accessor: 'spellcasting.spellSlotsLevel4',
      });
    }
    if (spells.spellSlotsLevel5) {
      columns.push({
        Header: '5',
        accessor: 'spellcasting.spellSlotsLevel5',
      });
    }
    if (spells.spellSlotsLevel6) {
      columns.push({
        Header: '6',
        accessor: 'spellcasting.spellSlotsLevel6',
      });
    }
    if (spells.spellSlotsLevel7) {
      columns.push({
        Header: '7',
        accessor: 'spellcasting.spellSlotsLevel7',
      });
    }
    if (spells.spellSlotsLevel8) {
      columns.push({
        Header: '8',
        accessor: 'spellcasting.spellSlotsLevel8',
      });
    }
    if (spells.spellSlotsLevel9) {
      columns.push({
        Header: '9',
        accessor: 'spellcasting.spellSlotsLevel9',
      });
    }
    if (spells.spellsKnown) {
      columns.push({
        Header: 'Spells Known',
        accessor: 'spellcasting.spellsKnown',
      });
    }
  }
  return columns;
};

export const buildData = (levels: DndClassLevel[]) => {
  return levels.map((level: DndClassLevel) => {
    const data = {
      level: level.level,
      profBonus: level.profBonus,
      featureString: level.features.map((feature) => feature.name).join(', ') || '-',
      spellcasting: {
        ...level.spellcasting,
      },
    };
    level.classSpecifics.forEach((classSpecific) => {
      if (typeof classSpecific.value === 'object') {
        return;
      } else {
        const value =
          classSpecific.value === '0' || classSpecific.value === 'f' ? '-' : classSpecific.value;
        data[Util.camelize(classSpecific.name)] = value === 't' ? '√' : value;
      }
    });
    return data;
  });
};
