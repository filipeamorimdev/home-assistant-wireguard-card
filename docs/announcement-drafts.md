# Announcement drafts

Ready-to-paste posts. Attach `assets/wireguard-card.gif` (or `assets/card.png`) to each.
Repo: https://github.com/filipeamorimdev/home-assistant-wireguard-card

## Home Assistant Community forum
Category: Share your Projects → Dashboards & Frontend

**Title:** WireGuard Card — see which VPN peers are connected, right on your dashboard

I wanted to see who's connected to my WireGuard VPN without SSH-ing in to run `wg show`, so I built a Lovelace card for it.

- Colour-coded online/offline status per peer
- Endpoint, allowed IPs, last handshake and rx/tx transfer
- Built-in visual editor — no YAML needed
- Translated into English, Português, Español, Français and Deutsch
- Works with plain WireGuard: a small Python script (included) exposes `wg show` as JSON and a standard REST sensor feeds the card. No add-on or integration required.

Repo + setup guide: <link>

Feedback, bug reports and translation PRs are very welcome!

## Reddit — r/homeassistant
Flair: Dashboards / Show & Tell

**Title:** I built a Lovelace card that shows my WireGuard peers' status (online/offline, handshake, transfer)

<GIF>

Works with vanilla WireGuard via a tiny Python script + REST sensor, has a visual editor and 5 languages. Repo: <link>. Happy to take feature requests!

## Reddit — r/WireGuard
**Title:** Dashboard card for monitoring WireGuard peers in Home Assistant

Short version of the above; lead with the `wg show` → JSON script, since that's what this audience cares about. Mention the security note (the sample script has no auth — bind it to LAN/127.0.0.1).

## Home Assistant Discord
Channel: #share-your-projects (or #frontend)

Built a WireGuard status card for Lovelace (visual editor, 5 languages, no YAML). Screenshot attached. Repo: <link> — feedback welcome!
