export interface Item {
  id: string;
  user_id: string;
  name: string;
  type: "top" | "bottom" | "outerwear" | "shoes";
  image_front?: string;
  image_back?: string;
  last_worn?: string;
  wear_count: number;
  is_dirty: boolean;
  created_at: string;
}

export interface Outfit {
  top: Item;
  bottom: Item;
  shoes?: Item;
} 