import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  termCtrl = new FormControl();
  locCtrl = new FormControl();
  catCtrl = new FormControl();
  distCtrl = new FormControl();
  checkCtrl = new FormControl();
  clearCtrl = new FormControl();
  submitCtrl = new FormControl();

  Terms: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  selectedTerm: any = "";

  isChecked = false;
  selectedDistance: any = 10;
  selectedLocation: any = "";
  selectedCategory: any = "Default";
  clearTerm:any = 'Clear';
  submitTerm:any = 'Submit';

  constructor(
    private http: HttpClient,
    private dataService:DataServiceService
  ) { }

  clear(){
    this.isChecked = false;
    this.selectedTerm = "";
    this.selectedDistance = 10;
    this.selectedLocation = "";
    this.selectedCategory = "Default";
    this.dataService.clear();
  }

  async getFromIP(){
    let res = await fetch('https://ipinfo.io/json?token= TOKEN GOES HERE');
    return await res.json();
  }

  async getfromGoogle(){
    let res = await fetch('https://business-search-57191.wl.r.appspot.com/getLocation?location='+this.selectedLocation);
    return await res.json();
  }

  async submit(){
    var lngV: any;
    var latV: any;
    var cat: any;
    var obj: any;

    if(this.isChecked){
      obj = await this.getFromIP(); 
      let arr = obj.loc.split(',');
      latV = arr[0];
      lngV = arr[1];
    }else{
      obj = await this.getfromGoogle();
      latV = obj.lat;
      lngV = obj.lng;
    }

    var result:any = [];

    if(obj.length != 0){
      if(this.selectedCategory == "Default"){
        cat = "all";
      }else{
        cat = this.selectedCategory;
      }
      
      var rad = Math.round(parseFloat(this.selectedDistance) * 1609.34);
      
      if(rad > 40000){
          rad = 40000;
      }
      let res = await fetch('https://business-search-57191.wl.r.appspot.com/searchTerm?term='+this.selectedTerm+'&latitude='+latV+'&longitude='+lngV+'&categories='+cat+'&radius='+rad);
      let sol = await res.json();
      console.log(sol);

      let n = 0
      for(let i = 0; i < sol.length; i++){
        if(n>9){break;}
        result.push(sol[i]);
        result[i].distance = parseInt((result[i].distance/1609.34).toString())
        n++;
      }
      console.log(result);
      this.dataService.clear();
      this.dataService.add(result);
    }else{
      this.dataService.clear();
      this.dataService.add(result);
      console.log('no results');
    }
  }

  checkBoxchange(){
    this.isChecked = !this.isChecked;
    this.selectedLocation = "";
  }

  onSelected() {
    console.log(this.selectedTerm);
    this.selectedTerm = this.selectedTerm;
  }

  ngOnInit(): void {
    this.termCtrl.valueChanges.pipe(filter(res =>{
      return res !== null
    }),
    distinctUntilChanged(),
    debounceTime(1000),
    tap(() => {
      this.errorMsg = "";
      this.Terms = [];
      this.isLoading = true;
    }),
    switchMap(value => this.http.get('https://business-search-57191.wl.r.appspot.com/autocomplete?text='+value).pipe(
        finalize(() => {
          this.isLoading = false;
          }),
        )
      )
    )
    .subscribe((data:any)=>{
      this.errorMsg = "";
      this.Terms = data;
      console.log(this.Terms);
    });
  }

}
