import { Component } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { Collection } from '../../models/collection.model';
import { Skin } from '../../models/skin.model';
import { CommonModule } from '@angular/common';
import { CollectionModalComponent } from '../../components/collection-modal/collection-modal.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, CollectionModalComponent],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent {
  collections: Collection[] = [];
  selectedCollection: Collection | null = null;
  collectionItems: Skin[] = [];
  showModal = false;

  constructor(public mockData: MockDataService) {
    this.collections = this.mockData.getCollections();
  }

  openCollectionModal(collection: Collection) {
    this.selectedCollection = collection;
    this.collectionItems = this.mockData.getItemsByCollection(collection.id);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}