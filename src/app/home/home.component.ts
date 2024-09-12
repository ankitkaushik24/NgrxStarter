import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HomeService } from "./home.service";
import { IUser } from "./users.model";
import { UsersServiceState } from "./users.service.state";



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // HomeService,
    UsersServiceState
  ]
})
export class HomeComponent {
  // homeService = inject(HomeService);
  usersService = inject(UsersServiceState);

  // users$ = this.homeService.users$;
  users$ = this.usersService.users$;

  edits = new Set();

  columns: { header: string; key: string; readonly?: boolean; cell: (user: IUser) => string; }[] = [{
    header: 'ID',
    key: 'id',
    readonly: true,
    cell: (data) => data.id
  }, {
    header: 'Name',
    key: 'name',
    cell: user => user.name
  }, {
    header: 'Username',
    key: 'username',
    cell: user => user.username
  }, {
    header: 'Email',
    key: 'email',
    cell: user => user.email
  }];

  updatedData: Record<string, any> = {};

  onDataChange(id: string, name: string, val: string) {
    this.updatedData[id] = { ...this.updatedData[id], [name]: val };
  }

  onSave(user: IUser) {
    const payload = { ...user, ...this.updatedData[user.id] };
    console.log(payload);

    this.edits.delete(user.id);

    // this.homeService.save$$.next({
    //   payload, afterEffect: (res) => {
    //     // this.edits.delete(res.id)
    //   }
    // });

    this.usersService.save$$.next({
      payload, afterEffect: (res) => {
        // this.edits.delete(res.id)
      }
    });
  }

  onEdit(user: IUser) {
    this.edits.add(user.id);
  }
}
