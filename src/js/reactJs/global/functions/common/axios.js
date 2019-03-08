import axios from 'axios';

export async function axiosAPI({ src, data, headers }) {
    
    if (src) {
        let res = await axios({
            method: 'post',
            url: src,
            data: data
        }).then(function (response) {
            return response.data
        });


        return await res;
    }


}