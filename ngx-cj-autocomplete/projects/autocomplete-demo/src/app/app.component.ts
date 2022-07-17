import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, debounceTime } from 'rxjs';

interface User {
  "id": number,
  "name": string,
  "email": string,
}

const initSearchStr = '' // Ervin Howell

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * 每次用户输入任意值，都会从 payload$ 流中获得
   * 比如，用户依次输入 a, b, c
   * 那么 payload$ 流会获得三个值："a", "ab", "abc"
   */
  payload$: BehaviorSubject<string>;
  subscription: Subscription;
  searchStr: string = '' // debounced inputStr from payload

  users$: Observable<User[]> = of([])

  // input passed into lib-cj-autocomplete
  myInputStr: string
  myOptions: Array<any>

  constructor(private http: HttpClient) {
    this.myInputStr = initSearchStr
    this.myOptions = []

    this.payload$ = new BehaviorSubject(initSearchStr)

    // 除了此处的 .subscribe() 调用，其他地方都不应该调用 Observable/Subject 的 subscribe 方法
    this.subscription = this.getAutoSearch().subscribe((searchedUserName: string) => {
      this.searchStr = searchedUserName
      this.users$ = this.searchQuery(searchedUserName)
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onInputStrChangeHandler(newStr: string) {
    this.payload$.next(newStr)
  }

  // 发送请求，获取搜索结果
  searchQuery(userName: string): Observable<User[]> {
    const filterQuery = (userName)? `?name=${encodeURI(userName)}` : ''
    const result = this.http.get<User[]>(
      `https://jsonplaceholder.typicode.com/users${filterQuery}`
    )

    result.subscribe((users: User[]) => {
      // console.log('get value:', users)
      this.myOptions = users.map(u => {
        return {
          label: u.name,
          value: u.id
        }
      })
    })
    return result
  } ;

  // 你要实现的方法
  getAutoSearch() {
    const search$ = this.payload$.pipe(debounceTime(500))
    return search$;
  }
}
