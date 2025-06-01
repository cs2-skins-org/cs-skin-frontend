// src/app/pages/collections/collections.component.ts
import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Collection } from "../../models/interfaces";
import { CollectionService } from "../../services/collection.service";

// Extended collection interface for image loading state
interface CollectionWithImageState extends Collection {
  imageLoaded?: boolean;
  imageLoading?: boolean;
  fallbackAttempted?: boolean;
  alternativeImageUrl?: string;
}

@Component({
  selector: "app-collections",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./collections.component.html",
  styleUrl: "./collections.component.css",
})
export class CollectionsComponent implements OnInit {
  private collectionService = inject(CollectionService);

  collections: CollectionWithImageState[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.loading = true;
    this.error = null;

    this.collectionService.getAllCollections().subscribe({
      next: (collections: Collection[]) => {
        // Initialize collections with image state
        this.collections = collections.map(collection => ({
          ...collection,
          imageLoaded: undefined,
          imageLoading: false,
          fallbackAttempted: false
        }));
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

  // Generate image URL from collection name
  getCollectionImageUrl(collection: CollectionWithImageState): string {
    console.log('=== COLLECTION IMAGE URL GENERATION ===');
    console.log('Collection name:', collection?.name);
    
    if (collection?.name) {
      // Convert collection name to image filename
      // "The Cobblestone Collection" -> "The_Cobblestone_Collection"
      const imageName = collection.name
        .replace(/\s+/g, '_')  // Replace spaces with underscores
        .replace(/[^\w\s_-]/g, ''); // Remove special characters except underscores and hyphens
      
      // Try .jpg first
      const imageUrl = `/assets/collections/${imageName}.jpg`;
      console.log('Generated collection image URL:', imageUrl);
      return imageUrl;
    }
    
    // Fallback image
    console.log('Using fallback collection image');
    return '/assets/collections/default_collection.jpg';
  }

  // Get background style for collection
  getCollectionBackgroundStyle(collection: CollectionWithImageState): string {
    // Use alternative URL if available
    if (collection.alternativeImageUrl) {
      return `url('${collection.alternativeImageUrl}')`;
    }
    
    const imageUrl = this.getCollectionImageUrl(collection);
    this.preloadImage(imageUrl, collection);
    return `url('${imageUrl}')`;
  }

  // Preload collection image
  private preloadImage(imageUrl: string, collection: CollectionWithImageState): void {
    if (collection.imageLoaded !== undefined || collection.imageLoading) {
      return;
    }
    
    collection.imageLoading = true;
    collection.imageLoaded = false;
    
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Collection image loaded:', collection.name, imageUrl);
      collection.imageLoaded = true;
      collection.imageLoading = false;
    };
    
    img.onerror = () => {
      console.log('❌ Collection image failed:', collection.name, imageUrl);
      collection.imageLoaded = false;
      collection.imageLoading = false;
      
      if (!collection.fallbackAttempted) {
        collection.fallbackAttempted = true;
        
        // Try alternative format
        let alternativeUrl: string;
        if (imageUrl.includes('.jpg')) {
          alternativeUrl = imageUrl.replace('.jpg', '.png');
        } else if (imageUrl.includes('.png')) {
          alternativeUrl = imageUrl.replace('.png', '.jpg');
        } else {
          alternativeUrl = imageUrl + '.png';
        }
        
        console.log('🔄 Trying alternative format:', alternativeUrl);
        this.preloadAlternativeImage(alternativeUrl, collection);
      }
    };
    
    img.src = imageUrl;
  }

  // Preload alternative image format
  private preloadAlternativeImage(imageUrl: string, collection: CollectionWithImageState): void {
    collection.imageLoading = true;
    
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Alternative collection image loaded:', collection.name, imageUrl);
      collection.imageLoaded = true;
      collection.imageLoading = false;
      collection.alternativeImageUrl = imageUrl;
    };
    
    img.onerror = () => {
      console.log('💀 All collection image formats failed:', collection.name);
      collection.imageLoaded = false;
      collection.imageLoading = false;
    };
    
    img.src = imageUrl;
  }

  // Check if image is loaded
  isImageLoaded(collection: CollectionWithImageState): boolean {
    return collection.imageLoaded === true;
  }

  // Check if image is loading
  isImageLoading(collection: CollectionWithImageState): boolean {
    return collection.imageLoading === true;
  }

  // Navigate to collection details
  viewCollection(collectionId: number): void {
    console.log('Viewing collection:', collectionId);
    // Add navigation logic here when you have collection detail page
  }

  trackById(index: number, item: CollectionWithImageState): number {
    return item.id;
  }
}