import {AxiosPromise} from 'axios';
import NewApiBasicFetcher from './NewApiBasicFetcher';

export default class NewApiCrewFetcher extends NewApiBasicFetcher {
  fetch({crewSlug}): AxiosPromise<any> {
    return this.http({
      url: '/crew/byname',
      params: {
        name: crewSlug,
      },
    });
  }
}
