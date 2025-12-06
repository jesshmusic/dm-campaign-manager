import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import { GiCheckMark, GiCycle, GiCrossMark } from 'react-icons/gi';
import { NpcConcept } from './AIGenerateMonster';

type ConceptApprovalModalProps = {
  concept: NpcConcept;
  onApprove: (concept: NpcConcept) => void;
  onRegenerate: () => void;
  onClose: () => void;
  isLoading?: boolean;
  isAdmin?: boolean;
  tokenUsage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

// GPT-4o-mini pricing (as of 2024): $0.15 per 1M input tokens, $0.60 per 1M output tokens
const calculateCost = (tokenUsage?: {
  prompt_tokens?: number;
  completion_tokens?: number;
}): string => {
  if (!tokenUsage) return '$0.00';
  const inputCost = ((tokenUsage.prompt_tokens || 0) / 1_000_000) * 0.15;
  const outputCost = ((tokenUsage.completion_tokens || 0) / 1_000_000) * 0.6;
  const totalCost = inputCost + outputCost;
  return `$${totalCost.toFixed(4)}`;
};

const ModalOverlay = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: ${({ theme }) => theme.zIndex?.modal || 1050};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors?.cardBg || '#fdf1dc'};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows?.lg || '5px 7px 7px rgba(9, 9, 7, 0.5)'};
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-width: 900px;
  overflow: hidden;
  width: 95%;
`;

const ModalHeader = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.primary || '#972c1d'};
  color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;

  h2 {
    color: ${({ theme }) => theme.colors?.white || '#ffffff'};
    font-family: ${({ theme }) => theme.fonts?.mrEaves || "'Mr Eaves', serif"};
    font-size: ${({ theme }) => theme.fontSizes?.h3 || '1.25rem'};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const ModalBody = styled.div`
  background-color: ${({ theme }) => theme.colors?.cardBg || '#fdf1dc'};
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  background-color: ${({ theme }) => theme.colors?.backgroundMed || '#f3e8d4'};
  border-top: 2px solid ${({ theme }) => theme.colors?.primary || '#972c1d'};
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    border-bottom: 2px solid ${({ theme }) => theme.colors?.primary || '#972c1d'};
    color: ${({ theme }) => theme.colors?.primary || '#972c1d'};
    font-family: ${({ theme }) => theme.fonts?.mrEaves || "'Mr Eaves', serif"};
    font-size: ${({ theme }) => theme.fontSizes?.h5 || '1rem'};
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
  }
`;

const Grid = styled.div<{ $cols?: number }>`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(${({ $cols }) => $cols || 3}, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FullWidthField = styled(Field)`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors?.gray700 || '#272825'};
  font-family: ${({ theme }) => theme.fonts?.sansSerif || "'Scaly Sans', sans-serif"};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  font-weight: 600;
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.gray400 || '#555752'};
  border-radius: 0.25rem;
  font-family: ${({ theme }) => theme.fonts?.sansSerif || "'Scaly Sans', sans-serif"};
  font-size: ${({ theme }) => theme.fontSizes?.base || '1rem'};
  padding: 0.5rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors?.primary || '#972c1d'};
    outline: none;
  }
`;

const TextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.gray400 || '#555752'};
  border-radius: 0.25rem;
  font-family: ${({ theme }) => theme.fonts?.sansSerif || "'Scaly Sans', sans-serif"};
  font-size: ${({ theme }) => theme.fontSizes?.base || '1rem'};
  min-height: 80px;
  padding: 0.5rem;
  resize: vertical;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors?.primary || '#972c1d'};
    outline: none;
  }
`;

const ActionItem = styled.div`
  background-color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.gray300 || '#707370'};
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
`;

const ActionName = styled.input`
  background-color: ${({ theme }) => theme.colors?.cardBg || '#fdf1dc'};
  border: 1px solid ${({ theme }) => theme.colors?.gray400 || '#555752'};
  border-radius: 0.25rem;
  font-family: ${({ theme }) => theme.fonts?.sansSerif || "'Scaly Sans', sans-serif"};
  font-size: ${({ theme }) => theme.fontSizes?.base || '1rem'};
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors?.primary || '#972c1d'};
    outline: none;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors?.backgroundMed || '#f3e8d4'};
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.colors?.gray800 || '#181916'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  padding: 0.25rem 0.5rem;
`;

const AbilityScores = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(6, 1fr);

  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AbilityScore = styled.div`
  text-align: center;

  label {
    color: ${({ theme }) => theme.colors?.gray700 || '#272825'};
    display: block;
    font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  input {
    text-align: center;
    width: 100%;
  }
`;

const TokenInfo = styled.div`
  background-color: ${({ theme }) => theme.colors?.gray100 || '#9a9c98'};
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.colors?.gray800 || '#181916'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  margin-right: auto;
  padding: 0.5rem 0.75rem;
`;

const ConceptApprovalModal = ({
  concept,
  onApprove,
  onRegenerate,
  onClose,
  isLoading,
  isAdmin,
  tokenUsage,
}: ConceptApprovalModalProps) => {
  const [editedConcept, setEditedConcept] = useState<NpcConcept>(concept);

  useEffect(() => {
    setEditedConcept(concept);
  }, [concept]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const updateField = (field: keyof NpcConcept, value: unknown) => {
    setEditedConcept((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAction = (
    field: 'actions' | 'special_abilities' | 'reactions' | 'legendary_actions',
    index: number,
    key: 'name' | 'desc',
    value: string,
  ) => {
    setEditedConcept((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  };

  const handleApprove = () => {
    onApprove(editedConcept);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modal = (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Review Generated Creature</h2>
          <CloseButton onClick={onClose}>
            <GiCrossMark />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <h3>Basic Info</h3>
            <Grid $cols={4}>
              <Field>
                <Label>Name</Label>
                <Input
                  value={editedConcept.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Size</Label>
                <Input
                  value={editedConcept.size}
                  onChange={(e) => updateField('size', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Type</Label>
                <Input
                  value={editedConcept.monster_type}
                  onChange={(e) => updateField('monster_type', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Alignment</Label>
                <Input
                  value={editedConcept.alignment}
                  onChange={(e) => updateField('alignment', e.target.value)}
                />
              </Field>
            </Grid>
          </Section>

          <Section>
            <h3>Combat Stats</h3>
            <Grid $cols={5}>
              <Field>
                <Label>Armor Class</Label>
                <Input
                  type="number"
                  value={editedConcept.armor_class}
                  onChange={(e) => updateField('armor_class', parseInt(e.target.value, 10))}
                />
              </Field>
              <Field>
                <Label>Hit Points</Label>
                <Input
                  type="number"
                  value={editedConcept.hit_points}
                  onChange={(e) => updateField('hit_points', parseInt(e.target.value, 10))}
                />
              </Field>
              <Field>
                <Label>Hit Dice</Label>
                <Input
                  value={editedConcept.hit_dice}
                  onChange={(e) => updateField('hit_dice', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Challenge Rating</Label>
                <Input
                  value={editedConcept.challenge_rating}
                  onChange={(e) => updateField('challenge_rating', e.target.value)}
                />
              </Field>
              <Field>
                <Label>XP</Label>
                <Input
                  type="number"
                  value={editedConcept.xp}
                  onChange={(e) => updateField('xp', parseInt(e.target.value, 10))}
                />
              </Field>
            </Grid>
          </Section>

          <Section>
            <h3>Ability Scores</h3>
            <AbilityScores>
              <AbilityScore>
                <label>STR</label>
                <Input
                  type="number"
                  value={editedConcept.strength}
                  onChange={(e) => updateField('strength', parseInt(e.target.value, 10))}
                />
              </AbilityScore>
              <AbilityScore>
                <label>DEX</label>
                <Input
                  type="number"
                  value={editedConcept.dexterity}
                  onChange={(e) => updateField('dexterity', parseInt(e.target.value, 10))}
                />
              </AbilityScore>
              <AbilityScore>
                <label>CON</label>
                <Input
                  type="number"
                  value={editedConcept.constitution}
                  onChange={(e) => updateField('constitution', parseInt(e.target.value, 10))}
                />
              </AbilityScore>
              <AbilityScore>
                <label>INT</label>
                <Input
                  type="number"
                  value={editedConcept.intelligence}
                  onChange={(e) => updateField('intelligence', parseInt(e.target.value, 10))}
                />
              </AbilityScore>
              <AbilityScore>
                <label>WIS</label>
                <Input
                  type="number"
                  value={editedConcept.wisdom}
                  onChange={(e) => updateField('wisdom', parseInt(e.target.value, 10))}
                />
              </AbilityScore>
              <AbilityScore>
                <label>CHA</label>
                <Input
                  type="number"
                  value={editedConcept.charisma}
                  onChange={(e) => updateField('charisma', parseInt(e.target.value, 10))}
                />
              </AbilityScore>
            </AbilityScores>
          </Section>

          <Section>
            <h3>Defenses</h3>
            <Grid $cols={2}>
              <Field>
                <Label>Saving Throws</Label>
                <TagList>
                  {editedConcept.saving_throws?.map((save, i) => (
                    <Tag key={i}>{save}</Tag>
                  ))}
                  {(!editedConcept.saving_throws || editedConcept.saving_throws.length === 0) && (
                    <span style={{ color: '#999' }}>None</span>
                  )}
                </TagList>
              </Field>
              <Field>
                <Label>Skills</Label>
                <TagList>
                  {editedConcept.skills?.map((skill, i) => (
                    <Tag key={i}>{skill}</Tag>
                  ))}
                  {(!editedConcept.skills || editedConcept.skills.length === 0) && (
                    <span style={{ color: '#999' }}>None</span>
                  )}
                </TagList>
              </Field>
            </Grid>
            <Grid $cols={2} style={{ marginTop: '0.75rem' }}>
              <Field>
                <Label>Damage Resistances</Label>
                <TagList>
                  {editedConcept.damage_resistances?.map((res, i) => (
                    <Tag key={i}>{res}</Tag>
                  ))}
                  {(!editedConcept.damage_resistances ||
                    editedConcept.damage_resistances.length === 0) && (
                    <span style={{ color: '#999' }}>None</span>
                  )}
                </TagList>
              </Field>
              <Field>
                <Label>Damage Immunities</Label>
                <TagList>
                  {editedConcept.damage_immunities?.map((imm, i) => (
                    <Tag key={i}>{imm}</Tag>
                  ))}
                  {(!editedConcept.damage_immunities ||
                    editedConcept.damage_immunities.length === 0) && (
                    <span style={{ color: '#999' }}>None</span>
                  )}
                </TagList>
              </Field>
            </Grid>
            <Grid $cols={2} style={{ marginTop: '0.75rem' }}>
              <Field>
                <Label>Damage Vulnerabilities</Label>
                <TagList>
                  {editedConcept.damage_vulnerabilities?.map((vuln, i) => (
                    <Tag key={i}>{vuln}</Tag>
                  ))}
                  {(!editedConcept.damage_vulnerabilities ||
                    editedConcept.damage_vulnerabilities.length === 0) && (
                    <span style={{ color: '#999' }}>None</span>
                  )}
                </TagList>
              </Field>
              <Field>
                <Label>Condition Immunities</Label>
                <TagList>
                  {editedConcept.condition_immunities?.map((cond, i) => (
                    <Tag key={i}>{cond}</Tag>
                  ))}
                  {(!editedConcept.condition_immunities ||
                    editedConcept.condition_immunities.length === 0) && (
                    <span style={{ color: '#999' }}>None</span>
                  )}
                </TagList>
              </Field>
            </Grid>
          </Section>

          {editedConcept.special_abilities?.length > 0 && (
            <Section>
              <h3>Special Abilities</h3>
              {editedConcept.special_abilities.map((ability, index) => (
                <ActionItem key={index}>
                  <ActionName
                    value={ability.name}
                    onChange={(e) =>
                      updateAction('special_abilities', index, 'name', e.target.value)
                    }
                  />
                  <TextArea
                    value={ability.desc}
                    onChange={(e) =>
                      updateAction('special_abilities', index, 'desc', e.target.value)
                    }
                  />
                </ActionItem>
              ))}
            </Section>
          )}

          {editedConcept.actions?.length > 0 && (
            <Section>
              <h3>Actions</h3>
              {editedConcept.actions.map((action, index) => (
                <ActionItem key={index}>
                  <ActionName
                    value={action.name}
                    onChange={(e) => updateAction('actions', index, 'name', e.target.value)}
                  />
                  <TextArea
                    value={action.desc}
                    onChange={(e) => updateAction('actions', index, 'desc', e.target.value)}
                  />
                </ActionItem>
              ))}
            </Section>
          )}

          {editedConcept.reactions?.length > 0 && (
            <Section>
              <h3>Reactions</h3>
              {editedConcept.reactions.map((reaction, index) => (
                <ActionItem key={index}>
                  <ActionName
                    value={reaction.name}
                    onChange={(e) => updateAction('reactions', index, 'name', e.target.value)}
                  />
                  <TextArea
                    value={reaction.desc}
                    onChange={(e) => updateAction('reactions', index, 'desc', e.target.value)}
                  />
                </ActionItem>
              ))}
            </Section>
          )}

          {editedConcept.legendary_actions?.length > 0 && (
            <Section>
              <h3>Legendary Actions</h3>
              {editedConcept.legendary_actions.map((action, index) => (
                <ActionItem key={index}>
                  <ActionName
                    value={action.name}
                    onChange={(e) =>
                      updateAction('legendary_actions', index, 'name', e.target.value)
                    }
                  />
                  <TextArea
                    value={action.desc}
                    onChange={(e) =>
                      updateAction('legendary_actions', index, 'desc', e.target.value)
                    }
                  />
                </ActionItem>
              ))}
            </Section>
          )}

          <Section>
            <h3>Other</h3>
            <FullWidthField>
              <Label>Languages</Label>
              <Input
                value={editedConcept.languages}
                onChange={(e) => updateField('languages', e.target.value)}
              />
            </FullWidthField>
          </Section>
        </ModalBody>

        <ModalFooter>
          {isAdmin && tokenUsage && (
            <TokenInfo>
              Tokens: {tokenUsage.prompt_tokens || 0} in + {tokenUsage.completion_tokens || 0} out ={' '}
              {tokenUsage.total_tokens || 0} | Cost: {calculateCost(tokenUsage)}
            </TokenInfo>
          )}
          <Button
            color={Colors.secondary}
            title="Cancel"
            onClick={onClose}
            type="button"
            icon={<GiCrossMark size={20} />}
          />
          <Button
            color={Colors.warning}
            title="Regenerate"
            onClick={onRegenerate}
            type="button"
            icon={<GiCycle size={20} />}
          />
          <Button
            color={Colors.success}
            title={isLoading ? 'Creating...' : 'Approve & Create'}
            onClick={handleApprove}
            type="button"
            disabled={isLoading}
            icon={<GiCheckMark size={20} />}
          />
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default ConceptApprovalModal;
