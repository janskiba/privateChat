import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})

export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('auth guard activated!');
    return this.authService.user$.pipe(
      //look into the 'user$' for one time only
      take(1),
      //convert user object to boolean using '!!' wchich converts to true everything which is not 'undefined' of 'null'
      map((user) => {
        const isAuth = !!user;
        if (isAuth)
          return true;
        return this.router.createUrlTree(['/']);
      })
    );
  }
}
