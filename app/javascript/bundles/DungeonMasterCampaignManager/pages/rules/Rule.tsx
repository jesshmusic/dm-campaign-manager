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

import { RuleContent, RulesList, TableFrame } from './Rule.styles';

type Ancestor = {
  name: string;
  slug: string;
};

const Rule = (props: {
  rule: {
    name: string;
    slug: string;
    description: string;
    ancestors?: Ancestor[];
    rules: {
      name: string;
      slug: string;
    }[];
  } | null;
  loading: boolean;
  getRule: (ruleSlug: string) => void;
}) => {
  const { rule, loading, getRule } = props;
  const { ruleSlug } = useParams<'ruleSlug'>();
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
        { title: 'Rules', url: '/app/rules' },
        ...rule.ancestors.map((ancestor) => ({
          title: ancestor.name,
          url: `/app/rules/${ancestor.slug}`,
        })),
        { title: rule.name, url: `/app/rules/${rule.slug}` },
      ];
      setCustomPaths(paths);
    } else {
      setCustomPaths(undefined);
    }

    // Clear custom paths when unmounting
    return () => setCustomPaths(undefined);
  }, [rule, setCustomPaths]);

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
              rule.rules.map((rule) => (
                <Link key={rule.slug} to={`/app/rules/${rule.slug}`}>
                  <h2 style={{ border: 0 }}>{rule.name}</h2>
                </Link>
              ))}
          </RulesList>
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
