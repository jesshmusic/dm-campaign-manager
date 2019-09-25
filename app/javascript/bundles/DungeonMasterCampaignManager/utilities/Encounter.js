/**
 * A utility class for running an encounter.
 */

const mobTypes = {
  MONSTER: 'monster',
  PC: 'pc',
  NPC: 'npc',
};

export default class Encounter {
  monsters = [];
  npcs = [];
  pcs = [];
  combatOrder = [];
  currentRound = {
    number: 1,
    currentMobIndex: 0,
  };

  constructor (monsters, npcs, pcs) {
    this.monsters = monsters.map((monster, index) => ({
      mobId: index + 1,
      name: `${monster.name} ${index + 1}`,
      armorClass: monster.armorClass,
      hitPoints: monster.hitPoints,
      currentHitPoints: monster.hitPoints,
      xp: monster.xp,
      initiativeRoll: 0,
      type: mobTypes.MONSTER,
    }));
    this.npcs = npcs.map((npc, index) => ({
      mobId: this.monsters.length + index + 1,
      name: `${npc.name}`,
      armorClass: npc.armorClass,
      hitPoints: npc.hitPoints,
      currentHitPoints: npc.hitPoints,
      xp: npc.xp,
      initiativeRoll: 0,
      type: mobTypes.NPC,
    }));
    this.pcs = pcs.map((pc, index) => ({
      mobId: this.monsters.length + this.npcs.length + index + 1,
      name: `${pc.name}`,
      armorClass: pc.armorClass,
      hitPoints: pc.hitPoints,
      currentHitPoints: pc.hitPoints,
      xp: 0,
      initiativeRoll: 0,
      type: mobTypes.PC,
    }));
  }

  /**
   * Add an initiative roll.
   * @param mob
   * @param initiativeRoll
   */
  addInitiative(mob, initiativeRoll) {
    this.combatOrder.push({
      label: mob.name,
      value: initiativeRoll,
      ...mob,
    }).sort((a, b) => a.value - b.value);

    return this.initiativeOrder;
  }

  /**
   * Returns the initiative order for all mobs
   * @returns {[]|Array}
   */
  get initiativeOrder () {
    return this.combatOrder;
  }

  /**
   * Sets the current round to the next mob's turn.
   * Skips monsters at 0 hit points because they are dead!
   * Does not skip PCs and NPCs with 0 hit points because they might have options and need to make death saves.
   */
  incrementTurn () {
    this.currentRound.currentMobIndex += 1;
    if (this.combatOrder[this.currentRound.currentMobIndex] === mobTypes.MONSTER &&
      this.combatOrder[this.currentRound.currentMobIndex].currentHitPoints <= 0) {
      this.incrementTurn();
    }
    if (this.currentRound.currentMobIndex === this.combatOrder.length) {
      this.currentRound.number += 1;
      this.currentRound.currentMobIndex = 0;
    }
    return this.combatOrder[this.currentRound.currentMobIndex];
  }

  /**
   * Apply damage to the mob at index in the initiative set.
   * @param mobIndex
   * @param damage
   * @returns {boolean} false if the mob falls below 0 hit points
   */
  damageMob (mobIndex, damage) {
    this.combatOrder[mobIndex].currentHitPoints -= damage;
    return this.combatOrder[mobIndex].currentHitPoints <= 0;
  }

  /**
   * Heals the mob
   * @param mobIndex
   * @param healingPoints
   */
  healMob (mobIndex, healingPoints) {
    this.combatOrder[mobIndex].currentHitPoints += healingPoints;
  }
}