import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { GiRuleBook } from 'react-icons/gi';
import Rule from './Rule';

import { RulesGrid, RuleCard, RuleCardIcon, RuleCardContent } from './Rules.styles';

type RuleSummary = {
  name: string;
  slug: string;
  category?: string;
  description?: string;
};

type RulesCategoryProps = {
  rules: RuleSummary[];
  loading: boolean;
  getRules: () => void;
  getRule: (slug: string) => void;
  currentRule: RuleSummary | null;
  ruleLoading: boolean;
};

// Helper to create a URL-friendly slug from a category name
const categoryToSlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '-');
};

// Helper to find category name from slug
const findCategoryFromSlug = (rules: RuleSummary[], slug: string): string | null => {
  // Find a rule that has a category whose slug matches
  for (const rule of rules) {
    if (rule.category && categoryToSlug(rule.category) === slug) {
      return rule.category;
    }
  }
  return null;
};

const RulesCategory = ({
  rules,
  loading,
  getRules,
  getRule,
  currentRule,
  ruleLoading,
}: RulesCategoryProps) => {
  const { ruleSlug } = useParams<{ ruleSlug: string }>();
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    getRules();
  }, []);

  // Find category name from slug by looking at rules' categories
  const categoryName = React.useMemo(() => {
    if (!ruleSlug) return null;
    return findCategoryFromSlug(rules, ruleSlug);
  }, [ruleSlug, rules]);

  // Check if the slug matches an actual rule (not a category)
  const isIndividualRule = React.useMemo(() => {
    if (!ruleSlug || rules.length === 0) return false;
    return rules.some((r) => r.slug === ruleSlug);
  }, [ruleSlug, rules]);

  const isCategory = !!categoryName;

  // If it's a category, get the rules for that category
  const categoryRules = React.useMemo(() => {
    if (!categoryName) return [];
    return rules
      .filter((rule) => rule.category === categoryName)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryName, rules]);

  // Show loading ONLY on initial load when we have no rules data yet
  // Don't show loading if we already have rules (to prevent flash/remount when refetching)
  if (rules.length === 0 && (loading || ruleSlug)) {
    return (
      <PageContainer pageTitle="Rules" description="Loading rules...">
        <DndSpinner />
      </PageContainer>
    );
  }

  // If it's an individual rule (slug matches a rule, not a category), render the Rule component
  if (isIndividualRule && ruleSlug) {
    return <Rule getRule={getRule} rule={currentRule} loading={ruleLoading} />;
  }

  // If it's not a category and not an individual rule, show not found
  if (!isCategory && ruleSlug) {
    return (
      <PageContainer pageTitle="Rules" description="Category not found">
        <PageTitle title="Category Not Found" isLegacy={isEdition2014} />
        <p>The requested rules category could not be found.</p>
        <Link to="/app/rules">Back to Rules</Link>
      </PageContainer>
    );
  }

  if (!categoryName) {
    return (
      <PageContainer pageTitle="Rules" description="Category not found">
        <PageTitle title="Category Not Found" isLegacy={isEdition2014} />
        <p>The requested rules category could not be found.</p>
        <Link to="/app/rules">Back to Rules</Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle={`${categoryName} Rules`}
      description={`D&D 5th Edition ${categoryName} Rules Reference.`}
    >
      <PageTitle title={categoryName} isLegacy={isEdition2014} />
      {loading ? (
        <DndSpinner />
      ) : (
        <RulesGrid>
          {categoryRules.map((rule) => (
            <Link key={rule.slug} to={`/app/rules/${rule.slug}`}>
              <RuleCard>
                <RuleCardIcon>
                  <GiRuleBook />
                </RuleCardIcon>
                <RuleCardContent>
                  <h3>{rule.name}</h3>
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
    currentRule: state.rules.currentRule,
    ruleLoading: state.rules.currentRuleLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRules: () => {
      dispatch(rest.actions.getRules());
    },
    getRule: (slug: string) => {
      dispatch(rest.actions.getRule({ id: slug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesCategory);
