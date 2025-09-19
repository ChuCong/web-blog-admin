import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Contact, Paginate } from '@/model'

interface ContactState {
    contact: Contact[];
    contactDetail: Contact | null;
    paginate: Paginate | null;
}

export const useContactStore = defineStore('contact', {
    state: (): ContactState => ({
        contact: [],
        contactDetail: null,
        paginate: null
    }),

    actions: {
        async fetchContact(params) {
            this.contact = [];
            this.paginate = null;
            const response = await ApiService.query('contacts', params);
            this.contact = response.data.data.data || [];
            this.paginate = response.data.data.paginate || null
        },

        async getContactDetail(id: number) {
            const response = await ApiService.get(`contacts`, id);
            this.contactDetail = response.data.data || null;
        },

        async saveContacts(contact: Contact) {
            if (contact.id) {
                const response = await ApiService.update('contacts', contact.id, contact);
                return response.data;
            } else {
                const response = await ApiService.post('contacts', contact);
                return response.data;
            }
        },

        async deleteContacts(id: number) {
            const response = await ApiService.delete('contacts', id);
            return response.data.status === 1;
        },


    },
})
