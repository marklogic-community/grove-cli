# MarkLogic Grove Command Line Tool

## Installation

Soon, it will be:

    npm install -g grove-cli

For now, until we publish this package, clone this repository, `cd` into it and then:

    npm install -g

This provides the `grove` command.

## Usage

### grove new

Generates a new Grove application as a subdirectory of the current directory. Eventually, `new` will offer a choice among application templates. For now, it generates a React front-end with a NodeJS middle-tier.

Use it by passing your new application name.

    grove new my-app

### grove config

Generates or modifies settings for your application, based on prompts. This is the preferred way to manage configuration files. We plan to add additional functionality to it soon. **Run this command from the parent directory of your generated project.**

    grove config

### grove demo

**This command is intended for very limited use cases. You should not use it for regular application development. It is for quick demonstrations and requires that MarkLogic is already running and initialized, that all dependencies are in place on the machine where it is invoked, that provided ports are available, etc.**

Generates a new application (as if you ran `grove new`), prompts for some configuration (as if you ran `grove config`), configures MarkLogic, loads sample data, and starts a Grove middle-tier and Webpack development server for front-end assets.

    grove demo my-demo
