import React from 'react';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import rest from '../../api/api';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Link, useParams } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext';
import { GiDragonBreath } from 'react-icons/gi';
import { getContentUrl, parseEditionParams, getContentIndexUrl } from '../../utilities/editionUrls';

import {
  RuleContent,
  RulesList,
  TableFrame,
  RuleNavigation,
  NavButton,
  NavButtonText,
  NavSpacer,
} from './Rule.styles';

type Ancestor = {
  name: string;
  slug: string;
};

type RuleNav = {
  name: string;
  slug: string;
};

const Rule = (props: {
  rule: {
    name: string;
    slug: string;
    description: string;
    ancestors?: Ancestor[];
    previous_rule?: RuleNav;
    next_rule?: RuleNav;
    rules: {
      name: string;
      slug: string;
    }[];
  } | null;
  loading: boolean;
  getRule: (ruleSlug: string) => void;
}) => {
  const { rule, loading, getRule } = props;
  const params = useParams<{ edition?: string; ruleSlug?: string }>();
  const { edition, slug: ruleSlug } = parseEditionParams(params.edition, params.ruleSlug);
  const { isEdition2014 } = useEdition();
  const { setCustomPaths } = useBreadcrumbs();

  // Track which slug we've fetched to prevent duplicate fetches
  const fetchedSlugRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Only fetch if the slug changed and we haven't already fetched it
    if (ruleSlug && ruleSlug !== fetchedSlugRef.current) {
      fetchedSlugRef.current = ruleSlug;
      getRule(ruleSlug);
    }
  }, [ruleSlug, getRule]);

  // Update breadcrumbs when rule data loads
  React.useEffect(() => {
    if (rule && rule.ancestors && rule.ancestors.length > 0) {
      const paths = [
        { title: 'Rules', url: getContentIndexUrl('rules', edition) },
        ...rule.ancestors.map((ancestor) => ({
          title: ancestor.name,
          url: getContentUrl('rules', ancestor.slug, edition),
        })),
        { title: rule.name, url: getContentUrl('rules', rule.slug, edition) },
      ];
      setCustomPaths(paths);
    } else {
      setCustomPaths(undefined);
    }

    // Clear custom paths when unmounting
    return () => setCustomPaths(undefined);
  }, [rule, edition, setCustomPaths]);

  const ruleTitle = rule ? rule.name : 'Loading...';

  return (
    <PageContainer
      pageTitle={ruleTitle}
      description={`${ruleTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      {!loading && rule ? (
        <RuleContent>
          <PageTitle title={ruleTitle} isLegacy={isEdition2014} />
          <ReactMarkdown
            components={{
              table: ({ node: _node, ...props }) => (
                <TableFrame>
                  <table {...props} />
                </TableFrame>
              ),
            }}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
          >
            {rule.description}
          </ReactMarkdown>
          <RulesList>
            {rule.rules &&
              rule.rules.map((childRule) => (
                <Link key={childRule.slug} to={getContentUrl('rules', childRule.slug, edition)}>
                  <h2 style={{ border: 0 }}>{childRule.name}</h2>
                </Link>
              ))}
          </RulesList>

          {(rule.previous_rule || rule.next_rule) && (
            <RuleNavigation>
              {rule.previous_rule ? (
                <NavButton as={Link} to={getContentUrl('rules', rule.previous_rule.slug, edition)}>
                  <GiDragonBreath style={{ transform: 'rotate(135deg)' }} />
                  <NavButtonText>
                    <small>Previous</small>
                    <span>{rule.previous_rule.name}</span>
                  </NavButtonText>
                </NavButton>
              ) : (
                <NavSpacer />
              )}

              {rule.next_rule ? (
                <NavButton
                  as={Link}
                  to={getContentUrl('rules', rule.next_rule.slug, edition)}
                  style={{ textAlign: 'right' }}
                >
                  <NavButtonText style={{ alignItems: 'flex-end' }}>
                    <small>Next</small>
                    <span>{rule.next_rule.name}</span>
                  </NavButtonText>
                  <GiDragonBreath style={{ transform: 'rotate(-45deg)' }} />
                </NavButton>
              ) : (
                <NavSpacer />
              )}
            </RuleNavigation>
          )}
        </RuleContent>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    rule: state.rules.currentRule,
    loading: state.rules.currentRuleLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRule: (ruleSlug: string) => {
      dispatch(rest.actions.getRule({ id: ruleSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rule);
