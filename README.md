# justcheck
exam check

> day1��20210305��
- �����ײ�ѡ�

> day2 (20210306)
- ��ֲ�����б�demoģ��
- �б�һֱ�޷����أ�methods������ת�ط����ϵ����ȥ��Q1��
- Q1��ģ����tabҳ������ת������Ϊ�б�ģ����ϼ����������methods������ת�ط���������ֲ������û�������ڼ���ʱִ�е���û�������Ķϵ㡣

> day3 (20210307)
- ��ֲ����������ʽ

> day4 (20210309)
- ����uni-id��¼ģ��

> day5 (20210310)
- �����û����������ݱ�ṹ

> day6 (20210311)
- ���ƺ�����ȡ��Ŀ�������ĵ�

> day7 (20210315)
- �б���ʽ

> day8 (20210316)
- ��Ŀҳ����ʽ��ͨ�Ŵ���
- Q1��������flex�����£���������Ԫ����ô����˳�����У��ڶ�������Ԫ���޷����е��ڶ��С�

> day9 (20210318)
- ����: ��v-for�б�ÿ��item����¼������ҵ����Ӧitemʱ���ĸ�item��class������item����ԭ����
- �������������Ҫ����class�ı�ǩ��class,����computed���㡣����v-forʱ��index
```html
<text :class="fn(index)">
```
- ��data�����ø���i��������computed������Ҫ������ʾ��classֵ��index == this.i�ж� �������ĳ��itemʱ�����踡��i item��ֵ�±�ֵ����ʱcomputed���±�ֵ�븡��i��ֵ��ͬ����Żᴥ����Ҫ���ĵ�class
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
- computed����Ҫ����returnһ���հ��������ܽ��д��Σ�����ᱣ��class��computed����һ��function��

> day10 (20210320)
-  ����ҳ���Ѷ�ѡ��

> day11 (20210321)
- �������⵹��ʱ

> day12 (20210322)
- tips: encodeURIComponent()�ڱ����ʱ��Դ���%���ַ�����Ҫ����replace(/%/g,'%25')��������ᱨ�쳣
- Q1: ���첽����uniCloud.callFunction��ֱ��ʹ��this.XX�޷���ֵ��
- A1: ��ʱthisָ�������첽��������Ҫ���첽����ǰ��ֵvue��this�������С�

> day13 (20210323)
- ��������ҳ�棬������������������ͨ��
- tips: �������ֵ�ظ����������ͨ�����·�ʽ
```html
//�������
<examination-detail :questionDetail="getQuestionDetail"
	@examinationDetailValue="getExaminationDetailValue" :key="examinationDetailKey">
</examination-detail>
//��@examinationDetailValue�󶨸���method�����getExaminationDetailValue

//�����ͨ��method���ô�ֵ
this.$emit("examinationDetailValue",this.examinationDetailValue);
```

> day14 (20210326)
- 1.����������ҳ��tab
- 2.������ɺ��ύ��
- Q1: vuex��ʹ�ã�ʲô���͵�������Ҫ����vuex����������ҳ������������questionList��1.����ʹ�ã��ύʹ�ã���������ʾreprotʹ�á�
- Q2: vuex��moduleģʽ�µ�������...mapState�ȣ�������������ĸ�module�µ�state��
- A2: todo