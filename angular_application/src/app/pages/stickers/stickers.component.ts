import { Component } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { Sticker } from '../../models/sticker.model';
import { CommonModule } from '@angular/common';
import { ItemModalComponent } from '../../components/item-modal/item-modal.component';

@Component({
  selector: 'app-stickers',
  standalone: true,
  templateUrl: './stickers.component.html',
  styleUrls: ['./stickers.component.css'],
  imports: [CommonModule, ItemModalComponent],
})
export class StickersComponent {
  stickers: Sticker[] = [];

  constructor(private mockData: MockDataService) {
    this.stickers = this.mockData.getStickers();
  }
}