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
import { useEdition } from '../../contexts/EditionContext';
import { parseEditionParams, getContentUrl, isValidEdition } from '../../utilities/editionUrls';

import { Section, Info, TableFrame } from './Item.styles';

const Item = (props: ItemPageProps) => {
  const { item, getItem } = props;
  const { getItemParentInfo } = singleItemUseData(props);
  const [itemInfo, setItemInfo] = React.useState<ItemInfoBlock>({
    parentTitle: 'Loading...',
    parentUrl: '/app/items',
    subtitle: '',
    infoBlock: [],
  });
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

  const itemTitle = item ? item.name : 'Item Loading...';
  return (
    <PageContainer
      pageTitle={itemTitle}
      description={`Item: ${itemTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      <PageTitle title={itemTitle} isLegacy={isEdition2014} />
      {item && itemInfo ? (
        <Section>
          <Info>
            <h2>{itemInfo.subtitle}</h2>
            {itemInfo.infoBlock &&
              itemInfo.infoBlock.map((info, index) => (
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
          {item.desc &&
            item.desc.map((itemDesc, index) => (
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
        </Section>
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
