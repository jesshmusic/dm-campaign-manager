import React from 'react';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useParams } from 'react-router-dom';
import { GiBarbute } from 'react-icons/all';

const styles = require('./rule.module.scss');

const Rule = (props: {
  rule: {
    name: string;
    description: string;
    rules: {
      name: string;
      slug: string;
    }[]
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
          <ReactMarkdown
            className={styles.rule}
            children={rule.description}
            components={{
              table: ({ node, ...props }) => (
                <div className={styles.tableFrame}>
                  <table {...props} />
                </div>
              ),
            }}
            remarkPlugins={[remarkGfm]}
          />
          {rule.rules && (
            rule.rules.map(rule => (
              <Link to={`/app/rules/${rule.slug}`} className={styles.buttonBar}>
                <h2>{rule.name}</h2>
              </Link>
            ))
          )}
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
