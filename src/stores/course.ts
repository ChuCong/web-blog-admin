import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Course } from "@/model";

interface CourseState {
  courses: Course[];
  purchaseCourses: Course[];
  detailCourse: Course;
}

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    courses: [] as Course[],
    purchaseCourses: [],
    detailCourse: {
        
        id: 0,
        title: '',
        price: '',
        description: '',
        introduction: '',
        url_lading_page: '',
        status: 0,
        lesson_number: 0,
        number_month_expired: 0,
        image_id: 0,
        responsive_image_id: 0,
        active: false,
        is_recommend: 0,
        slug: '',
        meta: '',
        category_id: 0,
        created_at: '',
        updated_at: '',
        image: {
          id: 0,
          alt: '',
          src: '',
          type: 0,
          s3_url: '',
          created_at: '',
          updated_at: ''
        },
        responsive_image: {
          id: 0,
          alt: '',
          src: '',
          type: 0,
          s3_url: '',
          created_at: '',
          updated_at: ''
        },
        is_free: false,
        is_deal: false,
        not_buy: false,
        revenue: 0,
        user_register: 0
      } as Course
  }),
  
  actions: {
    async fetchCourses() {
      const { data } = await ApiService.get('courses');
      if (data.status) {
        this.courses = data.data;
      }
      return data;
    },

    async deleteCourse(id) {
      try {
        const { data } = await ApiService.delete('courses', id);
        console.log(data)
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async changeExpiredDate(payload) {
      try {
        const { data } = await ApiService.post('change_expired_date', payload);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async fetchCourseDetail(payload) {
      // if (!payload) {
      //   this.resetDetailCourse();
      //   return;
      // }
      const { data } = await ApiService.get('courses', payload);
      console.log(data.data);
      if (data.status) {
        if (!data.data.responsive_image) {
          data.data.responsive_image = { src: '' };
        }
        this.resetDetailCourse();
         Object.assign(this.detailCourse, data.data);
      }
      return data;
    },

    async uploadCourseImage(payload) {
      const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
      };
      const { data } = await ApiService.post('courses/upload-image', payload, config);
      return data?.data;
    },

    async saveCourse(payload) {
      const { data } = await ApiService.post('courses', payload);
      return data;
    },

    async updateCourse(payload) {
      const { data } = await ApiService.update('courses', payload.id, payload);
      return data;
    },

    async fetchPurchaseCourses(payload) {
      const { data } = await ApiService.query('course/purchase', payload);
      this.purchaseCourses = data.data;
      return data;
    },

    async fetchAllCourses() {
      const { data } = await ApiService.get('courses/all');
      return data.data || [];
    },

    resetDetailCourse() {
      Object.assign(this.detailCourse, {
        id: 0,
        title: '',
        price: '',
        description: '',
        introduction: '',
        url_lading_page: '',
        status: 0,
        lesson_number: 0,
        number_month_expired: 0,
        image_id: 0,
        responsive_image_id: 0,
        active: false,
        is_recommend: 0,
        slug: '',
        meta: '',
        category_id: 0,
        created_at: '',
        updated_at: '',
        image: {
          id: 0,
          alt: '',
          src: '',
          type: 0,
          s3_url: '',
          created_at: '',
          updated_at: ''
        },
        responsive_image: {
          id: 0,
          alt: '',
          src: '',
          type: 0,
          s3_url: '',
          created_at: '',
          updated_at: ''
        },
        is_free: false,
        is_deal: false,
        not_buy: false,
        revenue: 0,
        user_register: 0
      });
    }
  }
});
