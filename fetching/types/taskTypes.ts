export interface TaskAttachment {
  // Add attachment properties if needed
  id?: string;
  url?: string;
  name?: string;
}

export interface Task {
  taskId: number;                    // was task_id
  updatedAt: string;                 // was updated_at
  duration: string;
  prId: string;                      // was pr_id
  assignedTo: number;                // was assigned
  creatorId: string;                 // was creator_id
  taskName: string;                  // was task_name
  creatorPic: string;                // was creator_pic
  assigneePic: string;               // was assignee_pic
  householdName: string;             // was household_name
  location: string;
  mobileNumber: string;              // was mobile_num
  time: string | null;
  validTill: string;                 // was date
  status: string;
  taskStatusId: number;              // was task_status_id
  attachments: TaskAttachment[];
  notes: string;
  
  // Removed fields that don't exist in API response:
  // createdBy, empName
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