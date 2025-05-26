import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // User placeholder data
  user = {
    username: 'CS2_Player',
    email: 'player@example.com',
    steamId: 'STEAM_0:1:12345678',
    joinDate: 'January 2023',
    avatar: 'assets/avatar.jpg',
    balance: 245.67
  };

  // Inventory placeholder data
  inventory = [
    {
      type: 'skin',
      name: 'AK-47 | Asiimov',
      image: 'assets/skins/ak47-asiimov.jpg',
      price: 125.99,
      acquired: '3 days ago'
    },
    {
      type: 'sticker',
      name: 'Foil Katowice 2014',
      image: 'assets/stickers/foil-katowice.jpg',
      price: 45.00,
      acquired: '1 week ago'
    },
    {
      type: 'skin',
      name: 'AWP | Neo-Noir',
      image: 'assets/skins/awp-neonoir.jpg',
      price: 89.50,
      acquired: '2 weeks ago'
    }
  ];

  showTopUpModal = false;
  depositAmount = 0;
  cardDetails = {
    number: '',
    expiry: '',
    cvv: ''
  };

  openTopUpModal() {
    this.showTopUpModal = true;
  }

  submitDeposit() {
    console.log('Depositing:', this.depositAmount, 'with card:', this.cardDetails);
    
    this.user.balance += this.depositAmount;
    
    this.depositAmount = 0;
    this.cardDetails = { number: '', expiry: '', cvv: '' };
    this.showTopUpModal = false;
  }

  isValidDeposit(): boolean {
  return (
    this.depositAmount >= 5 && // Minimum $5 deposit
    this.depositAmount <= 1000 && // Maximum $1000
    this.cardDetails.number?.length === 16 &&
    this.cardDetails.expiry?.length === 5 &&
    this.cardDetails.cvv?.length === 3
  );
}
}