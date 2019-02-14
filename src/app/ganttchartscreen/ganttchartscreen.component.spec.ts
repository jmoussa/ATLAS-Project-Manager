import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttchartscreenComponent } from './ganttchartscreen.component';

describe('GanttchartscreenComponent', () => {
  let component: GanttchartscreenComponent;
  let fixture: ComponentFixture<GanttchartscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttchartscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttchartscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
