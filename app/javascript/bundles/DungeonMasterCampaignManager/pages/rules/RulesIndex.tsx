import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import {
  GiRuleBook,
  GiBookPile,
  GiBurningBook,
  GiSecretBook,
  GiSpellBook,
  GiBookStorm,
} from 'react-icons/gi';

import { RulesGrid, RuleCard, RuleCardIcon, RuleCardContent, RuleCardCount } from './Rules.styles';

const ruleIcons = [
  <GiRuleBook key="rule-book" />,
  <GiBookPile key="book-pile" />,
  <GiBurningBook key="burning-book" />,
  <GiSecretBook key="secret-book" />,
  <GiSpellBook key="spell-book" />,
  <GiBookStorm key="book-storm" />,
];

type RuleSummary = {
  name: string;
  slug: string;
  description?: string;
  count?: number;
  rules?: { name: string; slug: string }[];
};

type RulesIndexProps = {
  rules: RuleSummary[];
  loading: boolean;
  getRules: () => void;
};

const RulesIndex = ({ rules, loading, getRules }: RulesIndexProps) => {
  React.useEffect(() => {
    getRules();
  }, []);

  return (
    <PageContainer
      pageTitle="Rules"
      description="D&D 5th Edition Rules Reference. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and monsters."
    >
      <PageTitle title="Rules Reference" />
      {loading ? (
        <DndSpinner />
      ) : (
        <RulesGrid>
          {rules.map((rule, index) => (
            <Link key={rule.slug} to={`/app/rules/${rule.slug}`}>
              <RuleCard>
                <RuleCardIcon>{index < 6 ? ruleIcons[index] : <GiRuleBook />}</RuleCardIcon>
                <RuleCardContent>
                  <h3>{rule.name}</h3>
                  {rule.count !== undefined && rule.count > 0 && (
                    <RuleCardCount>
                      {rule.count} {rule.count === 1 ? 'section' : 'sections'}
                    </RuleCardCount>
                  )}
                </RuleCardContent>
              </RuleCard>
            </Link>
          ))}
        </RulesGrid>
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    rules: state.rules.rules,
    loading: state.rules.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRules: () => {
      dispatch(rest.actions.getRules());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesIndex);
