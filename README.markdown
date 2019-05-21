# MarkLogic Grove CLI (Command Line Interface)

The grove-cli is a command-line tool that allows you to generate new Grove projects and configure existing ones.

Grove is a UI toolkit. You can [learn more about Grove here](https://wiki.marklogic.com/display/SAL/Grove).

In the future, more functionality will be added to the grove-cli. This is the central tool facilitating work with Grove.

## Installation

    npm install -g @marklogic-community/grove-cli

This provides the `grove` command.

## Pre-requisites

The grove-cli requires that you have the following installed:

- Node.js 8.10 or above. (Check that it is available by running `node -v`. If not, refer to [nodejs.org](https://nodejs.org) for installation instructions.)

## Usage

### grove new

Generates a new Grove project as a subdirectory of the current directory. The `new` command offers a choice among project templates. For now, it offers [React](https://project.marklogic.com/repo/projects/NACW/repos/grove-react-template/browse) and [Vue](https://project.marklogic.com/repo/users/gjosten/repos/grove-vue-template/browse) front-end options. Both make use of a Node Express middle-tier.

Use it by passing your new application name.

    grove new my-app

You can see options for this command by running:

    grove new --help

For example, you can pass a `--templateVersion`. This currently corresponds to a branch or tag name in the template's git repository - though, in the future, it may refer to some other named template version.

### grove config

Generates or modifies settings for your application, based on prompts. This is the preferred way to manage configuration files. **Run this command from the parent directory of your generated project.**

    grove config

You can see options for this command by running:

    grove config --help

### grove demo

**This command is intended for very limited use cases. You should not use it for regular application development. It is for quick demonstrations and requires that MarkLogic is already running and initialized, that all dependencies are in place on the machine where it is invoked, that provided ports are available, etc.**

Generates a new application (as if you ran `grove new`), prompts for some configuration (as if you ran `grove config`), configures MarkLogic, loads sample data, and starts a Grove middle-tier and Webpack development server for front-end assets.

    grove demo my-demo

You can see options for this command by running:

    grove demo --help

For example, you can pass a `--templateVersion`. This currently corresponds to a branch or tag name in the template's git repository - though, in the future, it may refer to some other named template version.
