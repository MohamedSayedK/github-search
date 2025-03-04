import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GithubEndpoints } from "../constants";
import { Observable } from "rxjs";
import { GitHubSearchResponse, GitHubUser, Repository} from "../models";
import { QueryParams } from "../models/query";

@Injectable({
    providedIn: 'root',
})

export class GithubService {
    constructor(private __httpClient: HttpClient){}

    getAccounts(queryParams: QueryParams): Observable<GitHubSearchResponse>{
        const url = GithubEndpoints.SEARCH_USERS.replace('{query}', queryParams.query || '');
        return this.__httpClient.get<GitHubSearchResponse>(url, {
            params: {
                q: queryParams.query || '',
                page: queryParams.page?.toString() || '1',
                per_page: queryParams.perPage?.toString() || '15'
            }
        });
    }

    getUser(userName : string): Observable<GitHubUser>{
        const url = GithubEndpoints.USER_DETAILS.replace('{username}', userName);
        return this.__httpClient.get<GitHubUser>(url)
    }

    getUserRepos(userName: string):Observable<Repository[]>{
        const url = GithubEndpoints.USER_REPOS.replace('{username}', userName);
        return this.__httpClient.get<Repository[]>(url)
    }
}