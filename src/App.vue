<template>
  <div class="website-header" @click="$router.push('/')">
    <h1> Wordie </h1>
  </div>
  <router-view />
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
html, body {
  margin: 0;
  height: 100%;
  background-color: #1c1c1c;
  overflow: hidden;
  touch-action: none;
}

body {
  margin-right: auto;
  margin-left: auto;
  display: flex;
  max-width: 35rem;
}

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.website-header {
  color: white;
  border-bottom: solid 1px white;
  padding-top: 0.25rem;
  line-height: 0;
}
</style>
