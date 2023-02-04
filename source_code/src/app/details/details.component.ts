import { Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {

  @ViewChild('closeButton') closeButton:any;

  group = new FormGroup({
    emailCtrl : new FormControl('', [Validators.required, Validators.email]),
    dateCtrl : new FormControl('', [Validators.required]),
    hourCtrl : new FormControl('', [Validators.required]),
    minuteCtrl : new FormControl('', [Validators.required]),
  })

  currentDate:any = new Date();

  selectedEmail:any = "";
  selectedDate:any = "";
  selectedHour:any ="";
  selectedMinute:any ="";

  attemptedSubmit = false

  constructor(public dataService:DataServiceService) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.dataService.showTable();
  }

  hasProperty(p:any){

    if(p=='display_address'){
      if(this.dataService.details.hasOwnProperty('location')){
        if(this.dataService.details.location.hasOwnProperty(p)){
          return true;
        }
      }else{
        return false;
      }
    }

    if(p=='is_open_now'){
      if(this.dataService.details.hasOwnProperty('hours')){
        if(this.dataService.details.hours[0].hasOwnProperty(p)){
          return true;
        }
      }else{
        return false;
      }
    }

    if(this.dataService.details.hasOwnProperty(p)){
      return true;
    }
    else{
      return false;
    }
  }

  onSubmit(){

    this.attemptedSubmit = true

    if (this.group.valid) {
      console.log('form submitted');
      alert("Reservation created!");

      let arr = [];

      arr.push({"name":this.dataService.details.name});
      arr.push({"email":this.selectedEmail});
      arr.push({"date":this.selectedDate});
      arr.push({"hour":this.selectedHour});
      arr.push({"minute":this.selectedMinute});
      localStorage.setItem(this.dataService.details.id, JSON.stringify(arr))

      this.closeButton.nativeElement.click();
    }

  }

  onClose(){
    this.selectedEmail = "";
    this.selectedDate = "";
    this.selectedHour = "";
    this.selectedMinute = "";
    this.attemptedSubmit = false;
    this.group.reset();
  }

  cancelReservation(){
    alert("Reservation cancelled!");
    localStorage.removeItem(this.dataService.details.id);
  }

  checkLocalStorage(id:String){
    for (let i = 0; i < localStorage.length; i++) {
      var key = String(localStorage.key(i));
      if(id==key){return true}
    }
    return false;
  }
}
