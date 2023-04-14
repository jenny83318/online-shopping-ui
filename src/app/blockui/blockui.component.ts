import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blockui',
  templateUrl: './blockui.component.html',
  styleUrls: ['./blockui.component.css']
})
export class BlockuiComponent implements OnInit {
  message = "Loading...";
  constructor() { }

  ngOnInit() {
  }

}
