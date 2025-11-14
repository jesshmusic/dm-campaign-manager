import { describe, it, expect, beforeEach } from '@jest/globals';
import flashMessages, {
  addFlashMessage,
  dismissFlashMessage,
  FlashMessageType,
} from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/flashMessages';
import { FlashMessage } from '../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/types';

describe('flashMessages reducer', () => {
  let initialState: FlashMessage[];

  beforeEach(() => {
    initialState = [];
  });

  describe('initial state', () => {
    it('should return empty array as initial state', () => {
      expect(flashMessages(undefined, { type: '@@INIT' } as any)).toEqual([]);
    });
  });

  describe('addFlashMessage', () => {
    it('should add a flash message to the state', () => {
      const message: FlashMessage = {
        id: 1,
        messageType: FlashMessageType.success,
        heading: 'Success',
        text: 'Operation completed successfully',
      };

      const action = addFlashMessage(message);
      const newState = flashMessages(initialState, action);

      expect(newState).toHaveLength(1);
      expect(newState[0]).toMatchObject({
        messageType: FlashMessageType.success,
        heading: 'Success',
        text: 'Operation completed successfully',
      });
      expect(newState[0].id).toBeDefined();
    });

    it('should add new messages to the beginning of the array', () => {
      const firstMessage: FlashMessage = {
        id: 1,
        messageType: FlashMessageType.info,
        heading: 'First',
        text: 'First message',
      };

      const secondMessage: FlashMessage = {
        id: 2,
        messageType: FlashMessageType.warning,
        heading: 'Second',
        text: 'Second message',
      };

      let state = flashMessages(initialState, addFlashMessage(firstMessage));
      state = flashMessages(state, addFlashMessage(secondMessage));

      expect(state).toHaveLength(2);
      expect(state[0].heading).toBe('Second');
      expect(state[1].heading).toBe('First');
    });

    it('should handle different message types', () => {
      const messageTypes = [
        FlashMessageType.alert,
        FlashMessageType.success,
        FlashMessageType.info,
        FlashMessageType.warning,
        FlashMessageType.danger,
      ];

      messageTypes.forEach((type) => {
        const message: FlashMessage = {
          id: Date.now(),
          messageType: type,
          heading: `${type} message`,
          text: `This is a ${type} message`,
        };

        const state = flashMessages(initialState, addFlashMessage(message));
        expect(state[0].messageType).toBe(type);
      });
    });
  });

  describe('dismissFlashMessage', () => {
    beforeEach(() => {
      initialState = [
        {
          id: 1,
          messageType: FlashMessageType.success,
          heading: 'First',
          text: 'First message',
        },
        {
          id: 2,
          messageType: FlashMessageType.info,
          heading: 'Second',
          text: 'Second message',
        },
        {
          id: 3,
          messageType: FlashMessageType.warning,
          heading: 'Third',
          text: 'Third message',
        },
      ];
    });

    it('should remove a message by id', () => {
      const action = dismissFlashMessage(2);
      const newState = flashMessages(initialState, action);

      expect(newState).toHaveLength(2);
      expect(newState.find((m) => m.id === 2)).toBeUndefined();
    });

    it('should remove the correct message from multiple messages', () => {
      const action = dismissFlashMessage(1);
      const newState = flashMessages(initialState, action);

      expect(newState).toHaveLength(2);
      expect(newState[0].id).toBe(2);
      expect(newState[1].id).toBe(3);
    });

    it('should handle dismissing the last message', () => {
      let state = initialState;
      state = flashMessages(state, dismissFlashMessage(1));
      state = flashMessages(state, dismissFlashMessage(2));
      state = flashMessages(state, dismissFlashMessage(3));

      expect(state).toHaveLength(0);
    });

    it('should not modify state if message id does not exist', () => {
      const action = dismissFlashMessage(999);
      const newState = flashMessages(initialState, action);

      expect(newState).toHaveLength(3);
      expect(newState).toEqual(initialState);
    });
  });

  describe('redux-api actions', () => {
    describe('login success', () => {
      it('should add success message on login', () => {
        const action = {
          type: '@@redux-api@setUser_success',
          data: { name: 'John Doe' },
        };

        const newState = flashMessages(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0].messageType).toBe(FlashMessageType.success);
        expect(newState[0].heading).toBe('Welcome, John Doe');
        expect(newState[0].text).toBe('User signed in successfully');
      });
    });

    describe('login failed', () => {
      it('should add error message on login failure', () => {
        const action = {
          type: '@@redux-api@setUser_fail',
          error: {
            status: 401,
            statusText: 'Unauthorized',
            errors: 'Invalid credentials',
          },
        };

        const newState = flashMessages(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0].messageType).toBe(FlashMessageType.danger);
        expect(newState[0].heading).toBe('Error 401 Unauthorized');
        expect(newState[0].text).toBe('Invalid credentials');
      });
    });

    describe('logout success', () => {
      it('should add info message on logout', () => {
        const action = {
          type: '@@redux-api@userLogout_success',
        };

        const newState = flashMessages(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0].messageType).toBe(FlashMessageType.info);
        expect(newState[0].heading).toBe('Until next time...');
        expect(newState[0].text).toBe('User signed out successfully');
      });
    });

    describe('create custom action', () => {
      it('should add success message on create success', () => {
        const action = {
          type: '@@redux-api@createCustomAction_success',
        };

        const newState = flashMessages(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0].messageType).toBe(FlashMessageType.success);
        expect(newState[0].heading).toBe('Saved');
        expect(newState[0].text).toBe('Action Created Successfully');
      });

      it('should add error message on create failure', () => {
        const action = {
          type: '@@redux-api@createCustomAction_fail',
          error: {
            status: 422,
            statusText: 'Unprocessable Entity',
            errors: 'Validation failed',
          },
        };

        const newState = flashMessages(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0].messageType).toBe(FlashMessageType.danger);
      });
    });

    describe('update custom action', () => {
      it('should add success message on update success', () => {
        const action = {
          type: '@@redux-api@updateCustomAction_success',
        };

        const newState = flashMessages(initialState, action);

        expect(newState[0].messageType).toBe(FlashMessageType.success);
        expect(newState[0].text).toBe('Action Updated Successfully');
      });

      it('should add error message on update failure', () => {
        const action = {
          type: '@@redux-api@updateCustomAction_fail',
          error: {
            status: 500,
            statusText: 'Internal Server Error',
            errors: 'Server error',
          },
        };

        const newState = flashMessages(initialState, action);

        expect(newState[0].messageType).toBe(FlashMessageType.danger);
      });
    });

    describe('widget actions', () => {
      it('should handle create widget success', () => {
        const action = {
          type: '@@redux-api@createWidget_success',
        };

        const newState = flashMessages(initialState, action);

        expect(newState[0].text).toBe('Widget Created Successfully');
      });

      it('should handle create widget failure', () => {
        const action = {
          type: '@@redux-api@createWidget_fail',
          error: {
            status: 400,
            statusText: 'Bad Request',
            errors: 'Invalid widget data',
          },
        };

        const newState = flashMessages(initialState, action);

        expect(newState[0].messageType).toBe(FlashMessageType.danger);
      });

      it('should handle update widget success', () => {
        const action = {
          type: '@@redux-api@updateWidget_success',
        };

        const newState = flashMessages(initialState, action);

        expect(newState[0].text).toBe('Widget Updated Successfully');
      });

      it('should handle update widget failure', () => {
        const action = {
          type: '@@redux-api@updateWidget_fail',
          error: {
            status: 404,
            statusText: 'Not Found',
            errors: 'Widget not found',
          },
        };

        const newState = flashMessages(initialState, action);

        expect(newState[0].messageType).toBe(FlashMessageType.danger);
      });
    });
  });

  describe('message ordering', () => {
    it('should maintain newest messages at the top', () => {
      let state = initialState;

      // Add multiple messages
      for (let i = 1; i <= 5; i++) {
        const message: FlashMessage = {
          id: i,
          messageType: FlashMessageType.info,
          heading: `Message ${i}`,
          text: `This is message ${i}`,
        };
        state = flashMessages(state, addFlashMessage(message));
      }

      expect(state).toHaveLength(5);
      // Newest message should be first
      expect(state[0].heading).toBe('Message 5');
      expect(state[4].heading).toBe('Message 1');
    });
  });
});
