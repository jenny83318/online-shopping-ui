import { JolService } from './../service/JolService.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() prod: any;
  @Input() isHover: any;
  @Output() messageEvent = new EventEmitter<string>();
  isOnload: boolean = false;

  constructor(private router: Router, private jolService: JolService) {}

  ngOnInit() {}
  mouseOverImg() {
    if (this.isHover != false) {
      const img = new Image();
      img.src = this.prod.img[1];
      img.onload = () => {
        this.prod.imgUrl = this.prod.img[1];
      };
    }
  }

  mouseLeaveImg() {
    if (this.isHover != false) {
      const img = new Image();
      img.src = this.prod.img[0];
      img.onload = () => {
        this.prod.imgUrl = this.prod.img[0];
      };
    }
  }
  onLoadImg() {
    this.messageEvent.emit('load');
  }

  toProduct() {
    this.jolService.prod = this.prod;
    this.router.navigate(['/product'], { skipLocationChange: true });
  }
}
