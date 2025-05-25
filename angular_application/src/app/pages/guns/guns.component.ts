import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Skin } from '../../models/skin.model';
import { ItemModalComponent } from '../../components/item-modal/item-modal.component';

@Component({
  selector: 'app-guns',
  standalone: true,
  imports: [CommonModule, ItemModalComponent],
  templateUrl: './guns.component.html',
  styleUrls: ['./guns.component.css']
})
export class GunsComponent {
  guns: Skin[] = [];

  constructor(private mockData: MockDataService) {
    this.guns = this.mockData.getSkins().filter(skin => 
      ['Rifle', 'SMG', 'Heavy', 'Sniper Rifle'].includes(skin.weapon_type)
    );
  }
}