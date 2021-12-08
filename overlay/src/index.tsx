import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/player.css';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  //</React.StrictMode>,
  document.getElementById('root'),
);
