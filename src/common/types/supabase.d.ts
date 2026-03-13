import type { IUser, IHousehold } from '@hm/_src/interfaces/household';

type TSupabaseDoc<T> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export interface Database {
  public: {
    Tables: {
      households: {
        Row: IHousehold;
        Insert: TSupabaseDoc<IHousehold>;
        Update: Partial<IHousehold>;
      };
      users: {
        Row: IUser;
        Insert: TSupabaseDoc<IUser> & { role?: TUserRole };
        Update: Partial<IUser>;
      };
    };
  };
}
