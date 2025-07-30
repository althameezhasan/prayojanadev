export interface TaskAttachment {
  // Add attachment properties if needed
  id?: string;
  url?: string;
  name?: string;
}

export interface Task {
  task_id: number;
  updated_at: string;
  duration: string;
  pr_id: string;
  assigned: number;
  creator_id: string;
  task_name: string;
  createdBy: string;
  empName: string;
  creator_pic: string;
  assignee_pic: string;
  household_name: string;
  location: string;
  mobile_num: string;
  time: string | null;
  date: string;
  status: string;
  task_status_id: number;
  attachments: TaskAttachment[];
  notes: string;
}

export interface TaskResponse {
  message: Task[];
}

export interface UseTaskParams {
  householdId: number | null;
  userToken?: string | null;
  shouldFetch: boolean;
}

export interface UseTaskResult {
  tasks: Task[] | null;
  loading: boolean;
  error: any;
}
