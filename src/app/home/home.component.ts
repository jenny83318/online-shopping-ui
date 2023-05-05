import { JolService } from './../service/JolService.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
custList:any=[];
isOpen:boolean = false;
isSlide:boolean = false;
  constructor(private jolService: JolService) { }

  ngOnInit() {
    this.getHomeData();
  }

  getHomeData(){
    const body =  {type: "ALL"}
    let request = new Request("jenny83318",body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER + environment.CUST, request).subscribe(res => {
      console.log('res',res);
      this.custList = res.custList

    });
  }
  showMenu(){
    this.isOpen = this.isOpen == false ? true : false;
  }
  showSlideBar(){
    this.isSlide = this.isSlide == false ?  true : false;

  }
}
