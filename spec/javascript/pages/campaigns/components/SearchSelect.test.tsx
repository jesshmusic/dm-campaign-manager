import React from 'react';
import { render, fireEvent } from '../../../test-utils';
import PlannerModal from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/PlannerModal';
import SearchSelect from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/SearchSelect';
import { menuOptions, openSelect, selectInput } from '../selectHelpers';

const options = [
  { value: 'planned', label: 'Planned' },
  { value: 'played', label: 'Played' },
];

const renderInModal = () => {
  const onCancel = jest.fn();
  render(
    <PlannerModal title="Prep" isOpen onSave={jest.fn()} onCancel={onCancel}>
      <SearchSelect aria-label="Status" options={options} />
    </PlannerModal>,
  );
  return { onCancel };
};

const escape = (element: HTMLElement) =>
  fireEvent.keyDown(element, { key: 'Escape', code: 'Escape', keyCode: 27 });

describe('SearchSelect', () => {
  it('filters its options as you type', () => {
    renderInModal();

    openSelect('Status', 'yed');

    expect(menuOptions()).toEqual(['Played']);
  });

  it('closes its menu on Escape without closing the modal around it', () => {
    const { onCancel } = renderInModal();
    openSelect('Status');

    escape(selectInput('Status'));

    expect(menuOptions()).toEqual([]);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('lets Escape close the modal when its menu is closed', () => {
    const { onCancel } = renderInModal();

    escape(selectInput('Status'));

    expect(onCancel).toHaveBeenCalled();
  });
});
