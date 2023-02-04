import { Component} from '@angular/core';
import { DataServiceService } from './data-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public dataService:DataServiceService) { }
  title = 'hw8-angular';

  onclick(){
    this.dataService.clear();
  }
}
