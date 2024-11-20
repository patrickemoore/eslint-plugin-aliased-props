# eslint-plugin-aliased-props

## What the plugin does

This ESLint plugin enforces the use of aliased (named) types for React component props. It ensures that props are defined using named interfaces or type aliases instead of inline types.

## Installation

To install the plugin, run:

```sh
npm install @patrickemoore/eslint-plugin-aliased-props --save-dev
```

## Configuration

To configure the plugin in your ESLint configuration file, add the following:

```json
{
  "plugins": ["@patrickemoore/eslint-plugin-aliased-props"],
  "rules": {
    "@patrickemoore/eslint-plugin-aliased-props/require-aliased-props": "error"
  }
}
```

## Examples

### Incorrect

```jsx
const MyComponent = (props: { name: string, age: number }) => {
  return <div>{props.name}</div>;
};
```

### Correct

```jsx
type Props = {
  name: string,
  age: number,
};

const MyComponent = (props: Props) => {
  return <div>{props.name}</div>;
};
```
