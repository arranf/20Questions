export const pushState = (path) => {
    history.pushState(null, null, decodeURIComponent(path));
    // To make our hacky router work, popstate doesn't normally trigger on pushState()
    window.dispatchEvent(new Event('popstate'));
}

export const initializeClient = () => {
    const socket = io();
    window.client = feathers();
    window.client.configure(feathers.socketio(socket));
}

export const getQueryParams = () => {
    // Horrid one liner from https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
    const search = window.location.search.substring(1);
    return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}