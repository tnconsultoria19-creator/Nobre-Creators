export interface Author {
  id: string;
  name: string;
  handle: string;
  career: string; // UGC Creator, Influencer, Fotógrafo, Videógrafo, Modelo, Embaixador
  avatar: string;
  cover: string; // banner
  count: number; // completed campaigns / content count
  
  // New creator fields
  followers?: string;
  engagement?: string;
  niche?: string;
  location?: string;
  province?: string;
  startingPrice?: string;
  bio?: string;
  audienceDesc?: string;
  verified?: boolean;
  premium?: boolean;
  featured?: boolean;
  rating?: string | number;
  languages?: string[];
  responseTime?: string;
  availability?: string;
  travelAvailability?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  packages?: Array<{
    id: string;
    name: string;
    price: number; // in Kwanza (Kz)
    description: string;
    deliverables: string[];
  }>;
  reviews?: Array<{
    id: string;
    authorName: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  color: string;
  count: number;
  thumbnail: string;
}

export interface Post {
  id: string;
  featuredImage: string;
  title: string;
  handle: string;
  excerpt: string;
  date: string;
  readingTime: number;
  commentCount: number;
  viewCount: number;
  bookmarkCount: number;
  bookmarked: boolean;
  likeCount: string | number;
  liked: boolean;
  postType: 'standard' | 'audio' | 'video' | 'gallery';
  author: Author;
  categories: Category[];
  audioUrl?: string; // repurposed for voice introduction or podcast reviews
  videoUrl?: string; // repurposed for creator video showcase
  galleryImgs?: string[]; // repurposed for UGC photography examples
  
  // New campaign request fields
  campaignStatus?: 'requested' | 'selected' | 'accepted' | 'contract_generated' | 'funds_secured' | 'production' | 'submitted' | 'review' | 'approved' | 'paid';
  clientName?: string;
  budget?: string;
  deliverableType?: string;
}
