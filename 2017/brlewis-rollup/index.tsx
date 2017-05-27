import m from 'mithril';
import stream from 'mithril/stream';

class Hello {
    view(vnode) {
        const store = vnode.attrs.store;
        return <h1>Hello {store.who()}!</h1>;
    }
}

class ChangeName {
    view(vnode) {
        const store = vnode.attrs.store;
        return <p>Your name: <input onchange={event => store.who(event.target.value)} value={store.who()} /></p>;
    }
}

function MainStore() {
    this.who = stream();
}

function NameCountStore(mainStore) {
    let count = 0;
    this.counter = mainStore.who.map(() => ++count);
}

class NameCount {
    view(vnode) {
        const store = vnode.attrs.store;
        return <p>Count of names you have had: {store.counter()}</p>;
    }
}

function NameCountCommentaryStore(nameCountStore) {
    const comments = ['',
                    'Way to be consistent!',
                    'That\'s how many moons Mars has.',
                    'That\'s how many sides a triangle has.',
                    'That\'s a typical number of beats in a measure of music.',
                    'Jackson 5 was a great band.'];

    this.comment = nameCountStore.counter.map(count =>
        (count > comments.length) ? 'That\'s a lot of names!' :
            comments[count]);
}

class NameCountCommentary {
    view(vnode) {
        const store = vnode.attrs.store;
        return <p>{store.comment()}</p>;
    }
}

/*
 * Up to this point everything's been a reusable store or Mithril
 * component. Now it's time to tie it all together into an app. We
 * instantiate a single dispatcher and use tie it to our stores.
 */ 

const mainStore = new MainStore();
const nameCountStore = new NameCountStore(mainStore);
const nameCountCommentaryStore =
    new NameCountCommentaryStore(nameCountStore);
mainStore.who('World');

/*
 * Now the main Mithril component connects individual components to
 * their stores. Look at JSX documentation to understand the
 * syntax. If you decide you don't like JSX don't worry, it's easy
 * not to use it. The Mithril documentation eschews it.
 */

class Main {
    view() {
        return <div>
                 <Hello store={mainStore} />
                 <ChangeName store={mainStore} />
                 <NameCount store={nameCountStore} />
                 <NameCountCommentary store={nameCountCommentaryStore} />
               </div>;
    }
}

/*
 * Finally we start our Mithril app.
 */
console.log('starting...');
m.mount(document.getElementById('app'), Main)