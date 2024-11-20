/**
 * @fileoverview Custom ESLint rules
 */

'use strict';

module.exports = {
  rules: {
    'require-aliased-props': require('./lib/rules/require-aliased-props'),
  },
};
