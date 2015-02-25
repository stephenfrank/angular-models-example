Quickstart
==========

- RUN: `bower install`
- RUN: `composer install`
- RUN: `cp api/.env.example api/.env`
- EDIT: `api/.env` (add relevant DB credentials)
- RUN: `php artisan migrate:install`
- RUN: `php artisan migrate --seed`