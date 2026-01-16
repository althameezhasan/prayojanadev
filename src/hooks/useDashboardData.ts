// hooks/useDashboardData.ts
import { useEffect, useCallback, useState } from 'react';
import useHTTP from './http';
import { HouseholdData } from '../../fetching/types';

interface UseDashboardDataProps {
  loginDetails?: { loginType: string; id: number } | null;
  userToken?: string | null;
}

export const useDashboardData = ({ loginDetails, userToken }: UseDashboardDataProps) => {
  const { loading, data, callAPI, error } = useHTTP<HouseholdData>();
  const [fetched, setFetched] = useState(false);

  // Memoize the API call function to prevent unnecessary re-renders
  const fetchHouseholdData = useCallback(async () => {
    if (loginDetails?.id && userToken && !fetched) {
      try {
        await callAPI({
          url: `https://kwnfmv39-443.inc1.devtunnels.ms/prayojana/member/household/${loginDetails.id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setFetched(true);
      } catch (err) {
        console.error('Error fetching household data:', err);
      }
    }
  }, [loginDetails?.id, userToken, fetched, callAPI]);

  // Fetch household data only once when loginDetails.id is available
  useEffect(() => {
    fetchHouseholdData();
  }, [fetchHouseholdData]);

  // Log the API response or error - separate useEffect to avoid dependency issues
  useEffect(() => {
    if (data) {
      console.log('Household Data Response:', JSON.stringify(data, null, 2));
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Household Data Error:', error);
    }
  }, [error]);

  return {
    loading,
    data,
    error,
    refetch: fetchHouseholdData,
  };
};