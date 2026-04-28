MSG ?= Update

deploy:
	git add -A
	git commit -m "$(MSG)"
	git push

.PHONY: deploy
