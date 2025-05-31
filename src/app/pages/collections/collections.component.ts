import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Collection } from "../../models/interfaces";
import { CollectionService } from "../../services/collection.service";

/**
 * CollectionsComponent displays a list of collections and handles
 * the data loading and error states.
 *
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: "app-collections",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./collections.component.html",
  styleUrl: "./collections.component.css",
})
export class CollectionsComponent implements OnInit {
  /**
   * Service to fetch collection data.
   * @private
   */
  private collectionService = inject(CollectionService);

  /**
   * Array holding the collections data.
   * @type {Collection[]}
   */
  collections: Collection[] = [];

  /**
   * Indicates whether the component is currently loading data.
   * @type {boolean}
   */
  loading: boolean = true;

  /**
   * Holds an error message in case the collections fail to load.
   * @type {string | null}
   */
  error: string | null = null;

  /**
   * Lifecycle hook called after data-bound properties are initialized.
   * Loads the collections data.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadCollections();
  }

  /**
   * Loads all collections using the CollectionService.
   * Handles success and error responses by updating the component state.
   *
   * @returns {void}
   */
  loadCollections(): void {
    this.loading = true;
    this.error = null;

    this.collectionService.getAllCollections().subscribe({
      next: (collections: Collection[]) => {
        this.collections = collections;
        this.loading = false;
        console.log("Collections loaded:", collections);
      },
      error: (error: any) => {
        this.error = "Failed to load collections";
        this.loading = false;
        console.error("Error loading collections:", error);
      },
    });
  }

  /**
   * TrackBy function to optimize ngFor rendering.
   *
   * @param {number} index - The index of the current item.
   * @param {Collection} item - The current collection item.
   * @returns {number} The unique ID of the collection.
   */
  trackById(index: number, item: Collection): number {
    return item.id;
  }
}