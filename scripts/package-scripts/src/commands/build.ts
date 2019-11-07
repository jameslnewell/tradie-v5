
export const command = 'build';
export const describe = 'Build the package.';
export const builder = {};
export const handler = (argv) => {
  console.log('build called', argv)
}
