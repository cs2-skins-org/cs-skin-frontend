// src/app/pages/market/market.component.ts - UPDATED WITH NEON ANIMATIONS
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MarketService } from '../../services/market.service';
import { SkinService } from '../../services/skin.service';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BalanceService } from '../../services/balance.service';
import { MarketListing, SkinInstance, Collection, Rarity, Wear, Skin } from '../../models/interfaces';

// Extended skin interface for image loading state
interface SkinWithImageState extends Skin {
  imageLoaded?: boolean;
  imageFallbackAttempted?: boolean;
  backgroundImageAttempted?: boolean;
  imageLoading?: boolean;
  fallbackAttempted?: boolean;
  alternativeImageUrl?: string;
}

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent implements OnInit {
  private marketService = inject(MarketService);
  private skinService = inject(SkinService);
  private collectionService = inject(CollectionService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private balanceService = inject(BalanceService);
  private fb = inject(FormBuilder);

  // Data
  marketListings: any[] = [];
  userSkinInstances: SkinInstance[] = [];
  filteredListings: any[] = [];
  collections: Collection[] = [];
  
  // State
  loading = true;
  userSkinsLoading = false;
  showSellModal = false;
  selectedSkinToSell: SkinInstance | null = null;
  userBalance = 0;

  // Forms
  filterForm: FormGroup;
  sellForm: FormGroup;

  // Filter/Sort options
  rarityOptions = Object.values(Rarity);
  wearOptions = Object.values(Wear);
  sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  constructor() {
    this.filterForm = this.fb.group({
      search: [''],
      collection: [''],
      rarity: [''],
      wear: [''],
      minPrice: [''],
      maxPrice: [''],
      isStattrak: [false],
      isSouvenir: [false],
      minFloat: [''],
      maxFloat: [''],
      sortBy: ['price_asc']
    });

    this.sellForm = this.fb.group({
      price: ['']
    });
  }

  ngOnInit(): void {
    this.loadMarketData();
    this.loadUserBalance();
    this.setupFilterSubscription();
  }

  // Get current user ID from JWT token
  private getCurrentUserId(): number | null {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  async loadMarketData(): Promise<void> {
    try {
      this.loading = true;
      const [listings, collections] = await Promise.all([
        this.marketService.getAllListings().toPromise(),
        this.collectionService.getAllCollections().toPromise()
      ]);
      
      this.marketListings = listings || [];
      this.collections = collections || [];
      
      // Initialize image loading state for each listing
      this.marketListings.forEach(listing => {
        if (listing.skin) {
          const skinWithState = listing.skin as SkinWithImageState;
          skinWithState.imageLoaded = undefined;
          skinWithState.imageFallbackAttempted = false;
          skinWithState.backgroundImageAttempted = false;
          skinWithState.imageLoading = false;
          skinWithState.fallbackAttempted = false;
          // Initialize purchasing state
          listing.purchasing = false;
        }
      });
      
      this.applyFilters();
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadUserSkins(): Promise<void> {
    try {
      this.userSkinsLoading = true;
      const currentUserId = this.getCurrentUserId();
      
      if (!currentUserId) {
        console.error('No user ID found');
        this.userSkinInstances = [];
        return;
      }

      const allSkinInstances = await this.skinService.getAllSkinInstances().toPromise();
      
      this.userSkinInstances = (allSkinInstances || []).filter(
        (instance: SkinInstance) => 
          instance.owner?.id === currentUserId &&
          !instance.is_listed_for_sale && 
          !instance.is_traded_away
      );
      
      // Initialize image loading state for user skins
      this.userSkinInstances.forEach(instance => {
        if (instance.skin) {
          const skinWithState = instance.skin as SkinWithImageState;
          skinWithState.imageLoaded = undefined;
          skinWithState.imageFallbackAttempted = false;
          skinWithState.backgroundImageAttempted = false;
          skinWithState.imageLoading = false;
          skinWithState.fallbackAttempted = false;
        }
      });
      
    } catch (error) {
      console.error('Error loading user skins:', error);
      this.userSkinInstances = [];
    } finally {
      this.userSkinsLoading = false;
    }
  }

  async loadUserBalance(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
      this.balanceService.updateBalance(balanceData.balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }

  setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filtered = [...this.marketListings];

    if (filters.search) {
      filtered = filtered.filter(item => 
        item.skin.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.skin.weapon_type.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.collection) {
      filtered = filtered.filter(item => item.skin.collection?.id == filters.collection);
    }

    if (filters.rarity) {
      filtered = filtered.filter(item => item.skin.rarity === filters.rarity);
    }

    if (filters.wear) {
      filtered = filtered.filter(item => item.wear === filters.wear);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= parseFloat(filters.maxPrice));
    }

    if (filters.minFloat) {
      filtered = filtered.filter(item => item.float_value >= parseFloat(filters.minFloat));
    }
    if (filters.maxFloat) {
      filtered = filtered.filter(item => item.float_value <= parseFloat(filters.maxFloat));
    }

    if (filters.isStattrak) {
      filtered = filtered.filter(item => item.is_stattrak);
    }

    if (filters.isSouvenir) {
      filtered = filtered.filter(item => item.is_souvenir);
    }

    this.applySorting(filtered, filters.sortBy);
  }

  applySorting(items: any[], sortBy: string): void {
    switch (sortBy) {
      case 'price_asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        items.sort((a, b) => a.skin.name.localeCompare(b.skin.name));
        break;
      case 'name_desc':
        items.sort((a, b) => b.skin.name.localeCompare(a.skin.name));
        break;
    }
    this.filteredListings = items;
  }

  // Enhanced rarity color method
  getRarityColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      'white': 'text-gray-200',
      'blue': 'text-blue-400',
      'dark_blue': 'text-blue-600',
      'purple': 'text-purple-400',
      'pink': 'text-pink-400',
      'red': 'text-red-400',
      'contraband': 'text-yellow-300'
    };
    return colors[rarity] || 'text-white';
  }

  // Enhanced rarity border color method
  getRarityBorderColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      'white': 'border-gray-300/30',
      'blue': 'border-blue-400/40',
      'dark_blue': 'border-blue-600/40',
      'purple': 'border-purple-400/40',
      'pink': 'border-pink-400/40',
      'red': 'border-red-400/40',
      'contraband': 'border-yellow-400/50'
    };
    return colors[rarity] || 'border-white/20';
  }

  // Enhanced background style method
  getSkinBackgroundStyle(skin: any): string {
    const skinWithState = skin as SkinWithImageState;
    
    // If we have an alternative URL that works, use it
    if (skinWithState.alternativeImageUrl) {
      return `url('${skinWithState.alternativeImageUrl}')`;
    }
    
    const imageUrl = this.getSkinImageUrl(skin);
    this.preloadImage(imageUrl, skin);
    return `url('${imageUrl}')`;
  }

  // Enhanced image URL method
  getSkinImageUrl(skin: any): string {
    console.log('=== BACKGROUND IMAGE URL GENERATION ===');
    console.log('Skin name:', skin?.name);
    console.log('Raw database image_path:', skin?.image_path);
    
    if (skin?.image_path && skin.image_path !== null && skin.image_path !== '') {
      let imagePath = skin.image_path;
      
      // Clean the path
      const pathParts = imagePath.split(/[\\\/]+/);
      const filename = pathParts[pathParts.length - 1];
      const cleanFilename = filename.replace(/^\.+/, '').replace(/[<>:"|?*]/g, '').trim();
      
      if (cleanFilename && cleanFilename.length > 0) {
        if (!this.hasImageExtension(cleanFilename)) {
          const pngUrl = `/assets/skins/${cleanFilename}.png`;
          console.log('Generated PNG background URL:', pngUrl);
          return pngUrl;
        } else {
          const finalUrl = `/assets/skins/${cleanFilename}`;
          console.log('Generated background URL with extension:', finalUrl);
          return finalUrl;
        }
      }
    }
    
    console.log('Using fallback background URL');
    return '/assets/skins/AWP_Dragon_Lore.png';
  }

  // Preload image to check if it exists and update loading state
  private preloadImage(imageUrl: string, skin: any): void {
    const skinWithState = skin as SkinWithImageState;
    
    if (skinWithState.backgroundImageAttempted) {
      return;
    }
    
    skinWithState.backgroundImageAttempted = true;
    skinWithState.imageLoading = true;
    skinWithState.imageLoaded = false;
    
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Background image loaded:', skin.name, imageUrl);
      skinWithState.imageLoaded = true;
      skinWithState.imageLoading = false;
    };
    
    img.onerror = () => {
      console.log('❌ Background image failed:', skin.name, imageUrl);
      skinWithState.imageLoaded = false;
      skinWithState.imageLoading = false;
      
      if (!skinWithState.fallbackAttempted) {
        skinWithState.fallbackAttempted = true;
        const alternativeUrl = imageUrl.includes('.png') ? 
          imageUrl.replace('.png', '.jpg') : 
          imageUrl.replace('.jpg', '.png');
        
        console.log('🔄 Trying alternative background format:', alternativeUrl);
        this.preloadAlternativeImage(alternativeUrl, skin);
      }
    };
    
    img.src = imageUrl;
  }

  // Preload alternative image format
  private preloadAlternativeImage(imageUrl: string, skin: any): void {
    const skinWithState = skin as SkinWithImageState;
    skinWithState.imageLoading = true;
    
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Alternative background image loaded:', skin.name, imageUrl);
      skinWithState.imageLoaded = true;
      skinWithState.imageLoading = false;
      skinWithState.alternativeImageUrl = imageUrl;
    };
    
    img.onerror = () => {
      console.log('💀 All background image formats failed:', skin.name);
      skinWithState.imageLoaded = false;
      skinWithState.imageLoading = false;
    };
    
    img.src = imageUrl;
  }

  // Check if image is currently loading
  isImageLoading(skin: any): boolean {
    const skinWithState = skin as SkinWithImageState;
    return skinWithState.imageLoading === true;
  }

  // Check if image is loaded successfully
  isImageLoaded(skin: any): boolean {
    const skinWithState = skin as SkinWithImageState;
    return skinWithState.imageLoaded === true;
  }

  // Get the working image URL (original or alternative)
  getWorkingImageUrl(skin: any): string {
    const skinWithState = skin as SkinWithImageState;
    return skinWithState.alternativeImageUrl || this.getSkinImageUrl(skin);
  }

  // Keep your existing helper method
  private hasImageExtension(path: string): boolean {
    return path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.webp');
  }

  // Legacy image methods for compatibility
  onImageLoad(event: any, skin: any): void {
    const skinWithState = skin as SkinWithImageState;
    skinWithState.imageLoaded = true;
    console.log('✅ Image loaded:', skinWithState.name);
  }

  onImageError(event: any, skin: any): void {
    const skinWithState = skin as SkinWithImageState;
    skinWithState.imageLoaded = false;
    console.log('❌ Image failed:', skinWithState.name, 'URL:', event.target.src);
  }

  // Check if image should be visible
  isImageVisible(skin: any): boolean {
    const skinWithState = skin as SkinWithImageState;
    return skinWithState.imageLoaded === true;
  }

  // Check if fallback should be visible
  isFallbackVisible(skin: any): boolean {
    const skinWithState = skin as SkinWithImageState;
    return skinWithState.imageLoaded === false;
  }

  // Enhanced buy skin method with better UX
  async buySkin(listing: any): Promise<void> {
    if (this.userBalance < listing.price) {
      this.showInsufficientFundsNotification();
      return;
    }

    // Add loading state to button
    listing.purchasing = true;

    if (confirm(`Buy ${listing.skin.name} for $${listing.price}?`)) {
      try {
        const result = await this.marketService.buySkin(listing.id).toPromise();
        
        this.showSuccessNotification(`Successfully purchased ${listing.skin.name}!`);
        
        if (result?.newBalance !== undefined) {
          this.userBalance = result.newBalance;
          this.balanceService.updateBalance(result.newBalance);
        } else {
          await this.loadUserBalance();
        }
        
        this.loadMarketData();
        
      } catch (error) {
        console.error('Error buying skin:', error);
        this.showErrorNotification('Purchase failed. Please try again.');
        this.loadUserBalance();
      } finally {
        listing.purchasing = false;
      }
    } else {
      listing.purchasing = false;
    }
  }

  // Notification methods
  private showInsufficientFundsNotification(): void {
    console.log('Insufficient funds notification');
    // You can implement a proper notification system here
  }

  private showSuccessNotification(message: string): void {
    console.log('Success:', message);
    alert(message); // Replace with proper notification
  }

  private showErrorNotification(message: string): void {
    console.log('Error:', message);
    alert(message); // Replace with proper notification
  }

  // Check if user can afford the item
  canAfford(listing: any): boolean {
    return this.userBalance >= listing.price;
  }

  // Get button text based on affordability and state
  getButtonText(listing: any): string {
    if (listing.purchasing) {
      return 'Purchasing...';
    }
    return this.canAfford(listing) ? 'Buy Now' : 'Insufficient Funds';
  }

  // Get button class based on state
  getButtonClass(listing: any): string {
    const baseClass = 'action-btn';
    
    if (listing.purchasing) {
      return `${baseClass} purchasing-btn`;
    }
    
    return this.canAfford(listing) ? `${baseClass} buy-btn` : `${baseClass} insufficient-btn`;
  }

  openSellModal(): void {
    this.showSellModal = true;
    this.loadUserSkins();
  }

  closeSellModal(): void {
    this.showSellModal = false;
    this.selectedSkinToSell = null;
    this.sellForm.reset();
  }

  selectSkinToSell(skin: SkinInstance): void {
    this.selectedSkinToSell = skin;
    this.sellForm.patchValue({ price: skin.skin.base_price });
  }

  async listSkinForSale(): Promise<void> {
    if (!this.selectedSkinToSell || this.sellForm.invalid) return;

    const price = this.sellForm.value.price;
    
    try {
      await this.marketService.listSkinForSale(this.selectedSkinToSell.id, price).toPromise();
      alert('Skin listed for sale successfully!');
      this.closeSellModal();
      this.loadMarketData();
    } catch (error) {
      console.error('Error listing skin:', error);
      alert('Failed to list skin. Please try again.');
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      collection: '',
      rarity: '',
      wear: '',
      minPrice: '',
      maxPrice: '',
      isStattrak: false,
      isSouvenir: false,
      minFloat: '',
      maxFloat: '',
      sortBy: 'price_asc'
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}