const template = `
<div>
    <h1>Welcome to 20 Questions</h1>
    
    <div class="m-b-one m-l-one">
        <span v-if="error" class="tip danger">{{error}}</span>
    </div>

    <button class="info xl" @click.prevent="showCreatingGame">Start a Game</button>
    <button class="warning xl" @click.prevent="showJoiningGame">Join a Game</button>

    <div class="m-l-one" v-if="creatingGame">
        <p>Let's set up a game. What should the word you guess be?</p>
        <input v-model="guessWord" :class="guessWordInputClasses" type="text" />
        <button class="success" @click.prevent="startGame">Start</button>
    </div>
    
    <div class="m-l-one" v-if="joiningGame">
        <p>Let's join a game. What's the room code?</p>
        <input v-model="roomCode" :class="roomCodeInputClasses" pattern=".{7,7}" required type="text" />
        <button class="success" @click.prevent="joinGame">Join</button>
    </div>
</div>`;

import {pushState} from './utils.js';

export default {
    template,
    name: 'Start',
    data() {
      return {
        creatingGame: false,
        joiningGame: false,
        guessWord: '',
        roomCode: '',
        roomCodeError: false,
        guessWordError: false,
        error: ''
      }
    },
    computed: {
        guessWordInputClasses() {
            return {'input-error': this.guessWordError}
        },
        roomCodeInputClasses() {
            return {'input-error': this.roomCodeError}
        },
    },
    methods: {
        showCreatingGame() {
            this.joiningGame = false;
            this.creatingGame = !this.creatingGame;
        },
        showJoiningGame() {
            this.creatingGame = false;
            this.joiningGame = !this.joiningGame;
        },
        async startGame() {
            if (this.guessWord.length < 1) {
                this.guessWordError = true;
                return;
            }

            const game = await window.client.service('/games')
                .create({word: this.guessWord});
            const path = `host?Id=${game._id}`;
            pushState(path);
        },
        async joinGame () {
            if (this.roomCode.length < 1) {
                this.roomCodeError = true;
                return;
            } else {
                this.roomCodeError = false;
                this.error = '';
            }

            const handleError = (e) => {
                if (e) {console.error(e);}
                this.error = `Game with room code ${this.roomCode} not found`;
            }

            try {
                const results = await window.client.service('/games')
                    .find({query: {roomCode: this.roomCode.trim(), isFinished: false}});
                
                if (!(results.length || results.total )) {
                    handleError();
                    return;
                }

                const game = results.data[0];

                const path = `player?Id=${game._id}`;
                pushState(path);
            } catch (e) {
                handleError(e);
            }
        }
    }
  };