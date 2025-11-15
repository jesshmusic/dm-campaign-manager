import React from 'react';
import { GiAbstract029, GiBroadsword, GiInfo, GiSkullCrossedBones } from 'react-icons/gi';
import classNames from 'classnames';
import { FlashMessageType } from '../../reducers/flashMessages';
import { GrClose } from 'react-icons/all';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { gsap } from 'gsap';

const styles = require('./alert.module.scss');

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
    <div className={styles.alertWrapper} ref={alertRef} style={{ top: `${offset * 6 + 1}rem` }}>
      <div
        id={`liveToast${messageId}`}
        className={classNames(styles.alertContainer, {
          [styles.alertContainerAlert]: messageVariant === FlashMessageType.alert,
          [styles.alertContainerSuccess]: messageVariant === FlashMessageType.success,
          [styles.alertContainerInfo]: messageVariant === FlashMessageType.info,
          [styles.alertContainerWarning]: messageVariant === FlashMessageType.warning,
          [styles.alertContainerDanger]: messageVariant === FlashMessageType.danger,
        })}
        role="alert"
      >
        <div className={styles.alertHeader}>
          <div className={styles.icon}>{icon[messageVariant]}</div>
          <div className={styles.heading}>{messageHeading}</div>
          <Button
            className={styles.button}
            color={Colors.light}
            title="Close"
            onClick={handleDismiss}
            hideTitle
            icon={<GrClose />}
          />
        </div>
        <div className={styles.alertMessage}>{messageText}</div>
      </div>
    </div>
  );
};

export default AlertDismissible;
