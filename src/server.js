import Server from 'socket.io';

export default function startServer(store) {
    const io = new Server().attach(8090);

    // subscribe a listener to the store that reads the current state,
    // turns it into a JS object,
    // and emits it as a state event on the server.

    store.subscribe(

        // publishing whole state isn't always a good idea
        // could instead send diffs, snapshots, subsets
        () => io.emit('state', store.getState().toJS())
    );

    // clients will immediately receive current state, when they connect
    io.on('connection', (socket) => {
        socket.emit('state', store.getState().toJS());

        // clients will emit an action that is feed directly into redux store
        socket.on('action', store.dispatch.bind(store));
    });
}
