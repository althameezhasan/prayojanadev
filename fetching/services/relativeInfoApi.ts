// services/relativeInfoApi.ts
import { RelativeInfoResponse } from '../types/relativeInfoTypes';

const BASE_URL = 'https://kwnfmv39-443.inc1.devtunnels.ms/prayojana/member/relataive/info';

export class RelativeInfoApiService {
  static async fetchRelativeInfo(memberId: number, userToken?: string | null): Promise<RelativeInfoResponse> {
    const url = `${BASE_URL}/${memberId}`;
    
    console.log('🚀 RelativeInfo API Call:', {
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

      console.log('📡 RelativeInfo API Response Status:', response.status);
      console.log('📡 RelativeInfo API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ RelativeInfo API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: RelativeInfoResponse = await response.json();
      
      console.log('✅ RelativeInfo API Success Response:', JSON.stringify(data, null, 2));
      console.log('👥 Members from Relative API:', JSON.stringify(data.message.data.members, null, 2));
      console.log('🏠 Household ID from Relative API:', data.message.data.household_id);
      console.log('👨‍✈️ Captains from Relative API:', JSON.stringify(data.message.data.captains, null, 2));
      console.log('🤝 Care Buddies from Relative API:', JSON.stringify(data.message.data.carebuddies, null, 2));
      
      return data;
    } catch (error) {
      console.error('💥 RelativeInfo API Error:', error);
      throw error;
    }
  }
}