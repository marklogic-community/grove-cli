# MarkLogic UI Resources (MUIR) Command Line Tool

## Installation

Soon, it will be:

    npm install -g muir

For now, until we publish this package, clone this repository, `cd` into it and then:

    npm install -g

This provides the `muir` command.

## Usage

### muir new

Generates a new MUIR application as a subdirectory of the current directory. Eventually, `new` will offer a choice among application templates. For now, it generates a React front-end with a NodeJS middle-tier.

Use it by passing your new application name.

    muir new my-app

### muir config

Generates or modifies settings for your application, based on prompts. This is the preferred way to manage configuration files.

    muir config

### muir demo

**This command is intended for very limited use cases. You should not use it for regular application development. It is for quick demonstrations and requires that MarkLogic is already running and initialized, that all dependencies are in place on the machine where it is invoked, that provided ports are available, etc.**

Generates a new application (as if you ran `muir new`), prompts for some configuration (as if you ran `muir config`), configures MarkLogic, loads sample data, and starts a MUIR middle-tier and Webpack development server for front-end assets.

    muir demo my-demo
