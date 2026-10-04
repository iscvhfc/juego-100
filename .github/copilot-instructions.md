# Repository Instructions

## Project Context
- Static reveal.js app (bundled in `vendor/reveal`, no CDN) for a "100 Mexicanos Dijeron" tournament: 7 teams, winner-stays format with random draws, 3 questions per match (6 matches), each question shows 3 answers whose points are revealed when a team picks one.
- Files: `index.html`, `preguntas.js` (teams, 18 questions + 3 reserve), `app.js` (slide generation, draw and scoring), `styles.css`.
- `memori100.md` records the project instructions and changes; update it whenever rules, structure or data change.

## Working Conventions
- Keep changes focused on the requested behavior and avoid introducing unrelated files or dependencies.
- No build step: open `index.html` in a browser to validate changes.
- Edit questions and team names only in `preguntas.js`.
- Do not overwrite or remove user changes that are outside the requested scope.
