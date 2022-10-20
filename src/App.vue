<script>
function shuffle(array) {
  let newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function showWord(context, word) {
  context.wordToShow = word;
}

function startNewRound(words) {
  let that = this;
  // Shuffle words for this round
  this.currentRoundWords = shuffle(words);

  // Create experiment data for this round
  this.experimentData[`round${this.roundsPassed + 1}`] = {
    words: this.currentRoundWords,
    answers: [],
    time: [],
  };

  // Show words
  for (let i = 0; i < words.length; i++) {
    setTimeout(showWord, 1000 * i, that, words[i]);
  }

  // Show test when all words are shown
  setTimeout(() => { showWord(that, ''); this.testIsActive = true; this.currentTestStartTime = new Date().getTime(); }, 6000);

  // Round counter when the round is over
  if (this.roundsPassed < this.maxRounds) this.roundsPassed++;
}

function addRoundResult(word) {
  // if the word is already in the array, don't add it again
  if (this.currentTestResult.includes(word)) return;

  // calculate decision time and restart timer
  let time = new Date().getTime();
  let decisionTime = (time - this.currentTestStartTime) / 1000;

  // add data for the current step
  this.currentTestResult.push(word);
  this.currentTestTime.push(decisionTime);

  // reset timer
  this.currentTestStartTime = time;

  // if all words are answered
  if (this.currentTestResult.length == this.currentRoundWords.length) {
    this.testIsActive = !this.testIsActive;
    // save current test results
    this.experimentData[`round${this.roundsPassed}`].answers = this.currentTestResult.slice();
    this.experimentData[`round${this.roundsPassed}`].time = this.currentTestTime.slice();
    // reset current test results for the next round
    this.currentTestResult = [];
    this.currentTestTime = [];
    return;
  }
}

function saveData(){
  const api = '/save';
  const data = this.experimentData;
  fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  this.isExperimentFinished = true;
}

function generateApiUrl(){
  const baseApi = '/generateExperiment';
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const wordsPerRound = params.wordsPerRound || 6;
  const rounds = params.rounds || 30;
  const resultApi = `${baseApi}?wordsPerRound=${wordsPerRound}&rounds=${rounds}`;
  return resultApi;
}

export default {
  name: 'App',
  data() {
    return {
      words: [],
      maxRounds: 1,
      roundsPassed: 0,
      currentRoundWords: [],
      wordToShow: '',
      testIsActive: false,
      currentTestStartTime: 0,
      currentTestResult: [],
      currentTestTime: [],
      experimentData: {},
      isExperimentFinished: false,
    }
  },
  created() {
    const getWords = generateApiUrl();
    fetch(getWords)
      .then(response => response.json())
      .then(response => {
        this.words = response.data;
        this.maxRounds = response.data.length;
      })
  },
  methods: {
    startNewRound,
    addRoundResult,
    saveData,
  },
}
</script>


<template>
  <div class="content">
    <p>{{wordToShow?.toUpperCase()}}</p>

    <div class="btn-wrapper" v-if="wordToShow == '' && roundsPassed < maxRounds && !testIsActive">
      <div v-if="roundsPassed == 0">
        <p class="experiment-description">
          Hello there!<br />You know, I'm something of a scientist myself. So let's do some
          experiments!<br />{{maxRounds}} rounds left.
        </p>
      </div>
      <div v-else>
        <p class="experiment-description">
          Round {{roundsPassed + 1}} from {{maxRounds}}!<br />Ready?
        </p>
      </div>
      <button @click="startNewRound(words[roundsPassed])">Start</button>
    </div>

    <div class="test" id="test" v-if="testIsActive">
      <p class="test-question">Click one by one on the words in the order they were presented:</p>
      <div class="test__item" v-for="word in currentRoundWords" :key="word" @click="addRoundResult(word)">
        <p class="word">{{word.toUpperCase()}}</p>
        <p class="selected-number">
          {{ currentTestResult.find((item, index) => item == word) ? currentTestResult.findIndex((item, index) => item
          == word) + 1 :
          '' }}
        </p>
      </div>
    </div>

    <div v-if="wordToShow == '' && roundsPassed == maxRounds && !testIsActive">
      <p class="experiment-description" v-if="!isExperimentFinished">Thank you for participating! I didn't save any data yet, but I will in the future. Click the button below to save your answers.</p>
      <button @click="saveData" v-if="!isExperimentFinished">Finish experiment</button>
      <p class="experiment-description" v-if="isExperimentFinished">You can now close this window</p>
    </div>
  </div>
</template>

<style>
.content {
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  text-align: center;
}

.experiment-description {
  font-size: 18px;
  line-height: 140%;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background-color: rgb(0, 145, 255);
  color: #fff;
  cursor: pointer;
}

.test {
  padding: 0 10px;
  width: 600px;
  max-width: 100%;
  text-align: left;
  box-sizing: border-box;
}

.test__item {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 4px 0;
}

.test__item:hover {
  background-color: #eee;
}

.test__item p {
  line-height: 100% !important;
}
</style>
