import {UserType} from "./user.interface";

export interface IFeature {
  feature_id:number,
  event_id:string,
  feature_type:number,
  status:number,
    additional_requests:string
}

export interface IFeatureFood{
    feature_id:number,
    event_id:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    food_id:number,
    category:number,
    wait_staff:number
}

export interface IFeatureMusic{
    feature_id:number,
    event_id:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    music_id:number,
    genre:number,
    live_music:number
}

export interface IFeatureVenue{
    feature_id:number,
    event_id:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    venue_id:number,
    num_of_people:number,
    type_of_location:number
}

export interface IFeatureClothing{
    feature_id:number,
    event_id:string,
    feature_type:number,
    status:number,
    additional_requests:string,
    clothing_id:number,
    color:number,
    gender:number

}

export interface IBid {
  feature_id:number,
    vendor_id:number,
    interested_id:number,
    bid:string,
  amount:number
}

export interface IRecommendation {
  recommend_id:number,
    feature_id:number,
    vendor_id:number,
    confirm:number,
  amount:number
}

export interface IVendorBid {
    cellphone_number?:string
    email:string
    vendor_id:number
    address:string
    description:string
    name:string
    feature_id:number,
    bid:string
}