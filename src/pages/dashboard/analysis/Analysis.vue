<template>
  <div class="analysis">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="今日总调用次数" total="189,345" v-if="false">
          <a-tooltip :title="$t('introduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <trend style="margin-right: 16px" :term="$t('wow')" :percent="12" :is-increase="true" :scale="0"/>
            <trend :term="$t('dod')" :target="100" :value="89" :scale="0"/>
          </div>
          <div slot="footer">日均访问量<span> 3,000</span></div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" v-if="false">
        <chart-card :loading="loading" title="普通规则调用次数" total="100,334">
          <a-tooltip :title="$t('introduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-area/>
          </div>
          <div slot="footer">{{ $ta('daily|visits', 'p') }}<span> 123,4</span></div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" v-if="false">
        <chart-card :loading="loading" title="规则集调用次数" total="100,334">
          <a-tooltip :title="$t('introduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-area/>
          </div>
          <div slot="footer">{{ $ta('daily|visits', 'p') }}<span> 123,4</span></div>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" v-if="false">
        <chart-card :loading="loading" :title="$t('payments')" total="￥ 189,345">
          <a-tooltip :title="$t('introduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-bar/>
          </div>
          <div slot="footer">{{ $t('conversion') }} <span>60%</span></div>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" v-if="false">
        <chart-card :loading="loading" title="计算平局耗时" total="73ms">
          <a-tooltip :title="$t('introduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-progress target="80" percent="78" color="#13C2C2" height="8px"/>
          </div>
          <div slot="footer" style="white-space: nowrap;overflow: hidden">
            <trend style="margin-right: 16px" :term="$t('wow')" :percent="12" :is-increase="true" :scale="0"/>
            <trend :term="$t('dod')" :target="100" :value="70" :scale="0"/>
          </div>
        </chart-card>
      </a-col>

    </a-row>
    <a-card :loading="loading" style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrap" slot="tabBarExtraContent">
            <div class="extra-item">
              <!--              <a>{{ $t('day') }}</a>-->
              <a>{{ $t('week') }}</a>
              <a>{{ $t('month') }}</a>
<!--              <a>{{ $t('year') }}</a>-->
<!--              cpu，内存，平局耗时-->
            </div>
            <a-range-picker :style="{width: '256px'}"></a-range-picker>
          </div>
          <a-tab-pane loading="true" tab="普通规则" key="1">
            <bar id="generalRuleBar"/>
          </a-tab-pane>
          <a-tab-pane tab="规则集" key="2">
            <bar id="ruleSetBar"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>


    <a-row style="margin: 0 -12px" v-if="false">
      <a-col style="padding: 0 12px" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :loading="loading" :bordered="false" style="margin-top: 24px" :title="$t('search')">
          <hot-search/>
        </a-card>
      </a-col>
      <a-col style="padding: 0 12px" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :loading="loading" :bordered="false" style="margin-top: 24px;" :title="$t('proportion')">
          <sales-data/>
          <a-radio-group slot="extra" style="margin: -12px 0">
            <a-radio-button value="a">{{ $t('all') }}</a-radio-button>
            <a-radio-button value="b">{{ $t('online') }}</a-radio-button>
            <a-radio-button value="c">{{ $t('stores') }}</a-radio-button>
          </a-radio-group>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ChartCard from '../../../components/card/ChartCard'
import MiniArea from '../../../components/chart/MiniArea'
import MiniBar from '../../../components/chart/MiniBar'
import MiniProgress from '../../../components/chart/MiniProgress'
import Bar from '@/pages/dashboard/analysis/Bar'
import HotSearch from './HotSearch'
import SalesData from './SalesData'
import Trend from '../../../components/chart/Trend'

const rankList = []

for (let i = 0; i < 8; i++) {
  rankList.push({
    name: '规则' + i + '',
    total: 1256 - i * 100
  })
}

export default {
  name: 'Analysis',
  i18n: require('./i18n'),
  data() {
    return {
      rankList,
      loading: true
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
  },
  components: {Trend, SalesData, HotSearch, Bar, MiniProgress, MiniBar, MiniArea, ChartCard}
}
</script>

<style lang="less" scoped>
.extra-wrap {
  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a:not(:first-child) {
      margin-left: 24px;
    }
  }
}

@media screen and (max-width: 992px) {
  .extra-wrap .extra-item {
    display: none;
  }
}

@media screen and (max-width: 576px) {
  .extra-wrap {
    display: none;
  }
}

</style>
