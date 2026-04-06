# new-tab
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-F56565?style=for-the-badge&logo=lucide&logoColor=white)

## мне не понравилась стандартная новая вкладка в chrome, так что я сделал свой chrome extension на react.
это является минималистичной стартовой страницой для Chrome с кастомизируемыми ярлыками, виджетом погоды и эстетикой glassmorphism

### что умеет
- ярлыки (быстрый доступ к сайтам)
- показ погоды (по геолокации или вручную по координатам)
- поиск через google
---
### требования
 - Node.js 18+
 - OpenWeatherMap API ключ
---
### preview
![Extension Preview](https://i.ibb.co/R4D4Drf7/2026-04-07-010054.png)
![Settings Preview](https://i.ibb.co/rR7mZn32/image.png)
![Anchor Preview](https://i.ibb.co/1tkjhZVv/image.png)
---
### запуск
```bash
  # установить зависимости
  npm install
  # тестовый сервер (preview)
  npm run dev
  # сборка
  npm run build
```
---
### настройка
перед успешным использованием нужно совершить эти шаги:
 1. зайти во вкладку расширений chrome (chrome://extensions)
 2. включить режим разработчика в верхнем правом углу
 3. собрать расширение (выполнить `npm run build`)
 4. нажать загрузить упакованное расширение
 5. выбрать папку dist в корне проекта, нажать сохранить
 6. открыть новую вкладку, шестерёнку в верхнем правом углу и вписать API ключ OpenWeatherMap
 7. дать доступ к геолокации или ввести координаты самому
---
удачного использования!
