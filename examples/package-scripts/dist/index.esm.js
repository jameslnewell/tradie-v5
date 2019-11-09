import React from 'react';

var Sum = function Sum(_ref) {
  var numbers = _ref.numbers;
  return React.createElement(React.Fragment, null, numbers.reduce(function (total, number) {
    return total + number;
  }));
};

export { Sum };
//# sourceMappingURL=index.esm.js.map
