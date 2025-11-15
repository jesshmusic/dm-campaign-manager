import React from 'react';

import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { connect } from 'react-redux';
import { ItemInfoBlock, ItemPageProps } from '../../utilities/types';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { singleItemUseData } from './use-data';
import { Link, useParams } from 'react-router-dom';

const styles = require('./item.module.scss');

const Item = (props: ItemPageProps) => {
  const { item, getItem, loading } = props;
  const { getItemParentInfo } = singleItemUseData(props);
  const [itemInfo, setItemInfo] = React.useState<ItemInfoBlock>({
    parentTitle: 'Loading...',
    parentUrl: '/app/items',
    subtitle: '',
    infoBlock: [],
  });
  const { itemSlug } = useParams<'itemSlug'>();

  React.useEffect(() => {
    getItem(itemSlug!);
  }, [itemSlug]);

  React.useEffect(() => {
    if (item) {
      setItemInfo(getItemParentInfo(item));
    }
  }, [item]);

  const itemTitle = item ? item.name : 'Item Loading...';
  return (
    <PageContainer
      pageTitle={itemTitle}
      description={`Item: ${itemTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      <PageTitle title={itemTitle} />
      {item && itemInfo ? (
        <div className={styles.section}>
          <div className={styles.info}>
            <h2>{itemInfo.subtitle}</h2>
            {itemInfo.infoBlock &&
              itemInfo.infoBlock.map((info, index) => (
                <p key={`${info.title} - ${index}`}>
                  <span>{info.title}</span> {info.desc}
                </p>
              ))}
          </div>
          {item.contents && (
            <div className={styles.info}>
              <h3>Contents</h3>
              <ul>
                {item.contents.map((contentItem, index) => (
                  <li key={`${contentItem.index}-${index}`}>
                    <Link to={`/app/items/${contentItem.index}`}>
                      <strong>{contentItem.name}</strong> - quantity: {contentItem.quantity}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.desc &&
            item.desc.map((itemDesc, index) => (
              <ReactMarkdown
                key={index}
                className={styles.section}
                children={itemDesc}
                components={{
                  table: ({ node, ...props }) => (
                    <div className={styles.tableFrame}>
                      <table {...props} />
                    </div>
                  ),
                }}
                remarkPlugins={[remarkGfm]}
              />
            ))}
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    item: state.items.currentItem,
    loading: state.items.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItem: (itemSlug: string) => {
      dispatch(rest.actions.getItem({ id: itemSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
