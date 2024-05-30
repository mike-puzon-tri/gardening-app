# ensures uv only installs to the intended environment, even if some other venv was already activated
VIRTUAL_ENV=
CONDA_PREFIX=

# based on https://github.com/duarteocarmo/boilerplate
.PHONY: install clean check format

## Install for production
install:
	echo ">> Installing dependencies"
	ls .venv || uv venv --seed
	uv pip install -e .

## Install for development
install-dev: install
	uv pip install -e ".[dev]"

## Delete all temporary files
clean:
	rm -rf __pycache__
	rm -rf **/__pycache__

## Run hot reloading docker
up: down
	docker compose build && docker compose watch

## Bring down docker
down:
	docker compose down

## Build API as AWS Lambda docker image
build_lambda_api:
	docker build -t api_lambda .

## Format files
format:
	.venv/bin/tox --current-env -e format

## Check lint
check:
	.venv/bin/tox --current-env

## Run CI
ci: install-dev check

## Run API locally
api:
	.venv/bin/tox --current-env -e api


# Inspired by <http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html>
# sed script explained:
# /^##/:
# 	* save line in hold space
# 	* purge line
# 	* Loop:
# 		* append newline + line to hold space
# 		* go to next line
# 		* if line starts with doc comment, strip comment character off and loop
# 	* remove target prerequisites
# 	* append hold space (+ newline) to line
# 	* replace newline plus comments by `---`
# 	* print line
# Separate expressions are necessary because labels cannot be delimited by
# semicolon; see <http://stackoverflow.com/a/11799865/1968>
.PHONY: help
help:
	@echo "$$(tput bold)Available commands:$$(tput sgr0)"
	@sed -n -e "/^## / { \
		h; \
		s/.*//; \
		:doc" \
		-e "H; \
		n; \
		s/^## //; \
		t doc" \
		-e "s/:.*//; \
		G; \
		s/\\n## /---/; \
		s/\\n/ /g; \
		p; \
	}" ${MAKEFILE_LIST} \
	| awk -F '---' \
		-v ncol=$$(tput cols) \
		-v indent=30 \
		-v col_on="$$(tput setaf 6)" \
		-v col_off="$$(tput sgr0)" \
	'{ \
		printf "%s%*s%s ", col_on, -indent, $$1, col_off; \
		n = split($$2, words, " "); \
		line_length = ncol - indent; \
		for (i = 1; i <= n; i++) { \
			line_length -= length(words[i]) + 1; \
			if (line_length <= 0) { \
				line_length = ncol - indent - length(words[i]) - 1; \
				printf "\n%*s ", -indent, " "; \
			} \
			printf "%s ", words[i]; \
		} \
		printf "\n"; \
	}' \
	| more $(shell test $(shell uname) = Darwin && echo '--no-init --raw-control-chars')
