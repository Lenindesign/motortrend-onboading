# F-Series bracket voting module — design

The "Which F-Series generation is the greatest?" bracket (`BracketVotingV2`) is a **return-visit** feature, not a one-sitting game. It runs on every vehicle page. Editors open one round per week for about four weeks, and the community vote decides who advances. Anyone can vote. Readers who want a reminder when the next round opens sign in to a MotorTrend account and get it by email and in the notifications inbox. After each vote the reader sees the live split and taps **Next**. They can undo until then. Finishing a round shows a recap with the next opening date and a "Remind me" ask. On later page views the module shrinks to a compact strip. Repeat votes are limited on the server. Ties go to the higher seed (the lower seed number, so seed 1 beats seed 14). After the Final, a champion card stays up until the next bracket launches.

## Terms

| Term | Meaning | Avoid |
|---|---|---|
| **Bracket** | The whole 14-generation tournament: rounds of head-to-head matchups ending in one champion. | poll, quiz |
| **Matchup** | One head-to-head pair the reader votes on (e.g. Generation 3 vs Generation 14). | question, card |
| **Round** | A stage of the bracket (Opening round, Quarterfinals, Semifinals, Final). Each is open or scheduled. | step, level |
| **Live split** | The percentage of votes for each side, shown right after the reader votes. | results (reserve for the final reveal) |
| **Final results reveal** | The state shown after a round closes: who advanced and the final split. | |
| **Compact strip** | The one-line version of the module shown to a reader who has already voted on everything in the open round. | banner |

## Why

The module was built as a demo: one person can play every round in one sitting, picks are saved only in their browser, and it renders on every vehicle page regardless of model. This grill was run to pressure-test what the module is for, where it appears, and how voting should behave before it ships.

## Locked decisions

### 1. The goal is return visits (Q1)
**Decision:** The module is judged by return visits. It should bring readers back as each round opens.
- *Time on page (A), rejected:* rewards a one-sitting game and throws away the bracket's main advantage over a one-off poll, which is that it unfolds over time.
- *Sign-ups (C), rejected as the goal:* sign-ups follow from the reminder ask instead (see Q8).
- *Social reach (D), rejected:* sharing is a nice extra, not the success measure, so share taps aren't tracked (Q17).

### 2. Editors open rounds on a fixed schedule; community votes decide who advances (Q4)
**Decision:** Each round opens on a published date set by editors. When it closes, the community vote decides which generation advances.
- *Vote-threshold opening (B), rejected:* unpredictable, so a reminder can't say when to come back.
- *Personal bracket plus scored predictions (C), rejected:* a bigger build (scoring, prediction state), and finishing everything in one visit removes the reason to return.
- Cost accepted: someone has to run the calendar, and readers who arrive mid-bracket can only vote in the round that's open.

### 3. Repeat voting is limited on the server (Q10)
**Decision:** One vote per browser, enforced with an anonymous device ID plus per-IP rate limits on a server endpoint.
- *Browser storage only (A), rejected:* clearing the browser or using a private window gets around it, and a forum thread could swing a matchup.
- *Signed-in votes decide (C), rejected:* would make anonymous voting feel fake and contradicts Q8.
- Cost accepted: needs a server endpoint and tuning so shared IPs (offices, campuses) aren't blocked.

## Routine choices

- **Q2 – Where it shows:** every vehicle page (the current behavior), not just truck pages. The recommendation was pickup-truck pages; the reach of every page was chosen instead.
- **Q3 – After a vote:** show the live split and wait for a **Next matchup** tap. Remove the 2.6s auto-advance (`AUTO_ADVANCE_MS`), which is an accessibility problem.
- **Q5 – Reminder channels:** email, plus the existing notifications inbox (`NotificationInbox.tsx`, built on Novu). No browser push. No separate in-module message was chosen as a channel, but the recap (Q9) and the compact strip (Q12) still show the next opening date.
- **Q6 – When the split shows:** right after voting, plus a final results reveal when the round closes.
- **Q7 – Round length:** one week per round, about 4 weeks total ("new round every Monday").
- **Q8 – Who can vote:** anyone. Reminders need a MotorTrend account; sign-in is asked for at the "Remind me" step.
- **Q9 – After voting on every matchup in the open round:** a recap of the reader's picks with the live split, the date the next round opens, and a "Remind me" button. Replaces today's jump straight into the next round.
- **Q11 – Ties:** the higher seed advances, i.e. the lower seed number (already how `tally()` works, and the data's `tieBreakRule: higher-seed-advances`). Publish the rule in one line.
- **Q12 – Later page views after voting on everything:** a compact strip, e.g. "You've voted · Quarterfinals open Monday · View bracket".
- **Q13 – Changing a vote:** Undo is available until the reader taps Next; after that the vote is locked.
- **Q14 – Readers who missed a round:** show the open round with a one-line summary of who advanced last round (e.g. "Generation 9 knocked out Generation 3 last week") and a "View bracket" link.
- **Q15 – After the Final:** a champion card with full results stays up until the next bracket launches, with "Next bracket coming" and a reminder opt-in.
- **Q16 – Position on the page:** keep the bracket after the photo gallery; move `<PollOfTheDay>` further down so the two voting modules aren't stacked.
- **Q17 – What to measure:**
  - A: votes per matchup and round completion
  - B: "Remind me" taps, plus sign-ups and sign-ins that start there
  - C: return voters (readers who vote in two or more rounds), the success metric
  - D: reminder email and inbox opens, clicks, and the visits they bring back
  - Share taps are not tracked.

## Verified facts (from the codebase)

- `<BracketVotingV2 />` renders unconditionally in `src/pages/VehicleDetails/VehicleDetails.tsx`, right after the photo gallery and directly above `<PollOfTheDay variant="horizontal" />`.
- Bracket data comes from `getAutosUgcBracketPreview()` (`src/data/brackets/f-series-generations.mock.json`). It has 4 rounds: the Opening round is `open`, and the Quarterfinals, Semifinals, and Final are `scheduled`. Generations 1 and 2 have byes into the quarterfinals.
- Picks and round progress are saved in `localStorage` under `motortrend-bracket-demo-v2:<bracket id>`. Nothing is sent to a server.
- After a vote, the component auto-advances after `AUTO_ADVANCE_MS = 2600` ms.
- `tally()` breaks ties in favor of the higher seed (lower seed number).
- Finishing a round shows a recap and then moves to the next round straight away. A champion state exists for the Final.
- The component has a reminder opt-in toggle (`reminderOptIn`) that isn't connected to anything, a share button, and demo controls.
- The app already has `src/components/NotificationInbox.tsx` (Novu) and `src/utils/notificationPreferences.ts`.
- The component sends no analytics events.

## Risks

- **Showing an F-Series bracket on non-truck pages (Q2):** may read as off-topic on, say, a Honda Accord page and lower participation there. Watch votes per vehicle category, and fall back to truck pages if non-truck pages underperform.
- **The account wall for reminders (Q8):** some readers will skip the reminder rather than create an account, which caps return visits. Q17-B shows how big that drop-off is.
- **Running the schedule:** the weekly cadence (Q7) only works if someone opens and closes rounds on time, and reminders announce dates in advance.
- **Shared IPs (Q10):** rate limits that are too tight could block legitimate voters on office or campus networks.
- **The promise of a next bracket (Q15):** the champion card says another bracket is coming; editors have to deliver it.
- **Moving Poll of the Day (Q16):** touches another module's placement; agree it with that module's owner.

## Implementation notes (derived from the decisions)

- Replace the client-only, localStorage-driven round progression with server data: round status and opening dates, vote counts, and the device-ID-checked vote endpoint.
- Remove the auto-advance; add a Next button with Undo next to it.
- New states to design and build: recap with the "Remind me" ask, the compact strip, the summary of who advanced last round, the final results reveal, and the champion card with a "Next bracket coming" opt-in.
- Connect "Remind me" to sign-in, email reminders, and the Novu inbox.
- Hide or remove the demo controls in production.
- Add analytics events for Q17 A–D.

## Deferred

None.

## Open threads

None. Every question was answered without discussion threads.
