/**
 * @file market.service.ts
 * @description Contains the MarketService class which handles market-related HTTP operations.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketListing } from '../models/interfaces';

/**
 * Service for handling market related operations.
 *
 * @class MarketService
 * @remarks
 * Available throughout the root injector.
 */
@Injectable({
  providedIn: 'root'
})
export class MarketService {
  /**
   * HttpClient instance for making HTTP requests.
   * @private
   */
  private http = inject(HttpClient);

  /**
   * Base API URL for market endpoints.
   * @private
   */
  private apiUrl = 'http://localhost:3000/market';

  /**
   * Retrieves all market listings.
   *
   * @returns {Observable<MarketListing[]>} An observable containing an array of market listings.
   */
  getAllListings(): Observable<MarketListing[]> {
    return this.http.get<MarketListing[]>(this.apiUrl);
  }

  /**
   * Lists a skin instance for sale on the market.
   *
   * @param {number} skinInstanceId - The ID of the skin instance to list.
   * @param {number} price - The sale price for the skin.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  listSkinForSale(skinInstanceId: number, price: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/list`, { skinInstanceId, price });
  }

  /**
   * Buys a skin from the market.
   *
   * @param {number} skinInstanceId - The ID of the skin instance to purchase.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  buySkin(skinInstanceId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy/${skinInstanceId}`, {});
  }
}