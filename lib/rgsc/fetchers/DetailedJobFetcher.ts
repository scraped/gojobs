import axios, {AxiosInstance} from 'axios';
import {IFetcher} from './IFetcher';

type fetchParams = {
  id: string;
  specialNumber: number | string;
}

class JobDetailedFetcher implements IFetcher {
  protected http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://prod.cloud.rockstargames.com/',
    });
  }

  fetch({id, specialNumber}: fetchParams): Promise<any> {
    return this.http({
      url: `/ugc/gta5mission/${specialNumber}/${id}/0_0_en.json`,
    });
  }
}
