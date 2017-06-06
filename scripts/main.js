import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../containers/Root.js';

window.onload = function(){
  ReactDOM.render(<Root />, document.getElementById('app'));
}
