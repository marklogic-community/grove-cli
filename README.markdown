# MarkLogic Grove CLI (Command Line Interface)

## Installation

    npm install -g @marklogic-community/grove-cli

This provides the `grove` command.

## Usage

### grove new

Generates a new Grove project as a subdirectory of the current directory. The `new` command offers a choice among project templates. For now, it offers [React](https://project.marklogic.com/repo/projects/NACW/repos/grove-react-template/browse) and [Vue](https://project.marklogic.com/repo/users/gjosten/repos/grove-vue-template/browse) options.

Use it by passing your new application name `my-app`.

    grove new <my-app>

You can see options for this command by running:

    grove new --help

For example, you can pass a `--templateVersion`. This currently corresponds to a branch or tag name in the template's git repository - though, in the future, it may refer to some other named template version.

### grove config

Generates or modifies settings for your application, based on prompts. This is the preferred way to manage configuration files. **Run this command from the parent directory of your generated project.**

    grove config


You can pass the `environment` you want to override. By default it modifies the local environment.

    grove config <environment>

You can see options for this command by running:

    grove config --help

### grove demo

**This command is intended for very limited use cases. You should not use it for regular application development. It is for quick demonstrations and requires that MarkLogic is already running and initialized, that all dependencies are in place on the machine where it is invoked, that provided ports are available, etc.**

Generates a new application (as if you ran `grove new`), prompts for some configuration (as if you ran `grove config`), configures MarkLogic, loads sample data, and starts a Grove middle-tier and Webpack development server for front-end assets.

    grove demo my-demo

You can see options for this command by running:

    grove demo --help

For example, you can pass a `--templateVersion`. This currently corresponds to a branch or tag name in the template's git repository - though, in the future, it may refer to some other named template version.
