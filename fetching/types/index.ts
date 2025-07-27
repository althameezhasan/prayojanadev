// types/index.ts
export interface Carebuddy {
  hh_carebdy_id: number;
  household_id: number;
  carebuddy_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  carebuddy_type: string;
  is_active: boolean;
}

export interface Plan {
  household_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  payment_type: string | null;
  plan_amount: number;
  payment_date: string;
  amount_paid: number;
  payment_txn_id: string | null;
  plan_status_type_id: number;
  plan_paused_on: string | null;
  plan_activated_on: string | null;
  payment_due_date: string | null;
  reason_fr_pausing: string | null;
  plan_id: number;
  pr_id: string;
  hh_plan_id: number;
  is_deleted: boolean;
  part_payment: string | null;
  amount_due: number;
  payment_url: string | null;
  is_payment_deleted: boolean;
  notes: string | null;
  includehistory: boolean;
  id: number;
  name: string;
  city: string;
  duration: string;
  tax: string;
  price: number;
  plan_icon: string;
}

export interface Household {
  household_id: number;
  household_name: string;
  location: string;
  address: string;
  city: string;
  state: string | null;
  zipcode: number;
  emergency_ct: string;
  client_id: number;
  household_assistances_id: string | null;
  mobile_num: string;
  telephone_no: string;
  pr_id: string;
  landline_num: string;
  is_active: boolean;
  carebuddies: Carebuddy[];
  plans: Plan[];
  assistances: string | null;
}

export interface HouseholdData {
  message: {
    success: boolean;
    data: Household[];
  };
}

export interface DashboardScreenProps {
  onLogout?: () => void;
  userToken?: string | null;
  loginDetails?: { loginType: string; id: number } | null;
}