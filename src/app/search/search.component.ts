import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  ngOnInit(): void {
  }
  constructor( public dialogRef: MatDialogRef<SearchComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
 
  close(){
    this.dialogRef.close();
  }
}
