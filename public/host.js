
const template = `
<div>
  <loading v-if="isLoading" />

  <div v-else>
    <div v-if="!isGameEnded">
      <p>
        You are the host of this game. Players can join using the code <span class="tip info">{{game.roomCode}}</span>.
        <br>
        The player is trying to guess <span class="tip warning">{{answer}}</span>.
      </p>
      <p>They have <span class="tip warning">{{guessesLeft}}</span> questions remaining.</p>

      <div v-if="isCurrentQuestion">
        <p class="m-b-quarter">
          Their current question is <span class="tip info">{{currentQuestion.question}}</span>. What's the answer?
        </p>

        <button class="success" @click.prevent="updateQuestion(true)">Yes</button>
        <button class="danger" @click.prevent="updateQuestion(false)">No</button>
      </div>

      <div v-if="isCurrentGuess">
          <p>Their current guess is <span class="tip success">{{currentGuess.guess}}</span>. Is it correct?</p>

          <button class="success" @click.prevent="updateGuess(true)">Yes. What a guess!</button>
          <button class="danger" @click.prevent="updateGuess(false)">No. Not correct this time.</button>
      </div>

      <div v-if="!(isCurrentGuess || isCurrentQuestion)">
        <p>Waiting for the player to send a question or guess.</p>
      </div>
    </div>

    <div v-if="isHostVictory" class="host-victory">
      Congratulations. They were unable to guess {{answer}} correctly.
    </div>

    <div v-if="isPlayerVictory" class="host-loss">
      The other player guessed correctly with {{guessesLeft}} guesses remaining.
    </div>
  </div>
</div>`;

import { getQueryParams } from './utils.js';
import Loading from './loading.js';

export default {
    template,
    name: 'Host',
    components: {
      Loading
    },
    data() {
      return {
        game: {},
        error: '',
        currentGuess: undefined,
        currentQuestion: undefined
      }
    },
    methods: {
      updateGuess(isCorrect) {
        try {
          this.currentGuess.response = isCorrect;
          window.client.service('guesses').patch(this.currentGuess._id, {response: this.currentGuess.response});
          this.currentGuess = undefined;
        } catch (e) {
          console.error(e);
          // TODO HANDLE BETTER
        }
      },
      updateQuestion(isCorrect) {
        try {
          this.currentQuestion.response = isCorrect;
          window.client.service('questions').patch(this.currentQuestion._id, {response: this.currentQuestion.response});
          this.currentQuestion = undefined;
        } catch (e) {
          console.error(e);
          // TODO HANDLE BETTER
        }
      },
      handleNewGuess(guess) {
        if (guess && guess.gameId == this.game._id){
          this.currentGuess = guess;
        }
      },
      handleNewQuestion(question) {
        if (question && question.gameId == this.game._id){
          this.currentQuestion = question;
        }
      },
      handleGamePatch(game) {
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
      answer () {
        return this.game.word || ''; 
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
      isCurrentGuess () {
        return this.currentGuess && !this.currentGuess.response;
      },
      isCurrentQuestion() {
        return this.currentQuestion && !this.currentQuestion.response;
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
        this.game = await window.client.service('games').get(gameId);
        // TODO ERROR
        // FINISHED GAME
        // NO GAME
        
        const guesses = await window.client.service('guesses').find({query: {
          gameId: gameId,
          $sort: {
            createdAt: -1
          }
        }});
        if (guesses.total > 0) {
          this.currentGuess = guesses.data[0];
        }

        const questions = await window.client.service('questions').find({query: {
          gameId: gameId,
          $sort: {
            createdAt: -1
          }
        }});
        if (questions.total > 0) {
          this.currentQuestion = questions.data[0];
        }

        window.client.service('questions').on('created', this.handleNewQuestion);
        window.client.service('guesses').on('created', this.handleNewGuess);
        window.client.service('games').on('patched', this.handleGamePatch);
    }
};

