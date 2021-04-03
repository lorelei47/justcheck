### 开发日志

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

> day11 (20210321)
- 增加试题倒计时

> day12 (20210322)
- tips: encodeURIComponent()在编码的时候对带有%的字符串需要进行replace(/%/g,'%25')处理，否则会报异常
- Q1: 在异步函数uniCloud.callFunction中直接使用this.XX无法赋值。
- A1: 此时this指代的是异步函数，需要在异步函数前赋值vue的this到变量中。

> day13 (20210323)
- 增加试题页面，父级组件与子组件数据通信
- tips: 子组件传值回父级组件，可通过以下方式
```html
//父级组件
<examination-detail :questionDetail="getQuestionDetail"
	@examinationDetailValue="getExaminationDetailValue" :key="examinationDetailKey">
</examination-detail>
//用@examinationDetailValue绑定父级method里面的getExaminationDetailValue

//子组件通过method设置传值
this.$emit("examinationDetailValue",this.examinationDetailValue);
```

> day14 (20210326)
- 1.增加了试题页面tab
- 2.试题完成后提交。
- Q1: vuex的使用，什么类型的数据需要用在vuex，比如试题页面的生成试题的questionList。1.答题使用，提交使用，答题完显示reprot使用。
- Q2: vuex的module模式下的引用如...mapState等，如何区分属于哪个module下的state。
- A2: [modules后半页的命名简化](https://vuex.vuejs.org/zh/guide/modules.html)

> day15 (20210327)
- 1.保存用户测验作答记录。获取作答记录列表
- 2.增加测验报告弹窗，查看详细作答记录
- tips: 浅谈vue中fn()与fn: {}

> day16 (20210328)
- 测验模块功能实现
- Q1: 本日难点在于，mongodb的数组字段元素为对象的关联查询。
```json
{
	id: 1234,
	list: [
		{a: 1,b: 2},
		{a: 2,b: 3}
	]
}
在该文档中，a外键，关联另一个文档的主键。
```

> day17 (20210330)
- 增加随机一题功能

> day18 (20210331)
- 增加搜索查询

> day19 (20210401)
- 修复部分代码在微信小程序上不兼容问题

> day20 (20210402)
- 组件刷新渲染可以使用this.$nextTick()
- watch的深度监听编译成微信小程序时不可用（踩坑）
- 测试微信端样式兼容

> day21 (20210403)
- 增加意见反馈