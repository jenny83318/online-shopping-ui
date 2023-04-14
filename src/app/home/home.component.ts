import { JolService } from './../service/JolService.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../service/JolService.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
custList:any=[];

  constructor(private jolService: JolService) { }

  ngOnInit() {
    this.getHomeData();
  }

  getHomeData(){
    const body =  {type: 0}
    let request = new Request("jenny83318",body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER + environment.CUST, request).subscribe(res => {
      console.log('res',res);
      this.custList = res.custList

    });
  }
}
