import React from "react";
import { render } from "@testing-library/react";
import { Sum } from ".";

describe("<Sum/>", () => {
  test("returned the sum of the numbers", () => {
    const { container } = render(<Sum numbers={[1, 2, 3]} />);
    expect(container.textContent).toEqual(6);
  });
});
