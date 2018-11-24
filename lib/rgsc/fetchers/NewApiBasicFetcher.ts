import axios, {AxiosInstance, AxiosPromise} from 'axios';
import {IFetcher} from './IFetcher';

export default class NewApiBasicFetcher implements IFetcher {
  protected http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://scapi.rockstargames.com',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
        'x-amc': true,
        'x-lang': 'en-US',
      },
    });
  }

  fetch(params: object): AxiosPromise<any> {
    return this.http(params);
  }
}
