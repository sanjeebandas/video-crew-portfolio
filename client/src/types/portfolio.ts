export type PortfolioItem = {
  _id: number;
  title: string;
  category: string;
  client?: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  featured?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};
