import { ActionTypes, MonsterActionField, UserProps } from '../../utilities/types';
import { useForm } from 'react-hook-form';
import { generateAttackDesc } from '../monster-generator/components/generate-monster/use-data';

export const useAdminState = (props: {
  createCustomAction: (action: any, token?: string) => void;
  user: UserProps;
  token?: string;
}) => {
  const { createCustomAction, token, user } = props;

  const UseForm = useForm<{ action: MonsterActionField; actionType: ActionTypes }>({
    mode: 'onChange',
    defaultValues: {
      action: {
        actionType: ActionTypes.attack,
        numAttacks: 1,
        desc: 'Melee Weapon Attack: +9 to hit, reach 5 ft., one target Hit: 7 (1d8+ 3) slashing damage.',
        damage: {
          damageTypeOption: { label: 'Slashing', value: 'slashing' },
          damageType: 'slashing',
          diceValueOption: { label: 'd6', value: 6 },
          diceValue: 6,
          isRanged: false,
          numDice: 1,
          numTargets: 1,
          rangeNormal: 120,
          rangeLong: 300,
          reach: 5,
        },
        name: 'New Action',
      },
      actionType: ActionTypes.attack,
    },
  });

  const updateActionForm = async (fieldName: string | undefined, value: unknown) => {
    // @ts-ignore
    const fields = value as { action: MonsterActionField; actionType: ActionTypes };
    if (fieldName === 'action.damage.damageTypeOption') {
      UseForm.setValue(
        'action.damage.damageType',
        fields.action.damage?.damageTypeOption.value || 'slashing'
      );
    }
    if (fieldName === 'action.damage.diceValueOption') {
      UseForm.setValue(
        'action.damage.diceValue',
        (fields.action.damage?.diceValueOption.value as number) || 6
      );
    }
    if (fieldName !== `action.desc` && fieldName !== `action.name` && fieldName !== `actionType`) {
      const newDesc = await generateAttackDesc('Custom Action', fields.action, 6, 3, 3);
      UseForm.setValue(`action.desc`, newDesc);
    }
    if (fieldName === `damage.diceValueOption` && fields.action.damage) {
      UseForm.setValue(
        `action.damage.diceValue`,
        fields.action.damage.diceValueOption.value as number
      );
    }
    if (fieldName === `spellCasting.abilityOption`) {
      UseForm.setValue(
        `action.spellCasting.ability`,
        fields.action.spellCasting!.abilityOption.label
      );
    }
    if (fieldName === 'actionType') {
      UseForm.setValue('action.actionType', fields.actionType);
    }
  };

  const onSubmitActionForm = (data: { action: MonsterActionField; actionType: ActionTypes }) => {
    createCustomAction(
      { name: data.action.name, desc: data.action.desc, action_type: data.actionType },
      token
    );
  };

  // @TODO: Add a table with actions and a delete option

  return {
    onSubmitActionForm,
    updateActionForm,
    user,
    UseForm,
  };
};
