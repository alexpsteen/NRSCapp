export interface IEvent {
  eventId:string
  name:string
  startDate:string
  endDate:string
  budget:IBudget
}

export interface IBudget {
  lower:number
  upper:number
}