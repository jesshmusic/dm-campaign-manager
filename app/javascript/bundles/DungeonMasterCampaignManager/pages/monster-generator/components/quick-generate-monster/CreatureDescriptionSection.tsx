import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import styled from 'styled-components';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import { GiMagicSwirl, GiLinkedRings } from 'react-icons/gi';

const MAX_DESCRIPTION_LENGTH = 500;

interface GeneratedAction {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: string;
}

interface GeneratedData {
  actions: GeneratedAction[];
  special_abilities: GeneratedAction[];
  spells?: string[];
}

interface CreatureDescriptionSectionProps {
  UseForm: UseFormReturn<FieldValues>;
  generatedActions: GeneratedData | null;
  isGenerating: boolean;
  onGenerateActions: () => void;
}

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TextAreaLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const DescriptionTextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.white};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray400};
  border-radius: ${({ theme }) => theme.borders.radius};
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  min-height: 120px;
  padding: 0.75rem;
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: 0;
  }
`;

const CharacterCount = styled.span<{ $isNearLimit: boolean; $isOverLimit: boolean }>`
  align-self: flex-end;
  color: ${({ theme, $isOverLimit, $isNearLimit }) =>
    $isOverLimit
      ? theme.colors.danger
      : $isNearLimit
        ? theme.colors.warning
        : theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const GenerateButtonWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const GeneratedSection = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borders.radius};
  margin-top: 1rem;
  padding: 1rem;
`;

const GeneratedTitle = styled.h5`
  border-bottom: ${({ theme }) => theme.colors.orange} solid 0.05rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.h6};
  font-weight: normal;
  margin: 0 0 0.75rem;
  padding-bottom: 0.25rem;
`;

const ActionItem = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borders.radius};
  margin-bottom: 0.5rem;
  padding: 0.75rem;
`;

const ActionName = styled.input`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: bold;
  padding: 0;
  width: 100%;

  &:focus {
    outline: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const ActionDesc = styled.textarea`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  min-height: 60px;
  padding: 0.25rem 0;
  resize: vertical;
  width: 100%;

  &:focus {
    outline: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray400};
  }
`;

const SpellList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SpellTag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: 0.25rem 0.5rem;
`;

const HelpText = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0;
`;

const CreatureDescriptionSection: React.FC<CreatureDescriptionSectionProps> = ({
  UseForm,
  generatedActions,
  isGenerating,
  onGenerateActions,
}) => {
  const creatureDescription = UseForm.watch('creatureDescription') || '';
  const monsterDescription = UseForm.watch('description') || '';
  const charCount = creatureDescription.length;
  const isNearLimit = charCount > MAX_DESCRIPTION_LENGTH * 0.8;
  const isOverLimit = charCount > MAX_DESCRIPTION_LENGTH;

  const handleCreatureDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      UseForm.setValue('creatureDescription', value, { shouldDirty: true });
    }
  };

  const handleMonsterDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    UseForm.setValue('description', e.target.value, { shouldDirty: true });
  };

  const updateGeneratedAction = (
    type: 'actions' | 'special_abilities',
    index: number,
    field: 'name' | 'desc',
    value: string,
  ) => {
    if (!generatedActions) return;

    const updated = { ...generatedActions };
    updated[type] = [...updated[type]];
    updated[type][index] = { ...updated[type][index], [field]: value };
    UseForm.setValue('generatedActions', updated, { shouldDirty: true });
  };

  return (
    <DescriptionWrapper>
      <TextAreaWrapper>
        <TextAreaLabel htmlFor="description">
          Monster Description (saved to stat block)
        </TextAreaLabel>
        <DescriptionTextArea
          id="description"
          placeholder="A brief description of the creature's appearance, demeanor, and distinguishing features. This will be saved with the monster."
          value={monsterDescription}
          onChange={handleMonsterDescriptionChange}
        />
      </TextAreaWrapper>

      <TextAreaWrapper>
        <TextAreaLabel htmlFor="creatureDescription">
          AI Prompt - Describe the creature for action generation
        </TextAreaLabel>
        <DescriptionTextArea
          id="creatureDescription"
          placeholder="Example: A cunning goblin shaman who leads a small tribe, specializing in fire magic and ambush tactics. Known for crafting explosive traps and commanding giant spiders."
          value={creatureDescription}
          onChange={handleCreatureDescriptionChange}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
        <CharacterCount $isNearLimit={isNearLimit} $isOverLimit={isOverLimit}>
          {charCount}/{MAX_DESCRIPTION_LENGTH}
        </CharacterCount>
      </TextAreaWrapper>

      <HelpText>
        Based on the AI prompt and the stats from previous steps, AI will generate appropriate
        actions, special abilities, and spells for your creature.
      </HelpText>

      <GenerateButtonWrapper>
        <Button
          color={Colors.primary}
          title={isGenerating ? 'Generating...' : 'Generate Actions'}
          onClick={onGenerateActions}
          type="button"
          disabled={isGenerating || creatureDescription.length < 10}
          icon={
            isGenerating ? (
              <GiLinkedRings size={24} className="spinner" />
            ) : (
              <GiMagicSwirl size={24} />
            )
          }
        />
        {creatureDescription.length < 10 && (
          <HelpText>Enter at least 10 characters to generate actions</HelpText>
        )}
      </GenerateButtonWrapper>

      {generatedActions && (
        <>
          {generatedActions.actions.length > 0 && (
            <GeneratedSection>
              <GeneratedTitle>Generated Actions</GeneratedTitle>
              {generatedActions.actions.map((action, index) => (
                <ActionItem key={`action-${index}`}>
                  <ActionName
                    value={action.name}
                    onChange={(e) =>
                      updateGeneratedAction('actions', index, 'name', e.target.value)
                    }
                  />
                  <ActionDesc
                    value={action.desc}
                    onChange={(e) =>
                      updateGeneratedAction('actions', index, 'desc', e.target.value)
                    }
                  />
                </ActionItem>
              ))}
            </GeneratedSection>
          )}

          {generatedActions.special_abilities.length > 0 && (
            <GeneratedSection>
              <GeneratedTitle>Generated Special Abilities</GeneratedTitle>
              {generatedActions.special_abilities.map((ability, index) => (
                <ActionItem key={`ability-${index}`}>
                  <ActionName
                    value={ability.name}
                    onChange={(e) =>
                      updateGeneratedAction('special_abilities', index, 'name', e.target.value)
                    }
                  />
                  <ActionDesc
                    value={ability.desc}
                    onChange={(e) =>
                      updateGeneratedAction('special_abilities', index, 'desc', e.target.value)
                    }
                  />
                </ActionItem>
              ))}
            </GeneratedSection>
          )}

          {generatedActions.spells && generatedActions.spells.length > 0 && (
            <GeneratedSection>
              <GeneratedTitle>Generated Spells</GeneratedTitle>
              <SpellList>
                {generatedActions.spells.map((spell, index) => (
                  <SpellTag key={`spell-${index}`}>{spell}</SpellTag>
                ))}
              </SpellList>
            </GeneratedSection>
          )}
        </>
      )}
    </DescriptionWrapper>
  );
};

export default CreatureDescriptionSection;
