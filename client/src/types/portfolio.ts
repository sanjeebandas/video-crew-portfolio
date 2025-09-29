export type PortfolioItem = {
  _id: string;
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
