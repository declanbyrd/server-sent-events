const countdown = (res, count) => {
  const data = {
    countdown: count,
    progress: 100 - count,
  };
  res.write(`data: ${JSON.stringify(data)} \n\n`);
  if (count) setTimeout(() => countdown(res, count - 1), 1000);
  else res.end();
};

module.exports = countdown;
