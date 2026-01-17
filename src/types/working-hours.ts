export interface TimeSlot {
  start: number; // Hour in 24h format (0-23)
  end: number; // Hour in 24h format (0-23)
}

export interface OverlapResult {
  slots: TimeSlot[];
  totalHours: number;
  membersInOverlap: string[]; // member ids
}

export interface MemberWorkingStatus {
  isWorking: boolean;
  currentTime: string;
  hoursUntilStart?: number;
  hoursUntilEnd?: number;
}
