import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import Rule from './Rule';

type Ancestor = {
  name: string;
  slug: string;
};

type RuleSummary = {
  name: string;
  slug: string;
  category?: string;
  description?: string;
  ancestors?: Ancestor[];
  rules?: { name: string; slug: string }[];
};

type RulesCategoryProps = {
  rules: RuleSummary[];
  loading: boolean;
  getRules: () => void;
};

const RulesCategory = ({ rules, loading, getRules }: RulesCategoryProps) => {
  const { ruleSlug } = useParams<{ ruleSlug: string }>();
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    getRules();
  }, []);

  // Show loading ONLY on initial load when we have no rules data yet
  if (rules.length === 0 && (loading || ruleSlug)) {
    return (
      <PageContainer pageTitle="Rules" description="Loading rules...">
        <DndSpinner />
      </PageContainer>
    );
  }

  // All slugs now go to the Rule component (which handles showing the rule and its children)
  // Rule is a connected component that gets its props from Redux
  if (ruleSlug) {
    return <Rule />;
  }

  // No slug - show not found
  return (
    <PageContainer pageTitle="Rules" description="Rule not found">
      <PageTitle title="Rule Not Found" isLegacy={isEdition2014} />
      <p>The requested rule could not be found.</p>
      <Link to="/app/rules">Back to Rules</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(RulesCategory);
