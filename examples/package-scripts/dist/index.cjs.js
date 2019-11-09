'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

var Sum = function Sum(_ref) {
  var numbers = _ref.numbers;
  return React.createElement(React.Fragment, null, numbers.reduce(function (total, number) {
    return total + number;
  }));
};

exports.Sum = Sum;
//# sourceMappingURL=index.cjs.js.map
