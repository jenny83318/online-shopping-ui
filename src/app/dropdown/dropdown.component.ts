import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { createPopper } from "@popperjs/core";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  dropdownPopoverShow = false;
  @ViewChild("popoverDropdownRef", { static: false }) popoverDropdownRef: ElementRef;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @Input() title:any;

  ngOnInit() {}
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
      this.createPoppper();
    }
  }
  createPoppper() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
}
