import { Component } from '@angular/core';
import { JolService } from './service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from './model/Request';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jolui';

  constructor(private jolService: JolService) { }

  ngOnInit() {
  }
}
