import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Testimonial, Paginate } from '@/model'

interface TestimonialState {
    testimonial: Testimonial[];
    testimonialDetail: Testimonial | null;
    paginate: Paginate | null;
}

export const useTestimonialStore = defineStore('testimonial', {
    state: (): TestimonialState => ({
        testimonial: [],
        testimonialDetail: null,
        paginate: null
    }),

    actions: {
        async fetchTestimonial(params) {
            this.testimonial = [];
            this.paginate = null;
            const testimonials = await ApiService.query('testimonial', params);
            this.testimonial = testimonials.data.data.data || [];
            this.paginate = testimonials.data.data.paginate || null
        },

        async getTestimonialDetail(id: number) {
            const response = await ApiService.get(`testimonial`, id);
            this.testimonialDetail = response.data.data || null;
        },

        async saveTestimonial(testimonial: Testimonial) {
            if (testimonial.id) {
                const testimonials = await ApiService.update('testimonial', testimonial.id, testimonial);
                return testimonials.data;
            } else {
                const testimonials = await ApiService.post('testimonial', testimonial);
                return testimonials.data;
            }
        },

        async deleteTestimonial(id: number) {
            const testimonial = await ApiService.delete('testimonial', id);
            return testimonial.data.status === 1;
        },
        async uploadTestimonialImage(payload) {
            const data = await ApiService.post('testimonial-upload', payload);
            return data.data.data;
        },
       
    },
})
