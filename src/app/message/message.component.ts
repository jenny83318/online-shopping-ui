import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor() { }

  @Input() parent:any;
  @Output() message = new EventEmitter();
  ngOnInit() {
  }
  close(){
    this.parent.isMsg = false;
  }
}
