import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { SkinInstance } from '../../models/skin-instance.model';
import { ItemModalComponent } from '../../components/item-modal/item-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemModalComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  skinInstances: SkinInstance[] = [];
  filteredSkins: SkinInstance[] = [];
  
  constructor(private mockData: MockDataService) {
    this.skinInstances = mockData.getAvailableSkinInstances();
    this.filteredSkins = [...this.skinInstances];
  }

  getSkinDetails(instance: SkinInstance) {
    return this.mockData.getSkinById(instance.skin_id);
  }
}