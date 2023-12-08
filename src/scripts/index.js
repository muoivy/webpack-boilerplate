import _ from 'lodash';
import '../styles/style.css';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpackd'], ' ');
  element.classList.add('hello');


  return element;
}

document.body.appendChild(component());