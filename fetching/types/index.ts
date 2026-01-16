export interface Carebuddy {
  hh_carebdy_id?: number;
  household_id?: number;
  carebuddy_id?: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  carebuddy_type?: string; // From original household API
  carebuddyType?: string; // From member/info API
  is_active?: boolean;
  profilePic?: string;
  carebuddyName?: string;
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

export interface Captain {
  profilePic: string;
  name: string;
  empId: string;
  id: number;
}

export interface Member {
  memberName: string;
  memberId: number;
  phone: string;
  telephone_no: string;
  memberDob: string;
  memberGender: string;
  blood_group: string;
  memberPic: string;
  email: string | null;
  health_condition: string;
  notes: string;
  reference_status: {
    id: string;
    name: string;
    reference_status_type: string;
  };
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
  carebuddies?: Carebuddy[]; // From original household API
  carebuddyObj?: Carebuddy[]; // From member/info API
  plans: Plan[];
  assistances: string | null;
  captain?: Captain;
  memberArr?: Member[];
}

export interface HouseholdData {
  message: {
    success: boolean;
    data: Household[];
  };
}

export interface MemberInfoData {
  message: {
    success: boolean;
    data: {
      household_id: number;
      phone: string;
      notes: string;
      email: string | null;
      houseHoldName: string;
      mobileNum: string;
      location: string;
      city: string;
      telephone_no: string;
      landline_num: string;
      address: string;
      emergencyContact: string;
      pridNo: string;
      validTill: string;
      planType: string;
      plan_icon: string;
      status: string;
      careBuddyProfilePic?: string;
      carebuddyType?: string;
      carebuddyName?: string;
      captain_emp_id?: string;
      captain_user_id?: number;
      health_condition?: string;
      blood_group?: string;
      reference_status_name?: string;
      reference_status_id?: string;
      memberArr: Member[];
      plan_name: string;
      captain: Captain;
      carebuddyObj: Carebuddy[];
      duration: string;
    };
  };
}

export interface DashboardScreenProps {
  onLogout?: () => void;
  userToken?: string | null;
  loginDetails?: { loginType: string; id: number } | null;
}