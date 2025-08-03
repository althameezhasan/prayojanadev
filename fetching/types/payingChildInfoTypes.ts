

// types/payingChildInfoTypes.ts
export interface PayingChildInfoResponse {
  message: {
    data: {
      relation_id: number;
      relatedMemberId: string;
      household_id: number;
      name: string;
      address: string;
      notes: string;
      phone: string;
      whatsapp_num: string;
      alternate_num: string;
      type: string;
      email: string | null;
      is_sponser: boolean;
      profile_photo_url: string; // Added this field
      household: Array<{
        household_id: number;
        houseHoldName: string;
        mobileNum: string;
        location: string;
        city: string;
        telephone_no: string;
        landline_num: string;
        address: string;
        emergencyContact: string;
      }>;
      members: Array<{
        memberId: number;
        memberName: string;
        phone: string;
        email: string | null;
        notes: string;
        telephone_no: string;
        health_condition: string;
        gender: string;
        bloodGroup: string;
        dob: string;
        memberPic: string;
        reference_status_name: string;
        reference_status_id: string;
        reference_status_type: string;
      }>;
      captains: Array<{
        profilePic: string;
        name: string;
        empId: string;
        id: number;
      }>;
      carebuddies: Array<{
        profilePic: string;
        carebuddyType: string;
        carebuddyName: string;
      }>;
      planDetails?: Array<{
        validTill: string;
        paidAmount: string;
        planType: string;
        planCity: string;
        planDuration: string;
        planIcon: string;
        price: string;
        tax: string;
      }>;
    };
  };
}

export interface UsePayingChildInfoParams {
  memberId: number | null;
  userToken?: string | null;
  shouldFetch: boolean;
}

export interface UsePayingChildInfoResult {
  payingChildInfo: PayingChildInfoResponse | null;
  loading: boolean;
  error: any;
}