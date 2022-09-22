<template>
  <view class="container">
    <view class="intro">首页</view>
    	<swiper class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
					<image :src="item.src" />
				</swiper-item>
			</swiper>
   
  {{system.loadNumber}}
	<button
		hover-class="button-hover"
		@click="system.addLoadNumber()"
	>
		调用pinia
	</button>

	<navigator
		url="/subpages/subTest/subTest"
		animation-duration='300'	open-type="navigate"
		hover-class="navigator-hover"
	>	
	<button>跳转分包</button>
	</navigator>

  </view>
</template>

<script setup lang="ts">
import { getGoodsList } from '@/api/test';
import { systemStore } from '@/stores/system';
import { onMounted } from 'vue';
const swiperChange =()=>{

}
onMounted(() => {
	getGoodsList()
})
const system = systemStore();
const carouselList = [{
		src: "/static/banner3.jpg",
		background: "rgb(203, 87, 60)",
	},
	{
		src: "/static/banner2.jpg",
		background: "rgb(205, 215, 218)",
	},
	{
		src: "/static/banner1.jpg",
		background: "rgb(183, 73, 69)",
	}
]
</script>

<style>
.container {
  padding: 20px;
  font-size: 14px;
  line-height: 24px;
}
</style>
