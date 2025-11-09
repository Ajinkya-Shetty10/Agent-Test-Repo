export interface Fix {
  id: string;
  title: string;
  description?: string;
}

export interface Recommendation {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  skus: string[];
  stock: number;
  fixes: Fix[];
  impactScore: number;
  estimatedTimeHours: number;
  completed: boolean;
}
  