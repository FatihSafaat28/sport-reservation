export interface SportActivity {
  id: number;
  title: string;
  description: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  price: number;
  price_discount?: number;
  address: string;
  map_url: string;
  city: {
    city_name_full: string;
    province: {
      province_name: string;
    };
  };
  organizer: {
    id: number;
    name: string;
    email: string;
  };
  sport_category?: {
    name: string;
  };
  participants: {
    user: {
      name: string;
    };
  }[];
  slot: number;
}