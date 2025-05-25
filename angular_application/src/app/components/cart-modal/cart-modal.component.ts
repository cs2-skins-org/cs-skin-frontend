import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
  isOpen = false;
  hideCart = false;
  
  // Mock data for demonstration
  cartItems = [
    {
      type: 'skin',
      name: 'AK-47 | Asiimov',
      image_path: 'assets/skins/ak47-asiimov.jpg',
      base_price: 125.99,
      weapon_type: 'Rifle'
    },
    {
      type: 'sticker',
      name: 'Foil Katowice 2014',
      image_path: 'assets/stickers/foil-katowice.jpg',
      base_price: 45.00,
      rarity: 'Extraordinary'
    }
  ];

  constructor(private router: Router) { //hide on specific pages
    this.router.events.subscribe(() => {
      this.hideCart = ['/auth', '/profile'].includes(this.router.url);
    });
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
  }

  // Mock functions
  checkout() {
    console.log('Proceeding to checkout (would navigate in real implementation)');
    this.router.navigate(['/profile']);
    this.isOpen = false;
  }

  getItemType(item: any): string {
    return item.type === 'skin' ? item.weapon_type : item.rarity;
  }

  removeItem(index: number) {
    console.log('Removing item at index:', index);
    this.cartItems.splice(index, 1);
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.base_price, 0);
  }
}