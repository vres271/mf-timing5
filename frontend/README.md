# mft5-frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `https://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Структура папок


```
src/
├── app/
│   ├── core/                  # Основные сервисы, guards, интерсепторы
│   │   ├── guards/            # Guards (например, AuthGuard, RoleGuard)
│   │   ├── interceptors/      # HTTP интерсепторы
│   │   ├── services/          # Основные сервисы (например, AuthService)
│   │   ├── models/            # Основные модели данных
│   │   └── utils/             # Утилиты и хелперы
│   ├── shared/                # Общие компоненты, пайпы, директивы
│   │   ├── components/        # Общие компоненты (например, header, footer)
│   │   ├── pipes/             # Общие пайпы
│   │   ├── directives/        # Общие директивы
│   │   └── models/            # Общие модели данных
│   ├── features/              # Функциональные модули (ленивая загрузка)
│   │   ├── auth/              # Модуль для авторизации
│   │   │   ├── components/    # Компоненты модуля (например, login, register)
│   │   │   ├── services/      # Сервисы модуля
│   │   │   ├── models/        # Модели данных модуля
│   │   │   └── routes.ts      # Маршруты для функциональности
│   │   ├── dashboard/         # Модуль для dashboard
│   │   ├── admin/             # Модуль для административной панели
│   │   └── user/              # Модуль для управления пользователями
│   ├── app.component.ts       # Корневой компонент (stand-alone)
│   └── app.routes.ts          # Корневая маршрутизация
├── assets/                    # Статические файлы (изображения, шрифты)
├── environments/              # Конфигурации для разных окружений
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.scss                # Глобальные стили
```

---
