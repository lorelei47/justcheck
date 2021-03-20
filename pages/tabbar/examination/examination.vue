<template>
	<view class="center">
		<cu-custom bgColor="topTitle">
			<block slot="content">试题</block>
		</cu-custom>
		<view v-if="!isBegin" class="exam-choice" :style="[{marginTop: -CustomBar + 'px'}]">
			<view v-for="(item, index) in questionDifficulty" :key="index">
				<button @click="toBegin(item)" class="choice-button" type="primary">{{item.name}}</button>
			</view>
		</view>
		<view v-if="isBegin" class="exam-question">
			开始
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				isBegin: false,
				examDiff: null,
				questionDifficulty: [{
					code: 'easy',
					name: '简单'
				}, {
					code: 'normal',
					name: '普通'
				}, {
					code: 'difficult',
					name: '困难'
				}]
			};
		},
		methods: {
			toBegin(item) {
				this.isBegin = true;
				this.examDiff = item.code;
			}
		}
	}
</script>

<style lang="scss">
	.center{
		display: flex;
		flex-direction: column;
		.exam-choice{
			width: 100vw;
			justify-content: space-around;
			align-items: center;
			.choice-button {
				margin-top: 60px;
				margin-bottom: 20px;
				height: 40px;
				width: 100px;
				line-height: 40px;
				text-align: center;
				border: #0FAEFF 1px solid;
			}
		}
		.exam-question{
			
		}
	}
</style>
