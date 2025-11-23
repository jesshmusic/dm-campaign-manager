import { ActionTypes, FlashMessage, MonsterActionField, UserProps } from '../../utilities/types';
import { FieldValues, useForm } from 'react-hook-form';
import { generateAttackDesc } from '../monster-generator/components/generate-monster/use-data';
import { abilityOptions } from '../monster-generator/components/generate-monster/sections/actions/action-forms/SpellcastingForm';
import { useNavigate } from 'react-router-dom';

type CustomActionField = {
  action: MonsterActionField;
  actionType: ActionTypes;
  actionTypeOption: { value: string; label: string };
  flashMessages: FlashMessage[];
  addFlashMessage: (flashMessage: FlashMessage) => void;
};

export const useCustomActionState = (props: {
  createCustomAction: (action: unknown, token?: string) => void;
  user: UserProps;
  token?: string;
}) => {
  const { createCustomAction, token, user } = props;

  const navigate = useNavigate();

  const UseForm = useForm<FieldValues>({
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
      actionTypeOption: {
        value: ActionTypes.attack,
        label: 'Attack',
      },
    },
  });

  const updateActionForm = async (fieldName: string | undefined, value: unknown) => {
    // @ts-expect-error
    const fields = value as CustomActionField;
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
    if (fieldName !== `action.desc` && fieldName !== `action.name`) {
      const newDesc = await generateAttackDesc('NewMonster', fields.action, 6, 3, 3);
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
    if (fieldName === 'actionTypeOption') {
      const newActionType = fields.actionTypeOption.value as ActionTypes;
      switch (newActionType) {
        case ActionTypes.spellCasting:
          UseForm.setValue('action', {
            name: `Spellcasting`,
            actionType: ActionTypes.spellCasting,
            numAttacks: 1,
            desc: '',
            spellCasting: {
              level: 1,
              ability: 'Intelligence',
              abilityOption: abilityOptions[3],
              slots: {
                first: 0,
                second: 0,
                third: 0,
                fourth: 0,
                fifth: 0,
                sixth: 0,
                seventh: 0,
                eighth: 0,
                ninth: 0,
              },
              spellOptions: [],
            },
          });
          return;
        case ActionTypes.attack:
          UseForm.setValue('action', {
            name: fields.action.name,
            actionType: ActionTypes.attack,
            numAttacks: 1,
            desc: '',
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
          });
          return;
        default:
          UseForm.setValue('action', {
            name: fields.action.name,
            actionType: ActionTypes.ability,
            numAttacks: 1,
            desc: '',
          });
      }
      UseForm.setValue('action.actionType', newActionType);
      UseForm.setValue('actionType', newActionType);
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
    navigate('/app/admin-dashboard');
  };

  return {
    onSubmitActionForm,
    updateActionForm,
    user,
    UseForm,
  };
};
