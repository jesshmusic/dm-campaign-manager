import createDecorator from 'final-form-calculate';
import snakecaseKeys from 'snakecase-keys';

export const toSnakeCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('_');

export const filterOptions = (results) =>
  results.results.map((nextItem) => ({
    value: nextItem.id,
    label: nextItem.name,
  }));

export const filterOptionsWithData = (results) =>
  results.results.map((nextItem) => ({
    value: nextItem.id,
    label: nextItem.name,
    data: nextItem,
  }));

export const filterSnakeCaseOptionsWithData = (results) =>
  results.results.map((nextItem) => ({
    value: toSnakeCase(nextItem.name),
    label: nextItem.name,
  }));

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

export const monsterVariantOptions = [
  { value: 'fighter', label: 'Fighter' },
  { value: 'caster_wizard', label: 'Caster - Wizard' },
  { value: 'caster_cleric', label: 'Caster - Cleric' },
];

export const monsterSizeOptions = [
  { value: 'tiny', label: 'Tiny' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'huge', label: 'Huge' },
  { value: 'gargantuan', label: 'Gargantuan' },
];

export const monsterTypeOptions = [
  {
    value: 'aberration',
    label: 'Aberration',
  },
  {
    value: 'beast',
    label: 'Beast',
  },
  {
    value: 'celestial',
    label: 'Celestial',
  },
  {
    value: 'construct',
    label: 'Construct',
  },
  {
    value: 'dragon',
    label: 'Dragon',
  },
  {
    value: 'elemental',
    label: 'Elemental',
  },
  {
    value: 'fey',
    label: 'Fey',
  },
  {
    value: 'fiend',
    label: 'Fiend',
  },
  {
    value: 'giant',
    label: 'Giant',
  },
  {
    value: 'humanoid',
    label: 'Humanoid',
  },
  {
    value: 'monstrosity',
    label: 'Monstrosity',
  },
  {
    value: 'ooze',
    label: 'Ooze',
  },
  {
    value: 'plant',
    label: 'Plant',
  },
  {
    value: 'swarm of Tiny beasts',
    label: 'Swarm of Tiny beasts',
  },
  {
    value: 'undead',
    label: 'Undead',
  },
];

export const getChallengeRatingOptions = () => {
  const crs = [
    { value: '0', label: '0' },
    { value: '1/8', label: '1/8' },
    { value: '1/4', label: '1/4' },
    { value: '1/2', label: '1/2' },
  ];
  for (let i = 1; i < 31; i++) {
    crs.push({ value: `${i}`, label: `${i}` });
  }
  return crs;
};

const CalculateArmorClass = ({
  armor,
  armorClassModifier,
  dexterity,
  shield,
}) => {
  if (armor && armor.data.armorDexBonus && shield) {
    return (
      armor.data.armorClass +
      armor.data.armorClassBonus +
      abilityScoreModifier(dexterity) +
      shield.data.armorClassBonus +
      armorClassModifier
    );
  } else if (armor && armor.data.armorDexBonus && !shield) {
    return (
      armor.data.armorClass +
      armor.data.armorClassBonus +
      abilityScoreModifier(dexterity) +
      armorClassModifier
    );
  } else if (armor && shield) {
    return (
      armor.data.armorClass +
      armor.data.armorClassBonus +
      shield.data.armorClassBonus +
      armorClassModifier
    );
  } else if (armor) {
    return (
      armor.data.armorClass + armor.data.armorClassBonus + armorClassModifier
    );
  } else if (shield) {
    return (
      10 +
      abilityScoreModifier(dexterity) +
      shield.data.armorClassBonus +
      armorClassModifier
    );
  }
  return 10 + abilityScoreModifier(dexterity) + armorClassModifier;
};

const calculateProficiency = (totalLevel) => {
  switch (true) {
    case totalLevel < 5:
      return 2;
    case totalLevel < 9:
      return 3;
    case totalLevel < 13:
      return 4;
    case totalLevel < 17:
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
    characterItems: newChar.inventory
      ? newChar.inventory.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          carrying: item.carrying,
          label: 'Item',
          item: {
            value: item.itemId,
            label: item.name,
          },
        }))
      : [],
    totalLevel: newChar.totalLevel,
    armorClass: newChar.armorClass,
    armorClassModifier: newChar.armorClassModifier,
    hitPoints: newChar.hitPoints,
    xp: newChar.xp,
    strength: newChar.strength,
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
    guildOptions: newChar.campaign.guilds,
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

  if (newChar.armors) {
    newChar.armors.forEach((nextArmor) => {
      charObject.characterItems.push({
        id: nextArmor.id,
        quantity: nextArmor.quantity,
        carrying: nextArmor.carrying,
        label: 'Armor',
        item: {
          value: nextArmor.armorId,
          label: nextArmor.name,
        },
      });
    });
  }

  if (newChar.oneHandedWeapons) {
    newChar.oneHandedWeapons.forEach((nextWeapon) => {
      charObject.characterItems.push({
        id: nextWeapon.id,
        quantity: nextWeapon.quantity,
        carrying: nextWeapon.carrying,
        label: 'One-handed Weapon',
        item: {
          value: nextWeapon.weaponId,
          label: nextWeapon.name,
        },
      });
    });
  }

  if (newChar.twoHandedWeapons) {
    newChar.twoHandedWeapons.forEach((nextWeapon) => {
      charObject.characterItems.push({
        id: nextWeapon.id,
        quantity: nextWeapon.quantity,
        carrying: nextWeapon.carrying,
        label: 'Two-handed Weapon',
        item: {
          value: nextWeapon.weaponId,
          label: nextWeapon.name,
        },
      });
    });
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

  if (newChar.guild) {
    charObject.guild = {
      value: newChar.guild.id,
      label: newChar.guild.name,
    };
  }

  newChar.characterClasses.forEach((nextClass) => {
    if (nextClass.spellsCantrips) {
      charObject[`spellsCantrips${nextClass.dndClass}`] =
        nextClass.spellsCantrips;
      nextClass.spellsCantrips.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel1) {
      charObject[`spellsLevel1${nextClass.dndClass}`] = nextClass.spellsLevel1;
      nextClass.spellsLevel1.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel2) {
      charObject[`spellsLevel2${nextClass.dndClass}`] = nextClass.spellsLevel2;
      nextClass.spellsLevel2.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel3) {
      charObject[`spellsLevel3${nextClass.dndClass}`] = nextClass.spellsLevel3;
      nextClass.spellsLevel3.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel4) {
      charObject[`spellsLevel4${nextClass.dndClass}`] = nextClass.spellsLevel4;
      nextClass.spellsLevel4.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel5) {
      charObject[`spellsLevel5${nextClass.dndClass}`] = nextClass.spellsLevel5;
      nextClass.spellsLevel5.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel6) {
      charObject[`spellsLevel6${nextClass.dndClass}`] = nextClass.spellsLevel6;
      nextClass.spellsLevel6.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel7) {
      charObject[`spellsLevel7${nextClass.dndClass}`] = nextClass.spellsLevel7;
      nextClass.spellsLevel7.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel8) {
      charObject[`spellsLevel8${nextClass.dndClass}`] = nextClass.spellsLevel8;
      nextClass.spellsLevel8.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
    if (nextClass.spellsLevel9) {
      charObject[`spellsLevel9${nextClass.dndClass}`] = nextClass.spellsLevel9;
      nextClass.spellsLevel9.forEach((spell) =>
        charObject.characterSpellsAttributes.push(parseSpell(spell))
      );
    }
  });

  // Spells
  charObject.showBardSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Bard'
  );
  charObject.showClericSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Cleric'
  );
  charObject.showDruidSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Druid'
  );
  charObject.showPaladinSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Paladin'
  );
  charObject.showRangerSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Ranger'
  );
  charObject.showSorcererSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Sorcerer'
  );
  charObject.showWarlockSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Warlock'
  );
  charObject.showWizardSpells = charObject.dndClasses.some(
    (dndClass) => dndClass.dndClass.label === 'Wizard'
  );

  return charObject;
};

const parseSpell = (spell) => ({
  id: spell.data.characterSpellId ? spell.data.characterSpellId : null,
  isPrepared: spell.data.isPrepared,
  spellClass: spell.data.spellClass,
  spellId: spell.value,
});

const abilityScoreUpdates = {
  strength: (value, allValues) =>
    allValues.applyRaceMods
      ? allValues.baseAbilities.strength +
        allValues.characterRace.data.strengthModifier
      : allValues.baseAbilities.strength,
  dexterity: (value, allValues) =>
    allValues.applyRaceMods
      ? allValues.baseAbilities.dexterity +
        allValues.characterRace.data.dexterityModifier
      : allValues.baseAbilities.dexterity,
  constitution: (value, allValues) =>
    allValues.applyRaceMods
      ? allValues.baseAbilities.constitution +
        allValues.characterRace.data.constitutionModifier
      : allValues.baseAbilities.constitution,
  intelligence: (value, allValues) =>
    allValues.applyRaceMods
      ? allValues.baseAbilities.intelligence +
        allValues.characterRace.data.intelligenceModifier
      : allValues.baseAbilities.intelligence,
  wisdom: (value, allValues) =>
    allValues.applyRaceMods
      ? allValues.baseAbilities.wisdom +
        allValues.characterRace.data.wisdomModifier
      : allValues.baseAbilities.wisdom,
  charisma: (value, allValues) =>
    allValues.applyRaceMods
      ? allValues.baseAbilities.charisma +
        allValues.characterRace.data.charismaModifier
      : allValues.baseAbilities.charisma,
  raceId: (value) => value.value,
};

export const defaultFighterClass = {
  dndClass: {
    value: 153,
    label: 'Fighter',
    data: {
      id: 153,
      name: 'Fighter',
      hitDie: 10,
      slug: 'fighter',
      userId: null,
      spellAbility: null,
      primaryAbilities: ['Strength'],
      savingThrowAbilities: ['Strength', 'Constitution'],
      proficiencies: [
        {
          id: 4,
          name: 'All armor',
          profType: 'Armor',
        },
        {
          id: 18,
          name: 'Shields',
          profType: 'Armor',
        },
        { id: 19, name: 'Simple weapons', profType: 'Weapons' },
        { id: 20, name: 'Martial weapons', profType: 'Weapons' },
      ],
      proficiencyChoices: [
        {
          id: 118,
          name: 'Fighter 0',
          numChoices: 2,
          profChoiceType: 'proficiencies',
          proficiencies: [
            { id: 105, name: 'Skill: Acrobatics', profType: 'Skills' },
            { id: 106, name: 'Skill: Animal Handling', profType: 'Skills' },
            { id: 108, name: 'Skill: Athletics', profType: 'Skills' },
            { id: 110, name: 'Skill: History', profType: 'Skills' },
            { id: 111, name: 'Skill: Insight', profType: 'Skills' },
            { id: 112, name: 'Skill: Intimidation', profType: 'Skills' },
            { id: 116, name: 'Skill: Perception', profType: 'Skills' },
            { id: 122, name: 'Skill: Survival', profType: 'Skills' },
          ],
        },
      ],
      url: 'http://127.0.0.1:3000/v1/dnd_classes/fighter.json',
    },
  },
  level: 1,
};

export const characterCalculations = createDecorator(
  {
    field: 'applyRaceMods',
    updates: abilityScoreUpdates,
  },
  {
    field: 'armorClassModifier',
    updates: {
      armorClass: (armorClassModifier, allValues) =>
        CalculateArmorClass({
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
      armorClass: (newValue, allValues) =>
        CalculateArmorClass({
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
      armorClass: (armor, allValues) =>
        CalculateArmorClass({
          armor,
          armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
          dexterity: allValues.dexterity || 10,
          shield: allValues.shield,
        }),
      armorId: (characterArmor) =>
        characterArmor ? characterArmor.value : null,
      characterItems: (armor, allValues, prevValues) => {
        const newItems = allValues.characterItems;
        if (
          armor &&
          !newItems.find((nextItem) => nextItem.item.value === armor.value)
        ) {
          newItems.push({
            quantity: 1,
            carrying: true,
            label: 'Armor',
            item: {
              value: armor.value,
              label: armor.label,
            },
          });
        } else if (!armor && prevValues.armor) {
          const removeIndex = newItems
            .map((item) => item.item.value)
            .indexOf(prevValues.armor.value);
          if (removeIndex >= 0) {
            newItems.splice(removeIndex, 1);
          }
        }
        return newItems;
      },
    },
  },
  {
    field: 'shield',
    updates: {
      armorClass: (shield, allValues) =>
        CalculateArmorClass({
          armor: allValues.armor,
          armorClassModifier: parseInt(allValues.armorClassModifier, 10) || 0,
          dexterity: allValues.dexterity || 10,
          shield,
        }),
      characterItems: (shield, allValues, prevValues) => {
        const newItems = allValues.characterItems;
        if (
          shield &&
          !newItems.find((nextItem) => nextItem.item.value === shield.value)
        ) {
          newItems.push({
            quantity: 1,
            carrying: true,
            label: 'Shield',
            item: {
              value: shield.value,
              label: shield.label,
            },
          });
        } else if (!shield && prevValues.shield) {
          const removeIndex = newItems
            .map((item) => item.item.value)
            .indexOf(prevValues.shield.value);
          if (removeIndex >= 0) {
            newItems.splice(removeIndex, 1);
          }
        }
        return newItems;
      },
    },
  },
  {
    field: 'weaponLh',
    updates: {
      characterItems: (weapon, allValues, prevValues) => {
        const newItems = allValues.characterItems;
        if (
          weapon &&
          !newItems.find((nextItem) => nextItem.item.value === weapon.value)
        ) {
          newItems.push({
            quantity: 1,
            carrying: true,
            label: 'One-handed Weapon',
            item: {
              value: weapon.value,
              label: weapon.label,
            },
          });
        } else if (!weapon && prevValues.weaponLh) {
          const removeIndex = newItems
            .map((item) => item.item.value)
            .indexOf(prevValues.weaponLh.value);
          if (removeIndex >= 0) {
            newItems.splice(removeIndex, 1);
          }
        }
        return newItems;
      },
    },
  },
  {
    field: 'weaponRh',
    updates: {
      characterItems: (weapon, allValues, prevValues) => {
        const newItems = allValues.characterItems;
        if (
          weapon &&
          !newItems.find((nextItem) => nextItem.item.value === weapon.value)
        ) {
          newItems.push({
            quantity: 1,
            carrying: true,
            label: 'One-handed Weapon',
            item: {
              value: weapon.value,
              label: weapon.label,
            },
          });
        } else if (!weapon && prevValues.weaponRh) {
          const removeIndex = newItems
            .map((item) => item.item.value)
            .indexOf(prevValues.weaponRh.value);
          if (removeIndex >= 0) {
            newItems.splice(removeIndex, 1);
          }
        }
        return newItems;
      },
    },
  },
  {
    field: 'weapon2h',
    updates: {
      characterItems: (weapon, allValues, prevValues) => {
        const newItems = allValues.characterItems;
        if (
          weapon &&
          !newItems.find((nextItem) => nextItem.item.value === weapon.value)
        ) {
          newItems.push({
            quantity: 1,
            carrying: true,
            label: 'Two-handed Weapon',
            item: {
              value: weapon.value,
              label: weapon.label,
            },
          });
        } else if (!weapon && prevValues.weapon2h) {
          const removeIndex = newItems
            .map((item) => item.item.value)
            .indexOf(prevValues.weapon2h.value);
          if (removeIndex >= 0) {
            newItems.splice(removeIndex, 1);
          }
        }
        return newItems;
      },
    },
  },
  {
    field: 'characterRace',
    updates: abilityScoreUpdates,
  },
  {
    field: 'dndClasses',
    updates: {
      showBardSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Bard'),
      showClericSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Cleric'),
      showDruidSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Druid'),
      showPaladinSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Paladin'),
      showRangerSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Ranger'),
      showSorcererSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Sorcerer'),
      showWarlockSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Warlock'),
      showWizardSpells: (newValue) =>
        newValue.some((dndClass) => dndClass.dndClass.label === 'Wizard'),
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
            if (
              !allValues.characterSpellsAttributes.some(
                (spell) => spell.spellId === parsedSpell.spellId
              )
            ) {
              allValues.characterSpellsAttributes.push(parsedSpell);
            }
          });
        }
        return allValues.characterSpellsAttributes;
      },
    },
  },
  {
    field: 'weaponState',
    updates: {
      weaponRh: (newState, allValues) => {
        switch (newState) {
          case WeaponState.DUAL:
          case WeaponState.SINGLE:
          case WeaponState.SHIELD:
            return allValues.weaponRh;
          default:
            return null;
        }
      },
      weaponLh: (newState, allValues) => {
        if (newState === WeaponState.DUAL) {
          return allValues.weaponLh;
        }
        return null;
      },
      shield: (newState, allValues) => {
        if (newState === WeaponState.SHIELD) {
          return allValues.shield;
        }
        return null;
      },
      weapon2h: (newState, allValues) => {
        if (newState === WeaponState.TWOHAND) {
          return allValues.weapon2h;
        }
        return null;
      },
    },
  }
);

export const getSpellLevelArray = (spells) =>
  spells.map((spell) => spell.value);

export const getCharacterObject = (values) => {
  const returnChar = {
    name: values.name,
    alignment: values.characterAlignment.value,
    background: values.background,
    description: values.description,
    languages: values.languages,
    role: values.role,
    race_id: values.characterRace.value,
    armorClassModifier: values.armorClassModifier,
    hitPoints: values.hitPoints,
    xp: values.xp,
    strength: values.strength,
    dexterity: values.dexterity,
    constitution: values.constitution,
    intelligence: values.intelligence,
    wisdom: values.wisdom,
    charisma: values.charisma,
    copperPieces: values.copperPieces,
    silverPieces: values.silverPieces,
    electrumPieces: values.electrumPieces,
    goldPieces: values.goldPieces,
    platinumPieces: values.platinumPieces,
    weaponRhId: values.weaponRh ? values.weaponRh.value : null,
    weaponLhId: values.weaponLh ? values.weaponLh.value : null,
    weapon_2h_id: values.weapon2h ? values.weapon2h.value : null,
    shieldId: values.shield ? values.shield.value : null,
    armorId: values.armor ? values.armor.value : null,
    guildId: values.guild ? values.guild.value : null,
    characterClassesAttributes: values.dndClasses.map((dndClass) => {
      const returnClass = {
        level: dndClass.level,
        dnd_class_id: dndClass.dndClass.value,
      };
      if (dndClass.id) {
        returnClass.id = dndClass.id;
      }
      if (dndClass._destroy) {
        returnClass._destroy = dndClass._destroy;
      }
      return returnClass;
    }),
    characterItemsAttributes: values.characterItems.map((item) => {
      const returnItem = {
        quantity: item.quantity,
        carrying: item.carrying,
        item_id: item.item.value,
      };
      if (item.id) {
        returnItem.id = item.id;
      }
      if (item._destroy) {
        returnItem._destroy = item._destroy;
      }
      return returnItem;
    }),
    characterSpellsAttributes: values.characterSpellsAttributes,
  };
  if (values.id) {
    returnChar.id = values.id;
  }

  return snakecaseKeys(returnChar, { exclude: ['_destroy'] });
};
