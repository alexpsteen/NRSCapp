export interface IEvent {
  event_id:number
  customer_id?:number
  event_planner_id?:number
  event_name:string
  event_date_start:string
  event_date_end:string
  event_budget:number
  event_status:number
}

export enum EventStatus {
  NOT_PUBLISHED = 0,
  PUBLISHED = 1
}