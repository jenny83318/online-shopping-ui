import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishitemComponent } from './wishitem.component';

describe('WishitemComponent', () => {
  let component: WishitemComponent;
  let fixture: ComponentFixture<WishitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
