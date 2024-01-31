

all: run-cs

run-cs:
	vi-node cs.js

run-gen-coins: install
	vi-node gen-coins.mjs

run-index: install
	vi-node index.mjs

install:
	test -d node_modules || npm install
