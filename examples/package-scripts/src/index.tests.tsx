import {sum} from '.';

describe('sum()', () => {
  test('returned the sum of the numbers', () => {
    expect(sum(1, 2)).toEqual(3);
  })
})
