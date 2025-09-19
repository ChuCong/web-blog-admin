import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Teacher } from '@/model'

interface TeacherState {
  teachers: Teacher[];
  teacherDetail: Teacher | null;
}

export const useTeacherStore = defineStore('teacher', {
  state: (): TeacherState => ({
    teachers: [],
    teacherDetail: null,
  }),

  actions: {
    async fetchTeachers(params?:any) {
      const response = await ApiService.query('teachers', params);
      this.teachers = response.data.data || [];
    },

    async getTeacherDetail(id: number) {
      const response = await ApiService.get(`teachers`, id);
      this.teacherDetail = response.data.data || null;
    },

    async saveTeacher(teacher: Teacher) {
      if (teacher.id) {
        const response = await ApiService.update('teachers', teacher.id, teacher);
        return response.data;
      } else {
        const response = await ApiService.post('teachers', teacher);
        return response.data;
      }
    },

    async deleteTeacher(id: number) {
      const response = await ApiService.delete('teachers', id);
      return response.data.status === 1;
    },

    async uploadImage(formData: FormData) {
      const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
      };
      const response = await ApiService.post('teachers/upload-image', formData, config);
      return response.data?.data;
    },
  },
})
