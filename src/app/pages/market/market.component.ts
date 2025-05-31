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

/**
 * Extended skin interface to include image loading states.
 * @interface
 * @extends {Skin}
 */
interface SkinWithImageState extends Skin {
  /** Indicates if the skin image has successfully loaded. */
  imageLoaded?: boolean;
  /** Indicates if a fallback image load has been attempted. */
  imageFallbackAttempted?: boolean;
}

/**
 * MarketComponent displays market listings and allows user interactions such as filtering, buying, and selling skins.
 *
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent implements OnInit {
  /** Market service injected instance. */
  private marketService = inject(MarketService);
  /** Skin service injected instance. */
  private skinService = inject(SkinService);
  /** Collection service injected instance. */
  private collectionService = inject(CollectionService);
  /** User service injected instance. */
  private userService = inject(UserService);
  /** Auth service injected instance. */
  private authService = inject(AuthService);
  /** Balance service injected instance. */
  private balanceService = inject(BalanceService);
  /** Form builder injected instance. */
  private fb = inject(FormBuilder);

  /** Array of market listings. */
  marketListings: any[] = [];
  /** Array of skin instances owned by the current user. */
  userSkinInstances: SkinInstance[] = [];
  /** Array of filtered market listings based on applied filters. */
  filteredListings: any[] = [];
  /** Array of skin collections. */
  collections: Collection[] = [];
  
  /** Indicates if the market data is loading. */
  loading = true;
  /** Indicates if the user's skins are loading. */
  userSkinsLoading = false;
  /** Controls the visibility of the sell modal. */
  showSellModal = false;
  /** Currently selected skin to sell. */
  selectedSkinToSell: SkinInstance | null = null;
  /** The user's balance. */
  userBalance = 0;

  /** Form group for filters. */
  filterForm: FormGroup;
  /** Form group for selling a skin. */
  sellForm: FormGroup;

  /** Options for skin rarity selection. */
  rarityOptions = Object.values(Rarity);
  /** Options for skin wear selection. */
  wearOptions = Object.values(Wear);
  /** Options for sorting market listings. */
  sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  /**
   * Creates an instance of MarketComponent.
   */
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

  /**
   * Lifecycle hook called after data-bound properties of a directive are initialized.
   * Initializes market data, user balance, and filter subscription.
   */
  ngOnInit(): void {
    this.loadMarketData();
    this.loadUserBalance();
    this.setupFilterSubscription();
  }

  /**
   * Retrieves the current user ID from the JWT token.
   *
   * @returns {number | null} The user ID if present, otherwise null.
   */
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

  /**
   * Loads market listings and collections data.
   * Also initializes the image loading state for each skin in the listings.
   *
   * @async
   * @returns {Promise<void>}
   */
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
          skinWithState.imageLoaded = undefined; // Start as undefined (not loaded yet)
          skinWithState.imageFallbackAttempted = false;
        }
      });
      
      this.applyFilters();
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Loads skin instances owned by the current user.
   * Filters out skins that are already listed for sale or traded away.
   *
   * @async
   * @returns {Promise<void>}
   */
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
        }
      });
      
    } catch (error) {
      console.error('Error loading user skins:', error);
      this.userSkinInstances = [];
    } finally {
      this.userSkinsLoading = false;
    }
  }

  /**
   * Loads the user's balance and updates the balance service.
   *
   * @async
   * @returns {Promise<void>}
   */
  async loadUserBalance(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
      this.balanceService.updateBalance(balanceData.balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }

  /**
   * Sets up a subscription to the filter form to reapply filters on any change.
   */
  setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  /**
   * Applies filter criteria to the market listings.
   */
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

  /**
   * Sorts an array of market listings based on the selected sort option.
   *
   * @param {any[]} items - The array of listings to sort.
   * @param {string} sortBy - The sort criteria.
   */
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

  /**
   * Returns the CSS class for the given rarity.
   *
   * @param {string} rarity - The rarity value.
   * @returns {string} The CSS class for text color.
   */
  getRarityColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      'white': 'text-gray-300',
      'blue': 'text-blue-400',
      'dark_blue': 'text-blue-600',
      'purple': 'text-purple-400',
      'pink': 'text-pink-400',
      'red': 'text-red-400',
      'contraband': 'text-yellow-400'
    };
    return colors[rarity] || 'text-white';
  }

  /**
   * Returns the CSS class for the border color based on rarity.
   *
   * @param {string} rarity - The rarity value.
   * @returns {string} The CSS class for border color.
   */
  getRarityBorderColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      'white': 'border-gray-300/50',
      'blue': 'border-blue-400/50',
      'dark_blue': 'border-blue-600/50',
      'purple': 'border-purple-400/50',
      'pink': 'border-pink-400/50',
      'red': 'border-red-400/50',
      'contraband': 'border-yellow-400/50'
    };
    return colors[rarity] || 'border-white/20';
  }

  /**
   * Constructs the image URL for a given skin.
   *
   * @param {any} skin - The skin object.
   * @returns {string} The image URL.
   */
  getSkinImageUrl(skin: any): string {
    console.log('=== IMAGE URL GENERATION ===');
    console.log('Skin name:', skin?.name);
    console.log('Database image_path:', skin?.image_path);

    if (skin?.image_path && skin.image_path !== null && skin.image_path !== '') {
      let imagePath = skin.image_path;

      // Remove "./" prefix if present
      if (imagePath.startsWith('./')) {
        imagePath = imagePath.substring(2);
      }

      // If no extension, we'll let the error handler try different extensions
      if (!this.hasImageExtension(imagePath)) {
        // Start with PNG since that's what you have
        const pngUrl = `/assets/skins/${imagePath}.png`;
        console.log('No extension found, trying PNG first:', pngUrl);
        return pngUrl;
      }

      // If extension already present, use as-is
      const finalUrl = `/assets/skins/${imagePath}`;
      console.log('Extension present, using:', finalUrl);
      return finalUrl;
    }

    // Fallback
    console.log('No image_path, using default fallback');
    return '/assets/skins/AWP_Dragon_Lore.png';
  }

  /**
   * Checks if a given image path contains a valid image file extension.
   *
   * @private
   * @param {string} path - The image path.
   * @returns {boolean} True if the path has an image extension, false otherwise.
   */
  private hasImageExtension(path: string): boolean {
    return path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.webp');
  }

  /**
   * Event handler for a successful image load.
   *
   * @param {any} event - The load event.
   * @param {any} skin - The skin object.
   */
  onImageLoad(event: any, skin: any): void {
    const skinWithState = skin as SkinWithImageState;
    skinWithState.imageLoaded = true;
    console.log('✅ Image loaded:', skinWithState.name);
  }

  /**
   * Event handler for an image load error.
   *
   * @param {any} event - The error event.
   * @param {any} skin - The skin object.
   */
  onImageError(event: any, skin: any): void {
    const skinWithState = skin as SkinWithImageState;
    skinWithState.imageLoaded = false;
    console.log('❌ Image failed:', skinWithState.name, 'URL:', event.target.src);
  }

  /**
   * Determines if a skin's image is visible.
   *
   * @param {any} skin - The skin object.
   * @returns {boolean} True if the image is visible, false otherwise.
   */
  isImageVisible(skin: any): boolean {
    const skinWithState = skin as SkinWithImageState;
    return skinWithState.imageLoaded === true;
  }

  /**
   * Determines if the fallback image should be visible for a skin.
   *
   * @param {any} skin - The skin object.
   * @returns {boolean} True if fallback should be visible, false otherwise.
   */
  isFallbackVisible(skin: any): boolean {
    const skinWithState = skin as SkinWithImageState;
    return skinWithState.imageLoaded === false;
  }

  /**
   * Initiates the process of buying a skin from the market.
   *
   * @async
   * @param {any} listing - The market listing.
   * @returns {Promise<void>}
   */
  async buySkin(listing: any): Promise<void> {
    if (this.userBalance < listing.price) {
      alert('Insufficient balance!');
      return;
    }

    if (confirm(`Buy ${listing.skin.name} for $${listing.price}?`)) {
      try {
        const result = await this.marketService.buySkin(listing.id).toPromise();
        alert('Purchase successful!');
        
        if (result?.newBalance !== undefined) {
          this.userBalance = result.newBalance;
          this.balanceService.updateBalance(result.newBalance);
        } else {
          await this.loadUserBalance();
        }
        
        this.loadMarketData();
        
      } catch (error) {
        console.error('Error buying skin:', error);
        alert('Purchase failed. Please try again.');
        this.loadUserBalance();
      }
    }
  }

  /**
   * Opens the sell modal and loads the user's skin instances.
   */
  openSellModal(): void {
    this.showSellModal = true;
    this.loadUserSkins();
  }

  /**
   * Closes the sell modal and resets the selected skin and form.
   */
  closeSellModal(): void {
    this.showSellModal = false;
    this.selectedSkinToSell = null;
    this.sellForm.reset();
  }

  /**
   * Selects a skin instance to be listed for sale.
   *
   * @param {SkinInstance} skin - The skin instance to sell.
   */
  selectSkinToSell(skin: SkinInstance): void {
    this.selectedSkinToSell = skin;
    this.sellForm.patchValue({ price: skin.skin.base_price });
  }

  /**
   * Lists the selected skin for sale with the specified price.
   *
   * @async
   * @returns {Promise<void>}
   */
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

  /**
   * Clears all filter values and resets the filter form.
   */
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

  /**
   * TrackBy function to optimize Angular's ngFor rendering.
   *
   * @param {number} index - The index of the current item.
   * @param {any} item - The current item.
   * @returns {number} The unique ID of the item.
   */
  trackById(index: number, item: any): number {
    return item.id;
  }
}