import {AxiosPromise} from 'axios';
import NewApiBasicFetcher from './NewApiBasicFetcher';

export default class NewApiJobFetcher extends NewApiBasicFetcher {
  fetch({jobId}): AxiosPromise<any> {
    return this.http({
      url: '/ugc/mission/details',
      params: {
        title: 'gtav',
        contentId: jobId,
      },
    });
  }
}
