import React from "react";

export const Sum: React.FC<{ numbers: number[] }> = ({ numbers }) => (
  <>{numbers.reduce((total, number) => total + number)}</>
);
