<script>
function showWord(context, word) {
  context.currentWord = word;
}
function showWords(words) {
  let that = this;
  for (let i = 0; i < words.length; i++) {
    setTimeout(showWord, 1000 * i, that, words[i]);
  }
  setTimeout(showWord, 6000, that, "");
}
export default {
  name: 'App',
  data() {
    return {
      words: [],
      currentWord: '',
    }
  },
  created() {
    const getWords = 'http://localhost:3000';
    fetch(getWords)
      .then(response => response.json())
      .then(response => {
        this.words = response.data;
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

    <div class="btn-wrapper">
      <button @click="showWords(words[0])">Start</button>
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
