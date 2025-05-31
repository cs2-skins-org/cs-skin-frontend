/**
 * @file skin.service.ts
 * @description Contains the SkinService class which handles skin-related HTTP operations.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skin, SkinInstance } from '../models/interfaces';

/**
 * Service for handling skin related operations.
 *
 * @class SkinService
 * @remarks
 * Available throughout the root injector.
 */
@Injectable({
  providedIn: 'root'
})
export class SkinService {
  /**
   * HttpClient instance for making HTTP requests.
   * @private
   */
  private http = inject(HttpClient);
  
  /**
   * Base API URL for skin endpoints.
   * @private
   */
  private apiUrl = 'http://localhost:3000/skin';
  
  /**
   * Base API URL for skin instance endpoints.
   * @private
   */
  private instanceApiUrl = 'http://localhost:3000/skin-instances';

  /**
   * Retrieves all skins.
   *
   * @returns {Observable<Skin[]>} An observable containing an array of skins.
   */
  getAllSkins(): Observable<Skin[]> {
    return this.http.get<Skin[]>(`${this.apiUrl}/findAll`);
  }

  /**
   * Retrieves a skin by its ID.
   *
   * @param {number} id - The ID of the skin.
   * @returns {Observable<Skin>} An observable containing the skin.
   */
  getSkinById(id: number): Observable<Skin> {
    return this.http.get<Skin>(`${this.apiUrl}/findById/${id}`);
  }

  /**
   * Searches skins by name.
   *
   * @param {string} name - The name to search for.
   * @returns {Observable<Skin[]>} An observable containing an array of skins matching the name.
   */
  searchSkinsByName(name: string): Observable<Skin[]> {
    return this.http.get<Skin[]>(`${this.apiUrl}/searchSkinsByName/${name}`);
  }

  /**
   * Retrieves all skin instances.
   *
   * @returns {Observable<SkinInstance[]>} An observable containing an array of skin instances.
   */
  getAllSkinInstances(): Observable<SkinInstance[]> {
    return this.http.get<SkinInstance[]>(this.instanceApiUrl);
  }

  /**
   * Retrieves a skin instance by its ID.
   *
   * @param {number} id - The ID of the skin instance.
   * @returns {Observable<SkinInstance>} An observable containing the skin instance.
   */
  getSkinInstanceById(id: number): Observable<SkinInstance> {
    return this.http.get<SkinInstance>(`${this.instanceApiUrl}/${id}`);
  }

  /**
   * Creates a new skin (admin only).
   *
   * @param {Partial<Skin>} skin - An object with the skin fields to create.
   * @returns {Observable<Skin>} An observable containing the newly created skin.
   */
  createSkin(skin: Partial<Skin>): Observable<Skin> {
    return this.http.post<Skin>(this.apiUrl, skin);
  }

  /**
   * Creates multiple skins in bulk (admin only).
   *
   * @param {Partial<Skin>[]} skins - An array of skin objects to create.
   * @returns {Observable<Skin[]>} An observable containing an array of created skins.
   */
  createBulkSkins(skins: Partial<Skin>[]): Observable<Skin[]> {
    return this.http.post<Skin[]>(`${this.apiUrl}/bulk`, skins);
  }

  /**
   * Updates a skin (admin only).
   *
   * @param {number} id - The ID of the skin to update.
   * @param {Partial<Skin>} skin - An object containing the skin fields to update.
   * @returns {Observable<Skin>} An observable containing the updated skin.
   */
  updateSkin(id: number, skin: Partial<Skin>): Observable<Skin> {
    return this.http.patch<Skin>(`${this.apiUrl}/update/${id}`, skin);
  }

  /**
   * Deletes a skin (admin only).
   *
   * @param {number} id - The ID of the skin to delete.
   * @returns {Observable<void>} An observable of the deletion result.
   */
  deleteSkin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}