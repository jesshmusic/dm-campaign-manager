import createDecorator from 'final-form-calculate';

export const filterOptions = (results) => results.map((nextItem) => (
  {value: nextItem.id, label: nextItem.name}
));

export const filterOptionsWithData = (results) => results.map((nextItem) => (
  {value: nextItem.id, label: nextItem.name, data: nextItem}
));

const AbilityScoreModifier = (abilityScore) => {
  const mods = {
    1: -5, 2: -4, 3: -4, 4: -3, 5: -3, 6: -2, 7: -2,
    8: -1, 9: -1, 10: 0, 11: 0, 12: 1, 13: 1, 14: 2, 15: 2,
    16: 3, 17: 3, 18: 4, 19: 4, 20: 5, 21: 5, 22: 6, 23: 6,
    24: 7, 25: 7, 26: 8, 27: 8, 28: 9, 29: 9, 30: 10, 31: 10
  };

  return mods[abilityScore];
};

export const alignmentOptions = [
  { value: 'Lawful Good', label: 'Lawful Good' },
  { value: 'Neutral Good', label: 'Neutral Good' },
  { value: 'Chaotic Good', label: 'Chaotic Good' },
  { value: 'Lawful Neutral', label: 'Lawful Neutral' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Chaotic Neutral', label: 'Chaotic Neutral' },
  { value: 'Lawful Evil', label: 'Lawful Evil' },
  { value: 'Neutral Evil', label: 'Neutral Evil' },
  { value: 'Chaotic Evil', label: 'Chaotic Evil' },
];

const CalculateArmorClass = ({armor, armorClassModifier, dexterity, shield}) => {
  if (armor && armor.data.armorDexBonus && shield) {
    return armor.data.armorClass + armor.data.armorClassBonus + AbilityScoreModifier(dexterity) + shield.data.armorClassBonus + armorClassModifier;
  } else if (armor && armor.data.armorDexBonus && !shield) {
    return armor.data.armorClass + armor.data.armorClassBonus + AbilityScoreModifier(dexterity) + armorClassModifier;
  } else if (armor && shield) {
    return armor.data.armorClass + armor.data.armorClassBonus + shield.data.armorClassBonus + armorClassModifier;
  } else if (armor) {
    return armor.data.armorClass + armor.data.armorClassBonus + armorClassModifier;
  } else if (shield) {
    return 10 + AbilityScoreModifier(dexterity) + shield.data.armorClassBonus + armorClassModifier;
  }
  return 10 + AbilityScoreModifier(dexterity) + armorClassModifier;
};

const calculateProficiency = (totalLevel) => {
  switch (true) {
    case (totalLevel < 5):
      return 2;
    case (totalLevel < 9):
      return 3;
    case (totalLevel < 13):
      return 4;
    case (totalLevel < 17):
      return 5;
    default:
      return 6;
  }
};

export const WeaponState = {
  DUAL: 'Dual Wield',
  SHIELD: 'Main hand and shield',
  TWOHAND: 'Two handed weapon',
  SINGLE: 'Main hand only',
};

export const SetupCharacterState = (newChar) => {
  // Initial character state object
  const charObject = {
    id: newChar.id,
    name: newChar.name,
    characterAlignment: {
      value: newChar.alignment,
      label: newChar.alignment,
    },
    background: newChar.background,
    description: newChar.description,
    languages: newChar.languages,
    role: newChar.role,
    dndClasses: newChar.characterClasses.map((dndClass) => ({
      id: dndClass.id,
      dndClass: {
        value: dndClass.dndClassId ? dndClass.dndClassId : 153,
        label: dndClass.dndClass ? dndClass.dndClass : 'Fighter',
      },
      level: dndClass.level,
    })),
    totalLevel: newChar.totalLevel,
    armorClass: newChar.armorClass,
    armorClassModifier: newChar.armorClassModifier,
    hitPoints: newChar.hitPoints,
    xp: newChar.xp,
    strength:  newChar.strength,
    dexterity: newChar.dexterity,
    constitution: newChar.constitution,
    intelligence: newChar.intelligence,
    wisdom: newChar.wisdom,
    charisma: newChar.charisma,
    proficiency: calculateProficiency(newChar.totalLevel),
    armor: newChar.armor,
    shield: newChar.shield,
    weapon2h: newChar.weapon2h,
    weaponLh: newChar.weaponLh,
    weaponRh: newChar.weaponRh,
    actions: newChar.actions,
    copperPieces: newChar.copperPieces,
    silverPieces: newChar.silverPieces,
    electrumPieces: newChar.electrumPieces,
    goldPieces: newChar.goldPieces,
    platinumPieces: newChar.platinumPieces,
    applyRaceMods: false,
    characterSpellsAttributes: [],
  };

  if (newChar.weapon2h) {
    charObject.weaponState = WeaponState.TWOHAND;
  } else if (newChar.shield) {
    charObject.weaponState = WeaponState.SHIELD;
  } else if (newChar.weaponRh && newChar.weaponLh) {
    charObject.weaponState = WeaponState.DUAL;
  } else {
    charObject.weaponState = WeaponState.SINGLE;
  }

  // Set initial ability scores
  charObject.baseAbilities = {
    strength: newChar.strength,
    dexterity: newChar.dexterity,
    constitution: newChar.constitution,
    intelligence: newChar.intelligence,
    wisdom: newChar.wisdom,
    charisma: newChar.charisma,
  };

  // Calculate AC
  charObject.armorClass = CalculateArmorClass({
    armor: charObject.armor,
    armorClassModifier: parseInt(charObject.armorClassModifier, 10) || 0,
    dexterity: charObject.dexterity || 10,
    shield: charObject.shield,
  });

  if (newChar.armor) {
    charObject.armorId = newChar.armor.value;
  }

  // Set Race
  if (newChar.race) {
    charObject.characterRace = {
      value: newChar.race.id,
      label: newChar.race.name,
      data: newChar.race,
    };
  } else {
    charObject.characterRace = {
      value: 1,
      label: 'Human',
      data: {
        id: 1,
        name: 'Human',
        speed: '30 feet',
        strengthModifier: 1,
        dexterityModifier: 1,
        constitutionModifier: 1,
        intelligenceModifier: 1,
        wisdomModifier: 1,
        charismaModifier: 1,
      },
    };
  }

  newChar.characterClasses.forEach((nextClass) => {
    if (nextClass.spellsCantrips) {
      charObject[`spellsCantrips${nextClass.dndClass}`] = nextClass.spellsCantrips;
      nextClass.spellsCantrips.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel1) {
      charObject[`spellsLevel1${nextClass.dndClass}`] = nextClass.spellsLevel1;
      nextClass.spellsLevel1.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel2) {
      charObject[`spellsLevel2${nextClass.dndClass}`] = nextClass.spellsLevel2;
      nextClass.spellsLevel2.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel3) {
      charObject[`spellsLevel3${nextClass.dndClass}`] = nextClass.spellsLevel3;
      nextClass.spellsLevel3.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel4) {
      charObject[`spellsLevel4${nextClass.dndClass}`] = nextClass.spellsLevel4;
      nextClass.spellsLevel4.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel5) {
      charObject[`spellsLevel5${nextClass.dndClass}`] = nextClass.spellsLevel5;
      nextClass.spellsLevel5.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel6) {
      charObject[`spellsLevel6${nextClass.dndClass}`] = nextClass.spellsLevel6;
      nextClass.spellsLevel6.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel7) {
      charObject[`spellsLevel7${nextClass.dndClass}`] = nextClass.spellsLevel7;
      nextClass.spellsLevel7.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel8) {
      charObject[`spellsLevel8${nextClass.dndClass}`] = nextClass.spellsLevel8;
      nextClass.spellsLevel8.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
    if (nextClass.spellsLevel9) {
      charObject[`spellsLevel9${nextClass.dndClass}`] = nextClass.spellsLevel9;
      nextClass.spellsLevel9.forEach((spell) => charObject.characterSpellsAttributes.push(parseSpell(spell)));
    }
  });

  // Spells
  charObject.showBardSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Bard');
  charObject.showClericSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Cleric');
  charObject.showDruidSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Druid');
  charObject.showPaladinSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Paladin');
  charObject.showRangerSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Ranger');
  charObject.showSorcererSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Sorcerer');
  charObject.showWarlockSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Warlock');
  charObject.showWizardSpells = charObject.dndClasses.some(dndClass => dndClass.dndClass.label === 'Wizard');

  return charObject;
};

const parseSpell = (spell) => ({
  id: spell.data.characterSpellId ? spell.data.characterSpellId : null,
  isPrepared: spell.data.isPrepared,
  spellClass: spell.data.spellClass,
  spellId: spell.value,
});

const abilityScoreUpdates = {
  strength: (value, allValues) => (allValues.applyRaceMods ? (
    allValues.baseAbilities.strength + allValues.characterRace.data.strengthModifier
  ) : (
    allValues.baseAbilities.strength
  )),
  dexterity: (value, allValues) => (allValues.applyRaceMods ? (
    allValues.baseAbilities.dexterity + allValues.characterRace.data.dexterityModifier
  ) : (
    allValues.baseAbilities.dexterity
  )),
  constitution: (value, allValues) => (allValues.applyRaceMods ? (
    allValues.baseAbilities.constitution + allValues.characterRace.data.constitutionModifier
  ) : (
    allValues.baseAbilities.constitution
  )),
  intelligence: (value, allValues) => (allValues.applyRaceMods ? (
    allValues.baseAbilities.intelligence + allValues.characterRace.data.intelligenceModifier
  ) : (
    allValues.baseAbilities.intelligence
  )),
  wisdom: (value, allValues) => (allValues.applyRaceMods ? (
    allValues.baseAbilities.wisdom + allValues.characterRace.data.wisdomModifier
  ) : (
    allValues.baseAbilities.wisdom
  )),
  charisma: (value, allValues) => (allValues.applyRaceMods ? (
    allValues.baseAbilities.charisma + allValues.characterRace.data.charismaModifier
  ) : (
    allValues.baseAbilities.charisma
  )),
  raceId: (value) => value.value,
};

export const characterCalculations = createDecorator (
  {
    field: 'applyRaceMods',
    updates: abilityScoreUpdates,
  },
  {
    field: 'armorClassModifier',
    updates: {
      armorClass: (armorClassModifier, allValues) => CalculateArmorClass({
        armor: allValues.armor,
        armorClassModifier: parseInt(armorClassModifier, 10) || 0,
        dexterity: allValues.dexterity || 10,
        shield: allValues.shield,
      }),
    },
  },
  {
    field: 'strength',
    updates: {
      'baseAbilities.strength': (newValue, allValues) => {
        let score = parseInt(newValue, 10);
        if (allValues.applyRaceMods) {
          score -= allValues.characterRace.data.strengthModifier;
        }
        return score;
      },
    },
  },
  {
    field: 'dexterity',
    updates: {
      armorClass: (newValue, allValues) => CalculateArmorClass({
        armor: allValues.armor,
        armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
        dexterity: newValue || 10,
        shield: allValues.shield,
      }),
      'baseAbilities.dexterity': (newValue, allValues) => {
        let score = parseInt(newValue, 10);
        if (allValues.applyRaceMods) {
          score -= allValues.characterRace.data.dexterityModifier;
        }
        return score;
      },
    },
  },
  {
    field: 'constitution',
    updates: {
      'baseAbilities.constitution': (newValue, allValues) => {
        let score = parseInt(newValue, 10);
        if (allValues.applyRaceMods) {
          score -= allValues.characterRace.data.constitutionModifier;
        }
        return score;
      },
    },
  },
  {
    field: 'intelligence',
    updates: {
      'baseAbilities.intelligence': (newValue, allValues) => {
        let score = parseInt(newValue, 10);
        if (allValues.applyRaceMods) {
          score -= allValues.characterRace.data.intelligenceModifier;
        }
        return score;
      },
    },
  },
  {
    field: 'wisdom',
    updates: {
      'baseAbilities.wisdom': (newValue, allValues) => {
        let score = parseInt(newValue, 10);
        if (allValues.applyRaceMods) {
          score -= allValues.characterRace.data.wisdomModifier;
        }
        return score;
      },
    },
  },
  {
    field: 'charisma',
    updates: {
      'baseAbilities.charisma': (newValue, allValues) => {
        let score = parseInt(newValue, 10);
        if (allValues.applyRaceMods) {
          score -= allValues.characterRace.data.charismaModifier;
        }
        return score;
      },
    },
  },
  {
    field: 'armor',
    updates: {
      armorClass: (armor, allValues) => CalculateArmorClass({
        armor,
        armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
        dexterity: allValues.dexterity || 10,
        shield: allValues.shield,
      }),
      armorId: (characterArmor) => characterArmor ? characterArmor.value : null,
    },
  },
  {
    field: 'shield',
    updates: {
      armorClass: (shield, allValues) => CalculateArmorClass({
        armor: allValues.armor,
        armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
        dexterity: allValues.dexterity || 10,
        shield,
      }),
    },
  },
  {
    field: 'characterRace',
    updates: abilityScoreUpdates,
  },
  {
    field: 'dndClasses',
    updates: {
      showBardSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Bard'),
      showClericSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Cleric'),
      showDruidSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Druid'),
      showPaladinSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Paladin'),
      showRangerSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Ranger'),
      showSorcererSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Sorcerer'),
      showWarlockSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Warlock'),
      showWizardSpells: (newValue) => newValue.some((dndClass) => dndClass.dndClass.label === 'Wizard'),
      characterClassesAttributes: (newValue) => {
        const newCharacterClassesAttributes = [];
        newValue.forEach((nextClass) => {
          const charClass = {
            level: nextClass.level,
            dndClassId: nextClass.dndClass.value,
          };
          if (nextClass.id) {
            charClass.id = nextClass.id;
          }
          if (nextClass._destroy) {
            charClass._destroy = nextClass._destroy;
          }
          newCharacterClassesAttributes.push(charClass);
        });
        return newCharacterClassesAttributes;
      },
    },
  },
  {
    field: /spells*/,
    updates: {
      characterSpellsAttributes: (newValues, allValues) => {
        if (newValues) {
          const parsedSpells = newValues.map((spell) => parseSpell(spell));
          parsedSpells.forEach((parsedSpell) => {
            if (!allValues.characterSpellsAttributes.some((spell) => spell.spellId === parsedSpell.spellId)) {
              allValues.characterSpellsAttributes.push(parsedSpell);
            }
          });
        }
        return allValues.characterSpellsAttributes;
      },
    },
  }
);
