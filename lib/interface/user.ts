export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  profile_picture_url?: string;
  token?: string;
}
