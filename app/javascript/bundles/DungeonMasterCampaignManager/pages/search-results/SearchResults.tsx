import React from 'react';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { useParams } from 'react-router-dom';
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
    <PageContainer
      description={`${resultsCount} results.`}
      maxWidth
      pageTitle={`Search for "${query}"`}
    >
      <PageTitle title={`Search for "${query}"`} />
      {results &&
        results.map((result) => (
          <Frame key={result.url} title={result.name} linkTo={result.url}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: () => <></>,
                h2: () => <></>,
              }}
            >
              {result.description.length > 255
                ? result.description.substring(0, 255) + '...'
                : result.description}
            </ReactMarkdown>
          </Frame>
        ))}
    </PageContainer>
  );
};

function mapStateToProps(state: RootState) {
  return {
    resultsCount: state.search.count,
    results: state.search.results,
    loading: state.search.loading,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    search: (searchString: string) => {
      dispatch(rest.actions.search({ searchString }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
