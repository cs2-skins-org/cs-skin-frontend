// src/app/models/interfaces.ts

/**
 * Represents a collection of skins.
 *
 * @interface Collection
 */
export interface Collection {
  /**
   * Unique identifier for the collection.
   */
  id: number;
  /**
   * The name of the collection.
   */
  name: string;
  /**
   * The year the collection was released.
   */
  release_year: number;
}

/**
 * Represents a skin.
 *
 * @interface Skin
 */
export interface Skin {
  /**
   * Unique identifier for the skin.
   */
  id: number;
  /**
   * The name of the skin.
   */
  name: string;
  /**
   * The type of weapon this skin belongs to.
   */
  weapon_type: WeaponType;
  /**
   * The rarity level of the skin.
   */
  rarity: Rarity;
  /**
   * Path to the skin's image.
   */
  image_path: string;
  /**
   * The collection to which the skin belongs.
   */
  collection: Collection;
  /**
   * The release date of the skin.
   */
  release_date: Date;
  /**
   * The base price of the skin.
   */
  base_price: number;
  /**
   * Optional list of skin instances.
   */
  instances?: SkinInstance[];
}

/**
 * Represents an instance of a skin owned by a user.
 *
 * @interface SkinInstance
 */
export interface SkinInstance {
  /**
   * Unique identifier for the skin instance.
   */
  id: number;
  /**
   * The skin associated with this instance.
   */
  skin: Skin;
  /**
   * The owner of the skin instance.
   */
  owner: User;
  /**
   * The float value of the skin instance.
   */
  float_value: number;
  /**
   * Indicates if the skin is StatTrak.
   */
  is_stattrak: boolean;
  /**
   * Indicates if the skin is a souvenir.
   */
  is_souvenir: boolean;
  /**
   * Indicates if the skin is listed for sale.
   */
  is_listed_for_sale: boolean;
  /**
   * Indicates if the skin has been traded away.
   */
  is_traded_away: boolean;
  /**
   * Optional custom name for the skin instance.
   */
  custom_name?: string;
  /**
   * The wear level of the skin.
   */
  wear: Wear;
  /**
   * Optional date until which the skin is trade locked.
   */
  trade_locked_until?: Date;
  /**
   * Optional market price of the skin.
   */
  price?: number;
  /**
   * The date when the skin was acquired.
   */
  acquired_at: Date;
}

/**
 * Represents a user.
 *
 * @interface User
 */
export interface User {
  /**
   * Unique identifier for the user.
   */
  id: number;
  /**
   * The username of the user.
   */
  username: string;
  /**
   * The email address of the user.
   */
  email: string;
  /**
   * Optional Steam ID of the user.
   */
  steam_id?: string;
  /**
   * Optional profile URL of the user.
   */
  profile_url?: string;
  /**
   * The date when the user was created.
   */
  created_at: Date;
  /**
   * The current balance of the user.
   */
  balance: number;
}

/**
 * Represents a market listing for a skin.
 *
 * @interface MarketListing
 */
export interface MarketListing {
  /**
   * Unique identifier for the market listing.
   */
  id: number;
  /**
   * The skin associated with the market listing.
   */
  skin: Skin;
  /**
   * The owner of the market listing.
   */
  owner: User;
  /**
   * The float value of the skin in the listing.
   */
  float_value: number;
  /**
   * Indicates if the skin is StatTrak.
   */
  is_stattrak: boolean;
  /**
   * Indicates if the skin is a souvenir.
   */
  is_souvenir: boolean;
  /**
   * Optional custom name for the skin.
   */
  custom_name?: string;
  /**
   * The wear level of the skin.
   */
  wear: Wear;
  /**
   * The price at which the skin is listed.
   */
  price: number;
  /**
   * The date when the skin was acquired.
   */
  acquired_at: Date;
}

/**
 * Enum for supported weapon types.
 *
 * @enum {string}
 */
export enum WeaponType {
  AK47 = "AK-47",
  M4A4 = "M4A4",
  M4A1S = "M4A1-S",
  AWP = "AWP",
  SSG08 = "SSG 08",
  AUG = "AUG",
  SG553 = "SG 553",
  FAMAS = "FAMAS",
  GALIL_AR = "Galil AR",
  MAC10 = "MAC-10",
  MP5SD = "MP5-SD",
  MP7 = "MP7",
  MP9 = "MP9",
  P90 = "P90",
  PPBIZON = "PP-Bizon",
  UMP45 = "UMP-45",
  SCAR20 = "SCAR-20",
  G3SG1 = "G3SG1",
  NOVA = "Nova",
  XM1014 = "XM1014",
  MAG7 = "MAG-7",
  SAWEDOFF = "Sawed-Off",
  M249 = "M249",
  NEGEV = "Negev",
  GLOCK18 = "Glock-18",
  USP_S = "USP-S",
  P2000 = "P2000",
  P250 = "P250",
  FIVESEVEN = "Five-SeveN",
  TEC9 = "Tec-9",
  CZ75 = "CZ75-Auto",
  DUAL_BERETTAS = "Dual Berettas",
  DEAGLE = "Desert Eagle",
  R8 = "R8 Revolver",
}

/**
 * Enum for skin rarities.
 *
 * @enum {string}
 */
export enum Rarity {
  RED = "red",
  BLUE = "blue",
  DARK_BLUE = "dark_blue",
  PURPLE = "purple",
  PINK = "pink",
  WHITE = "white",
  CONTRABAND = "contraband",
}

/**
 * Enum for skin wear levels.
 *
 * @enum {string}
 */
export enum Wear {
  FACTORY_NEW = "factory new",
  MINIMAL_WEAR = "minimal wear",
  FIELD_TESTED = "field tested",
  WELL_WORN = "well worn",
  BATTLE_SCARRED = "battle scarred",
}

/**
 * Returns the text color class associated with a given rarity.
 *
 * @param {Rarity} rarity - The rarity of the skin.
 * @returns {string} The CSS class for the text color.
 */
export function getRarityColor(rarity: Rarity): string {
  const colors = {
    [Rarity.WHITE]: "text-rarity-white",
    [Rarity.BLUE]: "text-rarity-blue",
    [Rarity.DARK_BLUE]: "text-blue-600",
    [Rarity.PURPLE]: "text-rarity-purple",
    [Rarity.PINK]: "text-rarity-pink",
    [Rarity.RED]: "text-rarity-red",
    [Rarity.CONTRABAND]: "text-rarity-contraband",
  };
  return colors[rarity] || "text-white";
}

/**
 * Returns the border color class associated with a given rarity.
 *
 * @param {Rarity} rarity - The rarity of the skin.
 * @returns {string} The CSS class for the border color.
 */
export function getRarityBorderColor(rarity: Rarity): string {
  const colors = {
    [Rarity.WHITE]: "border-rarity-white/50",
    [Rarity.BLUE]: "border-rarity-blue/50",
    [Rarity.DARK_BLUE]: "border-blue-600/50",
    [Rarity.PURPLE]: "border-rarity-purple/50",
    [Rarity.PINK]: "border-rarity-pink/50",
    [Rarity.RED]: "border-rarity-red/50",
    [Rarity.CONTRABAND]: "border-rarity-contraband/50",
  };
  return colors[rarity] || "border-white/20";
}

/**
 * Represents the response received after a successful login.
 *
 * @interface LoginResponse
 */
export interface LoginResponse {
  /**
   * The access token provided after login.
   */
  access_token: string;
}

/**
 * Represents the response containing the user's balance.
 *
 * @interface BalanceResponse
 */
export interface BalanceResponse {
  /**
   * The updated balance of the user.
   */
  balance: number;
  /**
   * The unique identifier of the user.
   */
  userId: number;
}