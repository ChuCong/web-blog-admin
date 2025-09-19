<template>
    <date-range-picker
        ref="picker"
        opens="center"
        :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd' }"
        :showWeekNumbers="true"
        :showDropdowns="true"
        v-model="dateRange"
        :dateRange="dateRange"
        @update="updateValues"
        :dateFormat="dateFormat"
        :always-show-calendars="false"
        :autoApply="true"
        :closeOnEsc="true"
    >
    </date-range-picker>
</template>
<script lang="js" >
import DateRangePicker from 'vue3-daterange-picker'
import dateUtil from '@/common/date.js'

export default {
    name: "TopDateRangePicker",
    components: {DateRangePicker},
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: Object,
        }
    },
    data() {
        return {
            dateRange: {}
        }
    },
    watch: {
        dateRange: {
            deep: true,
            immediate: true,
            handler(newVal) {
                const startDate = dateUtil.format(newVal.startDate, 'yyyy-mm-dd')
                const endDate = dateUtil.format(newVal.endDate, 'yyyy-mm-dd')
                this.$emit('update:modelValue', {startDate: startDate, endDate: endDate})
            }
        },
        formula() {
            this.renderMathJax()
        }
    },
    mounted() {
        let startDate = new Date()
        startDate.setDate(startDate.getDate() - 6)
        let endDate = new Date()

        this.dateRange = {
            startDate: startDate,
            endDate: endDate,
        }
    },
    methods: {
        dateFormat(classes, date) {
            let yesterday = new Date();
            let d1 = dateUtil.format(date, 'isoDate')
            let d2 = dateUtil.format(yesterday.setDate(yesterday.getDate() - 1), 'isoDate')
            if (!classes.disabled) {
                classes.disabled = d1 === d2
            }
            return classes
        },
        updateValues(value) {
            console.log(value)
        }
    }
}
</script>