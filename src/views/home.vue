<template>
    <div class="relative min-h-[1200px]">
        <SubHeader :breadcrumb="breadcrumb"></SubHeader>
        <Content>
            <!-- Info box tổng số -->
            <div class="grid grid-cols-3 gap-8 mb-8">
                <div class="bg-white rounded shadow p-6 text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ data?.user ?? 0 }}</div>
                    <div class="mt-2 text-gray-600">Tổng số học viên</div>
                </div>
                <div class="bg-white rounded shadow p-6 text-center">
                    <div class="text-2xl font-bold text-green-600">{{ data?.course ?? 0 }}</div>
                    <div class="mt-2 text-gray-600">Tổng số khóa học</div>
                </div>
                <div class="bg-white rounded shadow p-6 text-center">
                    <div class="text-2xl font-bold text-yellow-600">{{ data?.category ?? 0 }}</div>
                    <div class="mt-2 text-gray-600">Tổng số danh mục</div>
                </div>
            </div>
            <!-- Bộ lọc ngày -->
            <div class="flex gap-4 items-center justify-end mb-6">
                <div>
                    <label class="block font-semibold mb-1">Ngày bắt đầu</label>
                    <VueDatePicker v-model="startDate" placeholder="Ngày bắt đầu" :enable-time-picker="false" />
                </div>
                <div>
                    <label class="block font-semibold mb-1">Ngày kết thúc</label>
                    <VueDatePicker v-model="endDate" placeholder="Ngày kết thúc" :enable-time-picker="false" />
                </div>
                <button class="bg-primary text-white px-4 py-2 rounded mt-6" @click="fetchReportData">Lọc</button>
            </div>
            <!-- Các chart -->
            <div class="grid grid-cols-2 gap-8 mt-8">
                <div>
                    <h3 class="font-bold mb-2">Tỷ lệ hoàn thành từng khóa học</h3>
                    <BarChart :chartData="barData" :options="barOptions" />
                </div>
                <div>
                    <h3 class="font-bold mb-2">Lượt truy cập hệ thống theo ngày</h3>
                    <LineChart :chartData="lineData" :options="lineOptions" />
                </div>
                <!-- <div>
                    <h3 class="font-bold mb-2">Tỷ lệ học viên đang hoạt động và đã hoàn thành</h3>
                    <PieChart :chartData="pieData" :options="pieOptions" />
                </div>
                <div>
                    <h3 class="font-bold mb-2">Tổng số học viên, khóa học, danh mục</h3>
                    <DoughnutChart :chartData="doughnutData" :options="doughnutOptions" />
                </div> -->
                <div>
                    <h3 class="font-bold mb-2">Số khóa học của từng giảng viên tiêu biểu</h3>
                    <PolarAreaChart :chartData="polarData" :options="polarOptions" />
                </div>
                <div>
                    <h3 class="font-bold mb-2">Số khóa học hoàn thành của học viên tiêu biểu</h3>
                    <RadarChart :chartData="radarData" :options="radarOptions" />
                </div>
                <div>
                    <h3 class="font-bold mb-2">Số học viên theo từng khóa học</h3>
                    <BubbleChart :chartData="bubbleData" :options="bubbleOptions" />
                </div>
                <div>
                    <h3 class="font-bold mb-2">Số học viên hoàn thành theo từng khóa học</h3>
                    <ScatterChart :chartData="scatterData" :options="scatterOptions" />
                </div>
            </div>
        </Content>
    </div>
</template>

<script lang="ts" setup>
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { BarChart, LineChart, PieChart, DoughnutChart, PolarAreaChart, RadarChart, BubbleChart, ScatterChart } from 'vue-chart-3'
import { useLoadingStore } from '@/stores/loading';
import { useReportStore } from '@/stores/report';
import { ref, onMounted, computed } from 'vue'
import { formatDate } from '@/common/date' // dùng hàm formatDate nếu cần
import VueDatePicker from '@vuepic/vue-datepicker';

const breadcrumb = [
    { name: "Home", link: '/home' },
]

const loading = useLoadingStore();
const store = useReportStore();

const data = computed(() => store.data);

// Bar Chart
const MAX_LABEL_LENGTH = 30;

const barData = computed(() => ({
    labels: data.value?.completion_rate_by_course?.map(c =>
        c.course_title.length > MAX_LABEL_LENGTH
            ? c.course_title.slice(0, MAX_LABEL_LENGTH) + '...'
            : c.course_title
    ) || [],
    datasets: [{
        label: 'Tỷ lệ hoàn thành (%)',
        data: data.value?.completion_rate_by_course?.map(c => c.completion_rate * 100) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
    }]
}));
const barOptions = {
    responsive: true,
    y: {
        beginAtZero: true,
        min: 0,
        stepSize: 1, // bước nhảy trục Y là 1
        ticks: {
            stepSize: 1 // đảm bảo hiển thị từng bước là 1
        }
    }
}

// Line Chart
const lineData = computed(() => ({
    labels: data.value?.user_log_stats?.map(u => u.period) || [],
    datasets: [{
        label: 'Lượt truy cập/ngày',
        data: data.value?.user_log_stats?.map(u => u.total) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
}));
const lineOptions = { responsive: true }

// Pie Chart
const pieData = computed(() => ({
    labels: ['Đang hoạt động', 'Đã hoàn thành'],
    datasets: [{
        data: [
            data.value?.active_and_completed_users?.active_users ?? 0,
            data.value?.active_and_completed_users?.completed_users ?? 0
        ],
        backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
        ]
    }]
}));
const pieOptions = { responsive: true }

// Doughnut Chart
const doughnutData = computed(() => ({
    labels: ['Học viên', 'Khóa học', 'Danh mục'],
    datasets: [{
        data: [
            data.value?.user ?? 0,
            data.value?.course ?? 0,
            data.value?.category ?? 0
        ],
        backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
        ]
    }]
}));
const doughnutOptions = { responsive: true }

// PolarArea Chart
const polarData = computed(() => ({
    labels: data.value?.top_teachers?.map(t => t.full_name) || [],
    datasets: [{
        label: 'Số khóa học',
        data: data.value?.top_teachers?.map(t => t.courses_count) || [],
        backgroundColor: [
            'rgba(255,99,132,0.6)',
            'rgba(75,192,192,0.6)',
            'rgba(255,206,86,0.6)',
            'rgba(201,203,207,0.6)',
            'rgba(54,162,235,0.6)'
        ]
    }]
}));
const polarOptions = {
    responsive: true,
    scales: {
        r: {
            beginAtZero: true,
            min: 0,
            ticks: {
                stepSize: 1
            }
        }
    }
}

// Radar Chart
const radarData = computed(() => ({
    labels: data.value?.top_students?.map(s => s.full_name) || [],
    datasets: [{
        label: 'Khóa học hoàn thành',
        data: data.value?.top_students?.map(s => s.course_complete_count) || [],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255,99,132,1)'
    }]
}));
const radarOptions = {
    responsive: true,
    scales: {
        r: {
            beginAtZero: true,
            min: 0,
            ticks: {
                stepSize: 1
            }
        }
    }
}

// Bubble Chart (demo: số học viên theo từng khóa học)
const bubbleData = computed(() => ({
    labels: data.value?.completion_rate_by_course?.map(c =>
        c.course_title.length > MAX_LABEL_LENGTH
            ? c.course_title.slice(0, MAX_LABEL_LENGTH) + '...'
            : c.course_title
    ) || [],
    datasets: [{
        label: 'Số học viên theo khóa học',
        data: (data.value?.completion_rate_by_course || []).map((c, idx) => ({
            x: idx + 1, // dùng số thứ tự làm trục X
            y: c.total_students,
            r: Math.max(5, c.total_students * 2),
            course_title: c.course_title // lưu lại để dùng cho tooltip nếu muốn
        })),
        backgroundColor: 'rgba(255,99,132,0.6)'
    }]
}));
const bubbleOptions = {
    responsive: true,
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    const d = context.raw;
                    return `${d.course_title}: ${d.y} học viên`;
                }
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            min: 1,
            stepSize: 1, // bước nhảy trục X là 1
            ticks: {
                stepSize: 1 // đảm bảo hiển thị từng bước là 1
            }
        },
        y: {
            beginAtZero: true,
            min: 0,
            stepSize: 1, // bước nhảy trục Y là 1
            ticks: {
                stepSize: 1 // đảm bảo hiển thị từng bước là 1
            }
        }
    }
};

// Scatter Chart (demo: số học viên hoàn thành theo từng khóa học)
const scatterData = computed(() => ({
    labels: data.value?.completion_rate_by_course?.map(c =>
        c.course_title.length > MAX_LABEL_LENGTH
            ? c.course_title.slice(0, MAX_LABEL_LENGTH) + '...'
            : c.course_title
    ) || [],
    datasets: [{
        label: 'Số học viên hoàn thành theo từng khóa học',
        data: (data.value?.completion_rate_by_course || []).map((c, idx) => ({
            x: idx + 1,
            y: c.completed_students,
            course_title: c.course_title
        })),
        backgroundColor: 'rgba(54,162,235,0.6)'
    }]
}));

const scatterOptions = {
    responsive: true,
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    const d = context.raw;
                    return `${d.course_title}: ${d.y} học viên hoàn thành`;
                }
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            min: 1,
            stepSize: 1,
            ticks: {
                stepSize: 1
            }
        },
        y: {
            beginAtZero: true,
            min: 0,
            stepSize: 1,
            ticks: {
                stepSize: 1
            }
        }
    }
};

const startDate = ref(null)
const endDate = ref(null)

const setDefaultDateRange = () => {
    const today = new Date()
    endDate.value = today
    const lastMonth = new Date()
    lastMonth.setMonth(today.getMonth() - 1)
    startDate.value = lastMonth
}

const fetchReportData = async () => {
    loading.setLoading(true)
    await store.fetchData({
        start_date: startDate.value ? formatDate(startDate.value) : null,
        end_date: endDate.value ? formatDate(endDate.value) : null
    })
    loading.setLoading(false)
}

onMounted(() => {
    setDefaultDateRange()
    fetchReportData()
});
</script>

<style scoped lang="scss">
.text-introduce {
    color: #616161;
    text-align: center;
    font-family: Roboto;
    font-size: 20px;
    font-weight: 700;
    line-height: normal;
}
</style>