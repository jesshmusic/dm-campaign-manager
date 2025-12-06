import axios from 'axios';
import snakecaseKeys from 'snakecase-keys';
import { MonsterActionField } from '../../utilities/types';

type DescParams = {
  params: {
    monster_name: string;
    action: MonsterActionField;
    attack_bonus: number;
    prof_bonus: number;
    damage_bonus: number;
  };
};

export const generateAttackDesc = async (
  monsterName: string,
  actionFields: MonsterActionField,
  attackBonus: number,
  profBonus: number,
  damageBonus: number,
): Promise<string> => {
  const result = await axios.post<DescParams, { data: { desc: string } }>(
    '/v1/generate_action_desc',
    {
      params: snakecaseKeys({
        action: actionFields,
        monsterName,
        attackBonus,
        profBonus,
        damageBonus,
      }),
    },
  );
  return result.data.desc;
};
