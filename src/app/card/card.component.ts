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
  isMobile: boolean = false;

  constructor(private router: Router, private jolService: JolService) {}

  ngOnInit() {
    this.checkIsMobile();
    this.prod.img[0] = this.jolService.getImgUrl(this.prod.img[0]);
    this.prod.img[1] =  this.jolService.getImgUrl(this.prod.img[1]);
    this.prod.imgUrl =  this.prod.img[0];
  }
  checkIsMobile() {
    if (navigator.userAgent.match( /(iPhone|iPod|Android|ios|iOS|iPad|WebOS|Symbian|Windows Phone|Phone)/i)) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  mouseOverImg() {
    if (this.isHover != false && this.isMobile == false) {
      const img = new Image();
      img.src = this.prod.img[1];
      img.onload = () => {
        this.prod.imgUrl = this.prod.img[1];
      };
    }
  }

  mouseLeaveImg() {
    if (this.isHover != false && this.isMobile == false) {
      const img = new Image();
      img.src = this.prod.img[0];
      img.onload = () => {
        this.prod.imgUrl =this.prod.img[0];
      };
    }
  }
  onLoadImg() {
    this.messageEvent.emit('load');
  }

  toProduct() {
    this.jolService.prod = this.prod;
    this.router.navigate(['/product']);
  }
}
