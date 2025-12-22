import React from 'react';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Link, useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { getIconFromName } from '../../utilities/icons';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';
import { UserProps } from '../../utilities/types';
import { AdminNewButton } from '../../components/shared';
import RuleFormModal from './RuleFormModal';

import { RulesGrid, RuleCard, RuleCardIcon, RuleCardContent, RuleCardCount } from './Rules.styles';

type RuleSummary = {
  name: string;
  slug: string;
  category?: string;
  description?: string;
  count?: number;
  sort_order?: number;
  game_icon?: string;
  rules?: { name: string; slug: string }[];
};

type RulesIndexProps = {
  rules: RuleSummary[];
  loading: boolean;
  getRules: () => void;
  currentUser?: UserProps;
};

// Sort rules by sort_order, then by name (data is pre-sorted from API)
const sortByOrder = (rules: RuleSummary[]): RuleSummary[] => {
  return [...rules].sort((a, b) => {
    // Rules with sort_order come first, sorted by that value
    if (a.sort_order !== undefined && b.sort_order !== undefined) {
      return a.sort_order - b.sort_order;
    }
    if (a.sort_order !== undefined) return -1;
    if (b.sort_order !== undefined) return 1;
    // Otherwise sort alphabetically
    return a.name.localeCompare(b.name);
  });
};

// Helper to get icon for a rule - returns undefined if no icon set
export const getRuleIcon = (rule: RuleSummary) => {
  if (rule.game_icon) {
    return getIconFromName(rule.game_icon);
  }
  return undefined;
};

const RulesIndex = ({ rules, loading, getRules, currentUser }: RulesIndexProps) => {
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  const urlEdition = editionParam ?? param;
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  React.useEffect(() => {
    getRules();
  }, []);

  const handleCreateSuccess = () => {
    getRules();
  };

  // Sort rules by sort_order (data may already be sorted from API)
  const sortedRules = React.useMemo(() => sortByOrder(rules), [rules]);

  return (
    <PageContainer
      description="D&D 5th Edition Rules Reference. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and monsters."
      maxWidth
      pageTitle="Rules"
    >
      <PageTitle title="Rules Reference" isLegacy={isEdition2014} />
      <AdminNewButton
        currentUser={currentUser}
        onClick={() => setIsCreateModalOpen(true)}
        label="New Rule"
      />
      {loading ? (
        <DndSpinner />
      ) : (
        <RulesGrid>
          {sortedRules.map((rule) => (
            <Link key={rule.slug} to={getContentUrl('rules', rule.slug, edition)}>
              <RuleCard>
                <RuleCardIcon>{getRuleIcon(rule)}</RuleCardIcon>
                <RuleCardContent>
                  <h3>{rule.name}</h3>
                  {rule.count && rule.count > 0 && (
                    <RuleCardCount>
                      {rule.count} {rule.count === 1 ? 'sub-rule' : 'sub-rules'}
                    </RuleCardCount>
                  )}
                </RuleCardContent>
              </RuleCard>
            </Link>
          ))}
        </RulesGrid>
      )}
      <RuleFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </PageContainer>
  );
};

function mapStateToProps(state: RootState) {
  return {
    rules: state.rules.rules,
    loading: state.rules.loading,
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getRules: () => {
      dispatch(rest.actions.getRules());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesIndex);
