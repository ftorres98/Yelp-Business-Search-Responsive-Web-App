import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  show = false;
  data: any = [];
  IDs: any = [];
  details: any =[];
  reviews:any =[];
  show_details = false;

  constructor() { }

  add(data:any){
    this.data = data;
    this.show = true;

    for(let i = 0; i < this.data.length; i++){
      this.IDs.push(this.data[i].id);
    }

    console.log(this.IDs);
  }

  add_details(details:any){
    this.details = details;
  }

  add_reviews(reviews:any){
    this.reviews = reviews;
  }

  showDetails(){
    this.show = false;
    this.show_details = true;
  }

  showTable(){
    this.show = true;
    this.show_details = false;
  }

  clear(){
    this.reviews = [];
    this.show = false;
    this.show_details = false;
    this.data = [];
    this.IDs = [];
    this.details = [];
  }
}
