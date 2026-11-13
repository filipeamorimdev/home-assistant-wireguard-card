# Contributing

Thanks for helping improve the WireGuard Card! Bug reports, feature ideas and translations are all welcome.

## Adding a translation

Labels live in `wireguard-card.js`, in the `WG_TRANSLATIONS` object at the top of the file.

1. Copy the `en` block and rename it to your [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code (e.g. `it`).
2. Translate every value (keep the keys unchanged).
3. Add the language to `WG_LANG_NAMES`, using its name in that language (e.g. `it: 'Italiano'`).
4. Add a row to the **Languages** table in `README.md`. A translated `README.<code>.md` is a bonus, not a requirement.
5. Open a pull request with a screenshot of the card in your language.

## Reporting bugs

Please use the bug report template and include your Home Assistant version, the card version and, if possible, the sensor's attributes (remove any sensitive data such as public IPs or peer names).

## Code changes

For anything beyond a small fix, please open an issue first so we can agree on the approach.

## Releasing

1. Bump `WG_CARD_VERSION` in `wireguard-card.js` and `DEFAULT_REF` in `src/install.sh` to the new tag (e.g. `v1.2.0`).
2. Push and wait for the **Validate** workflow (HACS + ShellCheck) to pass.
3. Create a full GitHub release (not just a tag) and attach `wireguard-card.js` **and** `src/install.sh`. The README's installer link points at `releases/latest/download/install.sh`.
