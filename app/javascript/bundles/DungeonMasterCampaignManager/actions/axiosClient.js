import axios from 'axios';
import ReactOnRails from 'react-on-rails';

const axiosClient = axios.create({
  baseURL: '',
  headers: ReactOnRails.authenticityHeaders(),
});

export default axiosClient;
