import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    // 資料
    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            apiPath:'_shun0130',
            products:[],
            tempProduct:{
                imageUrl:[]
            },
            modalProduct:null,
            modalDel:null,
            //判斷
            isNew:false,
        };
    },
    //方法
    methods:{
        //驗證身分
        checkAdmin(){
            axios.post(`${this.apiUrl}/api/user/check`)
            .then((res)=>{
                this.getData();
            })
            .catch((error)=>{
                console.dir(error);
            })
        },
        //取得資料
        getData(){
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
            .then((res)=>{
                this.products = res.data.products;
            })
            .catch((error)=>{
                console.dir(error);
            })
        },
        openModal(status,item){
            if(status === 'new'){
                this.tempProduct = {
                    imagesUrl:[],
                };
                this.isNew = true;
                this.modalProduct.show();
            }else if(status === 'edit'){
                this.tempProduct = { ...item };
                if(!Array.isArray(this.tempProduct.imagesUrl)){
                    this.tempProduct.imagesUrl = [];
                }
                this.isNew = false;
                this.modalProduct.show();
            }else if(status === 'delete'){
                this.tempProduct = { ...item };
                this.modalDel.show();
            }
        },
        //新增資料
        updateProduct(){
            //新增
            let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            //修改資料
            if(!this.isNew){
                api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
                method = 'put';
            }
            axios[method](api,{data: this.tempProduct})
            .then((res)=>{
                //重新更新列表
                this.getData();
                //關閉彈掉視窗
                this.modalProduct.hide();
                //新增完資料後清除
                this.tempProduct = {};
            })
            .catch((error)=>{
                console.dir(error);
            })
        },
        //刪除資料
        deleteProduct(){
            const api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(api,{data: this.tempProduct})
            .then((res)=>{
                //重新更新列表
                this.getData();
                //關閉彈掉視窗
                this.modalDel.hide();
                //新增完資料後清除
                this.tempProduct = {};
            })
            .catch((error)=>{
                console.dir(error);
            })
        }  
    },
    //生命週期
    mounted(){
        //取出token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //把token存入headers
        axios.defaults.headers.common['Authorization'] = token;
        //執行checkAdmin方法
        this.checkAdmin();
        //new...>建立實體
        this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
        this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
    }
}).mount('#app');