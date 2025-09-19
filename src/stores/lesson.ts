import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Lesson , LessonList} from "@/model";

// const defaultLesson = {
//   title: '',
//   description: '',
//   type: 0,
//   content: '',
//   slug: '',
//   reference_id: null,
//   lesson_index: null,
//   medias: [],
//   course_id: null,
// };
interface LessonState {
  lesson: Lesson;
  lessons: Lesson[];
  listLessons: LessonList[];
  percentUpload: number;
  time: number;
}

export const useLessonStore = defineStore('lesson', {
  state: (): LessonState => ({
    lesson: {} as Lesson,
    lessons: [] as Lesson[],
    listLessons: [] as LessonList[],
    percentUpload: 0,
    time: 0,
  }),

  actions: {
    async fetchLessonDetail(params) {
      const { data } = await ApiService.get('/lessons', params);
      if (data.status && data.data) {
        Object.assign(this.lesson, data.data);
      } else {
        this.resetDetailLesson();
      }
      return data;
    },
    async fetchListLesson() {
      const { data } = await ApiService.get('/list-lessons');
      if (data.status && data.data) {
        this.listLessons = data.data;
      }
    },

    async fetchLessons(courseId) {
      const { data } = await ApiService.query('/lessons/by-course-id', { course_id: courseId });
      console.log(data);
      if (data.status) {
        this.lessons = data.data;
      }
      return data;
    },

    async saveLesson(payload) {
      const { data } = await ApiService.post('/lessons', payload);
      return data;
    },

    async updateLesson(payload) {
      const { data } = await ApiService.put(`/lessons/${payload.id}`, payload);
      return data;
    },

    async updateQuestionsOfLesson(payload) {
      const { data } = await ApiService.put(`/lessons/question/${payload.id}`, payload);
      return data;
    },

    async updateIsFree(payload) {
      const { data } = await ApiService.post('/lessons/update-is-free', payload);
      return data;
    },

    async updateLessonOrder(payload) {
      const { data } = await ApiService.post('/lessons/order/update', payload);
      return data;
    },

    async updateLessonTitle(payload) {
      const { data } = await ApiService.post('/lessons/title/update', payload);
      return data;
    },

    async updateLessonType(payload) {
      const { data } = await ApiService.post('/lessons/type/update', payload);
      return data;
    },

    async deleteLesson(id) {
      const { data } = await ApiService.delete('/lessons', id);
      return data;
    },

    async uploadLessonVideo(payload) {
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            console.log(progressEvent);
            this.percentUpload = (progressEvent.loaded * 100) / progressEvent.total;
            this.time = progressEvent.timeStamp;
          },
        };

        ApiService.post('/lessons/video/upload', payload, config)
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });
    },
    resetDetailLesson() {
      Object.assign(this.lesson, {
        id: 0,
        title: '',
        description: '',
        lesson_index: 0,
        status: 1, 
        type: 0,
        content: '',
        slug: '',
        reference_id: null,
        course_id: 0,
        order: 0,
        is_free: 1,  
        active: 0,
        seo_key: '',
        seo_title: '',
        seo_description: '',
        time: 0,
        medias: [],
        parent: null,
        encrypt_process: null,
        created_at: '',
        updated_at: ''
      });
    }
  },
});
