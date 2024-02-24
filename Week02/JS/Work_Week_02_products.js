import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    //資料
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: '_shun0130',
            products:[],
            tempProducts:{},
        }
    },
    methods:{
        // 身分驗證
        checkIdentity(){
            axios.post(`${this.apiUrl}/api/user/check`)
            .then((res)=>{
                this.getData();
            }) 
            .catch((error) =>{
                console.dir(error);
            })
        },
        // 取得產品資料
        getData(){
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
            .then((res)=>{   
                //把產品資料存入products                                 
                this.products = res.data.products;
            })
            .catch((error)=>{
                console.dir(error);
            })
        },
        openProduct(item){
            this.tempProducts = item;
        }
    },
    //生命週期
    mounted(){
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checkIdentity();
    }   
}).mount('#app');

