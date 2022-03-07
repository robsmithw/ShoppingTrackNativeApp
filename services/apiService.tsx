import { API_BASE } from '@env'
import axios, { AxiosInstance } from "axios";
import 'react-native-get-random-values'; //has to be imported for uuid
import { v4 as uuidv4 } from 'uuid';

export class ApiService {
  constructor(readonly bearer?: string) {}

  public getAxiosInstance = () => {
    let axiosInstance: AxiosInstance = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-type': 'application/json'
      }
    });
    
    axiosInstance.interceptors.request
    .use(
      config => {
        if (config.headers !== undefined){
          config.headers['X-CorrelationId'] = uuidv4();
          
          if (this.bearer !== undefined){
            config.headers['Authorization'] = 'Bearer ' + this.bearer;
          }
        }
        return config;
      }
    );

    return axiosInstance;
  }
}
