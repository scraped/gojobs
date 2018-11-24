import {AxiosPromise} from 'axios';
import NewApiBasicFetcher from './NewApiBasicFetcher';

export default class NewApiJobListFetcher extends NewApiBasicFetcher {
  fetch({type, id, plat, pageIndex = 0}): AxiosPromise<any> {
    let params = {
      sort: 'date',
      pageIndex,
      pageSize: 30,
      includeCommentCount: false,
      title: 'gtav',
    };

    if (plat) {
      params.platform = plat;
    }

    switch (type) {
      case 'rockstar':
        if (id === 'rockstar') params.filter = 'rockstar';
        if (id === 'verified') params.filter = 'rockstarVerified';
        break;

      case 'user':
        params.creatorRockstarId = id;
        break;

      case 'crew':
        params.filter = 'crew';
        params.crewId = id;
        break;

      default:
    }

    return this.http({
      url: '/search/mission',
      params,
    });
  }
}
