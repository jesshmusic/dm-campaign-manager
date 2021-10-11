import React from 'react';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import PageContainer from '../../containers/PageContainer';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const styles = require('./section.module.scss');

const Section = (props: {
  section: {
    name: string;
    description: string;
  };
  loading: boolean;
  sectionSlug: string;
  getSection: (sectionSlug: string) => void;
}) => {
  const { section, loading, sectionSlug, getSection } = props;

  React.useEffect(() => {
    getSection(sectionSlug);
  }, [sectionSlug]);

  const sectionTitle = section ? section.name : 'Loading...';

  return (
    <PageContainer
      pageTitle={sectionTitle}
      description={`${sectionTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      breadcrumbs={[{ isActive: true, title: sectionTitle }]}
    >
      <PageTitle title={sectionTitle} />
      {!loading && section ? (
        <ReactMarkdown
          className={styles.section}
          children={section.description}
          components={{
            table: ({ node, ...props }) => (
              <div className={styles.tableFrame}>
                <table {...props} />
              </div>
            ),
          }}
          remarkPlugins={[remarkGfm]}
        />
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    section: state.sections.currentSection,
    loading: state.sections.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSection: (sectionSlug: string) => {
      dispatch(rest.actions.getSection({ slug: sectionSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
