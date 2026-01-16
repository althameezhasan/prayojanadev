// hooks/useHouseholdTasks.ts
import { useState, useEffect } from 'react';
import { TaskApiService } from '../../fetching/services/taskApi';
import { 
  TaskResponse, 
  UseTaskParams, 
  UseTaskResult,
  Task
} from '../../fetching/types/taskTypes';

export const useHouseholdTasks = ({ 
  householdId, 
  userToken, 
  shouldFetch 
}: UseTaskParams): UseTaskResult => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('🔧 useHouseholdTasks Hook Inputs:', { 
      householdId, 
      userToken: userToken ? `${userToken.substring(0, 10)}...` : 'not required', 
      shouldFetch 
    });

    // Reset state when shouldFetch becomes false
    if (!shouldFetch) {
      console.log('⏸️ useHouseholdTasks Skipped: shouldFetch is false');
      setTasks(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Validate required parameters
    if (!householdId) {
      console.log('⚠️ useHouseholdTasks Skipped: Missing required parameter householdId', { 
        householdId
      });
      setTasks(null);
      setLoading(false);
      setError(new Error('Missing required parameter: householdId'));
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📞 Calling Household Tasks API...');
        const data = await TaskApiService.fetchHouseholdTasks(householdId, userToken);
        
        console.log('🎉 Household Tasks Hook Success!');
        console.log('📋 Tasks Data:', data.message);
        
        setTasks(data.message);
      } catch (err) {
        console.error('💥 useHouseholdTasks Hook Error:', err);
        setError(err);
        setTasks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [householdId, userToken, shouldFetch]);

  return { tasks, loading, error };
};
