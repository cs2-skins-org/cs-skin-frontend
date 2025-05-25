export interface SkinInstance {
    id: number;
    skin_id: number;
    owner_id: number | null;
    float_value: number;
    is_stattrak: boolean;
    is_souvenir: boolean;
    wear: string;
    trade_locked_until: Date | null;
  }