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

export interface MemberInfoResponse {
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
      memberArr: MemberInfoMember[];
      plan_name: string;
      captain: MemberInfoCaptain;
      carebuddyObj: MemberInfoCarebuddy[];
      duration: string;
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