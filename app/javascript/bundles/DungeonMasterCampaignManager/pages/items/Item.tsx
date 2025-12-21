import React from 'react';

import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ItemInfoBlock, ItemPageProps, UserProps } from '../../utilities/types';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { singleItemUseData } from './use-data';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { parseEditionParams, getContentUrl, isValidEdition } from '../../utilities/editionUrls';
import { AdminActions } from '../../components/shared';
import ItemFormModal from './ItemFormModal';

import { Section, Info, TableFrame } from './Item.styles';

type ItemDetailPageProps = ItemPageProps & {
  currentUser?: UserProps;
  deleteItem: (itemId: number) => Promise<unknown>;
};

const Item = (props: ItemDetailPageProps) => {
  const { item, getItem, deleteItem, currentUser } = props;
  const { getItemParentInfo } = singleItemUseData(props);
  const navigate = useNavigate();
  const [itemInfo, setItemInfo] = React.useState<ItemInfoBlock>({
    parentTitle: 'Loading...',
    parentUrl: '/app/items',
    subtitle: '',
    infoBlock: [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const params = useParams<{ edition?: string; itemSlug?: string }>();
  const { edition, slug: itemSlug } = parseEditionParams(params.edition, params.itemSlug);
  const { edition: contextEdition, isEdition2014 } = useEdition();

  // Use edition from parsed params if valid, otherwise from context
  const effectiveEdition = isValidEdition(edition) ? edition : contextEdition;

  React.useEffect(() => {
    if (itemSlug) {
      getItem(itemSlug);
    }
  }, [itemSlug]);

  React.useEffect(() => {
    if (item) {
      setItemInfo(getItemParentInfo(item));
    }
  }, [item]);

  const handleEditSuccess = () => {
    if (itemSlug) {
      getItem(itemSlug);
    }
  };

  const handleDeleteSuccess = () => {
    navigate(getContentUrl('items', '', effectiveEdition));
  };

  const handleDelete = async () => {
    if (item && window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      await deleteItem(item.id);
      handleDeleteSuccess();
    }
  };

  const itemTitle = item ? item.name : 'Item Loading...';
  return (
    <PageContainer
      description={`Item: ${itemTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      maxWidth
      pageTitle={itemTitle}
    >
      <PageTitle title={itemTitle} isLegacy={isEdition2014} />
      {item && itemInfo ? (
        <Section>
          <AdminActions
            currentUser={currentUser}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDelete}
          />
          <Info>
            <h2>{itemInfo.subtitle}</h2>
            {itemInfo.infoBlock?.map((info, index) => (
              <p key={`${info.title} - ${index}`}>
                <span>{info.title}</span> {info.desc}
              </p>
            ))}
          </Info>
          {item.contents && (
            <Info>
              <h3>Contents</h3>
              <ul>
                {item.contents.map((contentItem, index) => (
                  <li key={`${contentItem.index}-${index}`}>
                    <Link to={getContentUrl('items', contentItem.index, effectiveEdition)}>
                      <strong>{contentItem.name}</strong> - quantity: {contentItem.quantity}
                    </Link>
                  </li>
                ))}
              </ul>
            </Info>
          )}
          {item.desc?.map((itemDesc, index) => (
            <ReactMarkdown
              key={index}
              components={{
                table: ({ node: _node, ...props }) => (
                  <TableFrame>
                    <table {...props} />
                  </TableFrame>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {itemDesc}
            </ReactMarkdown>
          ))}
          <ItemFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
            initialData={item}
            onSuccess={handleEditSuccess}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </Section>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state: RootState) {
  return {
    item: state.items.currentItem,
    loading: state.items.loading,
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getItem: (itemSlug: string) => {
      dispatch(rest.actions.getItem({ id: itemSlug }));
    },
    deleteItem: (itemId: number) => {
      return dispatch(rest.actions.deleteItem({ id: itemId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
