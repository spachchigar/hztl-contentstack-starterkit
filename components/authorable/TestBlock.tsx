'use client';

import { IComponents } from '@/.generated';

export const TestBlock = (props: IComponents['test_block']) => {
  return (
    <div>
      <h2>{props.block_title}</h2>
      <p>{props.block_description}</p>
    </div>
  );
};
