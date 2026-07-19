1:
	@read -p "Commit message: " msg; \
	git add .; \
	git commit -m "$$msg"; \

2:
	git push
