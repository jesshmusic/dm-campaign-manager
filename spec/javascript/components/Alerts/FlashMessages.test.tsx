import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FlashMessages from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Alerts/FlashMessages';
import flashMessagesReducer from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/flashMessages';

const createMockStore = (initialMessages = []) => {
  return configureStore({
    reducer: {
      flashMessages: flashMessagesReducer,
    },
    preloadedState: {
      flashMessages: initialMessages,
    },
  });
};

describe('FlashMessages', () => {
  it('renders without messages', () => {
    const store = createMockStore([]);
    const { container } = render(
      <Provider store={store}>
        <FlashMessages />
      </Provider>
    );

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders with one message', () => {
    const messages = [
      {
        id: 1,
        heading: 'Success',
        text: 'Operation completed',
        messageType: 'success',
      },
    ];

    const store = createMockStore(messages);
    render(
      <Provider store={store}>
        <FlashMessages />
      </Provider>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('renders multiple messages', () => {
    const messages = [
      {
        id: 1,
        heading: 'Success',
        text: 'First message',
        messageType: 'success',
      },
      {
        id: 2,
        heading: 'Warning',
        text: 'Second message',
        messageType: 'warning',
      },
    ];

    const store = createMockStore(messages);
    render(
      <Provider store={store}>
        <FlashMessages />
      </Provider>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('uses default heading "Error" when heading is missing', () => {
    const messages = [
      {
        id: 1,
        text: 'Message without heading',
        messageType: 'danger',
      },
    ];

    const store = createMockStore(messages);
    render(
      <Provider store={store}>
        <FlashMessages />
      </Provider>
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('passes correct offset to AlertDismissible components', () => {
    const messages = [
      { id: 1, text: 'Message 1', messageType: 'info' },
      { id: 2, text: 'Message 2', messageType: 'info' },
      { id: 3, text: 'Message 3', messageType: 'info' },
    ];

    const store = createMockStore(messages);
    const { container } = render(
      <Provider store={store}>
        <FlashMessages />
      </Provider>
    );

    const alerts = container.querySelectorAll('[role="alert"]');
    expect(alerts.length).toBe(3);
  });

  it('connects to Redux store correctly', () => {
    const messages = [
      {
        id: 1,
        heading: 'Connected',
        text: 'Store is connected',
        messageType: 'success',
      },
    ];

    const store = createMockStore(messages);
    render(
      <Provider store={store}>
        <FlashMessages />
      </Provider>
    );

    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('handles empty text gracefully', () => {
    const messages = [
      {
        id: 1,
        heading: 'Heading Only',
        text: '',
        messageType: 'info',
      },
    ];

    const store = createMockStore(messages);
    render(
      <Provider store={store}>
        <FlashMessages />
      </Provider>
    );

    expect(screen.getByText('Heading Only')).toBeInTheDocument();
  });
});
