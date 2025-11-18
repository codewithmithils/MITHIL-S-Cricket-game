// simple cricket game JS (student style)

/* state */
let team1 = { runs: 0, wickets: 0, balls: 0 };
let team2 = { runs: 0, wickets: 0, balls: 0 };

const ballsPerOver = 6;
let maxOvers = 5; // default, will read from select

/* dom elements */
const team1ScoreEl = document.getElementById('team1-score');
const team2ScoreEl = document.getElementById('team2-score');
const team1WkEl = document.getElementById('team1-wickets');
const team2WkEl = document.getElementById('team2-wickets');
const team1OversEl = document.getElementById('team1-overs');
const team2OversEl = document.getElementById('team2-overs');

const commentaryText = document.getElementById('commentary-text');
const commentaryBox = document.getElementById('commentary');

const hitBtn = document.getElementById('hit-button');
const bowlBtn = document.getElementById('bowl-button');

/* optional reset at top if exists (some HTML versions had reset) */
const resetBtn = document.getElementById('reset-button');
const oversSelect = document.getElementById('overs-select');

/* simple helper to show overs as O.B */
function formatOvers(totalBalls) {
  const o = Math.floor(totalBalls / ballsPerOver);
  const b = totalBalls % ballsPerOver;
  return o + "." + b;
}

/* update the screen */
function updateUI() {
  team1ScoreEl.textContent = team1.runs;
  team2ScoreEl.textContent = team2.runs;
  team1WkEl.textContent = team1.wickets;
  team2WkEl.textContent = team2.wickets;

  if (team1OversEl) team1OversEl.textContent = formatOvers(team1.balls);
  if (team2OversEl) team2OversEl.textContent = formatOvers(team2.balls);
}

/* add a line of commentary */
function pushComment(text) {
  // update main commentary text
  if (commentaryText) commentaryText.textContent = text;
  // add small line above
  const d = document.createElement('div');
  d.textContent = (new Date()).toLocaleTimeString() + " - " + text;
  // put newest on top
  if (commentaryBox) commentaryBox.prepend(d);
}

/* pick runs randomly 1-6 */
function randomRuns() {
  return Math.floor(Math.random() * 6) + 1;
}

/* simple wicket chance */
function isWicket() {
  // 15% chance
  return Math.random() < 0.15;
}

/* check if innings over by overs or wickets */
function inningsDone(team) {
  const totalBallsAllowed = maxOvers * ballsPerOver;
  return team.wickets >= 10 || team.balls >= totalBallsAllowed;
}

/* check if match ended (both innings done or someone finished) */
function checkEnd() {
  const t1done = inningsDone(team1);
  const t2done = inningsDone(team2);

  if (t1done && t2done) {
    // decide winner
    if (team1.runs > team2.runs) {
      pushComment("Team 1 wins by " + (team1.runs - team2.runs) + " runs.");
    } else if (team2.runs > team1.runs) {
      pushComment("Team 2 wins by " + (team2.runs - team1.runs) + " runs.");
    } else {
      pushComment("Match tied: " + team1.runs + "-" + team2.runs);
    }
    // disable buttons
    hitBtn.disabled = true;
    bowlBtn.disabled = true;
  }
}

/* handle Hit: Team1 bats */
function handleHit() {
  if (inningsDone(team1) || inningsDone(team2)) {
    checkEnd();
    return;
  }

  team1.balls++;
  if (isWicket()) {
    team1.wickets++;
    pushComment("Team 1: WICKET!");
  } else {
    const r = randomRuns();
    team1.runs += r;
    pushComment("Team 1 scored " + r + " run" + (r > 1 ? "s" : ""));
  }

  updateUI();
  checkEnd();
}

/* handle Bowl: Team2 bats */
function handleBowl() {
  if (inningsDone(team1) || inningsDone(team2)) {
    checkEnd();
    return;
  }

  team2.balls++;
  if (isWicket()) {
    team2.wickets++;
    pushComment("Team 2: WICKET!");
  } else {
    const r = randomRuns();
    team2.runs += r;
    pushComment("Team 2 scored " + r + " run" + (r > 1 ? "s" : ""));
  }

  updateUI();
  checkEnd();
}

/* reset game */
function resetGame() {
  team1 = { runs: 0, wickets: 0, balls: 0 };
  team2 = { runs: 0, wickets: 0, balls: 0 };
  // read overs select if available
  if (oversSelect) {
    maxOvers = parseInt(oversSelect.value, 10) || 5;
  } else {
    maxOvers = 5;
  }
  hitBtn.disabled = false;
  bowlBtn.disabled = false;
  // clear commentary list (keep the main p if exists)
  if (commentaryBox) {
    commentaryBox.innerHTML = '<p id="commentary-text">Game starts now!</p>';
  }
  updateUI();
  pushComment("Game reset. Overs: " + maxOvers);
}

/* attach events */
if (hitBtn) hitBtn.addEventListener('click', handleHit);
if (bowlBtn) bowlBtn.addEventListener('click', handleBowl);
if (resetBtn) resetBtn.addEventListener('click', resetGame);
if (oversSelect) {
  // change overs only allowed before play
  oversSelect.addEventListener('change', function () {
    const anyBalls = team1.balls + team2.balls;
    if (anyBalls > 0) {
      // revert change
      oversSelect.value = maxOvers;
      pushComment("Cannot change overs mid-game. Reset to change.");
    } else {
      maxOvers = parseInt(oversSelect.value, 10) || 5;
      pushComment("Overs set to " + maxOvers);
    }
  });
}

/* initial UI */
if (oversSelect) maxOvers = parseInt(oversSelect.value) || 5;
updateUI();
pushComment("Ready. Overs: " + maxOvers + ". Press Hit or Bowl.");
