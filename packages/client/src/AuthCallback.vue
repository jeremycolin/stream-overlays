<script>
export default {
  name: "oauth-callback",
  async beforeCreate() {
    console.log("beforeCreate AuthCallback");
    const sessionStorageState = window.sessionStorage.getItem("oauth-state");
    if (!sessionStorageState === null) {
      console.error("Unable to get session storage state");
    }
    const { state, path } = JSON.parse(sessionStorageState);
    const urlState = new URLSearchParams(window.location.search).get("state");

    if (state !== urlState) {
      console.error("State in session storage does not match state in URL, this smells fishy!");
    } else {
      const code = new URLSearchParams(window.location.search).get("code");

      await fetch(`${__SERVER_ENDPOINT__}/oauth-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        mode: "cors",
      });

      // does no matter what happens here, we retry loading the user scene
      this.$router.push(path);
    }
  },
};
</script>

<template></template>
