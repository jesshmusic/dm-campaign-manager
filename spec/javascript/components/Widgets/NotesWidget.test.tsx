import React from 'react';
import { render } from '@testing-library/react';
import NotesWidget from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/NotesWidget';

jest.mock('react-quill', () => {
  const mockQuill = {
    import: jest.fn(() => ({})),
    register: jest.fn(),
  };
  const QuillComponent = function MockReactQuill({ value, onChange }: any) {
    return (
      <div data-testid="quill-editor">
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  };
  (QuillComponent as any).Quill = mockQuill;
  return QuillComponent;
});

describe('NotesWidget', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<NotesWidget />);
  });

  it('loads notes from localStorage on mount', () => {
    localStorage.setItem('dmWidgetNotes', 'Test notes');
    const { getByDisplayValue } = render(<NotesWidget />);
    expect(getByDisplayValue('Test notes')).toBeInTheDocument();
  });

  it('renders quill editor', () => {
    render(<NotesWidget />);
    expect(document.querySelector('[data-testid="quill-editor"]')).toBeInTheDocument();
  });
});
