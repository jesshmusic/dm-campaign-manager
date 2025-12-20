import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';
import { GiFire, GiLinkedRings } from 'react-icons/gi';

import {
  NameFieldWrapper,
  NameFieldLabel,
  NameFieldInput,
  NameFieldError,
  MonsterTypeButtons,
} from '../MonsterGenerator.styles';

export type NameButtonType = 'monster' | 'npc' | 'male' | 'female' | null;

type NameFormFieldProps = {
  characterRace?: string;
  handleGenerateName: (gender: string, race: string) => void;
  handleGenerateMonsterName: () => void;
  errors: FieldErrors;
  isGeneratingName?: boolean;
  register: UseFormRegister<FieldValues>;
  monsterType: string;
  activeNameButton?: NameButtonType;
};

const NameFormField = (props: NameFormFieldProps) => {
  const {
    characterRace,
    handleGenerateName,
    handleGenerateMonsterName,
    isGeneratingName,
    register,
    errors,
    monsterType,
    activeNameButton,
  } = props;

  const loadingIcon = <GiLinkedRings size={20} className="spinner" />;

  return (
    <NameFieldWrapper>
      <NameFieldLabel>Name</NameFieldLabel>
      <NameFieldInput
        {...register('name', { required: true })}
        autoComplete={''}
        type={'text'}
        placeholder={'NPC name'}
      />
      {errors.name && (
        <NameFieldError>
          <GiFire /> This is required
        </NameFieldError>
      )}
      <MonsterTypeButtons>
        <Button
          color={Colors.warning}
          disabled={isGeneratingName}
          isLoading={activeNameButton === 'monster'}
          icon={activeNameButton === 'monster' ? loadingIcon : undefined}
          title="Random Creature Name"
          onClick={handleGenerateMonsterName}
        />
        {monsterType.toLowerCase() === 'humanoid' && (
          <>
            <Button
              color={Colors.primary}
              disabled={isGeneratingName}
              isLoading={activeNameButton === 'npc'}
              icon={activeNameButton === 'npc' ? loadingIcon : undefined}
              title="Random NPC Name"
              onClick={() => handleGenerateName('npc', characterRace || 'any')}
            />
            <Button
              color={Colors.secondary}
              disabled={isGeneratingName}
              isLoading={activeNameButton === 'male'}
              icon={activeNameButton === 'male' ? loadingIcon : undefined}
              title="Random Male NPC Name"
              onClick={() => handleGenerateName('male', characterRace || 'any')}
            />
            <Button
              color={Colors.success}
              disabled={isGeneratingName}
              isLoading={activeNameButton === 'female'}
              icon={activeNameButton === 'female' ? loadingIcon : undefined}
              title="Random Female NPC Name"
              onClick={() => handleGenerateName('female', characterRace || 'any')}
            />
          </>
        )}
      </MonsterTypeButtons>
    </NameFieldWrapper>
  );
};

export default NameFormField;
