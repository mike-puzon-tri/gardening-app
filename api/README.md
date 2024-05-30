# Frontend API

* This API is created with FastAPI
* Endpoints all under prefix /api by convention to make deployment easier

<!-- TOC -->
* [Frontend API](#frontend-api)
  * [How To Run Locally - Non Developer](#how-to-run-locally---non-developer)
    * [Non Developer Prerequisites](#non-developer-prerequisites)
      * [Non Developer Required programs](#non-developer-required-programs)
      * [Non Developer Set environment variables](#non-developer-set-environment-variables)
    * [Run](#run)
  * [How To Run Locally - Developer](#how-to-run-locally---developer)
    * [Developer Prerequisites](#developer-prerequisites)
      * [Developer Required programs](#developer-required-programs)
      * [Developer Set environment variables](#developer-set-environment-variables)
    * [Developer Commands](#developer-commands)
      * [Makefile as the command runner (Unix)](#makefile-as-the-command-runner-unix)
      * [Tox as the command runner (hopefully cross-platform)](#tox-as-the-command-runner-hopefully-cross-platform)
  * [Running the API in AWS Lambda](#running-the-api-in-aws-lambda)
    * [Build Lambda Docker Image](#build-lambda-docker-image)
  * [Other Makefile commands](#other-makefile-commands)
  * [Other Tox commands](#other-tox-commands)
<!-- TOC -->

## How To Run Locally - Non Developer

### Non Developer Prerequisites

#### Non Developer Required programs

* Docker/Docker Compose (version 23)
  * Linux users should follow steps for [non-root usage](https://docs.docker.com/engine/install/linux-postinstall/)

#### Non Developer Set environment variables

* Our applications typically use environment variables. We define them in
[settings.py](app/settings.py) To override defaults, set them in the terminal
or create a dotenv at **api/app/.env** for example

```dotenv
DEFAULT_USERNAME=DUMMY
DEFAULT_AGE=21
DEBUG=1
```

### Run

```sh
make up
```

See Swagger UI at  <http://localhost:8080/api_docs>

## How To Run Locally - Developer

### Developer Prerequisites

#### Developer Required programs

* Python 3.11 or later
* Docker/Docker Compose
  * Linux users should follow steps for [non-root usage](https://docs.docker.com/engine/install/linux-postinstall/)

#### Developer Set environment variables

* To override defaults, set them in the terminal or create a dotenv at
**api/app/.env** with for example

```dotenv
DEFAULT_USERNAME=DUMMY
DEFAULT_AGE=21
DEBUG=1
```

### Developer Commands

#### Makefile as the command runner (Unix)

Requires [uv](https://github.com/astral-sh/uv) for faster package installation.

* `make install-dev` - create and install to a virtual env (.venv)
* `make check` - run tests
* `make format` - format files
* `make api` - run api locally

#### Tox as the command runner (hopefully cross-platform)

Requires [tox](https://tox.wiki/en/4.14.1/installation.html).
Optionally [tox-uv](https://github.com/tox-dev/tox-uv) also for faster installs.

* `tox` - install venvs and run tests
* `tox run -e format` - format files
* `tox run -e api` - run api locally

## Running the API in AWS Lambda

We use the [aws-lambda-web-adapter](https://github.com/awslabs/aws-lambda-web-adapter)

### Build Lambda Docker Image

```sh
make build_lambda_api
```

## Other Makefile commands

```text
❯ make help
install                        Install for production
install-dev                    Install for development
clean                          Delete all temporary files
up                             Run hot reloading docker
down                           Bring down docker
build_lambda_api               Build API as AWS Lambda docker image ```
format                         Format files
check                          Check lint
ci                             Run CI
api                            Run API locally
```

## Other Tox commands

```text
❯ .venv/bin/tox --current-env list
default environments:
check  -> Static analysis checks (lint, security, type checking)
test   -> Run tests with pytest
report -> Show test coverage report

additional environments:
format -> Auto-format files
api    -> Run tests with pytest
3.11   -> Run tests with pytest
```
