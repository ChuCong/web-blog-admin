import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import JwtService from '@/common/jwt.service';

export const useAuthStore = defineStore('auth', {
    actions: {
        async login(credentials: any) {
            const response = await ApiService.post('login', credentials);
            console.log(response);
            if (response.data.status) {
                JwtService.saveToken(response.data.data.access_token);
                JwtService.saveUser(response.data.data.data);
            }
            return response.data;
        }
    }
})
