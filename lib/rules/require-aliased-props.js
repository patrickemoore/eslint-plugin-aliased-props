/**
 * @fileoverview Require React component props to have an aliased (named) type.
 */

'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require React component props to have an aliased (named) type.',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null, // or 'code' if you implement autofix
    schema: [], // No options
  },

  create(context) {
    const ts = require('@typescript-eslint/typescript-estree');

    return {
      FunctionDeclaration(node) {
        checkPropsParameter(node);
      },
      ArrowFunctionExpression(node) {
        if (
          node.parent &&
          node.parent.type === 'VariableDeclarator'
        ) {
          checkPropsParameter(node);
        } else if (
          node.parent &&
          node.parent.type === 'CallExpression' &&
          node.parent.callee.type === 'MemberExpression' &&
          node.parent.callee.object.name === 'React' &&
          node.parent.callee.property.name === 'memo'
        ) {
          checkPropsParameter(node);
        }
      },
    };

    function checkPropsParameter(node) {
      const isReactComponent = isNodeReactComponent(node);

      if (!isReactComponent) {
        return;
      }

      const firstParam = node.params[0];
      if (!firstParam || firstParam.type !== 'Identifier') {
        return;
      }

      const typeAnnotation = firstParam.typeAnnotation;
      if (
        typeAnnotation &&
        typeAnnotation.typeAnnotation &&
        typeAnnotation.typeAnnotation.type === 'TSTypeLiteral'
      ) {
        context.report({
          node: typeAnnotation,
          message:
            'Props should use a named interface or type alias instead of an inline type.',
        });
        return;
      }
    }

    function isNodeReactComponent(node) {
      // Check if the function returns JSX
      let hasJSX = false;
      const sourceCode = context.getSourceCode();
      const visitorKeys = sourceCode.visitorKeys;

      function traverse(node) {
        if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
          hasJSX = true;
          return;
        }

        const keys = visitorKeys[node.type];
        if (!keys) {
          return;
        }

        for (const key of keys) {
          const child = node[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              traverse(c);
            }
          } else if (child) {
            traverse(child);
          }
        }
      }

      traverse(node.body);

      return hasJSX;
    }
  },
};
