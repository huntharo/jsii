import '@jsii/check-node/run';

import { writeFile } from 'node:fs';
import { promisify } from 'node:util';
import * as yargs from 'yargs';

import jsiiConfig from '../lib';

const writeFilePromise = promisify(writeFile);
/*
 * Read package.json and prompt user for new or revised jsii config values.
 */
async function main() {
  const argv = await yargs
    .command('$0 [args]', 'configure jsii compilation options in package.json')
    .option('package-json', {
      alias: 'p',
      type: 'string',
      description: "location of module's package.json file",
      default: './package.json',
    })
    .option('dry-run', {
      alias: 'd',
      type: 'boolean',
      description: "print output to stdout, don't write to package.json",
      default: false,
    })
    .help().argv;

  const packageJsonLocation = argv['package-json'];
  const config = await jsiiConfig(packageJsonLocation);
  const output = JSON.stringify(config, null, 2);

  if (argv['dry-run']) {
    console.log(output);
  } else {
    await writeFilePromise(packageJsonLocation, output);
  }
}

main()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(100);
  });