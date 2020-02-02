import store from '@/store'
import axios from 'axios'
import 'vue-axios';
export function imgupload(param) {
    var fileObj = param.file;
    // FormData 对象
    let url1 = process.env.VUE_APP_BASE_API + '/image/uplode'
    var form = new FormData();
    form.append('file', fileObj);
    axios({
        method: 'post',
        url: url1,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: form
    }).then(res => {
        return res;
    });
}