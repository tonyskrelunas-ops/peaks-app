# Ancestral Peaks — the app

An installable web app (PWA). No app store, no review, no fee.
Long-form guided sound for the gym, the road, and the dark morning.

## Adding a session

1. Drop the file in `audio/` (mp3, 96–128 kbps mono is plenty for voice and drone).
2. Add an entry to `sessions.json`:

```json
{
  "id": "short-slug",
  "title": "The Long Road",
  "subtitle": "For driving. Minimal voice, mostly song.",
  "depth": 1,
  "minutes": 45,
  "file": "audio/long-road.mp3",
  "note": "One line on what it is for."
}
```

`depth` controls who can reach it:
1 = The Door · 2 = The Fire · 3 = The Crossing · 4 = The Council

3. Commit and push. Live in about a minute.

## What it already does

- Plays with the screen off and on the lock screen (Media Session API), so it
  survives a pocket, a treadmill and CarPlay.
- Remembers where you stopped in each session and resumes there.
- **Save** downloads a session for offline, so a 45 minute track never
  restreams on cellular.
- Works with no signal once installed.
- The breath gate on entry; depth earned by sittings over time, kept in the
  visitor's own browser.

## The placeholder audio

`audio/*.mp3` are a 20 second generated tone, there only so the player can be
tested. Replace them.


## The gates

`gates.json` holds what each level asks before it opens. Edit the questions there.

| Level | Account | Rounds | Asks |
|---|---|---|---|
| The Door | no | 5 | one sentence |
| The Fire | no | 7 | three things to sit with |
| The Crossing | **yes** | 7 | four, answered over time |
| The Council | **yes** | 7 | three, about carrying for others |

Your door deepens as you do. Whatever depth you have reached is the gate you
pass through on your next visit, so the ask grows with the practice.

Answers are kept in the visitor's own browser and shown back to them next time,
so the writing accumulates into a record they own. Nothing is scored and nothing
is sent anywhere.

The Crossing and The Council show an account wall. Accounts are not built — that
is deliberate. Nobody has practiced long enough to need one yet.

## Notes

- `noindex` is set in `index.html`. Remove that line when you want to be found.
- Bump the cache names in `sw.js` (`ap-shell-v1`) after a big change, or
  returning visitors keep the old version.
