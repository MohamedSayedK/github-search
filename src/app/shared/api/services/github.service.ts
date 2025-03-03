import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GithubEndpoints } from "../constants";
import { Observable } from "rxjs";
import { GitHubSearchResponse, GitHubUser, Repository} from "../models";

@Injectable({
    providedIn: 'root',
})

export class GithubService {
    constructor(private __httpClient: HttpClient){}

    getAccounts(query: string, page: number = 1, perPage: number = 15): Observable<GitHubSearchResponse>{
        const url = GithubEndpoints.SEARCH_USERS.replace('{query}', query);
        return this.__httpClient.get<GitHubSearchResponse>(url, {
            params: {
                q: query,
                page: page.toString(),
                per_page: perPage.toString()
            }
        });
    }

    getUser(userName : string): Observable<GitHubUser>{
        const url = GithubEndpoints.USER_DETAILS.replace('{username}', userName);
        return this.__httpClient.get<GitHubUser>(url)
    }

    getUserRepos(userName : string, page: number = 1, perPage: number = 6):Observable<Repository[]>{
        const url = GithubEndpoints.USER_REPOS.replace('{username}', userName);
        return this.__httpClient.get<Repository[]>(url , {
            params: {
                page: page.toString(),
                per_page: perPage.toString()
            }
        })
    }
}