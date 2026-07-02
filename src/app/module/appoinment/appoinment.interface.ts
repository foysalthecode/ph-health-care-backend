export interface IBookAppoinmentPayload {
  doctorId: string;
  scheduleId: string;
}

export interface IUpdateAppoinmentPayload {
  doctor?: string;
  scheduleId?: string;
  status?: string;
}
