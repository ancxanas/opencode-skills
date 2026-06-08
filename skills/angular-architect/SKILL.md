---
title: angular-architect

name: angular-architect
description: Builds Angular 22+ applications with standalone components, signal-based reactivity, zoneless change detection, and enterprise architecture. Use when implementing components with @if/@for control flow, setting up signal-based state management, using @Service() decorator for injectables, configuring advanced routing with lazy loading, managing complex state with NgRx Signal Store, optimizing bundle performance, or writing Angular tests for enterprise apps.
license: MIT
compatibility: opencode
metadata:
  author: https://github.com/Jeffallan
  version: "1.1.0"
  domain: frontend
  triggers: Angular, Angular 17, standalone components, signals, RxJS, NgRx, Angular performance, Angular routing, Angular testing
  role: specialist
  scope: implementation
  output-format: code
  related-skills: typescript-pro, test-master
  targets-version: angular@22
  last-reviewed: 2026-06-08
parent: Frontend
nav_order: 2
render_with_liquid: false
---
{% raw %}
# Angular Architect

Senior Angular architect specializing in Angular 22+ with standalone components, signal-based reactivity, zoneless change detection, and enterprise-grade application development.

## Core Workflow

1. **Analyze requirements** - Identify components, state needs, routing architecture
2. **Design architecture** - Plan standalone components, signal usage, zoneless mode, state flow
3. **Implement features** - Build components with `@if`/`@for` control flow and signal-based bindings
4. **Manage state** - Use signals and computed for local state; NgRx Signal Store or `@Service()` for shared state; verify state flow before proceeding
5. **Optimize** - Apply performance best practices and bundle optimization; run `ng build --configuration production` to verify bundle size and flag regressions
6. **Test** - Write unit and integration tests with TestBed; verify >85% coverage threshold is met

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Components | `references/components.md` | Standalone components, signals, input/output |
| RxJS | `references/rxjs.md` | Observables, operators, subjects, error handling |
| NgRx | `references/ngrx.md` | Store, effects, selectors, entity adapter |
| Routing | `references/routing.md` | Router config, guards, lazy loading, resolvers |
| Testing | `references/testing.md` | TestBed, component tests, service tests |

## Key Patterns

### Standalone Component with Zoneless and Signals

```typescript

import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="user-card">
      @if (fullName()) {
        <h2>{{ fullName() }}</h2>
      }
      <button (click)="onSelect()">Select</button>
    </div>
  `,
})
export class UserCardComponent {
  firstName = input.required<string>();
  lastName = input.required<string>();
  selected = output<string>();

  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

  onSelect(): void {
    this.selected.emit(this.fullName());
  }
}

```

### Zoneless Change Detection

Angular 22+ defaults to zoneless when no zone.js is imported. Zone.js is still supported for backward compatibility.

```typescript
// angular.json — opt into zoneless (default in new v22 projects)
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "polyfills": []  // omit zone.js
          }
        }
      }
    }
  }
}

// Or hybrid mode — zone.js present but zoneless for specific components
@Component({
  changeDetection: ChangeDetectionStrategy.Zoneless,  // Angular 22+
  template: `...`,
})
export class ZonelessComponent {}
```

### @if / @for Control Flow (Replaces *ngIf / *ngFor)

```typescript

@Component({
  template: `
    @if (users(); as usersList) {
      <ul>
        @for (user of usersList; track user.id) {
          <li>{{ user.name }}</li>
        } @empty {
          <li>No users found</li>
        }
      </ul>
    } @else {
      <p>Loading...</p>
    }
  `,
})
export class UserListComponent {
  users = signal<User[] | null>(null);
}

```

- `track` replaces `trackBy` and is always required in `@for`
- `@empty` handles the empty-list case inline
- `@if` / `@for` / `@switch` are the standard control flow — `*ngIf`, `*ngFor`, `*ngSwitch` are legacy
- `@let` syntax (Angular 22+) allows template variable assignment


### @Service() Decorator (Angular 22+)

```typescript
import { Service } from '@angular/core';

@Service()
export class UserService {
  private users = signal<User[]>([]);
  private http = inject(HttpClient);

  readonly users$ = this.users.asReadonly();

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe({
      next: (users) => this.users.set(users),
    });
  }
}
```

- `@Service()` replaces `@Injectable({ providedIn: 'root' })` for application services
- Also accepts scope: `@Service({ scope: 'feature' })` for module-scoped singletons

### RxJS Subscription Management with `takeUntilDestroyed`

Use RxJS only when integrating with third-party libraries or Angular's HttpClient. Prefer `toSignal()` to bridge RxJS to signals.

```typescript
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from './user.service';

@Component({ selector: 'app-users', standalone: true, template: `...` })
export class UsersComponent {
  private userService = inject(UserService);

  // Bridge RxJS observable to signal
  users = toSignal(this.userService.getUsers(), { initialValue: [] });

  // Traditional subscription only when toSignal() doesn't fit
  constructor() {
    this.userService.getEvents()
      .pipe(takeUntilDestroyed())
      .subscribe((event) => { /* handle */ });
  }
}
```

### State Management — Signals First

```typescript
// Local component state — just signals
@Component({ template: `@for (item of filtered(); track item.id) { ... }` })
export class ProductListComponent {
  private allItems = signal<Product[]>([]);
  filterText = signal('');

  filtered = computed(() =>
    this.allItems().filter(p => p.name.includes(this.filterText()))
  );
}

// NgRx Signal Store — for complex shared state (Angular 22+)
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubled: computed(() => count() * 2),
  })),
  withMethods(({ count, ...store }) => ({
    increment() { count.update(c => c + 1); },
  })),
);
```

## Constraints

### MUST DO
- Use standalone components (Angular 17+ default; Angular 22 uses them exclusively)
- Use `@if` / `@for` / `@switch` control flow — not `*ngIf` / `*ngFor` / `*ngSwitch`
- Use signals and computed for local component state
- Use `track` in `@for` (not `trackBy` in `*ngFor`)
- Prefer `toSignal()` over manual subscriptions for bridging RxJS to signals
- Use `@Service()` instead of `@Injectable({ providedIn: 'root' })` for Angular 22+ projects
- Use strict TypeScript configuration
- Write tests with >85% coverage
- Follow Angular style guide

### MUST NOT DO
- Use NgModule-based components (except when required for compatibility)
- Force zone.js dependency — let zoneless be the default
- Use `*ngIf`, `*ngFor`, `*ngSwitch` in new code (use `@if`, `@for`, `@switch`)
- Forget to unsubscribe from observables (use `takeUntilDestroyed()` without arguments or `toSignal()`)
- Use async operations without proper error handling
- Skip accessibility attributes
- Expose sensitive data in client-side code
- Use `any` type without justification
- Mutate state directly in NgRx (use Signal Store or immutable patterns)
- Skip unit tests for critical logic

## Output Templates

When implementing Angular features, provide:
1. Component file with standalone configuration
2. Service file if business logic is involved
3. State management files if using NgRx
4. Test file with comprehensive test cases
5. Brief explanation of architectural decisions
{% endraw %}
