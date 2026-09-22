import axios from 'axios';
// //
// // export default axios.craate({
// //   baseURL:'192.168.100.2/baqi/'
// // })
export const uri = axios.create({
    baseURL: '',
    timeout: 1000
});
