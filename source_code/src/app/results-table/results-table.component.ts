import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent implements OnInit {

  constructor(public dataService:DataServiceService) { }

  ngOnInit(): void {
  }

  async get(i:any){
    let res = await fetch('https://business-search-57191.wl.r.appspot.com/businessDetails?ID='+this.dataService.IDs[i]);
    let sol = await res.json();
    this.dataService.add_details(sol);

    let res1 = await fetch('https://business-search-57191.wl.r.appspot.com/getReviews?ID='+this.dataService.IDs[i]);
    let sol1 = await res1.json();
    this.dataService.add_reviews(sol1);
    
    this.dataService.showDetails();
    console.log(sol);
    console.log(sol1);
  };

}
