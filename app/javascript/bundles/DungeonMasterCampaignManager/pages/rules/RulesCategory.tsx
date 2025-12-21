import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { parseEditionParams, getContentIndexUrl } from '../../utilities/editionUrls';
import Rule from './Rule';
import { RootState, AppDispatch } from '../../store/store';

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
  const params = useParams<{ edition?: string; ruleSlug?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();

  // Handle different route patterns:
  // - /app/rules/:edition/:ruleSlug - params.edition and params.ruleSlug are set
  // - /app/rules/:param (via resolver) - params.param is set (could be slug since resolver already checked edition)
  // - /app/rules/:ruleSlug (old route) - params.ruleSlug is set but not edition
  let edition: string;
  let ruleSlug: string | undefined;

  if (params.edition && params.ruleSlug) {
    // Two-param route: /app/rules/:edition/:ruleSlug
    const parsed = parseEditionParams(params.edition, params.ruleSlug);
    edition = parsed.edition;
    ruleSlug = parsed.slug;
  } else if (params.param) {
    // Single-param via resolver: /app/rules/:param (param is a slug, not edition)
    edition = contextEdition;
    ruleSlug = params.param;
  } else if (params.ruleSlug) {
    // Old single-param route: /app/rules/:ruleSlug
    edition = contextEdition;
    ruleSlug = params.ruleSlug;
  } else {
    edition = contextEdition;
    ruleSlug = undefined;
  }

  React.useEffect(() => {
    getRules();
  }, []);

  // Show loading ONLY on initial load when we have no rules data yet
  if (rules.length === 0 && (loading || ruleSlug)) {
    return (
      <PageContainer description="Loading rules..." maxWidth pageTitle="Rules">
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
    <PageContainer description="Rule not found" maxWidth pageTitle="Rules">
      <PageTitle title="Rule Not Found" isLegacy={isEdition2014} />
      <p>The requested rule could not be found.</p>
      <Link to={getContentIndexUrl('rules', edition)}>Back to Rules</Link>
    </PageContainer>
  );
};

function mapStateToProps(state: RootState) {
  return {
    rules: state.rules.rules,
    loading: state.rules.loading,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getRules: () => {
      dispatch(rest.actions.getRules());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesCategory);
