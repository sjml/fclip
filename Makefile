fclip: fclip.ts deno.lock deno.json
	deno compile --allow-sys --allow-env --allow-read --allow-run ./fclip.ts

.PHONY: install
install: fclip
	rsync -u -t -p fclip ~/.local/bin/fclip
