exports.generateList = () => {
  const list = [];
  for (let count = 0; count < 4; count++) {
    const required = Math.floor(Math.random() * (100 - 10) + 10);
    const current = Math.floor(Math.random() * (required - 1 - 5) + 5);
    const object = {
      id: count,
      product: 'Toothbrush',
      price: Math.floor(Math.random() * (20 - 10) + 10),
      backersRequired: required,
      currentBackers: current,
      progress: (current / required) * 100,
    };
    list.push(object);
  }
  return list;
};

exports.products = [
  {
    id: 001,
    name: 'Toothbrush',
  },
];
