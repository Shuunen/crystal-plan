<template>
  <div class="background" />
</template>

<style>
@keyframes bg-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes bg-zoom {
  0%,
  100% {
    background-position: 0 0;
  }
  30% {
    background-position: 20px 0px;
  }
  60% {
    background-position: 40px 40px;
  }
}
.section {
  position: relative;
}
.section.bottom {
  /*background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/light-veneer.png");
    background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/geometry2.png");
    background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/geometry2.png");*/
  background: linear-gradient(40deg, #fff, #ffe8d4);
  background-size: 400% 400%;
  animation: bg-gradient 20s ease infinite;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: inset 0px -12px 50px 0px #ddd;
  /* animation: bg-gradient 30s ease infinite;
  background-color: linear-gradient(270deg, #fdfdfd, #feffc5);
  background-size: 400%; */
  animation: bg-zoom 20s ease infinite;
  background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/sayagata-400px.png");
  background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/confectionary.png");
}
</style>
