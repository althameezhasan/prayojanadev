// services/memberInfoApi.ts
import { MemberInfoResponse } from '../types/memberInfoTypes';

const BASE_URL = 'https://kwnfmv39-443.inc1.devtunnels.ms/prayojana/member/member/info';

export class MemberInfoApiService {
  static async fetchMemberInfo(memberId: number, userToken?: string | null): Promise<MemberInfoResponse> {
    const url = `${BASE_URL}/${memberId}`;
    
    console.log('🚀 MemberInfo API Call:', {
      url,
      memberId,
      userToken: userToken ? `${userToken.substring(0, 10)}...` : 'not required'
    });

    try {
      // Create headers object - only add Authorization if userToken is provided
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      console.log('📡 MemberInfo API Response Status:', response.status);
      console.log('📡 MemberInfo API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ MemberInfo API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: MemberInfoResponse = await response.json();
      
      console.log('✅ MemberInfo API Success Response:', JSON.stringify(data, null, 2));
      console.log('👥 MemberArr from API:', JSON.stringify(data.message.data.memberArr, null, 2));
      
      return data;
    } catch (error) {
      console.error('💥 MemberInfo API Error:', error);
      throw error;
    }
  }
}