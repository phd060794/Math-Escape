// Math Escape - game.js

let shuffledQuestions = [];
let currentIndex = 0;

// 문제 순서 섞기
function shuffleQuestions(array) {
  const copiedArray = [...array];

  for (let i = copiedArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[randomIndex]] = [
      copiedArray[randomIndex],
      copiedArray[i],
    ];
  }

  return copiedArray;
}

// 정답 비교를 위한 정리
function normalizeAnswer(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}

// 띄어쓰기 없이도 비교하기 위한 정리
function removeSpaces(value) {
  return normalizeAnswer(value).replace(/\s/g, "");
}

// 게임 화면 만들기
function renderGameLayout() {
  const gameArea = document.getElementById("gameArea");

  gameArea.innerHTML = `
    <div class="game-card">
      <div class="top-info">
        <span id="progress"></span>
        <span id="room"></span>
      </div>

      <h1 id="title"></h1>

      <img id="questionImage" class="question-image" alt="문제 이미지">

      <section class="concept-box">
        <h2>개념 보기</h2>
        <p id="concept"></p>
      </section>

      <section class="question-box">
        <h2>문제</h2>
        <p id="question"></p>
      </section>

      <button id="hintBtn" type="button">힌트 보기</button>

      <div id="hintBox" class="hint-box" style="display: none;">
        <h2>힌트</h2>
        <p id="hint"></p>
      </div>

      <div class="answer-box">
        <input id="answerInput" type="text" placeholder="정답을 입력하세요">
        <button id="submitBtn" type="button">확인</button>
      </div>

      <p id="message"></p>
    </div>
  `;

  document.getElementById("submitBtn").addEventListener("click", checkAnswer);
  document.getElementById("hintBtn").addEventListener("click", showHint);

  document.getElementById("answerInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
}

// 게임 시작
function startGame() {
  const introCard = document.getElementById("introCard");
  const gameArea = document.getElementById("gameArea");

  introCard.classList.add("hidden");
  gameArea.classList.remove("hidden");

  if (!window.questions || window.questions.length === 0) {
    gameArea.innerHTML =
      "<p>문제 데이터가 없습니다. questions.js 파일을 먼저 확인하세요.</p>";
    return;
  }

  shuffledQuestions = shuffleQuestions(window.questions);
  currentIndex = 0;

  renderGameLayout();
  loadQuestion();
}

// 현재 문제 불러오기
function loadQuestion() {
  const q = shuffledQuestions[currentIndex];

  document.getElementById("progress").textContent =
    `${currentIndex + 1} / ${shuffledQuestions.length}`;

  document.getElementById("room").textContent = q.room;
  document.getElementById("title").textContent = q.title;
  document.getElementById("concept").textContent = q.concept;
  document.getElementById("question").textContent = q.question;
  document.getElementById("hint").textContent = q.hint;

  document.getElementById("hintBox").style.display = "none";
  document.getElementById("answerInput").value = "";
  document.getElementById("message").textContent = "";

  const questionImage = document.getElementById("questionImage");

  if (q.image) {
    questionImage.src = q.image;
    questionImage.style.display = "block";
  } else {
    questionImage.removeAttribute("src");
    questionImage.style.display = "none";
  }

  document.getElementById("answerInput").focus();
}

// 정답 확인
function checkAnswer() {
  const q = shuffledQuestions[currentIndex];

  const userAnswer = document.getElementById("answerInput").value;
  const correctAnswer = q.answer;

  const isCorrect =
    normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer) ||
    removeSpaces(userAnswer) === removeSpaces(correctAnswer);

  if (isCorrect) {
    document.getElementById("message").textContent =
      "정답입니다! 다음 문으로 이동합니다.";

    setTimeout(function () {
      currentIndex++;

      if (currentIndex < shuffledQuestions.length) {
        loadQuestion();
      } else {
        showEnding();
      }
    }, 800);
  } else {
    document.getElementById("message").textContent =
      "아직 문이 열리지 않았습니다. 다시 생각해보세요.";
  }
}

// 힌트 보기
function showHint() {
  document.getElementById("hintBox").style.display = "block";
}

// 마지막 화면
function showEnding() {
  const gameArea = document.getElementById("gameArea");

  gameArea.innerHTML = `
    <div class="game-card ending-card">
      <h1>탈출 성공!</h1>
      <p>모든 수학 암호를 해결했습니다.</p>
      <p>수학문화관의 비밀 문이 열렸습니다.</p>
      <button id="restartBtn" type="button">다시 도전하기</button>
    </div>
  `;

  document.getElementById("restartBtn").addEventListener("click", startGame);
}

// 페이지가 열리면 게임 시작
document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("startBtn");

  startBtn.addEventListener("click", function () {
    startGame();
  });
});