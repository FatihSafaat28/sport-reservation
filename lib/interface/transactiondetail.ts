export interface TransactionDetail {
  id: string;
  total_amount: number;
  invoice_id: string;
  proof_payment_url?: string;
  payment_method_id: number
  order_id?: string;
  status: string;
  order_date: string;
  expired_date?: string;
  created_at: string;
  updated_at: string;
  transaction_items: {
    sport_activity_id: number;
    sport_activities : {
        title:string;
        address:string;
        activity_date:string;
        start_time:string;
        end_time:string;
    }
  };
}