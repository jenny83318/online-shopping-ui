import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  date = new Date().getFullYear();
  constructor() { }
isOnload:boolean = false;
  @Input() prod:any;
  @Input() home:any;
  @Output() messageEvent = new EventEmitter<string>();
  ngOnInit() {
  }
  mouseOverImg(prodId: any) {
        const img = new Image();
        img.src = this.prod.img[1];
        img.onload = () => {
            this.prod.imgUrl = this.prod.img[1];
        };
  }

  mouseLeaveImg(prodId: any) {
    const img = new Image();
    img.src = this.prod.img[0];
    img.onload = () => {
      this.prod.imgUrl = this.prod.img[0];
    };
  }
  onLoadImg(){
    this.messageEvent.emit('load');
  }
}
