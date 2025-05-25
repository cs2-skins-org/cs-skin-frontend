import { Injectable } from '@angular/core';
import { Collection } from '../models/collection.model';
import { SkinInstance } from '../models/skin-instance.model';
import { Skin } from '../models/skin.model';
import { Sticker } from '../models/sticker.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private collections: Collection[] = [
    { id: 1, name: 'Danger Zone', release_year: 2018 },
    { id: 2, name: 'Prisma', release_year: 2019 },
    { id: 3, name: 'Fracture', release_year: 2020 }
  ];

  private skins: Skin[] = [
    {
      id: 1,
      name: 'AK-47 | Asiimov',
      weapon_type: 'Rifle',
      rarity: 'Covert',
      collection_id: 1,
      release_date: new Date('2018-12-06'),
      base_price: 125.99,
      image_path: 'assets/skins/ak47-asiimov.jpg'
    },
    {
      id: 2,
      name: 'AWP | Neo-Noir',
      weapon_type: 'Sniper Rifle',
      rarity: 'Classified',
      collection_id: 2,
      release_date: new Date('2019-03-28'),
      base_price: 89.50,
      image_path: 'assets/skins/awp-neonoir.jpg'
    },
  ];

  private skinInstances: SkinInstance[] = [
    {
      id: 1,
      skin_id: 1,
      owner_id: null,
      float_value: 0.072356,
      is_stattrak: false,
      is_souvenir: false,
      wear: 'Minimal Wear',
      trade_locked_until: null
    },
    {
      id: 2,
      skin_id: 2,
      owner_id: null,
      float_value: 0.152489,
      is_stattrak: true,
      is_souvenir: false,
      wear: 'Field-Tested',
      trade_locked_until: null
    },
  ];

  private stickers: Sticker[] = [
    {
      id: 1,
      name: 'Foil Katowice 2014',
      rarity: 'Extraordinary',
      image_path: 'assets/stickers/foil-katowice.jpg'
    },
    {
      id: 2,
      name: 'Cologne 2016',
      rarity: 'High Grade',
      image_path: 'assets/stickers/cologne-2016.jpg'
    },
  ];

  getCollections(): Collection[] {
    return this.collections;
  }

  getSkins(): Skin[] {
    return this.skins;
  }
  
  getStickers(): Sticker[] {
    return this.stickers;
  }
  
  getCollectionById(id: number): Collection | undefined {
    return this.collections.find(c => c.id === id);
  }

  getItemsByCollection(collectionId: number): Skin[] {
    return this.skins.filter(skin => skin.collection_id === collectionId);
  }

  getAvailableSkinInstances(): SkinInstance[] {
    return this.skinInstances.filter(instance => instance.owner_id === null);
  }

  getSkinById(id: number): Skin | undefined {
    return this.skins.find(skin => skin.id === id);
  }
}