export function addToPixiLoader(app, name, url) {
  app.loader.add({ name: name, url: url });

  return new Promise((resolve) => {
    app.loader.load(() => resolve());
  });
}

// return a random number within a range
export function random(min, max) {
  return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
export function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}
