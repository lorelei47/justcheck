<template>
	<view>
		<cu-custom bgColor="topTitle">
			<block slot="content">试题</block>
		</cu-custom>
		<view></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">

</style>
