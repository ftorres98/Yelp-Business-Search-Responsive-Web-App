import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  reservations:any = [];


  constructor(public dataService:DataServiceService) { }

  ngOnInit(): void {
    for (var i = 0; i < localStorage.length; i++){
      console.log(localStorage.getItem(String(localStorage.key(i))));
      console.log(JSON.parse(String(localStorage.getItem(String(localStorage.key(i))))));
      this.reservations.push(JSON.parse(String(localStorage.getItem(String(localStorage.key(i))))));
    }
  }

  onDelete(i:any){
    this.reservations.splice(i,1);
    localStorage.removeItem(String(localStorage.key(i)));
    alert("Reservation cancelled!");
  }
}
