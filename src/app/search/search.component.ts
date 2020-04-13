import { Component, OnInit } from '@angular/core';
import{ FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { Subject, throwError } from 'rxjs'; 
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retry, retryWhen } from 'rxjs/operators';
import { SearchService } from '../search.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  [x: string]: any;

  constructor() { }

public loading: boolean;
public searchTerm=  new Subject<string>();
public searchResults: any;
public paginationElements: any;
public errorMessage:any;  

public searchForm = new FormGroup({
  search: new FormControl ( "", Validators.required),
});

public search(){
  this.searchTerm.pipe(
    map((e: any) => {
      console.log(e.target.value);
      return e.target.value
    }),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(term => {
      this.loading = true;
      return this.searchService._searchEntries(term);
    }),
     catchError((e) =>{
      console.log(e);
      this.loading = false;
      this.errorMessage = e.message;
      return throwError(e);
     }),

  ).subscribe(v => {
    this.loading = false;
    this.searchResults = v;//null
    this.paginationElements = this.searchResults;
  })
}
  ngOnInit() {
      this.search();
  }

}
