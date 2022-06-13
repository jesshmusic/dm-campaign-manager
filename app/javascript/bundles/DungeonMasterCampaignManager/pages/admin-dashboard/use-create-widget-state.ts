import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreateWidgetForm, WidgetProps } from '../../components/Widgets/Widget';

export const useCreateWidgetState = (props: {
  createWidget: (widget: WidgetProps, token?: string) => void;
  token?: string;
}) => {
  const { createWidget, token } = props;
  const [testState, setTestState] = React.useState();
  const navigate = useNavigate();

  const UseForm = useForm<CreateWidgetForm>({
    mode: 'onChange',
    defaultValues: {
      title: 'New Widget',
      subtitle: '',
      icon: 'Sword In Stone',
      iconOption: {
        value: 'GiSwordInStone',
        label: 'Sword In Stone',
      },
      content: '',
    },
  });

  const updateWidgetForm = async (fieldName: string | undefined, value: unknown) => {
    // @ts-ignore
    const fields = value as CreateWidgetForm;
    if (fieldName === 'iconOption') {
      UseForm.setValue('icon', fields.iconOption.value as string);
    }
  };

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
    setTestState,
    testState,
    updateWidgetForm,
    UseForm,
  };
};
