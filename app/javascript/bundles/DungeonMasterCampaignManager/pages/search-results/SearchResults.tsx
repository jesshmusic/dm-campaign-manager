import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import PageTitle from '../../components/PageTitle/PageTitle';
import Frame from '../../components/Frame/Frame';

const SearchResults = (props: {
  resultsCount: number;
  results: {
    name: string;
    description: string;
    url: string;
  }[];
  search: (searchString: string) => void;
}) => {
  const { query } = useParams<'query'>();
  const { resultsCount, results, search } = props;
  React.useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query]);

  return (
    <PageContainer pageTitle={`Search for "${query}"`} description={`${resultsCount} results.`}>
      <PageTitle title={`Search for "${query}"`} />
      {results &&
        results.map((result) => (
          <Frame title={result.name} linkTo={result.url}>
            <ReactMarkdown
              children={
                result.description.length > 255
                  ? result.description.substring(0, 255) + '...'
                  : result.description
              }
              remarkPlugins={[remarkGfm]}
              components={{
                h1: () => <></>,
                h2: () => <></>,
              }}
            />
          </Frame>
        ))}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    resultsCount: state.search.count,
    results: state.search.results,
    loading: state.search.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    search: (searchString: string) => {
      dispatch(rest.actions.search({ searchString }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
