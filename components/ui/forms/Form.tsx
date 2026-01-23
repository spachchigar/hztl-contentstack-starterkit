import React from 'react';
import { IForm } from '@/.generated';
import { componentMapper } from '@/temp/registered-components';

export const Form = (props: IForm) => {
  const Component = componentMapper.getComponent(props.form_name);

  return <Component {...props} />;
};
