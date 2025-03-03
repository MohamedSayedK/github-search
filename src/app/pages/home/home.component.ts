import { Component, ElementRef, NgZone, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService} from '../../shared/api/services/github.service'
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { finalize, Observable, Subject, switchMap, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { GitHubSearchResponse } from '../../shared/api/models';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[FormsModule,LoaderComponent,AsyncPipe,CommonModule,FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  loading: boolean = false;
  search: string = '';
  accounts$! : Observable<GitHubSearchResponse>;
  private searchSubject = new Subject<string>();

  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 0;

  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;


  constructor(private gitHubService: GithubService, private ngZone: NgZone) {
    this.accounts$ = this.searchSubject.pipe(
      switchMap(query => {
        this.loading = true;
        return this.gitHubService.getAccounts(query, this.currentPage, this.itemsPerPage).pipe(
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
    this.searchSubject.next(this.search);
  }

  onPageChange(page : number){
    this.currentPage = page;
    this.searchSubject.next(this.search);
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
