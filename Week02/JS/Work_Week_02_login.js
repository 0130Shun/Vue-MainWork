import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    // 資料
    data(){
        return{
            user:{
                username: '',
                password: '',
            },
        }
    },
    // 方法
    methods:{
        login(){
            const apiUrl = "https://vue3-course-api.hexschool.io/v2/admin/signin";
            axios.post(apiUrl,this.user)
            .then((res)=>{
                // 寫入token
                const { token,expired } = res.data;
                document.cookie = `hexToken=${ token }; expired=${new Date(expired)}`;
                window.location = 'Work_Week_02_products.html';
            })
            //失敗訊息
            .catch((error)=>{
                alert('登入失敗');
            })
        }
    }
}).mount('#app');