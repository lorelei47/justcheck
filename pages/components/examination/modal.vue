<template>
	<view class="cu-modal" :class="modalName=='modal1'?'show':''">
		<view class="cu-dialog">
			<view class="cu-bar bg-white justify-end">
				<view class="content">{{modalContent.name}}</view>
				<view class="action" @tap="hideModal">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view class="padding-xl">{{modalContent.explain}}</view>
			<view class="cu-bar bg-white justify-end">
				<view class="action">
					<button class="cu-btn bg-green" @tap="hideModal">确定</button>
					<button class="cu-btn line-green text-green margin-left" @tap="hideModal">取消</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			modalContent: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		data() {
			return {
				modalName: null,
			}
		},
		methods: {
			showModal(item, e) {
				this.modalName = e.currentTarget.dataset.target;
				this.modalContent = item;
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style>
</style>
