<template>
  <v-chart :forceFit="true" height="400" :data="data" :padding="[20, 20, 95, 20]" :scale="scale">
    <v-tooltip/>
    <v-axis :dataKey="axis1Opts.dataKey" :line="axis1Opts.line" :tickLine="axis1Opts.tickLine" :grid="axis1Opts.grid"/>
    <v-axis :dataKey="axis2Opts.dataKey" :line="axis2Opts.line" :tickLine="axis2Opts.tickLine" :grid="axis2Opts.grid"/>
    <v-legend dataKey="user" marker="circle" :offset="30"/>
    <v-coord type="polar" radius="0.8"/>
    <v-line position="item*score" color="user" :size="2"/>
    <v-point position="item*score" color="user" :size="4" shape="circle"/>
  </v-chart>
</template>

<script>
const DataSet = require('@antv/data-set')

const axis1Opts = {
  dataKey: 'item',
  line: null,
  tickLine: null,
  grid: {
    lineStyle: {
      lineDash: null
    },
    hideFirstLine: false
  }
}
const axis2Opts = {
  dataKey: 'score',
  line: null,
  tickLine: null,
  grid: {
    type: 'polygon',
    lineStyle: {
      lineDash: null
    }
  }
}

import {numberOfCreationsRanking} from "@/services/workplace";

export default {
  name: 'Radar',
  data() {
    return {
      data: [],
      axis1Opts,
      axis2Opts,
      scale: null,
    }
  }, created() {
    numberOfCreationsRanking().then(res => {
      let max = 0;
      const sourceData = Array.from(res.data.data).filter(f => {
        if (f.generalRuleNumber > max) {
          max = f.generalRuleNumber;
        }
        if (f.ruleSetNumber > max) {
          max = f.ruleSetNumber;
        }
        return true;
      }).map(m => ({
        item: m.createUsername
      }));
      this.scale = [{
        dataKey: 'score',
        min: 0,
        max: max
      }]
      const dv = new DataSet.View().source(sourceData)
      dv.transform({
        type: 'fold',
        fields: ['普通规则'],
        key: 'user',
        value: 'score'
      })
      this.data = dv.rows
    })
  }
}
</script>

<style scoped>

</style>
