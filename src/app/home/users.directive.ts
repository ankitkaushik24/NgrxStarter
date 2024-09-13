import { Directive } from "@angular/core";
import { IUser } from "./users.model";

@Directive({
    standalone: true,
})
export class UsersDirective {
  edits = new Set();

  isGlobalEdit = false;

  updatedData: Record<string, any> = {};

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

  onDataChange(id: string, name: string, val: string) {
    this.updatedData[id] = { ...this.updatedData[id], [name]: val };
  }

  onSave(user: IUser) {
    this.edits.delete(user.id);
    // throw new Error("onSave method not impplemented!");
  }

  onEdit(user: IUser) {
    this.edits.add(user.id);
  }

  onGlobalSave(users: IUser[]) {
    throw new Error("GlobalSave not implmented!");
  }
}