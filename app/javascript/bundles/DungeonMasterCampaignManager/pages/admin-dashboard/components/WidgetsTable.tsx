import React from 'react';
import { UserProps } from '../../../utilities/types';
import rest from '../../../api/api';
import { connect } from 'react-redux';
import DataTable from '../../../components/DataTable/DataTable';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiPencil, GiTrashCan } from 'react-icons/gi';
import { WidgetProps } from '../../../components/Widgets/Widget';
import { getIconFromName } from '../../../utilities/icons';
import { NavLink } from '../../../components/NavLink/NavLink';

const styles = require('../admin-dashboard.module.scss');

const WidgetsTable = (props: {
  getWidgets: (searchTerm?: string) => void;
  deleteWidget: (id: number) => void;
  widgets: WidgetProps[];
  loading: boolean;
  user?: UserProps;
}) => {
  const { getWidgets, deleteWidget, widgets, user } = props;

  React.useEffect(() => {
    getWidgets();
  }, [user]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Icon',
        accessor: 'icon',
        Cell: ({ value }) => getIconFromName(value),
      },
      {
        Header: 'Widget',
        accessor: 'title',
      },
      {
        Header: 'Subtitle',
        accessor: 'subtitle',
      },
      {
        Header: 'Delete',
        accessor: 'id',
        size: 25,
        Cell: ({ value }) => (
          <>
            <NavLink
              to={`/app/admin-dashboard/edit-widget/${value}`}
              className={styles.editButton}
              icon={<GiPencil size={30} />}
              title={'Edit'}
              isButton
            />
            <Button
              type="button"
              onClick={() => deleteWidget(value)}
              color={Colors.danger}
              icon={<GiTrashCan size={30} />}
              title="Delete"
              hideTitle
            />
          </>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return widgets.map((widget: WidgetProps) => {
      return {
        id: widget.id,
        title: widget.title,
        subtitle: widget.subtitle,
        icon: widget.icon,
      };
    });
  }, [widgets]);

  const onSearch = (searchTerm: string) => {
    getWidgets(searchTerm);
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={false}
      onSearch={onSearch}
      results={data.length}
      noHover
    />
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
    widgets: state.widgets.widgets,
    loading: state.users.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWidgets: (searchTerm?: string) => {
      if (searchTerm) {
        dispatch(rest.actions.getWidgets({ search: searchTerm }));
      } else {
        dispatch(rest.actions.getWidgets());
      }
    },
    deleteWidget: (id: number) => {
      dispatch(rest.actions.deleteWidget({ id }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsTable);
