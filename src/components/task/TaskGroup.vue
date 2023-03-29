<template>
  <div class="task-group">
    <div class="task-content">
      <draggable :v-bind="dragOptions" :handle="handle" @update="update" :id="id">
        <slot></slot>
      </draggable>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import {conditionGroupRearrange} from "@/services/conditionGroup";
import {rearrange} from "@/services/conditionGroupCondition";
import {ruleSetRuleRearrange} from '@/services/rule'

const dragOptions = {
  sort: true,
  scroll: true,
  scrollSpeed: 2,
  animation: 150,
  ghostClass: 'dragable-ghost',
  chosenClass: 'dragable-chose',
  dragClass: 'dragable-drag',
};

export default {
  name: 'TaskGroup',
  components: {Draggable},
  props: ['title', 'group', 'dataList', 'id', 'handle', "ruleId", "ruleSetId"],
  data() {
    return {
      dragOptions: {...dragOptions, group: this.group}
    }
  },
  methods: {
    update(e) {
      this.$emit("update:loading", true);
      if (this.ruleSetId) {
        // 移动规则集中规则
        this.rearrangeOrder({
          from: this.dataList[e.oldIndex],
          to: this.dataList[e.newIndex],
          data: this.dataList
        });
        // 调用后端重新排序
        ruleSetRuleRearrange(Array.from(this.dataList).map(m => ({
          id: m.id,
          orderNo: m.orderNo
        }))).then(res => {
          if (res.data.data) {
            this.$emit("update:loading", false);
          }
        });

      } else if (this.ruleId) {
        this.rearrangeOrder({
          ruleId: this.ruleId,
          from: this.dataList[e.oldIndex],
          to: this.dataList[e.newIndex],
          data: this.dataList
        });
        // 调用后端重新排序
        conditionGroupRearrange(Array.from(this.dataList).map(m => ({
          id: m.id,
          orderNo: m.orderNo
        }))).then(res => {
          if (res.data.data) {
            this.$emit("update:loading", false);
          }
        });
      } else {
        let cgc = this.getConditionGroupById(e.from.id).conditionGroupCondition
        this.rearrangeOrder({
          from: cgc[e.oldIndex],
          to: cgc[e.newIndex],
          data: cgc
        })
        // 调用后端重新排序
        rearrange(Array.from(cgc).map(m => ({
          id: m.id,
          orderNo: m.orderNo
        }))).then(res => {
          if (res.data.data) {
            this.$emit("update:loading", false);
          }
        });
      }
    },
    rearrangeOrder(args) {
      // 重新排序
      let toOrderNo = args.to.orderNo;
      let formOrderNo = args.from.orderNo;
      if (toOrderNo <= args.from.orderNo) {
        args.data.forEach(f => {
          if (f.orderNo !== formOrderNo && f.orderNo >= args.to.orderNo) {
            f.orderNo = f.orderNo + 1;
          }
        });
        args.from.orderNo = toOrderNo;
      } else {
        args.data.forEach(f => {
          if (f.orderNo !== formOrderNo && f.orderNo <= toOrderNo) {
            f.orderNo = f.orderNo - 1;
          }
        });
        args.from.orderNo = toOrderNo;
      }
      args.data.sort((a, b) => a.orderNo - b.orderNo);
    },
    getConditionGroupById(id) {
      return this.dataList.find(e => e.id === parseInt(id))
    }
  },
  computed: {
    count() {
      return this.$slots.default.length
    }
  }
}
</script>

<style lang="less">
.task-group {
  width: 100%;
  //padding: 8px 8px;
  //background-color: @background-color-light;
  //border-radius: 6px;
  //border: 1px solid @shadow-color;

  .task-head {
    //margin-bottom: 8px;
    .title {
      display: inline-block;

      span {
        display: inline-block;
        border-radius: 10px;
        margin: 0 8px;
        font-size: 12px;
        padding: 2px 6px;
        background-color: @base-bg-color;
      }
    }

    .actions {
      display: inline-block;
      float: right;
      font-size: 18px;
      font-weight: bold;

      i {
        cursor: pointer;
      }
    }
  }
}

.dragable-ghost {
  //border: 1px dashed red;
  opacity: 1;
}

.dragable-chose {
  //border: 1px dashed red;
  opacity: 0.8;
}

.dragable-drag {
  //border: 1px dashed red;
  opacity: 1;
}
</style>
