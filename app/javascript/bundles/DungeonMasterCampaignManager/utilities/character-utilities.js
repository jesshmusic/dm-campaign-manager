import createDecorator from 'final-form-calculate';

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
    return armor.data.armorClass + AbilityScoreModifier(dexterity) + shield.data.armorClass + armorClassModifier;
  } else if (armor && armor.data.armorDexBonus && !shield) {
    return armor.data.armorClass + AbilityScoreModifier(dexterity) + armorClassModifier;
  } else if (armor && shield) {
    return armor.data.armorClass + shield.data.armorClass + armorClassModifier;
  } else if (armor) {
    return armor.data.armorClass + armorClassModifier;
  } else if (shield) {
    return 10 + AbilityScoreModifier(dexterity) + shield.data.armorClass + armorClassModifier;
  }
  return 10 + AbilityScoreModifier(dexterity) + armorClassModifier;
};

export const SetupCharacterState = (newChar, races) => {
  // Initial character state object
  const charObject = {
    ...newChar,
    characterAlignment: {
      value: newChar.alignment,
      label: newChar.alignment,
    },
    dndClasses: newChar.characterClasses.map((dndClass) => ({
      id: dndClass.id,
      dndClass: {
        value: dndClass.dndClassId ? dndClass.dndClassId : 153,
        label: dndClass.dndClass ? dndClass.dndClass : 'Fighter',
        data: dndClass ? dndClass : {},
      },
      level: dndClass.level,
    })),
    applyRaceMods: false,
  };

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
    armor: charObject.characterArmor,
    armorClassModifier: parseInt(charObject.armorClassModifier, 10) || 0,
    dexterity: charObject.dexterity || 10,
    shield: charObject.characterShield,
  });

  // Set Race
  if (newChar.race) {
    charObject.characterRace = {
      value: newChar.race.id,
      label: newChar.race.name,
      data: newChar.race,
    };
  } else if (races.length > 0) {
    charObject.characterRace = {
      value: 1,
      label: 'Human',
      data: races.find((race) => race.name === 'Human'),
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

  // Add armor
  if (newChar.armor) {
    charObject.characterArmor = {
      value: newChar.armor.id,
      label: newChar.armor.name,
      data: newChar.armor,
    };
  }

  return charObject;
};

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
};

export const characterCalculations = createDecorator(
  {
    field: 'applyRaceMods',
    updates: abilityScoreUpdates,
  },
  {
    field: 'armorClassModifier',
    updates: {
      armorClass: (armorClassModifier, allValues) => CalculateArmorClass({
        armor: allValues.characterArmor,
        armorClassModifier: parseInt(armorClassModifier, 10) || 0,
        dexterity: allValues.dexterity || 10,
        shield: allValues.characterShield,
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
        armor: allValues.characterArmor,
        armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
        dexterity: newValue || 10,
        shield: allValues.characterShield,
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
    field: 'characterArmor',
    updates: {
      armorClass: (characterArmor, allValues) => CalculateArmorClass({
        armor: characterArmor,
        armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
        dexterity: allValues.dexterity || 10,
        shield: allValues.characterShield,
      }),
    },
  },
  {
    field: 'characterShield',
    updates: {
      armorClass: (characterShield, allValues) => CalculateArmorClass({
        armor: allValues.characterArmor,
        armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
        dexterity: allValues.dexterity || 10,
        shield: characterShield,
      }),
    },
  },
  {
    field: 'characterRace',
    updates: abilityScoreUpdates,
  },
);
