# Docker4me

> CLI tool for rapid orchestration of Docker Compose containers, automating the process of starting and stopping sequences.

Docker4me is a Command Line Interface (CLI) designed to optimize the use of Docker for developers working on multiple projects. It automates the process of starting and stopping Docker containers in the correct order, saving you precious development time.

## Installation

Install Docker4me globally using npm:

```bash
npm i -g docker4me
```


## How it Works

Docker4me works by creating symbolic links to your Docker Compose files (`docker-compose.yml`) using the `docker4me link` command. You need to link all your microservices in the correct order. Once done, you can bring up all your containers in the correct sequence by typing `docker4me up`. To stop all containers, simply type `docker4me down`.

## Features

* Easily bring up all containers in the correct sequence.
* Quickly bring down all containers in the correct order.
* Grouping functionality for better organization and management of your Docker projects.
* List all the created groups.

## Commands

Here is a list of available commands:

* `docker4me up` - Starts all linked containers in the correct order.
* `docker4me down` - Stops all linked containers in the correct order.
* `docker4me create [<group>]` - Creates a new group.
* `docker4me delete [<group>]` - Deletes the specified group.
* `docker4me ls` - Lists all existing groups.
* `docker4me link` - Creates a symbolic link to the `docker-compose.yml` file in the current directory.
* `docker4me unlink` - Unlinks the selected Docker Compose files.

## Usage

1. Navigate to the directory containing the `docker-compose.yml` file.
2. Run the command `docker4me link` to create a symbolic link to the `docker-compose.yml` file. Repeat this step for all your microservices in the correct order.
3. Once all microservices are linked, run `docker4me up` to start all containers in the correct sequence.
4. To stop all containers, run `docker4me down`.


## Alias tip

To make your Docker4me commands even more efficient, you might want to consider creating an alias for Docker4me in your shell configuration file. An alias is a shortcut that you can set up to represent a longer command, which can save you time and typing.

For example, if you are using Bash or Zsh, you can add the following line to your `.bashrc`, `.bash_profile`, or `.zshrc` file:

```bash
alias d='docker4me'
```
After saving the file and restarting your shell (or sourcing the shell profile file), you can now use `d` as a shortcut for `docker4me`.

This way, instead of typing out `docker4me up`, you can simply type `d up`, and similarly for other commands, making your work even faster and more efficient.
