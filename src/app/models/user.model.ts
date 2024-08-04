export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  job?: string; // Optional field for job title
}

export interface UserResponse {
  data: User;
  support: {
    url: string;
    text: string;
  };
}



export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: string;
    text: string;
  };
}
