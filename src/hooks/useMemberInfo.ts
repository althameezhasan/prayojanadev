// hooks/useMemberInfo.ts
import { useState, useEffect } from 'react';
import { MemberInfoApiService } from '../../fetching/types/memberInfoApi';
import { 
  MemberInfoResponse, 
  UseMemberInfoParams, 
  UseMemberInfoResult 
} from '../../fetching/types/memberInfoTypes';

export const useMemberInfo = ({ 
  memberId, 
  userToken, 
  shouldFetch 
}: UseMemberInfoParams): UseMemberInfoResult => {
  const [memberInfo, setMemberInfo] = useState<MemberInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('🔧 useMemberInfo Hook Inputs:', { 
      memberId, 
      userToken: userToken ? `${userToken.substring(0, 10)}...` : 'not required', 
      shouldFetch 
    });

    // Reset state when shouldFetch becomes false
    if (!shouldFetch) {
      console.log('⏸️ useMemberInfo Skipped: shouldFetch is false');
      setMemberInfo(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Only validate memberId - userToken is optional
    if (!memberId) {
      console.log('⚠️ useMemberInfo Skipped: Missing required parameter memberId', { 
        memberId
      });
      setMemberInfo(null);
      setLoading(false);
      setError(new Error('Missing required parameter: memberId'));
      return;
    }

    const fetchMemberInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📞 Calling MemberInfo API...');
        const data = await MemberInfoApiService.fetchMemberInfo(memberId, userToken);
        
        console.log('🎉 MemberInfo Hook Success!');
        console.log('📋 Member Array Data:', data.message.data.memberArr);
        
        setMemberInfo(data);
      } catch (err) {
        console.error('💥 useMemberInfo Hook Error:', err);
        setError(err);
        setMemberInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, [memberId, userToken, shouldFetch]);

  return { memberInfo, loading, error };
};