// types/memberInfoTypes.ts
export interface MemberInfoCarebuddy {
  profilePic: string;
  carebuddyType: string;
  carebuddyName: string;
}

export interface MemberInfoCaptain {
  profilePic: string;
  name: string;
  empId: string;
  id: number;
}

// Updated household structure
export interface MemberInfoHousehold {
  household_id: number;
  houseHoldName: string;
  mobileNum: string;
  location: string;
  city: string;
  telephone_no: string;
  landline_num: string;
  address: string;
  emergencyContact: string;
}

// Updated relative data structure
export interface MemberInfoRelativeData {
  relation_id: number;
  relatedMemberId: string;
  household_id: number;
  name: string;
  address: string;
  notes: string;
  phone: string;
  whatsapp_num: string | null;
  alternate_num: string | null;
  type: string;
  email: string | null;
  is_sponser: boolean;
}

// Updated member structure based on new API response
export interface MemberInfoMember {
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

// Updated response structure to match new API
export interface MemberInfoResponse {
  message: {
    data: {
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
      memberPic: string; // ✅ Added this field that was missing
      reference_status_name: string;
      reference_status_id: string;
      reference_status_type: string;
      household: MemberInfoHousehold[];
      relativeData: MemberInfoRelativeData[];
      captains: MemberInfoCaptain[];
      carebuddies: MemberInfoCarebuddy[];
      
      // Legacy fields for backward compatibility (if needed)
      household_id?: number;
      memberArr?: MemberInfoMember[];
      captain?: MemberInfoCaptain;
      carebuddyObj?: MemberInfoCarebuddy[];
      houseHoldName?: string;
      mobileNum?: string;
      location?: string;
      city?: string;
      landline_num?: string;
      address?: string;
      emergencyContact?: string;
      pridNo?: string;
      validTill?: string;
      planType?: string;
      plan_icon?: string;
      status?: string;
      careBuddyProfilePic?: string;
      carebuddyType?: string;
      carebuddyName?: string;
      captain_emp_id?: string;
      captain_user_id?: number;
      plan_name?: string;
      duration?: string;
    };
  };
}

export interface UseMemberInfoParams {
  memberId: number | null;
  userToken?: string | null;
  shouldFetch: boolean;
}

export interface UseMemberInfoResult {
  memberInfo: MemberInfoResponse | null;
  loading: boolean;
  error: any;
}