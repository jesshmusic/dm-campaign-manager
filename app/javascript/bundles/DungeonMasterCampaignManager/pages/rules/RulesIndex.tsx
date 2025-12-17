import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { GiRuleBook } from 'react-icons/gi';

import { RulesGrid, RuleCard, RuleCardIcon, RuleCardContent, RuleCardCount } from './Rules.styles';

type RuleSummary = {
  name: string;
  slug: string;
  category?: string;
  description?: string;
  count?: number;
  rules?: { name: string; slug: string }[];
};

type RulesIndexProps = {
  rules: RuleSummary[];
  loading: boolean;
  getRules: () => void;
};

// Helper to create a URL-friendly slug from a category name
const categoryToSlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '-');
};

// Build categories dynamically from rules' category field
const buildCategoriesFromRules = (
  rules: RuleSummary[],
): { name: string; slug: string; ruleCount: number; rules: RuleSummary[] }[] => {
  // Group rules by their category
  const categoryMap = new Map<string, RuleSummary[]>();

  rules.forEach((rule) => {
    const category = rule.category || 'Other';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(rule);
  });

  // Convert map to array of category objects
  const categories: { name: string; slug: string; ruleCount: number; rules: RuleSummary[] }[] = [];
  categoryMap.forEach((categoryRules, categoryName) => {
    categories.push({
      name: categoryName,
      slug: categoryToSlug(categoryName),
      ruleCount: categoryRules.length,
      rules: categoryRules.sort((a, b) => a.name.localeCompare(b.name)),
    });
  });

  // Sort categories alphabetically, but put "Conditions" last
  return categories.sort((a, b) => {
    if (a.name === 'Conditions') return 1;
    if (b.name === 'Conditions') return -1;
    return a.name.localeCompare(b.name);
  });
};

const RulesIndex = ({ rules, loading, getRules }: RulesIndexProps) => {
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    getRules();
  }, []);

  // Build categories dynamically from rules
  const categories = React.useMemo(() => buildCategoriesFromRules(rules), [rules]);

  return (
    <PageContainer
      pageTitle="Rules"
      description="D&D 5th Edition Rules Reference. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and monsters."
    >
      <PageTitle title="Rules Reference" isLegacy={isEdition2014} />
      {loading ? (
        <DndSpinner />
      ) : (
        <RulesGrid>
          {categories.map((category) => {
            // If category has only one rule, link directly to that rule
            const linkTo =
              category.ruleCount === 1
                ? `/app/rules/${category.rules[0].slug}`
                : `/app/rules/${category.slug}`;

            return (
              <Link key={category.slug} to={linkTo}>
                <RuleCard>
                  <RuleCardIcon>
                    <GiRuleBook />
                  </RuleCardIcon>
                  <RuleCardContent>
                    <h3>{category.name}</h3>
                    {category.ruleCount > 1 && (
                      <RuleCardCount>
                        {category.ruleCount} {category.ruleCount === 1 ? 'rule' : 'rules'}
                      </RuleCardCount>
                    )}
                  </RuleCardContent>
                </RuleCard>
              </Link>
            );
          })}
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
