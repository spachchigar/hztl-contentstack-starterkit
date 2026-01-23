'use client';

// Local
import { withPagesStyleChangeWatcher } from '@/helpers/HOC/withPagesStyleChangeWatcher';
import { ComponentProps } from '@/lib/component-props';

/**
 * Component wrapper HOC with all the standard functionality we expect for most components
 * @param Component The component itself
 * @returns The wrapped component with added functionality
 */
export function withStandardComponentWrapper<P extends ComponentProps>(
  Component: React.ComponentType<P>
) {
  const WrappedComponent = withPagesStyleChangeWatcher(Component);

  return WrappedComponent;
}
