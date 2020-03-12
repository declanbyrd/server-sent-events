'use strict';

if (!!window.EventSource) {
  const source = new EventSource('/countdown');

  source.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    const dataElement = document.getElementById('data');
    const progress = document.querySelector('progress');
    dataElement.textContent = data.countdown;
    const progressValue = data.progress;
    progress.value = progressValue;
  });

  source.addEventListener('open', event => {
    const stateElement = document.getElementById('state');
    stateElement.textContent = 'Connected';
  });

  source.addEventListener('error', event => {
    const stateElement = document.getElementById('state');
    if (event.eventPhase == EventSource.CLOSED) {
      source.close();
    }
    if (event.target.readyState == EventSource.CLOSED) {
      stateElement.textContent = 'Disconnected';
    }
    if (event.target.readyState == EventSource.CONNECTING) {
      stateElement.textContent = 'Connecting...';
    }
  });
} else {
  console.log('Your browser does not support server sent events');
}
