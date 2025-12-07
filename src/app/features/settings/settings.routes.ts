import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { GroupList } from './group-list/group-list.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { GroupDetailsComponent } from './group-details/group-details.component';

export const SETTINGS_ROUTES: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'group-list', component: GroupList },
  { path: 'create-group', component: CreateGroupComponent },
  { path: 'group-details/:id', component: GroupDetailsComponent },
];
