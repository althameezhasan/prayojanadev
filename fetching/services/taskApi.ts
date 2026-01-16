import { TaskResponse } from '../types/taskTypes';

const BASE_URL = 'https://kwnfmv39-443.inc1.devtunnels.ms/prayojana/member/householdtask';

export class TaskApiService {
  static async fetchHouseholdTasks(householdId: number, userToken?: string | null): Promise<TaskResponse> {
    const url = `${BASE_URL}/${householdId}`;
    console.log(url)
    
    console.log('🚀 Task API Call:', {
      url,
      householdId,
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

      console.log('📡 Task API Response Status:', response.status);
      console.log('📡 Task API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Task API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: TaskResponse = await response.json();
      
      console.log('✅ Task API Success Response:', JSON.stringify(data, null, 2));
      console.log('📋 Tasks from API:', JSON.stringify(data.message, null, 2));
      
      return data;
    } catch (error) {
      console.error('💥 Task API Error:', error);
      throw error;
    }
  }
}
