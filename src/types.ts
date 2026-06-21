export interface Product {
  _id: string;
  id?: string; // Backward compatibility
  name: string;
  description?: string;
  brand?: string;
  team?: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number; // Backward compatibility
  discount_price?: number;
  currency?: string;
  images: string[];
  image?: string; // Backward compatibility
  stock?: number;
  isAvailable?: boolean;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  reviews_count?: number;
  isNew?: boolean;
  isSale?: boolean;
  isBestSeller?: boolean;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
  itemsCount: number;
  mainItemImage: string;
  mainItemName: string;
}
