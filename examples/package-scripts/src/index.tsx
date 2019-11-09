import React from 'react';

export const Sum = ({numbers}: {numbers: number[]}) => <>{numbers.reduce((total, number) => total + number)}</>
