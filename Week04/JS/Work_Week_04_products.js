import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import pagination from './pagination.js';
import ProductModal from './ProductModal.js';
import ProductModalDel from './ProductModalDel.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = '_shun0130';

createApp({
    // 資料
    data() {
        return {
            products: [],
            tempProduct: {
                imageUrl: []
            },
            pages:{},
            modalProduct: null,
            modalDel: null,
            //判斷
            isNew: false,
        };
    },
    //方法
    methods: {
        //驗證身分
        checkAdmin() {
            axios.post(`${apiUrl}/api/user/check`)
                .then((res) => {
                    this.getData();
                })
                .catch((error) => {
                    console.dir(error);
                })
        },
        //取得資料
        getData(page) {
            axios.get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`)
                .then((res) => {
                    this.products = res.data.products;
                    this.pages = res.data.pagination;
                    console.log(res);
                })
                .catch((error) => {
                    console.dir(error);
                })
        },
        openModal(status, item) {
            if (status === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                this.$refs.pModal.openModal();
            } else if (status === 'edit') {
                this.tempProduct = { ...item };
                if (!Array.isArray(this.tempProduct.imagesUrl)) {
                    this.tempProduct.imagesUrl = [];
                }
                this.isNew = false;
                this.$refs.pModal.openModal();
            } else if (status === 'delete') {
                this.tempProduct = { ...item };
                this.$refs.dModal.openModal();
            }
        },
        //新增資料
        updateProduct() {
            //新增
            let api = `${apiUrl}/api/${apiPath}/admin/product`;
            let method = 'post';
            //修改資料
            if (!this.isNew) {
                api = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`
                method = 'put';
            }
            axios[method](api, { data: this.tempProduct })
                .then((res) => {
                    //重新更新列表
                    this.getData();
                    //關閉彈掉視窗
                    this.$refs.pModal.closeModal();
                    //新增完資料後清除
                    this.tempProduct = {};
                })
                .catch((error) => {
                    console.dir(error);
                })
        },
        //刪除資料
        deleteProduct() {
            const api = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(api, { data: this.tempProduct })
                .then((res) => {
                    //重新更新列表
                    this.getData();
                    //關閉彈掉視窗
                    this.$refs.dModal.closeModel();
                })
                .catch((error) => {
                    console.dir(error);
                })
        }
    },
    //生命週期
    mounted() {
        //取出token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //把token存入headers
        axios.defaults.headers.common['Authorization'] = token;
        //執行checkAdmin方法
        this.checkAdmin();
        //new...>建立實體
    },
    components: {
        pagination,
        ProductModal,
        ProductModalDel
    }
}).mount('#app');