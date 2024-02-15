import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cartblock',
  templateUrl: './cartblock.component.html',
  styleUrls: ['./cartblock.component.scss']
})
export class CartblockComponent implements OnInit {
  isblock: boolean = false;
  message = "Loading...";
  constructor() { }

  ngOnInit(): void {
  }

}
