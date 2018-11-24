export interface IFetcher {
  fetch(...params: any): Promise<any>;
}
