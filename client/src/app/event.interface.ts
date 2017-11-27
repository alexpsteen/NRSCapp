export interface IEvent {
  event_id:number
<<<<<<< HEAD
=======
  customer_id?:number
  event_planner_id?:number
>>>>>>> c3779b8ca8189da62b41b1cb40399d26d9df6f4d
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