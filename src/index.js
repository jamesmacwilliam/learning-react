import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App txt="foo"/>, document.getElementById('root'));
registerServiceWorker();
