export interface User {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    photoUrl?: string;
    languageCode?: string;
    phone?: string;
    favoriteProducts: string[];
    orderHistory: string[];
  }