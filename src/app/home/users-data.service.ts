import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { IUser, apiUrl } from "./users.model";

@Injectable()
export class UsersDataService {
    private http = inject(HttpClient);

    fetchUsers() {
        return this.http.get<IUser[]>(apiUrl);
    }

    updateUser(payload: IUser) {
        return this.http.put<IUser>(`${apiUrl}/${payload.id}`, payload);
    }

    updateAllUsers(payload: IUser[]) {
        return this.http.post<IUser[]>(`${apiUrl}`, payload);
    }
}
