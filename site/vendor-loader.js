(() => {
  const assetBase = new URL("assets/vendor/", document.currentScript.src);
  const globals = { d3: "d3", hls: "Hls" };
  const pending = new Map();

  window.ParliamentStreamsVendor = {
    load(name) {
      const globalName = globals[name];
      const asset = window.PARLIAMENT_STREAMS_VENDOR?.[name];
      if (!globalName || !asset) return Promise.reject(new Error("The local media or map library is unavailable."));
      if (window[globalName]) return Promise.resolve();
      if (pending.has(name)) return pending.get(name);

      const script = document.createElement("script");
      const url = new URL(asset.file, assetBase);
      url.searchParams.set("v", asset.sha256);
      script.src = url.href;
      const promise = new Promise((resolve, reject) => {
        script.onload = () => window[globalName]
          ? resolve()
          : reject(new Error("The local media or map library did not initialize."));
        script.onerror = () => reject(new Error("Unable to load the local media or map library."));
        document.head.append(script);
      }).catch((error) => {
        pending.delete(name);
        script.remove();
        throw error;
      });
      pending.set(name, promise);
      return promise;
    },
  };
})();
