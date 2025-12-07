import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { GroupList } from './group/group-list/group-list.component';
import { CreateGroupComponent } from './group/create-group/create-group.component';
import { GroupDetailsComponent } from './group/group-details/group-details.component';
import { GroupEditComponent } from './group/group-edit/group-edit.component';

export const SETTINGS_ROUTES: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'group-list', component: GroupList },
  { path: 'create-group', component: CreateGroupComponent },
  { path: 'group/:id', children:[
    {path: '', redirectTo: 'details', pathMatch: 'full'},
    {path: 'details', component: GroupDetailsComponent},
    {path: 'edit', component: GroupEditComponent},
  ]},
];
