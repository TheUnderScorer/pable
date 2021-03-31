import yargs from 'yargs';
import chalk from 'chalk';
import { TerraformApiClient } from './api/TerraformApiClient';

async function main() {
  const { argv } = yargs(process.argv.slice(2)).options({
    image_tag: {
      type: 'string',
      alias: 'tag',
      demandOption: true,
    },
    terraform_token: {
      type: 'string',
      alias: 'token',
      demandOption: true,
    },
    workspace_id: {
      type: 'string',
      demandOption: true,
    },
  });

  const client = new TerraformApiClient(
    argv.workspace_id,
    argv.terraform_token
  );

  const response = await client.listVariables();

  const imageTagVariable = response.data.find(
    (value) => value.attributes.key === 'image_tag'
  );

  await client.updateVariable({
    ...imageTagVariable,
    attributes: {
      ...imageTagVariable.attributes,
      value: argv.image_tag,
    },
  });

  console.log(
    chalk.green(`Variable "image_tag" updated to: ${argv.image_tag}`)
  );
}

main().catch((error) => {
  console.log(chalk.red(`Execution failed: ${error.message}`));
});
