# DNA Example Web App

<!-- TOC -->
* [DNA Example Web App](#dna-example-web-app)
  * [Local Run entire app with Docker Compose](#local-run-entire-app-with-docker-compose)
  * [Stop the Local Run entire app with Docker Compose](#stop-the-local-run-entire-app-with-docker-compose)
  * [Add unit tests to PR with Jenkins](#add-unit-tests-to-pr-with-jenkins)
  * [Auto generate API interface from backend](#auto-generate-api-interface-from-backend)
<!-- TOC -->

**Note:** This is a live template.

* See the deployed website at <https://www.stage.example-web-app.dna.tri.global>
* See the api at <https://www.stage.example-web-app.dna.tri.global/api_docs>

## Local Run entire app with Docker Compose

```bash
docker compose build && docker compose watch
```

See UI at  <http://localhost:3000/>
See the Swagger API UI at [http://localhost:8080/api_docs](http://localhost:8080/api_docs)

## Stop the Local Run entire app with Docker Compose

```bash
docker compose down
```

## Add unit tests to PR with Jenkins

* We can gate the PR with unit [tests](tests).
* Follow IE's instructions to set it up. (Note that we already have the required files in step 4-6)
<https://toyotaresearchinstitute.atlassian.net/wiki/spaces/IE/pages/2185789489/How+to+add+a+unit+test+pipeline+to+repositories>
* This contains the Dockerfile used to create a container which will run the
unit tests on Jenkins to gate PRs.
* To build and run locally:

    ```bash
    docker build -t tests-devcontainer .devcontainer
    docker run --rm -u 1000:1000 -w /tmp/workspace -v $PWD:/tmp/workspace -it \
      tests-devcontainer /bin/sh -c "ls && git config --global --add safe.directory /tmp/workspace && sh tests"
    ```

## Auto generate API interface from backend

```bash
docker compose run --rm generate_openapi_client
```
