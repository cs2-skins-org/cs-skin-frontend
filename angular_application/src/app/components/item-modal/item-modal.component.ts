import { Component, Input } from '@angular/core';
import { Skin } from '../../models/skin.model';
import { Sticker } from '../../models/sticker.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  imports: [CommonModule],
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent {
  @Input() item: any;
  @Input() type: 'skin' | 'sticker' = 'skin';
  isOpen = false;

  addToCart() { //placeholder for actual cart logic
    console.log('Item would be added to cart:', this.item);
  }
  
  getSkinName(): string {
    return (this.item as Skin)?.name || '';
  }

  getSkinImage(): string {
    return (this.item as Skin)?.image_path || '';
  }

  getSkinWeaponType(): string {
    return (this.item as Skin)?.weapon_type || '';
  }

  getSkinRarity(): string {
    return (this.item as Skin)?.rarity || '';
  }

  getSkinPrice(): string {
    return (this.item as Skin)?.base_price?.toFixed(2) || '0.00';
  }

  getStickerName(): string {
    return (this.item as Sticker)?.name || '';
  }

  getStickerImage(): string {
    return (this.item as Sticker)?.image_path || '';
  }

  getStickerRarity(): string {
    return (this.item as Sticker)?.rarity || '';
  }

  openModal(item: Skin | Sticker, type: 'skin' | 'sticker') {
    this.item = item;
    this.type = type;
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}