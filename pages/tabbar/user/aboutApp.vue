<template>
	<view class="center">
		<view class="about-title">
			<text>about just-check</text>
		</view>
		<view class="about-content">
			<p>本应用收集了各类前端试题，可以在首页上筛选你想看的题目去做，试题以简述和单选形式。</p>
			<p>试题功能是，生成一套选择题供用户去模拟试题，试题不支持简述题形式，分了三种难度，每种难度会根据题目难度，试题数目，以及时限区分。</p>
			<p>本应用注册的用户是保存用户的测验记录，游客模式也可以使用测验功能，但不记录生成报告，如果需要记录，欢迎注册登录</p>
		</view>
		<view class="about-footer">
			<text>github: <a href="https://github.com/lorelei47/justcheck">https://github.com/lorelei47/justcheck</a></text>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.center {
		font-size: 15px;
		padding: 20px 15px;

		.about-title {
			font-size: 25px;
			font-weight: bold;
			margin-bottom: 10px;
			padding-bottom: 5px;
			border-bottom: #AAAAAA 1px solid;
		}

		.about-content {
			padding: 5px;
			border-bottom: #AAAAAA 1px solid;
			border-radius: 5px;
			margin-bottom: 10px;

			p {
				margin-top: 10px;
				text-indent: 2em;
			}
		}

		.about-footer {
			padding: 5px;
		}
	}
</style>
