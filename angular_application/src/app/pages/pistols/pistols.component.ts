import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Skin } from '../../models/skin.model';
import { ItemModalComponent } from '../../components/item-modal/item-modal.component';

@Component({
  selector: 'app-pistols',
  standalone: true,
  imports: [CommonModule, ItemModalComponent],
  templateUrl: './pistols.component.html',
  styleUrls: ['./pistols.component.css']
})
export class PistolsComponent {
  pistols: Skin[] = [];

  constructor(private mockData: MockDataService) {
    this.pistols = this.mockData.getSkins().filter(skin => 
      'Pistols'.includes(skin.weapon_type)
    );
  }
}