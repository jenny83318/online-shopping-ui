import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartblockComponent } from './cartblock.component';

describe('CartblockComponent', () => {
  let component: CartblockComponent;
  let fixture: ComponentFixture<CartblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartblockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
