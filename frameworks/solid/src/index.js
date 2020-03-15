import { createRoot } from 'solid-js';

import App from './App';
import { Debug } from './Debug';

//createRoot(() => document.getElementById('root').appendChild(<App/>));
createRoot(() => document.getElementById('root').appendChild(<Debug/>));
