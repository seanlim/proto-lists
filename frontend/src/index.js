import App from './components/App.svelte';
import dotenv from 'dotenv';
dotenv.config();

const app = new App({
  target: document.body,
  props: {
    apiURL: process.env.API_URL,
  },
});

export default app;
