export type Appointment = {
  id: number;
  contact_id?: number | null;
  sales_id: number;
  store_id?: number | null;
  start_at: string;
  end_at: string;
  type: string;
  title?: string | null;
  del_flg?: boolean;
  created_at?: string;
};
