#!/usr/bin/env sh
# sh deploy.sh  - run (в bash)

# остановить публикацию при ошибках
set -e

# сводка приложения
npm run build

# инициализация репозитория и загрузка кода в GitHub
git init

# добавление всех файлов, кроме папки node_modules
git add -A
git reset -- node_modules

git commit -m"deploy"

git push -f https://github.com/pkhtn-vld/moire-vue.git master:gh-pages

cd -
