'use strict';

const fetchProducts = async () => {
  const res = await fetch('/products');
  const products = await res.json();
  return products;
};

const commitToPurchase = dealId => {
  fetch('/purchase?dealId=' + encodeURIComponent(dealId), {
    method: 'POST',
  });
};

const showDeals = () => {
  const dealSection = document.getElementById('deals');
  const dealTemplate = document.getElementById('dealTemplate');
  dealSection.hidden = false;

  if (!!window.EventSource) {
    const source = new EventSource('/deals');

    source.addEventListener('message', event => {
      while (dealSection.firstChild)
        dealSection.removeChild(dealSection.lastChild);
      const data = JSON.parse(event.data);
      data.map(deal => {
        const clone = dealTemplate.content.cloneNode(true);
        clone.querySelector('h3').textContent = deal.product;
        const p = clone.querySelectorAll('p');
        p[0].textContent = `£ ${deal.price}`;
        p[1].textContent = `Number of backers required: ${deal.backersRequired}`;
        p[2].textContent = `Current number of backers: ${deal.currentBackers}`;
        const progress = clone.querySelector('progress');
        progress.max = 100;
        progress.value = deal.progress;
        const button = clone.querySelector('button');
        if (deal.currentBackers == 'Deal Fulfilled') button.disabled = true;
        button.addEventListener('click', () => commitToPurchase(deal.id));
        dealSection.appendChild(clone);
      });
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
};

if ('content' in document.createElement('template')) {
  const productSection = document.getElementById('products');
  const template = document.getElementById('productItem');

  fetchProducts().then(items => {
    items.map(item => {
      const clone = template.content.cloneNode(true);
      const li = clone.querySelector('li');
      li.textContent = item.name;
      li.addEventListener('click', showDeals);
      productSection.appendChild(clone);
    });
  });
}
