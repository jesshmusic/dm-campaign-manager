import { ActionTypes, MonsterActionField, UserProps } from '../../utilities/types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { generateAttackDesc } from '../monster-generator/components/generate-monster/use-data';

export const useAdminState = (props: {
  createAction: (action: any, token?: string) => void;
  getUsers: (searchTerm?: string) => void;
  user: UserProps;
  users: UserProps[];
  token?: string;
}) => {
  const { createAction, getUsers, token, user, users } = props;

  React.useEffect(() => {
    getUsers();
  }, [user]);

  const UseForm = useForm<{ action: MonsterActionField; actionType: ActionTypes }>({
    mode: 'onChange',
    defaultValues: {
      action: {
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
      },
      actionType: ActionTypes.attack,
    },
  });

  const columns = React.useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'name',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'NPCs',
        accessor: 'monsters',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return users.map((user: UserProps) => {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        monsters: user.monsters.length,
      };
    });
  }, [users]);

  const updateActionForm = async (fieldName: string | undefined, value: unknown) => {
    // @ts-ignore
    const fields = value as { action: MonsterActionField; actionType: ActionTypes };
    console.log(fields);
    if (fieldName === 'action.damage.damageTypeOption') {
      UseForm.setValue(
        'action.damage.damageType',
        fields.action.damage?.damageTypeOption.value || 'slashing'
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

  const onSearch = (searchTerm: string) => {
    getUsers(searchTerm);
  };

  const onSubmitActionForm = (data: { action: MonsterActionField; actionType: ActionTypes }) => {
    createAction(
      { name: data.action.name, desc: data.action.desc, action_type: data.actionType },
      token
    );
  };

  return {
    columns,
    data,
    onSearch,
    onSubmitActionForm,
    updateActionForm,
    user,
    UseForm,
  };
};
