import React from 'react';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useParams } from 'react-router-dom';

import { RuleContent, TableFrame } from './Rule.styles';

const Rule = (props: {
  rule: {
    name: string;
    description: string;
    rules: {
      name: string;
      slug: string;
    }[];
  };
  loading: boolean;
  getRule: (ruleSlug: string) => void;
}) => {
  const { rule, loading, getRule } = props;
  const { ruleSlug } = useParams<'ruleSlug'>();

  React.useEffect(() => {
    getRule(ruleSlug!);
  }, [ruleSlug]);

  const ruleTitle = rule ? rule.name : 'Loading...';

  return (
    <PageContainer
      pageTitle={ruleTitle}
      description={`${ruleTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      {!loading && rule ? (
        <>
          <RuleContent>
            <ReactMarkdown
              components={{
                table: ({ node: _node, ...props }) => (
                  <TableFrame>
                    <table {...props} />
                  </TableFrame>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {rule.description}
            </ReactMarkdown>
          </RuleContent>
          {rule.rules &&
            rule.rules.map((rule) => (
              <Link key={rule.slug} to={`/app/rules/${rule.slug}`}>
                <h2>{rule.name}</h2>
              </Link>
            ))}
        </>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    rule: state.rules.currentRule,
    loading: state.rules.loading,
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
