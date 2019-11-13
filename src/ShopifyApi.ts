import axios from 'axios';
import { IParams, IOrder, RequestInterface } from './contracts'

// https://github.com/axios/axios/issues/1510#issuecomment-448201698
// Overrides AxiosResponse so we can specifically return Shopify Response data.
declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

export class ShopifyApi {
  urlBase: string = '';

  constructor(
    public shopUrl: string,
    public apiKey: string,
    public password: string,
  ) {
    // Instantiate base url for api
    this.urlBase = `https://${this.apiKey}:${this.password}@${this.shopUrl}/admin/api/2019-10/`
  }

  // https://github.com/axios/axios#creating-an-instance
  // Could specifc more of config here
  private shopAxios = axios.create();

  // Get orders from limited selection of params
  async getAllOrders({ limit, pMin, pMax, financialStatus }: IParams): Promise<IOrder[]>{
    const paramString = `?limit=${limit}&processed_at_min=${pMin}&processed_at_max=${pMax}&financial_status=${financialStatus}`
    const url = this.urlBase + `orders.json${paramString}`

    let response = await this.shopAxios.get<RequestInterface>(url);
    return response.data;
  }
}