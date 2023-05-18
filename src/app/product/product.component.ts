import { JolService } from './../service/JolService.service';
import { Component, Input, OnInit } from '@angular/core';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  prod:any;
  constructor(private jolService:JolService) { }

  ngOnInit() {
    this.prod = this.jolService.prod;
  }

}
