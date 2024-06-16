import axios from 'axios';

const axiosIns = axios.create({
  timeout: 10000,
  headers: {
    'client_id': clientID.data,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosIns;
