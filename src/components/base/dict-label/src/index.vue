<template>
  <el-tag :type="type" :color="props.color" :round="props.round">{{ value }}</el-tag>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useAppStore } from "@/store";
import { getDictLabel } from "@/utils/utils";
export default defineComponent({
  name: "DictLabel",
  props: {
    dictType: {
      type: String,
      default: ""
    },
    dictValue: {
      type: [Number],
      default: 100
    },
    effect: {
      type: String,
      default: "light"
    },
    status: {
      type: Object,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {}
    },
    color: {
      type: String,
      default: ""
    },
    round: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useAppStore();
    return {
      value: computed(() => {
        return getDictLabel(store.state.dicts, props.dictType, props.dictValue);
      }),
      type: computed(() => {
        return props.status ? props.status[props.dictValue] : "";
      }),
      props
    };
  }
});
</script>
