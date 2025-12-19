import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row } from 'react-table';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import rest from '../../api/api';
import { connect } from 'react-redux';
import DataTable from '../../components/DataTable/DataTable';
import { RaceSummary } from '../../utilities/types';
import { useEdition } from '../../contexts/EditionContext';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';

const Races = (props: { getRaces: () => void; races: RaceSummary[]; loading: boolean }) => {
  const { getRaces, loading, races } = props;
  const navigate = useNavigate();
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014, isEdition2024 } = useEdition();

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  const urlEdition = editionParam || param;
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  // In 2024 edition, "Races" are called "Species"
  const pageTitle = isEdition2024 ? 'Species' : 'Races';

  React.useEffect(() => {
    getRaces();
  }, []);

  const goToPage = (row: Row<Record<string, unknown>>) => {
    navigate(getContentUrl('races', row.original.slug as string, edition));
  };

  const columns = React.useMemo(
    () => [
      { Header: isEdition2024 ? 'Species' : 'Race', accessor: 'name' },
      { Header: 'Traits', accessor: 'traits' },
    ],
    [isEdition2024],
  );

  const data = React.useMemo(() => {
    return races.map((race) => {
      const traits =
        race.traits.length > 0 ? race.traits.map((trait) => trait.name).join(', ') : '-';
      return {
        name: race.name,
        traits: traits,
        slug: race.slug,
      };
    });
  }, [races]);

  return (
    <PageContainer
      description={`All ${pageTitle.toLowerCase()} for characters. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.`}
      maxWidth
      pageTitle={pageTitle}
    >
      <PageTitle title={pageTitle} isLegacy={isEdition2014} />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        paginateExpandedRows={false}
        perPage={15}
        results={data.length}
        loading={loading}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    loading: state.races.loading,
    races: state.races.races,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRaces: () => {
      dispatch(rest.actions.getRaces());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Races);
