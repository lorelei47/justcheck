# justcheck
exam check

> day1（20210305）
- 创建底部选项卡

> day2 (20210306)
- 移植新闻列表demo模板
- 列表一直无法加载，methods中数据转载方法断点进不去（Q1）
- Q1：模板中tab页面数据转载是因为列表模板的上级组件调用了methods的数据转载方法，而移植过来后没有主动在加载时执行导致没进方法的断点。

> day3 (20210307)
- 移植个人中心样式

> day4 (20210309)
- 接入uni-id登录模块

> day5 (20210310)
- 创建用户与问题数据表结构

> day6 (20210311)
- 从云函数获取题目表数据文档

> day7 (20210315)
- 列表样式

> day8 (20210316)
- 题目页面样式与通信处理
- Q1：关于在flex布局下，两个行内元素怎么按照顺序排列，第二个行内元素无法换行到第二行。

> day9 (20210318)
- 场景: 给v-for列表每个item添加事件，并且点击对应item时更改该item的class，其他item保持原样。
- 解决方法：在需要更改class的标签绑定class,赋与computed计算。传入v-for时的index
```html
<text :class="fn(index)">
```
- 在data处设置浮标i，并且在computed中令需要更改显示的class值作index == this.i判断 ，当点击某个item时，赋予浮标i item的值下标值，此时computed中下标值与浮标i的值相同的项才会触发需要更改的class
```
//html
<view class="question-answer-option-item" @click="toAnswer(index)" v-for="(item, index) in list"
	:key="item.choice_code">
	<text :class="questionAnswerOptionClass(index)">{{item.choice_code}}</text>
</view>

//script
data() {
	return {
		clickOptionTrue: -1,
		clickOptionfalse: -1,
	}
},
computed: {
	questionAnswerOptionClass: function(index) {
		return function(index) {
			return {
				'question-answer-option-code': this.clickOptionTrue != index && this.clickOptionfalse != index,
				'question-answer-option-true': this.clickOptionTrue == index,
				'question-answer-option-false': this.clickOptionfalse == index,
			}
		}
	}
}
methods: {
	toAnswer(e) {
		this.clickOptionTrue = e;
	}
}
```
- computed中需要才用return一个闭包函数才能进行传参，否则会保绑定class的computed不是一个function。

> day10 (20210320)
-  试题页面难度选项