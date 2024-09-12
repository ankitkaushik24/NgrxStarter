import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const apiUrl = 'https://jsonplaceholder.typicode.com/users';

type IUser = Record<'id' | 'name' | 'username' | 'email', string>;

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  http = inject(HttpClient);
  users$ = this.http.get<IUser[]>(apiUrl);
  save$$ = new Subject<IUser>();
  
  edits = new Set();

  updateUser$ = this.save$$.pipe(
    switchMap((payload) => this.http.put<IUser>(`${apiUrl}/${payload.id}`, payload)),
    tap((res) => {
      this.edits.delete(res.id)
    })
  )

  constructor() {
    this.updateUser$.pipe(takeUntilDestroyed()).subscribe();
  }

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
    this.updatedData[id] = {...this.updatedData[id], [name]: val};
  }

  onSave(user: IUser) {
    const payload = {...user, ...this.updatedData[user.id]};
    console.log(payload);
    this.save$$.next(payload);
  }

  onEdit(user: IUser) {
    this.edits.add(user.id);
  }
}
