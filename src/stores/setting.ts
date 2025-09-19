import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Setting, Banner, AboutMsd } from '@/model'

interface SettingState {
    setting: Setting[];
    settingDetail: Setting | null;
    banner: Banner[];
    aboutMsd: AboutMsd[];
}

export const useSettingStore = defineStore('setting', {
    state: (): SettingState => ({
        setting: [],
        settingDetail: null,
        banner: [],
        aboutMsd: [],
    }),

    actions: {
        async fetchSetting(params) {
            this.setting = [];
            const response = await ApiService.query('setting', params);
            if (response.data.status) {
                this.setting = response?.data.data;
            } else { }
        },
        async fetchSettingByKey(key) {
            this.settingDetail = null;
            const response = await ApiService.query('/setting/by-key', key);
            if (response.data.status) {
                this.settingDetail = response?.data.data;
                if(this.settingDetail?.key === 'banner') {
                    this.banner = this.settingDetail?.value as Banner[];
                    this.settingDetail = this.settingDetail;
                }
                if(this.settingDetail?.key === 'about-msd') {
                    this.aboutMsd = this.settingDetail?.value as AboutMsd[];
                    this.settingDetail = this.settingDetail;
                }
            } else { }
        },

        async getSettingDetail(id: number) {
            const response = await ApiService.get(`setting`, id);
            this.settingDetail = response.data.data || null;
        },

        async saveSetting(setting: Setting) {
            if (setting.id) {
                const response = await ApiService.update('setting', setting.id, setting);
                return response.data;
            } else {
                const response = await ApiService.post('setting', setting);
                return response.data;
            }
        },

        async deleteSetting(id: number) {
            const response = await ApiService.delete('setting', id);
            return response.data.status === 1;
        },

        async uploadImage(formData: FormData) {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            };
            const response = await ApiService.post('setting/upload-image', formData, config);
            return response.data?.data;
        },

        async saveSettingHome(setting: Setting) {
            if (setting.id) {
                const response = await ApiService.update('setting', setting.id, setting);
                return response.data;
            } else {
                const response = await ApiService.post('create-home', setting);
                return response.data;
            }
        },
        async addFile(payload) {
            const data = await ApiService.post('add-file', payload);
            return data.data.data;
        },
    }
})
