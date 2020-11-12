<template>
    <div>
        <div class="flex items-center justify-center flex-col text-white absolute inset-0 w-full h-full bg-black bg-opacity-50 z-10">
            <div class="loader text-xl">
                <div class="inner one absolute w-full h-full box-border"></div>
                <div class="inner two absolute w-full h-full box-border"></div>
                <div class="inner three absolute w-full h-full box-border"></div>
            </div>
            <p class="mt-2 text-lg">Loading</p>
        </div>
    </div>
</template>

<script lang="ts">
export default {
  
}
</script>

<style scoped>
.loader {
	width: 64px;
	height: 64px;
	border-radius: 50%;
	perspective: 800px;
}
.inner.one {
	left: 0%;
	top: 0%;
	animation: rotate-one 2s linear infinite;
	border-bottom: 3px solid #EFEFFA;
}
.inner.two {
	right: 0%;
	top: 0%;
	animation: rotate-two 2s linear infinite;
	border-right: 3px solid #EFEFFA;
}
.inner.three {
	right: 0%;
	bottom: 0%;
	animation: rotate-three 2s linear infinite;
	border-top: 3px solid #EFEFFA;
}
.inner {
	border-radius: 50%;
}
@keyframes rotate-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes rotate-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}
</style>