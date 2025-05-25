import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skin } from '../../models/skin.model';
import { Collection } from '../../models/collection.model';

@Component({
  selector: 'app-collection-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-modal.component.html',
  styleUrls: ['./collection-modal.component.css']
})
export class CollectionModalComponent {
  @Input() collection: Collection | null = null;
  @Input() items: Skin[] = [];
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }
}