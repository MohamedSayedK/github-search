import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GithubEndpoints } from "../constants";
import { Observable } from "rxjs";
import { GitHubSearchResponse } from "../models";

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

    getUser(userName : string){
        const url = GithubEndpoints.USER_DETAILS.replace('{username}', userName);
        return this.__httpClient.get(url)
    }

    getUserRepos(userName : string, page: number = 1, perPage: number = 10, sort: string = 'created'){
        const url = GithubEndpoints.USER_REPOS.replace('{username}', userName);
        return this.__httpClient.get(url), {
            params: {
                page: page.toString(),
                per_page: perPage.toString(),
                sort
            }
        }
    }
}