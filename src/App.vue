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

  // Create experiment data for this round
  this.experimentData[`round${this.roundsPassed + 1}`] = {
    words: this.words[this.roundsPassed],
    answers: [],
    time: [],
  };

  // Shuffle words for this round
  this.currentRoundWords = shuffle(words);

  // Show words
  for (let i = 0; i < words.length; i++) {
    setTimeout(showWord, 1000 * i, that, words[i]);
  }

  // Show test when all words are shown
  setTimeout(() => { showWord(that, ''); this.testIsActive = true; this.currentTestStartTime = new Date().getTime(); }, 1000 * this.wordsPerRound);

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
    this.experimentData[`round${this.roundsPassed}`].userData = this.userData;
    // reset current test results for the next round
    this.currentTestResult = [];
    this.currentTestTime = [];
    return;
  }
}

function nextStep() {
  this.showStepOne = !this.showStepOne;
  this.showStepTwo = !this.showStepTwo;
}

function saveData() {
  const api = 'https://upf-experiment.ignat.co.uk/save';
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

function generateApiUrl() {
  const baseApi = 'https://upf-experiment.ignat.co.uk/generateExperiment';
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const wordsPerRound = params.wordsPerRound || 6;
  const rounds = params.rounds || 30;
  if (wordsPerRound != 6) this.wordsPerRound = wordsPerRound;

  const resultApi = `${baseApi}?wordsPerRound=${wordsPerRound}&rounds=${rounds}`;
  return resultApi;
}

function saveFormData() {
  const data = this.userData;
  function isFieldExist(field) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      return true;
    }
    return false;
  }

  if (
    !isFieldExist('name')
    && !isFieldExist('email')
    && !isFieldExist('age')
    && !isFieldExist('gender')
    && !isFieldExist('langLvl')
    && !isFieldExist('eduLvl')
  ) {
    alert('Please fill in all fields');
    return;
  }
  this.showForm = false;
}

export default {
  name: 'App',
  data() {
    return {
      words: [],
      maxRounds: 1,
      wordsPerRound: 6,
      roundsPassed: 0,
      currentRoundWords: [],
      wordToShow: '',
      testIsActive: false,
      currentTestStartTime: 0,
      currentTestResult: [],
      currentTestTime: [],
      userData: {
        gender: "",
        langLvl: "",
        eduLvl: "",
      },
      experimentData: {},
      isExperimentFinished: false,
      showForm: true,
      showStepOne: true,
      showStepTwo: false,
    }
  },
  created() {
    const getWords = this.generateApiUrl();
    fetch(getWords)
      .then(response => response.json())
      .then(response => {
        this.words = response.data;
        this.maxRounds = response.data.length;
      })
  },
  methods: {
    generateApiUrl,
    startNewRound,
    addRoundResult,
    saveData,
    saveFormData,
    nextStep,
  },
}
</script>


<template>
  <div class="initial-form" v-if="showForm">
    <div class="consent-text step1" v-if="showStepOne">
      <h2>Welcome to our experiment!</h2>
      <p>We are three students enrolled in the CSIM master at the Universitat Pompeu Fabra in Barcelona. We have to
        carry out a study as a homework assignment for the subject Research Methodologies in Humanities and Sciences. In
        the following pages we will ask you to complete a series of word orders. You may choose to stop answering them
        at any time and the data from incomplete questionnaires will not be used.</p>
      <p>We would like to inform you that the recipients of the data will only be the students in question, and they
        will not transfer this data to any entity, except to the tutors of the project, if absolutely necessary.
        Likewise, the data will be anonymous at all times.</p>
      <p>We understand that if you continue with the questionnaire from this point you accept these conditions and give
        your consent.</p>
      <p>If you have questions about the project you can contact us through any of the following emails:</p>
      <ul>
        <li>Ignat Smirnov: <a href="mailto:ignat.smirnov01@estudiant.upf.edu">ignat.smirnov01@estudiant.upf.edu</a></li>
        <li>Cansu Ak: <a href="mailto:cansu.ak01@estudiant.upf.edu">cansu.ak01@estudiant.upf.edu</a></li>
        <li>Ivan Zaitsev: <a href="mailto:ivan.zaitsev01@estudiant.upf.edu">ivan.zaitsev01@estudiant.upf.edu</a></li>
      </ul>
      <button class="btn-submit" type="button" @click.prevent="nextStep()">
        Accept and continue
      </button>
    </div>

    <div class="step2" v-if="showStepTwo">
      <form>
        <h2>First, tell us about yourself:</h2>
        <input type="text" name="name" id="name" placeholder="Name" class="form-input"
          v-model="userData.name">
        <input type="email" name="email" id="email" placeholder="Email" class="form-input"
          v-model="userData.email">
        <input type="number" name="age" id="age" placeholder="Age" class="form-input" v-model="userData.age">
        <select name="gender" id="gender" class="form-select" placeholder="Gender" required
          v-model="userData.gender">
          <option value="" disabled selected>Gender</option>
          <option value="m">Male</option>
          <option value="f">Female</option>
          <option value="o">Other</option>
          <option value="n">I don't want to share</option>
        </select>
        <select name="languageLevel" id="languageLevel" class="form-select" required
          placeholder="English language level" v-model="userData.langLvl">
          <option value="" disabled selected>English language level</option>
          <option value="a1">A1 (beginner)</option>
          <option value="a2">A2 (elementary)</option>
          <option value="b1">B1 (intermediate)</option>
          <option value="b2">B2 (upper intermediate)</option>
          <option value="c1">C1 (advanced)</option>
          <option value="c2">C2 (proficient)</option>
          <option value="fluent">Fluent</option>
        </select>
        <select name="educationLevel" id="educationLevel" class="form-select" placeholder="Education level"
          required v-model="userData.eduLvl">
          <option value="" disabled selected>Select Education level</option>
          <option value="bachelor">Bachelor</option>
          <option value="master">Master</option>
          <option value="phd">PhD</option>
        </select>
        <button class="btn-submit" type="button" @click.prevent="saveFormData()">
          Submit form and start the experiment
        </button>
      </form>
    </div>
  </div>

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
      <p class="experiment-description" v-if="!isExperimentFinished">Thank you for participating! I didn't save any data
        yet, but I will in the future. Click the button below to save your answers.</p>
      <button @click="saveData" v-if="!isExperimentFinished">Finish experiment</button>
      <p class="experiment-description" v-if="isExperimentFinished">You can now close this window</p>
    </div>
  </div>
</template>

<style>
.initial-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.initial-form h2 {
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.form-input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 420px;
  max-width: 100%;
  font-size: 16px;
  border: 1px solid rgba(60, 60, 60, 0.26);
  ;
  border-radius: 5px;
  box-sizing: border-box;
}

.form-select {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 420px;
  max-width: 100%;
  border: 1px solid rgba(60, 60, 60, 0.26);
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
}

.form-select:required:invalid {
  color: #666;
}

option[value=""][disabled] {
  display: none;
}

option {
  color: #000;
}

.btn-submit {
  display: block;
  width: 100%;
  margin: 0 auto;
  max-width: 100%;
}

.consent-text {
  margin: 0 auto;
  width: 640px;
  max-width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.consent-text button {
  margin-top: 32px;
}

.consent-text p,
.consent-text ul {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

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
  padding: 12px 24px;
  font-size: 16px;
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
