import App from './components/App.svelte';

const app = new App({
  target: document.body,
  props: {
    apiURL: 'http://localhost:3000', // TODO: move into env
  }
});

export default app;
