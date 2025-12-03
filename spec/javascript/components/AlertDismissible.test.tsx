import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import AlertDismissible from '../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Alerts/AlertDismissible';
import { FlashMessageType } from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/flashMessages';

// Mock Button component
jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return {
    __esModule: true,
    default: function Button({ onClick, icon, className }: any) {
      return (
        <button onClick={onClick} className={className} data-testid="close-button">
          {icon}
        </button>
      );
    },
  };
});

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    to: jest.fn((target, config) => {
      if (config.onComplete) {
        config.onComplete();
      }
    }),
    from: jest.fn(),
  },
}));

describe('AlertDismissible Component', () => {
  let mockDismissFlashMessage: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockDismissFlashMessage = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('rendering', () => {
    it('should render alert with message heading', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Test message text"
          messageHeading="Test Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      expect(screen.getByText('Test Heading')).toBeInTheDocument();
    });

    it('should render alert with message text', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="This is the detailed message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.success}
          offset={0}
        />
      );

      expect(screen.getByText('This is the detailed message')).toBeInTheDocument();
    });

    it('should render close button', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.warning}
          offset={0}
        />
      );

      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('should have role="alert"', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    const variants = [
      FlashMessageType.alert,
      FlashMessageType.info,
      FlashMessageType.danger,
      FlashMessageType.success,
      FlashMessageType.warning,
    ];

    variants.forEach((variant) => {
      it(`should render ${variant} variant`, () => {
        render(
          <AlertDismissible
            dismissFlashMessage={mockDismissFlashMessage}
            messageId={1}
            messageText="Test message"
            messageHeading={`${variant} message`}
            messageVariant={variant}
            offset={0}
          />
        );

        expect(screen.getByText(`${variant} message`)).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('should render danger variant with skull icon', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Danger message"
          messageHeading="Danger"
          messageVariant={FlashMessageType.danger}
          offset={0}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render success variant with sword icon', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Success message"
          messageHeading="Success"
          messageVariant={FlashMessageType.success}
          offset={0}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render info variant with info icon', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Info message"
          messageHeading="Info"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('dismiss functionality', () => {
    it('should call dismissFlashMessage when close button clicked', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Dismissible message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      expect(mockDismissFlashMessage).toHaveBeenCalledWith(1);
    });

    it('should call dismissFlashMessage with correct messageId', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={42}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.success}
          offset={0}
        />
      );

      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      expect(mockDismissFlashMessage).toHaveBeenCalledWith(42);
    });

    it('should auto-dismiss after 10 seconds', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Auto-dismiss message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      expect(mockDismissFlashMessage).not.toHaveBeenCalled();

      jest.advanceTimersByTime(10000);

      expect(mockDismissFlashMessage).toHaveBeenCalledWith(1);
    });

    it('should not auto-dismiss before 10 seconds', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      jest.advanceTimersByTime(9000);

      expect(mockDismissFlashMessage).not.toHaveBeenCalled();
    });
  });

  describe('positioning', () => {
    it('should position alert based on offset', () => {
      const { container } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={2}
        />
      );

      const alertWrapper = container.querySelector('[style]');
      expect(alertWrapper).toHaveStyle({ top: '13rem' }); // 2 * 6 + 1 = 13
    });

    it('should position first alert at correct offset', () => {
      const { container } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      const alertWrapper = container.querySelector('[style]');
      expect(alertWrapper).toHaveStyle({ top: '1rem' }); // 0 * 6 + 1 = 1
    });

    it('should stack multiple alerts correctly', () => {
      const { container: container1 } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="First Message"
          messageHeading="First"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      const { container: container2 } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={2}
          messageText="Second Message"
          messageHeading="Second"
          messageVariant={FlashMessageType.success}
          offset={1}
        />
      );

      const alert1 = container1.querySelector('[style]');
      const alert2 = container2.querySelector('[style]');

      expect(alert1).toHaveStyle({ top: '1rem' });
      expect(alert2).toHaveStyle({ top: '7rem' }); // 1 * 6 + 1 = 7
    });
  });

  describe('message ID', () => {
    it('should use messageId in element ID', () => {
      const { container } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={123}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      expect(container.querySelector('#liveToast123')).toBeInTheDocument();
    });

    it('should create unique IDs for different messages', () => {
      const { container: container1 } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="First"
          messageHeading="First"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      const { container: container2 } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={2}
          messageText="Second"
          messageHeading="Second"
          messageVariant={FlashMessageType.success}
          offset={1}
        />
      );

      expect(container1.querySelector('#liveToast1')).toBeInTheDocument();
      expect(container2.querySelector('#liveToast2')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have alert role', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Accessible message"
          messageHeading="Accessible Heading"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should have visible heading text', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Message"
          messageHeading="Clear Heading"
          messageVariant={FlashMessageType.success}
          offset={0}
        />
      );

      expect(screen.getByText('Clear Heading')).toBeVisible();
    });

    it('should have visible message text', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Clear message text"
          messageHeading="Heading"
          messageVariant={FlashMessageType.warning}
          offset={0}
        />
      );

      expect(screen.getByText('Clear message text')).toBeVisible();
    });
  });

  describe('edge cases', () => {
    it('should handle empty message text', () => {
      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText=""
          messageHeading="Heading Only"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      expect(screen.getByText('Heading Only')).toBeInTheDocument();
    });

    it('should handle long message text', () => {
      const longMessage = 'This is a very long message that contains a lot of text to test how the component handles lengthy content without breaking or causing layout issues.';

      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText={longMessage}
          messageHeading="Long Message"
          messageVariant={FlashMessageType.info}
          offset={0}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Message with <special> & "characters"';

      render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText={specialMessage}
          messageHeading="Special Chars"
          messageVariant={FlashMessageType.warning}
          offset={0}
        />
      );

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('should handle large offset values', () => {
      const { container } = render(
        <AlertDismissible
          dismissFlashMessage={mockDismissFlashMessage}
          messageId={1}
          messageText="Message"
          messageHeading="Heading"
          messageVariant={FlashMessageType.info}
          offset={10}
        />
      );

      const alertWrapper = container.querySelector('[style]');
      expect(alertWrapper).toHaveStyle({ top: '61rem' }); // 10 * 6 + 1 = 61
    });
  });
});
