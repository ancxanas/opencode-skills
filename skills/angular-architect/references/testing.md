----a--b--|';
      const result$ = source$.pipe(delay(20));

      expectObservable(result$).toBe(expected, { a: 1, b: 2 });
    });
  });
});
```

## Testing with Signals

```typescript
import { signal } from '@angular/core';

describe('Counter Component', () => {
  it('should update signal value', () => {
    const count = signal(0);

    expect(count()).toBe(0);

    count.set(5);
    expect(count()).toBe(5);

    count.update(val => val + 1);
    expect(count()).toBe(6);
  });

  it('should compute derived value', () => {
    const count = signal(5);
    const doubled = computed(() => count() * 2);

    expect(doubled()).toBe(10);

    count.set(10);
    expect(doubled()).toBe(20);
  });
});
```

## Testing NgRx

```typescript
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UsersComponent } from './users.component';
import { selectAllUsers, selectUsersLoading } from './store/users.selectors';

describe('UsersComponent with NgRx', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: MockStore;

  const initialState = {
    users: {
      ids: ['1', '2'],
      entities: {
        '1': { id: '1', name: 'John' },
        '2': { id: '2', name: 'Jane' }
      },
      loading: false
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should select users from store', () => {
    store.overrideSelector(selectAllUsers, [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' }
    ]);

    fixture.detectChanges();

    expect(component.users().length).toBe(2);
  });

  it('should dispatch action on delete', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.onDelete('1');

    expect(dispatchSpy).toHaveBeenCalledWith(
      UsersActions.deleteUser({ id: '1' })
    );
  });
});
```

## Testing Effects

```typescript
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { UsersEffects } from './users.effects';
import { UsersService } from './users.service';
import { UsersActions } from './users.actions';
import { hot, cold } from 'jasmine-marbles';

describe('UsersEffects', () => {
  let actions$: Observable<any>;
  let effects: UsersEffects;
  let usersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useValue: usersServiceSpy }
      ]
    });

    effects = TestBed.inject(UsersEffects);
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
  });

  it('should load users successfully', () => {
    const users = [{ id: '1', name: 'John' }];
    const action = UsersActions.loadUsers();
    const outcome = UsersActions.loadUsersSuccess({ users });

    actions$ = hot('-a', { a: action });
    const response = cold('-b|', { b: users });
    const expected = cold('--c', { c: outcome });

    usersService.getAll.and.returnValue(response);

    expect(effects.loadUsers$).toBeObservable(expected);
  });

  it('should handle load users failure', () => {
    const action = UsersActions.loadUsers();
    const error = new Error('Failed to load');
    const outcome = UsersActions.loadUsersFailure({ error: error.message });

    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, error);
    const expected = cold('--c', { c: outcome });

    usersService.getAll.and.returnValue(response);

    expect(effects.loadUsers$).toBeObservable(expected);
  });
});
```

## Testing Guards

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
  });

  it('should redirect when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    const urlTree = {} as any;
    router.createUrlTree.and.returnValue(urlTree);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/protected' } as any)
    );

    expect(result).toBe(urlTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/protected' } }
    );
  });
});
```

## Quick Reference

| Test Type | Key Tools |
|---
{% raw %}
--------|-----------|
| Component | `TestBed`, `ComponentFixture`, `detectChanges()` |
| Service | `HttpClientTestingModule`, `HttpTestingController` |
| RxJS | `TestScheduler`, marble diagrams |
| NgRx Store | `provideMockStore`, `MockStore` |
| Effects | `provideMockActions`, jasmine-marbles |
| Guards | `TestBed.runInInjectionContext()` |
| Signals | Direct value checks with `()` |
| Spies | `jasmine.createSpyObj()`, `spyOn()` |

{% endraw %}
