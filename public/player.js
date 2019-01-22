
const template = `
<div>
  <loading v-if="isLoading" />

  <div v-else>
    <div v-if="!isGameEnded">
      <p>
        Your are playing in room <span class="tip info">{{game.roomCode}}</span>.
      </p>
      <p>You have <span class="tip danger">{{guessesLeft}}</span> questions remaining.</p>

      <div>
        <p v-if="isLastQuestion">
          Your last question was <span class="tip info">{{lastQuestion.question}}</span>. 
          <br>
          <span v-if="lastQuestionAnswer">The answer was: <span class="tip success">{{lastQuestionAnswer}}</span></span>
          <span v-else>You're awaiting an answer from the host.</span>        
        </p>

        <p v-if="isLastGuess">
          Your last guess was <span class="tip warning">{{lastGuess.guess}}</span>.
          <br>
          <span v-if="lastGuessAnswer">The answer was: <span class="tip success">{{lastGuessAnswer}}</span></span>
          <span v-else>You're awaiting an answer for your last guest from the host.</span>
        </p>

        <button class="success xl" :disabled="isQuestionDisabled" @click.prevent="showQuestion">Ask a Question</button>
        <button class="danger xl" :disabled="isGuessDisabled" @click.prevent="showGuess">Guess the Answer</button>  
      </div>

      <div v-if="isShowQuestion">
        <input v-model="questionText" type="text">
        <button class="success" :disabled="isQuestionDisabled" @click.prevent="askQuestion">Ask</button>
      </div>

      <div v-if="isShowGuess">
        <input v-model="guessText" type="text">
        <button class="success" :disabled="isGuessDisabled" @click.prevent="askGuess">Guess</button>
      </div>
    </div>

    <div v-if="isHostVictory" class="host-victory">
        <p>
            Oops! You were unable to guess the answer correctly.
            <br>
            The answer you were looking for is <span class="tip warn">{{answer}}</span>
        </p>
    </div>

    <div v-if="isPlayerVictory">
        <p>
          Congratulations. You guessed correctly with {{guessesLeft}} guesses remaining.
        </p>
    </div>
  </div>
</div>`;

import { getQueryParams } from './utils.js';
import Loading from './loading.js';

export default {
    template,
    name: 'Player',
    components: {
      Loading
    },
    data() {
      return {
        game: {},
        questionText: '',
        guessText: '',
        lastGuess: undefined,
        lastQuestion: undefined,
        isShowQuestion: false,
        isShowGuess: false
      }
    },
    methods: {
        showQuestion() {
          this.isShowGuess = false;
          this.isShowQuestion = !this.isShowQuestion;
        },
        showGuess() {
          this.isShowQuestion = false;
          this.isShowGuess = !this.isShowGuess;
        },
        async askGuess() {
          try {
            this.lastGuess = await window.client.service('/guesses').create({gameId: this.game._id, guess: this.guessText});
            this.guessText = '';
            this.showGuess();
          } catch (e) {
            console.error(e);
          }
        },
        async askQuestion() {
          try {
            this.lastQuestion = await window.client.service('/questions').create({gameId: this.game._id, question: this.questionText});
            this.questionText = '';
            this.showQuestion();
          } catch (e) {
            console.error(e);
          }
        },
        handleUpdatedGuess(guess) {
          if (guess && guess.gameId == this.game._id){
            this.lastGuess = guess;
          }
        },
        handleUpdatedQuestion(question) {
          if (question && question.gameId == this.game._id){
            this.lastQuestion = question;
          }
        },
        handleGamePatched(game) {
          if (game && game._id === this.game._id) {
            this.game = game;
          }
        }
    },
    computed: {
      isLoading () {
          return !(this.game || this.error);
      },
      guessesLeft () {
        return (this.game.questionsLeft || 0);
      },
      isLastQuestion () {
        return Boolean(this.lastQuestion);
      },
      lastQuestionAnswer() {
        return this.isLastQuestion ? this.lastQuestion.response : ''
      },
      isLastGuess () {
        return Boolean(this.lastGuess);
      },
      lastGuessAnswer() {
        return this.lastGuess ? this.lastGuess.response : ''
      },
      isGameEnded () {
        return this.game && this.game.isFinished;
      },
      isHostVictory () {
        return this.isGameEnded && this.questionsLeft === 0;
      },
      isPlayerVictory () {
        return this.isGameEnded && !this.isHostVictory;
      },
      isQuestionDisabled() {
        return (this.isLastQuestion && !this.lastQuestionAnswer)
      },
      isGuessDisabled() {
        return (this.isLastGuess && !this.lastGuessAnswer)
      }

    },
    async created() {
        // TODO LOADING SPINNER

        const queryParams = getQueryParams();
        const gameId = queryParams['Id'];
        if (!gameId){
            // TODO: ERROR STATE
            return;
        }
        this.game = await window.client.service('/games').get(gameId);
        //TODO ERROR HANDLING
        // NO GAME
        // GAME IS FINISHED

        const guesses = await window.client.service('/guesses').find({query: {
          gameId: gameId,
          $sort: {
            createdAt: -1
          }
        }});
        if (guesses.total > 0) {
          this.lastGuess = guesses.data[0];
        }
        const questions = await window.client.service('/questions').find({query: {
          gameId: gameId,
          $sort: {
            createdAt: -1
          }
        }});
        if (questions.total > 0) {
          this.lastQuestion = questions.data[0];
        }


        window.client.service('questions').on('patched', this.handleUpdatedQuestion);
        window.client.service('guesses').on('patched', this.handleUpdatedGuess);
        window.client.service('games').on('patched', this.handleGamePatched);
    }
};

