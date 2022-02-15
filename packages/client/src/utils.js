export function addToPixiLoader(app, url) {
  app.loader.add({ name: "Font From Google", url: url });

  return new Promise((resolve) => {
    app.loader.load(() => resolve());
  });
}
