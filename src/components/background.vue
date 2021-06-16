<template>
  <div class="background" />
</template>

<script>
export default {}
</script>

<style>
@keyframes bg-gradient {
  0% { background-position: 0 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@keyframes bg-zoom {
  0%,  100% { background-position: 0 0; }
  30% { background-position: 20px 0; }
  60% { background-position: 40px 40px; }
}

.section {
  position: relative;
}

.section.bottom {
  animation: bg-gradient 20s ease infinite;
  background: linear-gradient(40deg, #fff, #ffe8d4);
  background-size: 400% 400%;
}

.background {
  animation: bg-zoom 20s ease infinite;
  background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/sayagata-400px.png");
  background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/confectionary.png");
  bottom: 0;
  box-shadow: inset 0 -12px 50px 0 #ddd;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
