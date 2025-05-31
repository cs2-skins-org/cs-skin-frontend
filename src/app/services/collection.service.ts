// src/app/services/collection.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '../models/interfaces';

/**
 * Service for handling collection related operations.
 *
 * @class CollectionService
 */
@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  /**
   * HttpClient instance for making HTTP requests.
   * @private
   */
  private http = inject(HttpClient);

  /**
   * Base API URL for collection endpoints.
   * @private
   */
  private apiUrl = 'http://localhost:3000/collections'; // Adjust to your backend URL

  /**
   * Retrieves all collections.
   *
   * @returns {Observable<Collection[]>} An observable containing an array of collections.
   */
  getAllCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.apiUrl);
  }

  /**
   * Retrieves a collection by its ID.
   *
   * @param {number} id - The ID of the collection.
   * @returns {Observable<Collection>} An observable containing the collection.
   */
  getCollectionById(id: number): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new collection (admin only).
   *
   * @param {Partial<Collection>} collection - The collection data to create.
   * @returns {Observable<Collection>} An observable containing the created collection.
   */
  createCollection(collection: Partial<Collection>): Observable<Collection> {
    return this.http.post<Collection>(this.apiUrl, collection);
  }

  /**
   * Updates an existing collection (admin only).
   *
   * @param {number} id - The ID of the collection to update.
   * @param {Partial<Collection>} collection - An object containing the collection fields to update.
   * @returns {Observable<Collection>} An observable containing the updated collection.
   */
  updateCollection(id: number, collection: Partial<Collection>): Observable<Collection> {
    return this.http.put<Collection>(`${this.apiUrl}/${id}`, collection);
  }

  /**
   * Deletes a collection (admin only).
   *
   * @param {number} id - The ID of the collection to delete.
   * @returns {Observable<void>} An observable that completes when the collection is deleted.
   */
  deleteCollection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}