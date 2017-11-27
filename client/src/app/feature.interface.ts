export interface IFeatureLite {
  featureId:number,
  eventId:string,
  feature_type:number,
  status:number,
    additional_requests:string
}

export interface IFeatureFood{
    featureId:number,
    eventId:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    foodId:number,
    category:number,
    wait_staff:number
}

export interface IFeatureMusic{
    featureId:number,
    eventId:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    music_id:number,
    genre:number,
    live_music:number
}

export interface IFeatureVenue{
    featureId:number,
    eventId:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    venue_id:number,
    num_of_people:number,
    outdoors:number,
    type_of_location:number
}

export interface IFeatureClothing{
    featureId:number,
    eventId:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    clothing_id:number,
    color:number,
    gender:number

}