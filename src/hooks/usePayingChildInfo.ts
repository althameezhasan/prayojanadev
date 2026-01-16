// hooks/usePayingChildInfo.ts
import { useState, useEffect } from 'react';
import { PayingChildInfoApiService } from '../../fetching/services/payingChildInfoApi';
import { 
  PayingChildInfoResponse, 
  UsePayingChildInfoParams, 
  UsePayingChildInfoResult 
} from '../../fetching/types/payingChildInfoTypes';

export const usePayingChildInfo = ({ 
  memberId, 
  userToken, 
  shouldFetch 
}: UsePayingChildInfoParams): UsePayingChildInfoResult => {
  const [payingChildInfo, setPayingChildInfo] = useState<PayingChildInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('🔧 usePayingChildInfo Hook Inputs:', { 
      memberId, 
      userToken: userToken ? `${userToken.substring(0, 10)}...` : 'not required', 
      shouldFetch 
    });

    // Reset state when shouldFetch becomes false
    if (!shouldFetch) {
      console.log('⏸️ usePayingChildInfo Skipped: shouldFetch is false');
      setPayingChildInfo(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Only validate memberId - userToken is optional
    if (!memberId) {
      console.log('⚠️ usePayingChildInfo Skipped: Missing required parameter memberId', { 
        memberId
      });
      setPayingChildInfo(null);
      setLoading(false);
      setError(new Error('Missing required parameter: memberId'));
      return;
    }

    const fetchPayingChildInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📞 Calling PayingChildInfo API...');
        const data = await PayingChildInfoApiService.fetchPayingChildInfo(memberId, userToken);
        
        console.log('🎉 PayingChildInfo Hook Success!');
        console.log('📋 Members Array Data:', data.message.data.members);
        
        setPayingChildInfo(data);
      } catch (err) {
        console.error('💥 usePayingChildInfo Hook Error:', err);
        setError(err);
        setPayingChildInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPayingChildInfo();
  }, [memberId, userToken, shouldFetch]);

  return { payingChildInfo, loading, error };
};