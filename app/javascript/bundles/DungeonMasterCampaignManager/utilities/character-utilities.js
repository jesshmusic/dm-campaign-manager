export const AbilityScoreModifier = (abilityScore) => {
  const mods = {
    1: -5, 2: -4, 3: -4, 4: -3, 5: -3, 6: -2, 7: -2,
    8: -1, 9: -1, 10: 0, 11: 0, 12: 1, 13: 1, 14: 2, 15: 2,
    16: 3, 17: 3, 18: 4, 19: 4, 20: 5, 21: 5, 22: 6, 23: 6,
    24: 7, 25: 7, 26: 8, 27: 8, 28: 9, 29: 9, 30: 10, 31: 10
  };

  return mods[abilityScore];
};

export const CalculateArmorClass = ({armor, armorClassModifier, dexterity, shield}) => {
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