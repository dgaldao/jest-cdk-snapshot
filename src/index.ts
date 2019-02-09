import { Stack } from '@aws-cdk/cdk';
import { toMatchSnapshot } from 'jest-snapshot';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchCdkSnapshot(): R;
    }
  }
}

export const toMatchCdkSnapshot: jest.CustomMatcher = function(
  received: Stack
) {
  const matcher = toMatchSnapshot.bind(this);
  return matcher(convertStack(received));
};

const convertStack = (stack: Stack) => {
  stack.node.prepareTree();

  const errors = stack.node.validateTree();
  if (errors.length > 0) {
    throw new Error(
      `Stack validation failed:\n${errors
        .map(e => `${e.message} at: ${e.source.node.scope}`)
        .join('\n')}`
    );
  }

  return stack.toCloudFormation();
};
