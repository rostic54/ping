import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-timeslot-list',
  imports: [],
  templateUrl: './timeslot-list.component.html',
  styleUrl: './timeslot-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeslotListComponent { }
