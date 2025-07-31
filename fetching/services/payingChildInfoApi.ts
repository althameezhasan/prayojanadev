// services/payingChildInfoApi.ts
import { PayingChildInfoResponse } from '../types/payingChildInfoTypes';

const BASE_URL = 'https://kwnfmv39-443.inc1.devtunnels.ms/prayojana/member/payingchild/info';

export class PayingChildInfoApiService {
  static async fetchPayingChildInfo(memberId: number, userToken?: string | null): Promise<PayingChildInfoResponse> {
    const url = `${BASE_URL}/${memberId}`;
    
    console.log('🚀 PayingChildInfo API Call:', {
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

      console.log('📡 PayingChildInfo API Response Status:', response.status);
      console.log('📡 PayingChildInfo API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PayingChildInfo API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: PayingChildInfoResponse = await response.json();
      
      console.log('✅ PayingChildInfo API Success Response:', JSON.stringify(data, null, 2));
      console.log('👥 Members from PayingChild API:', JSON.stringify(data.message.data.members, null, 2));
      console.log('🏠 Household ID from PayingChild API:', data.message.data.household_id);
      console.log('👨‍✈️ Captains from PayingChild API:', JSON.stringify(data.message.data.captains, null, 2));
      console.log('🤝 Care Buddies from PayingChild API:', JSON.stringify(data.message.data.carebuddies, null, 2));
      
      return data;
    } catch (error) {
      console.error('💥 PayingChildInfo API Error:', error);
      throw error;
    }
  }
}