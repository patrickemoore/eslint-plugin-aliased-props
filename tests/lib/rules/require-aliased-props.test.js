const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/require-aliased-props');

const flatConfig = [
  {
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'aliased-props': {
        rules: {
          'require-aliased-props': rule,
        },
      },
    },
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      ecmaVersion: 2020,
      sourceType: 'module',
      // ecmaFeatures: {
      //   jsx: true,
      // },
    },
  },
];

const ruleTester = new RuleTester(flatConfig[0]);

const invalidCodeSamples = [
  {
    code: `
      function SphereMarker(props: {
        position?: Vector3;
        color?: string;
      }) {
        return <div />;
      }
    `,
    filename: 'test.tsx',
    errors: [{ message: 'Props should use a named interface or type alias instead of an inline type.' }],
  },
  {
    code: `
      const MyComponent = (props: { name: string, age: number }) => {
        return <div>{props.name}</div>;
      };
    `,
    filename: 'test.tsx',
    errors: [{ message: 'Props should use a named interface or type alias instead of an inline type.' }],
  },
  {
    code: `
      function AnotherComponent(props: { title: string }) {
        return <h1>{props.title}</h1>;
      }
    `,
    filename: 'test.tsx',
    errors: [{ message: 'Props should use a named interface or type alias instead of an inline type.' }],
  },
];

const validCodeSamples = [
  {
    code: `
      interface SphereMarkerProps {
        position?: Vector3;
        color?: string;
      }

      function SphereMarker(props: SphereMarkerProps) {
        return <div />;
      }
    `,
    filename: 'test.tsx',
  },
  {
    code: `
      type MyComponentProps = {
        name: string,
        age: number,
      };

      const MyComponent = (props: MyComponentProps) => {
        return <div>{props.name}</div>;
      };
    `,
    filename: 'test.tsx',
  },
  {
    code: `
      interface AnotherComponentProps {
        title: string;
      }

      function AnotherComponent(props: AnotherComponentProps) {
        return <h1>{props.title}</h1>;
      }
    `,
    filename: 'test.tsx',
  },
];

ruleTester.run('require-aliased-props', rule, {
  valid: validCodeSamples,
  invalid: invalidCodeSamples,
});
