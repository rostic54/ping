import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { UserStateService } from "../../../core/services/store/user-state.service";
import { User } from "../../../core/interfaces";
import { of } from "rxjs/internal/observable/of";


export const userResolver: ResolveFn<User | null> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {
    const userState = inject(UserStateService);
    return of(userState.user());    
};