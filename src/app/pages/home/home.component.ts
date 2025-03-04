import { Component, ElementRef, NgZone, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GithubService} from '../../shared/api/services/github.service'
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { debounceTime, finalize, Observable, switchMap, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { GitHubSearchResponse } from '../../shared/api/models';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { QueryParams } from '../../shared/api/models/query';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[FormsModule,LoaderComponent,AsyncPipe,CommonModule,FooterComponent,RouterLink,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  loading: boolean = false;
  search = new FormControl('');
  accounts$! : Observable<GitHubSearchResponse>;
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 0;

  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;


  constructor(private gitHubService: GithubService, private ngZone: NgZone) {
    this.accounts$ = this.search.valueChanges.pipe(
      debounceTime(1000),
      switchMap(query => {
        if(!query) return [];
        this.loading = true;

        const queryParams: QueryParams = {
          query: query,
          page: this.currentPage,
          perPage: this.itemsPerPage
        };
        return this.gitHubService.getAccounts(queryParams).pipe(
          tap(response => {
            this.totalPages = Math.ceil(response.total_count/ this.itemsPerPage)
          }),
          finalize(() => this.loading = false)
        );
      })
    );
  }

  onSearch() {
    this.currentPage = 1;
    const searchValue = this.search.value;
    if (searchValue) {
      this.search.setValue(searchValue,{emitEvent: true})
    }
  }

  onPageChange(page : number){
    this.currentPage = page;
    const searchValue = this.search.value;
    if (searchValue) {
      this.search.setValue(searchValue,{emitEvent: true})
    }
  }

  onMouseMove(event: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      this.cardElements.forEach(card => {
        const rect = card.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.nativeElement.style.setProperty("--mouse-x", `${x}px`);
        card.nativeElement.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  }
}
