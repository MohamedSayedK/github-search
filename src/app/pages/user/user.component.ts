import { Component, DestroyRef, ElementRef, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GithubService } from '../../shared/api/services/github.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { GitHubUser, Repository } from '../../shared/api/models';
import { AsyncPipe } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [AsyncPipe,FooterComponent,RouterLink,LoaderComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user$!: Observable<GitHubUser>;
  repos$!: Observable<Repository[]>;
  totalRepos: number = 0;
  loading: boolean = false;

  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;


  constructor(
    private githubService : GithubService,
    private activeRoute: ActivatedRoute,
    private destroyRef: DestroyRef,
    private ngZone: NgZone) { }

  ngOnInit() {
    const username = this.activeRoute.snapshot.paramMap.get('username');

    if(username){
      this.user$ = this.githubService.getUser(username).pipe(
        tap(user => {
          this.totalRepos = user.public_repos;
        }),
        takeUntilDestroyed(this.destroyRef)
      );

      this.loadRepos(username);
    }
  }

  loadRepos(username: string){
    this.repos$ = this.githubService.getUserRepos(username).pipe(
      takeUntilDestroyed(this.destroyRef)
    );
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
