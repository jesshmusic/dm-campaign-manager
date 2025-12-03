import React from 'react';
import { GiAbstract029, GiBroadsword, GiInfo, GiSkullCrossedBones } from 'react-icons/gi';
import { FlashMessageType } from '../../reducers/flashMessages';
import { GrClose } from 'react-icons/gr';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { gsap } from 'gsap';

import {
  AlertWrapper,
  AlertContainer,
  AlertHeader,
  AlertIcon,
  AlertHeading,
  AlertMessage,
  AlertVariant,
} from './Alerts.styles';

type AlertDismissibleProps = {
  dismissFlashMessage: (messageId: number) => void;
  messageId: number;
  messageText: string;
  messageHeading: string;
  messageVariant: string;
  offset: number;
};

const AlertDismissible = (props: AlertDismissibleProps) => {
  const { dismissFlashMessage, messageId, messageText, messageHeading, messageVariant, offset } =
    props;

  const alertRef = React.useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to(alertRef.current, {
        duration: 0.5,
        ease: 'strong.inOut',
        opacity: 0,
        top: 160 * offset - 160,
        onComplete: () => dismissFlashMessage(messageId),
      });
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    gsap.from(alertRef.current, {
      duration: 0.5,
      ease: 'strong.inOut',
      opacity: 0,
      top: 160 * offset - 160,
    });
  }, [alertRef]);

  const icon = {
    [FlashMessageType.alert]: <GiSkullCrossedBones size={24} />,
    [FlashMessageType.info]: <GiInfo size={24} />,
    [FlashMessageType.danger]: <GiSkullCrossedBones size={24} />,
    [FlashMessageType.success]: <GiBroadsword size={24} />,
    [FlashMessageType.warning]: <GiAbstract029 size={24} />,
  };

  const handleDismiss = () => {
    gsap.to(alertRef.current, {
      duration: 0.5,
      ease: 'strong.inOut',
      opacity: 0,
      top: 160 * offset - 160,
      onComplete: () => dismissFlashMessage(messageId),
    });
  };

  return (
    <AlertWrapper ref={alertRef} style={{ top: `${offset * 6 + 1}rem` }}>
      <AlertContainer
        id={`liveToast${messageId}`}
        $variant={messageVariant as AlertVariant}
        role="alert"
      >
        <AlertHeader>
          <AlertIcon>{icon[messageVariant]}</AlertIcon>
          <AlertHeading>{messageHeading}</AlertHeading>
          <Button
            color={Colors.light}
            title="Close"
            onClick={handleDismiss}
            hideTitle
            icon={<GrClose />}
          />
        </AlertHeader>
        <AlertMessage>{messageText}</AlertMessage>
      </AlertContainer>
    </AlertWrapper>
  );
};

export default AlertDismissible;
