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

function showWords(words) {
  let that = this;
  this.currentRoundWords = shuffle(words);
  for (let i = 0; i < words.length; i++) {
    setTimeout(showWord, 1000 * i, that, words[i]);
  }
  setTimeout(() => { showWord(that, ''); this.testIsActive = true }, 6000);
  if (this.roundsPassed < this.maxRounds) this.roundsPassed++;
}

function addRoundResult(word) {
  if (this.currentTestResult.includes(word)) return;
  this.currentTestResult.push(word);
  if (this.currentTestResult.length == this.currentRoundWords.length) {
    console.log('round finished');
    this.testIsActive = !this.testIsActive;
    this.experimentData.push(this.currentTestResult);
    this.currentTestResult = [];
    // TODO: save data
    return;
  }
}

export default {
  name: 'App',
  data() {
    return {
      words: [],
      currentRoundWords: [],
      wordToShow: '',
      maxRounds: 1,
      roundsPassed: 0,
      testIsActive: false,
      currentTestResult: [],
      experimentData: [],
    }
  },
  created() {
    const getWords = 'http://localhost:3000';
    fetch(getWords)
      .then(response => response.json())
      .then(response => {
        this.words = response.data;
        this.maxRounds = response.data.length;
      })
  },
  methods: {
    showWords,
    addRoundResult,
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
      <button @click="showWords(words[roundsPassed])">Start</button>
    </div>

    <div class="test" id="test" v-if="testIsActive">
      <p class="test-question">Click one by one on the words in the order they were presented:</p>
      <div class="test__item" v-for="word in currentRoundWords" :key="word" @click="addRoundResult(word)">
        <p class="word">{{word.toUpperCase()}}</p>
        <p class="selected-number">
          {{ currentTestResult.find((item, index) => item == word) ? currentTestResult.findIndex((item, index) => item == word) + 1 :
          '' }}
        </p>
      </div>
    </div>

    <div v-if="wordToShow == '' && roundsPassed == maxRounds">
      Thank you for participating! I didn't save any data yet, but I will in the future.
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
  width: 600px;
  text-align: left;
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
