import { Routes } from '@angular/router';
import { ShopComponent } from './pages/shop/shop.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { GunsComponent } from './pages/guns/guns.component';
import { KnivesComponent } from './pages/knives/knives.component';
import { PistolsComponent } from './pages/pistols/pistols.component';
import { StickersComponent } from './pages/stickers/stickers.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  { path: '', component: ShopComponent, title: 'CS2 Skins Shop' },
  { path: 'collections', component: CollectionsComponent, title: 'Collections' },
  { path: 'guns', component: GunsComponent, title: 'Guns' },
  { path: 'knives', component: KnivesComponent, title: 'Knives' },
  { path: 'pistols', component: PistolsComponent, title: 'Pistols' },
  { path: 'stickers', component: StickersComponent, title: 'Stickers' },
  { path: 'profile', component: ProfileComponent, title: 'Profile' },
  { path: 'auth', component: AuthComponent, title: 'Authentication' },
  { path: 'stickers', component: StickersComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'auth', component: AuthComponent, title: 'Login' },
  { path: 'profile', component: ProfileComponent, title: 'Your Profile' }
];