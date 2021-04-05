<template>
	<view class="cu-modal" :class="modalName=='msgModal'?'show':''">
		<view class="cu-dialog">
			<view class="cu-bar bg-white justify-end">
				<view class="content">{{modalContent.msg}}</view>
				<view class="action" @tap="hideModal">
					<text class="cuIcon-close text-red"></text>
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
			showModal(e) {
				this.modalName = this.modalContent.modalName;
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style>
</style>
