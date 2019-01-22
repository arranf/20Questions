import Start from './start.js'
import Host from './host.js'
import Player from './player.js'

const routes = {
  "/": Start,
  "/host": Host,
  '/player': Player
};

import {initializeClient} from './utils.js';

export default {
    name: 'Router',
    data() {
        return {
            path: ''
        };
    },
    computed: {
        routeComponent() {
            return routes[this.path];
        }
    },
    methods: {
        getPath() {
            let path = decodeURI(window.location.pathname);
            const finalIndex = path.length - 1;
            if (finalIndex > 0 && path[finalIndex] === '/') {
                path = path.substring(0, finalIndex);
            }
            return path;
        }
    },
    render(h) {
        return h(this.routeComponent);
    },
    created() {
        this.path = this.getPath();
        window.addEventListener('popstate', e => {
            this.path = this.getPath();
        });
        if (!window.client) {
            initializeClient();
        }
    }
};