import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    // USERS ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public EVENT_USERS_CHANGE_COMPONENT = 'users_change_component';
    public EVENT_USERS_EDIT = 'edit_user';
    public EVENT_USERS_EDIT_ROLE = 'edit_role';
  constructor() { }
}
