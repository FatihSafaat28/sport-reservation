export interface SportActivity {
  id: number;
  title: string;
  description: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  price: number;
  address: string;
  map_url:string;
  city: {
    city_name: string;
    province: {
      province_name: string;
    };
  };
  organizer: {
    name: string;
    email: string;
  };
  sport_category?: {
    name: string;
  };
  participants: {
    user : {
      name : string;
    }
  }[]
  slot: number;
}