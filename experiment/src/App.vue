<script>
function showWord(context, word) {
  context.currentWord = word;
}
function showWords(words) {
  let that = this;
  for (let i = 0; i < words.length; i++) {
    setTimeout(showWord, 100 * i, that, words[i]);
  }
  setTimeout(showWord, 600, that, "");
  if (this.roundsPassed < this.maxRounds) this.roundsPassed++;
}
export default {
  name: 'App',
  data() {
    return {
      words: [],
      currentWord: '',
      maxRounds: 1,
      roundsPassed: 0,
    }
  },
  created() {
    const getWords = 'http://localhost:3000';
    fetch(getWords)
      .then(response => response.json())
      .then(response => {
        this.words = response.data.slice(0, 3);
        // this.maxRounds = response.data.length;
        this.maxRounds = 3;
      })
  },
  methods: {
    showWords,
  }
}
</script>


<template>
  <div class="content">
    <p>{{currentWord?.toUpperCase()}}</p>

    <div class="btn-wrapper" :style="{display: currentWord == '' && roundsPassed < maxRounds ? 'block' : 'none'}">
      <button @click="showWords(words[roundsPassed])">{{ roundsPassed > 0 ? 'Continue' : 'Start' }}</button>
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
</style>
