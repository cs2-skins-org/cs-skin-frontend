import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Skin } from '../../models/skin.model';
import { ItemModalComponent } from '../../components/item-modal/item-modal.component';

@Component({
  selector: 'app-knives',
  standalone: true,
  imports: [CommonModule, ItemModalComponent],
  templateUrl: './knives.component.html',
  styleUrls: ['./knives.component.css']
})
export class KnivesComponent {
  knives: Skin[] = [];

  constructor(private mockData: MockDataService) {
    this.knives = this.mockData.getSkins().filter(skin => 
      'Knives'.includes(skin.weapon_type)
    );
  }
}