<template>
  <div class="bar">
    <div :id="id"></div>
  </div>
</template>

<script>
import G2 from '@antv/g2/build/g2';

var data = [{
  date: '2018/8/1',
  type: 'total',
  value: 4623
}, {
  date: '2018/8/1',
  type: 'error',
  value: 10
}, {
  date: '2018/8/1',
  type: 'timeout',
  value: 182
}, {
  date: '2018/8/2',
  type: 'total',
  value: 6145
}, {
  date: '2018/8/2',
  type: 'error',
  value: 2016
}, {
  date: '2018/8/2',
  type: 'timeout',
  value: 257
}, {
  date: '2018/8/3',
  type: 'total',
  value: 508
}, {
  date: '2018/8/3',
  type: 'error',
  value: 12
}, {
  date: '2018/8/3',
  type: 'timeout',
  value: 289
}, {
  date: '2018/8/4',
  type: 'total',
  value: 6268
}, {
  date: '2018/8/4',
  type: 'error',
  value: 309
}, {
  date: '2018/8/4',
  type: 'timeout',
  value: 428
}, {
  date: '2018/8/5',
  type: 'total',
  value: 6411
}, {
  date: '2018/8/5',
  type: 'error',
  value: 80
}, {
  date: '2018/8/5',
  type: 'timeout',
  value: 619
}, {
  date: '2018/8/6',
  type: 'total',
  value: 1890
}, {
  date: '2018/8/6',
  type: 'error',
  value: 0
}, {
  date: '2018/8/6',
  type: 'timeout',
  value: 87
}];


export default {
  name: 'Bar',
  props: ['title', 'id'],
  data() {
    return {}
  },
  mounted() {
    var chart = new G2.Chart({
      container: this.id,
      forceFit: true,
      height: 330,
      padding: [80, 35, 30, 50] // 上右下左
    });
    chart.source(data);
    chart.tooltip({
      follow: false,
      crosshairs: 'y',
      htmlContent: function htmlContent(title, items) {
        var alias = {
          total: '当日累计调用次数',
          error: '当日累计失败次数',
          timeout: '当日累计超时次数'
        };
        var html = '<div class="custom-tooltip">';
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var color = item.color;
          var name = alias[item.name];
          var value = item.value;
          var domHead = '<div class="custom-tooltip-item" style="border-left-color:' + color + '">';
          var domName = '<div class="custom-tooltip-item-name">' + name + '</div>';
          var domValue = '<div class="custom-tooltip-item-value">' + value + '</div>';
          var domTail = '</div>';
          html += domHead + domName + domValue + domTail;
        }
        return html + '</div>';
      }
    });
    chart.axis('date', {
      label: {
        textStyle: {
          fill: '#aaaaaa'
        }
      }
    });
    chart.axis('value', {
      label: {
        textStyle: {
          fill: '#aaaaaa'
        },
        formatter: function formatter(text) {
          return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
      }
    });
    chart.legend(false);
    chart.line().position('date*value').color('type', ['#1890FF', '#f85a73', '#FACC14']);
    chart.render();
    chart.showTooltip({
      x: document.getElementById('mountNode').width - 20,
      y: 100
    });
  }
}
</script>

<style lang="less">
.bar {
  .custom-tooltip {
    width: 100% !important;
    height: 10% !important;
    position: absolute;
    top: 0px;
    left: 0px
  }

  .custom-tooltip-item {
    width: 150px;
    height: 50px;
    position: relative;
    float: left;
    margin-left: 20px;
    border-left-style: solid;
    border-left-width: 5px
  }

  .custom-tooltip-item:first-child {
    margin-left: 0
  }

  .custom-tooltip-item-name {
    width: 80%;
    height: 20px;
    position: absolute;
    top: 0px;
    left: 10px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px
  }

  .custom-tooltip-item-value {
    width: 80%;
    height: 30px;
    position: absolute;
    bottom: 0px;
    left: 10px;
    color: #262626;
    font-size: 22px;
    /*font-weight: bold*/
  }
}

</style>
<style scoped lang="less">
.bar {
  position: relative;

  .chart {
  }
}
</style>
