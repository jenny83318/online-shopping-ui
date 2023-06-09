/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BlockuiComponent } from './blockui.component';

describe('BlockuiComponent', () => {
  let component: BlockuiComponent;
  let fixture: ComponentFixture<BlockuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
