import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeDelDialogComponent } from './see-del-dialog.component';

describe('SeeDelDialogComponent', () => {
  let component: SeeDelDialogComponent;
  let fixture: ComponentFixture<SeeDelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeDelDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeDelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
