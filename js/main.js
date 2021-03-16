'use strict';
const holes = document.querySelectorAll('.holes .hole');
const field = document.querySelector('.holes');
const gameTimes = document.querySelector('.game__time');
const gameScore = document.querySelector('.score');
const startButton = document.querySelector('.game__startBtn');
const refreshButton = document.querySelector('.refresh__btn');
const popup = document.querySelector('.popup');
const popupMsg = document.querySelector('.popup__message');

const GAME_DURATION = 20;
const MOLE_COUNT = 10;

let lastHole = 0;
let sec = undefined;
let started = false;
let score = 0;
let time;

startButton.addEventListener('click', () => {
  if (started) {
    gameStop();
  } else {
    gameStart();
  }
});

refreshButton.addEventListener('click', function () {
  gameStart();
  test();
});

field.addEventListener('click', onMoleClick);

function onMoleClick(event) {
  if (!started) {
    return;
  }

  const target = event.target;

  if (target.matches('.up')) {
    target.classList.remove('up');
    score++;
    scoreBoard();

    if (score === MOLE_COUNT) {
      stopGameTimer();
      finallyGame(true);
      return;
    }
    sec === 0 && finallyGame(false);
  }
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min)) + 1;
}

function randomNumber(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const holeNumber = holes[idx];

  if (holeNumber === lastHole) {
    return randomNumber(holes);
  }
  lastHole = holeNumber;
  return holeNumber;
}

function gameStart() {
  score = 0;
  started = true;
  startGameTimer();
  showStopButton();
  initGame();
  showScoreFooter();
}

function gameStop() {
  started = false;
  stopGameTimer();
  removeMole();
  hideStopButton();
  showPopUpWithText('REPLAY ❔');
}
function finallyGame(win) {
  showPopUpWithText(win ? `YOU WIN 💝 \n SCORE : ${score}` : 'Faill 💢 HaHa!!');
}
function initGame() {
  gameScore.innerText = `${score}/ ${MOLE_COUNT}`;
  const ranTime = randomTime(500, 2500);
  const hole = randomNumber(holes);
  hole.classList.add('up');
  time = setTimeout(() => {
    hole.classList.remove('up');
    if (sec < 0) {
      removeMole();
      clearTimeout(time);
    } else {
      initGame();
    }
  }, ranTime);
}

// timer connection
function startGameTimer() {
  let remianingTime = GAME_DURATION;
  updateTime(remianingTime);
  sec = setInterval(() => {
    if (remianingTime <= 0) {
      clearInterval(sec);
      clearTimeout(time);
      removeMole();
      finallyGame();
      return;
    }
    updateTime(--remianingTime);
  }, 1000);
}

function updateTime(time) {
  const min = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimes.innerText = `${min}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function removeMole() {
  holes.forEach((items) => {
    items.classList.remove('up');
  });
}

function showStopButton() {
  const icon = document.querySelector('.game__startBtn > img');
  icon.setAttribute('src', 'images/pause.svg');
}
function showPopUpWithText(text) {
  popup.classList.remove('hide__popup');
  popupMsg.innerText = `${text}`;
}
function showScoreFooter() {
  const scoreFooter = document.querySelector('.footer');
  scoreFooter.style.visibility = 'visible';
}
function test() {
  popup.classList.add('hide__popup');
  startButton.style.visibility = 'visible';
}
function hideStopButton() {
  startButton.style.visibility = 'hidden';
}

function scoreBoard() {
  gameScore.innerText = `${score}/ ${MOLE_COUNT}`;
}
function stopGameTimer() {
  clearInterval(sec);
  clearTimeout(time);
}
