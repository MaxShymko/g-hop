build:
	zip -r ghop_$$(jq -r '.version' < manifest.json).zip assets src manifest.json
