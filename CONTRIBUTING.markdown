# grove-cli Contributors' Guide

TODO: improve this guide!

## Developing the grove-cli locally

		git clone https://github.com/marklogic-community/grove-cli.git
		cd grove-cli
		npm install -g

This will link your clone of the grove-cli to the global `grove` command, so that you can put your changes to work immediately.

## Lint

The following will lint your code and report errors:

    npm run lint

The following will apply fixes automatically (WARNING: overwrites files. You may want to check them into version control first.):

    npm run lint:fix
