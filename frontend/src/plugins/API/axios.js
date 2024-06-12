import axios from "axios";

const axiosIns = axios.create({
  timeout: 10000,
  headers: {
    "X-Custom-Header": "foobar",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosIns;
