import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { WidgetProps } from '../../components/Widgets/Widget';

export const useCreateWidgetState = (props: {
  createWidget: (widget: WidgetProps, token?: string) => void;
  token?: string;
}) => {
  const { createWidget, token } = props;
  const [testState, setTestState] = React.useState();
  const navigate = useNavigate();

  const UseForm = useForm<WidgetProps>({
    mode: 'onChange',
    defaultValues: {
      title: 'New Widget',
      subtitle: '',
      icon: 'GiSwordInStone',
      content: '',
    },
  });

  React.useEffect(() => {
    const subscription = UseForm.watch((value) => {
      // @ts-ignore
      setTestState(value);
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  const onSubmit = (data) => {
    createWidget(data, token);
    navigate('/app/admin-dashboard');
  };

  return {
    onSubmit,
    testState,
    UseForm,
  };
};
