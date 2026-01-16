// hooks/useRelativeInfo.ts
import { useState, useEffect } from 'react';
import { RelativeInfoApiService } from '../../fetching/services/relativeInfoApi';
import { 
  RelativeInfoResponse, 
  UseRelativeInfoParams, 
  UseRelativeInfoResult 
} from '../../fetching/types/relativeInfoTypes';

export const useRelativeInfo = ({ 
  memberId, 
  userToken, 
  shouldFetch 
}: UseRelativeInfoParams): UseRelativeInfoResult => {
  const [relativeInfo, setRelativeInfo] = useState<RelativeInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('🔧 useRelativeInfo Hook Inputs:', { 
      memberId, 
      userToken: userToken ? `${userToken.substring(0, 10)}...` : 'not required', 
      shouldFetch 
    });

    // Reset state when shouldFetch becomes false
    if (!shouldFetch) {
      console.log('⏸️ useRelativeInfo Skipped: shouldFetch is false');
      setRelativeInfo(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Only validate memberId - userToken is optional
    if (!memberId) {
      console.log('⚠️ useRelativeInfo Skipped: Missing required parameter memberId', { 
        memberId
      });
      setRelativeInfo(null);
      setLoading(false);
      setError(new Error('Missing required parameter: memberId'));
      return;
    }

    const fetchRelativeInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📞 Calling RelativeInfo API...');
        const data = await RelativeInfoApiService.fetchRelativeInfo(memberId, userToken);
        
        console.log('🎉 RelativeInfo Hook Success!');
        console.log('📋 Members Array Data:', data.message.data.members);
        
        setRelativeInfo(data);
      } catch (err) {
        console.error('💥 useRelativeInfo Hook Error:', err);
        setError(err);
        setRelativeInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRelativeInfo();
  }, [memberId, userToken, shouldFetch]);

  return { relativeInfo, loading, error };
};