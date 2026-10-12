# Michele Kamanga | Portfolio

A personal portfolio website for Michele Kamanga, a second-year IT student at Gauteng City College who is working towards a career in software engineering.

The whole site is one HTML file with no frameworks, no build step and no dependencies to install. It uses plain HTML, CSS and JavaScript, so you can open it in a browser and it works.

## Contents

- [Features](#features)
- [Sections](#sections)
- [Built with](#built-with)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [How the JavaScript works](#how-the-javascript-works)
- [Customising the site](#customising-the-site)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Projects featured](#projects-featured)
- [License](#license)
- [Contact](#contact)

## Features

- **Light and dark mode.** A toggle in the header switches themes. The choice is saved in `localStorage`. On a first visit the site follows the visitor's system setting (`prefers-color-scheme`).
- **Playable drum kit.** The hero section has four pads (Kick, Snare, Hi-hat and Tom). Visitors can tap them or press `A`, `S`, `D` and `F`. A "Play a beat" button loops an 8-step groove.
- **Synthesised sound.** The drum sounds are generated in the browser with the Web Audio API, so there are no audio files to load.
- **Rotating greeting.** The word "Hello" cycles through Hello, Bonjour, Hola and Merhaba, one for each language I speak or am learning.
- **Project filter.** Buttons filter the project cards by topic (All, Web, C#, Java and Banking).
- **Contact form with validation.** Name, email and message are checked as the visitor types. A valid form opens their email app with the message filled in, so no server is needed.
- **Active section highlight.** The navigation link for the section on screen is highlighted using `IntersectionObserver`.
- **Responsive layout.** The site works from phones to wide desktop screens, with a hamburger menu on small screens.
- **Automatic footer year.** The copyright year updates itself.

## Sections

| Section | What it shows |
| --- | --- |
| Home | Greeting, short introduction, links to projects and contact, and the drum kit |
| About | A short bio and an "Outside of code" list (drums, drawing, UX/UI design) |
| Skills | Programming languages, design and security topics, working style and spoken languages |
| Projects | Filterable cards that link to each GitHub repository |
| Journey | Education timeline and certificates |
| Contact | Email and social links, plus the message form |

## Built with

- **HTML5** with semantic elements (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`)
- **CSS3** with custom properties for theming, Grid and Flexbox for layout, and media queries for responsiveness
- **JavaScript (ES5 style, no libraries)** wrapped in one self-running function
- **Web Audio API** for the drum sounds
- **Google Fonts:** [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) for headings and [Figtree](https://fonts.google.com/specimen/Figtree) for body text

### Design tokens

The colours and sizes are set as CSS variables at the top of the stylesheet, and the dark theme overrides them.

| Variable | Light theme | Purpose |
| --- | --- | --- |
| `--paper` | `#eef0ff` | Page background |
| `--paper-2` | `#e2e5fb` | Tinted section background |
| `--card` | `#ffffff` | Cards and form |
| `--ink` | `#14123a` | Text and borders |
| `--muted` | `#4d4a75` | Secondary text |
| `--cobalt` | `#3d3df5` | Main accent |
| `--sun` | `#ffc933` | Yellow accent |
| `--mint` | `#7be0b5` | Green accent |
| `--pink` | `#ff8fb1` | Pink accent |

## Project structure

```
my-potfolio/
├── inded.html   # The whole site: markup, styles and scripts
├── README.md    # This file
└── LICENSE      # MIT License
```

Inside the HTML file the code is organised in this order:

1. `<head>`: meta tags, Google Fonts and the `<style>` block
2. `<header>`: logo, navigation, theme toggle and mobile menu button
3. `<main>`: the six sections (Home, About, Skills, Projects, Journey, Contact)
4. `<footer>`
5. `<script>`: all the behaviour, split into eight numbered parts

## Getting started

You don't need to install anything.

### Run it locally

1. Clone the repository:
   ```bash
   git clone https://github.com/genmahub/my-potfolio.git
   cd my-potfolio
   ```
2. Open the HTML file in your browser by double-clicking it, or serve it locally:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

### Publish it on GitHub Pages

1. Rename `inded.html` to `index.html`. GitHub Pages looks for a file with that exact name.
2. Push the change to the `main` branch.
3. In the repository, go to **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save.
5. After a minute or two the site will be live at `https://genmahub.github.io/my-potfolio/`.

## How the JavaScript works

All the code sits in one self-running function, so nothing leaks into the global scope.

1. **Theme toggle.** Reads the saved theme from `localStorage`, falls back to the system preference, and sets `data-theme` on the `<html>` element. The CSS variables change with it. Storage access is wrapped in `try/catch` in case the browser blocks it.
2. **Mobile navigation.** Opens and closes the menu, updates `aria-expanded` and `aria-label`, and closes the menu when a link is clicked or `Esc` is pressed.
3. **Rotating greeting.** A `setInterval` swaps the greeting every 2.2 seconds. It is skipped for visitors who prefer reduced motion.
4. **Drum kit.** Creates an `AudioContext` on the first hit. Each sound is built from oscillators (kick and tom) or filtered white noise (snare and hi-hat). Pads respond to pointer, keyboard and the `A`/`S`/`D`/`F` keys, and typing in a form field never triggers a drum. The beat button plays an 8-step groove every 300 ms.
5. **Project filter.** Each card has a `data-category` attribute. Clicking a filter shows the cards that match it, hides the others, and shows a message if none match.
6. **Form validation.** Checks each field on blur and on input, shows an error message under the field, and moves focus to the first invalid field. Valid messages are sent with a `mailto:` link.
7. **Navigation highlight.** An `IntersectionObserver` marks the link for the visible section with the `is-current` class and `aria-current`.
8. **Footer year.** Sets the year from `new Date()`.

## Customising the site

- **Your details.** Edit the text inside each `<section>` in the HTML.
- **Email address.** Change `EMAIL_TO` in the form section of the script, and the `mailto:` link in the Contact section.
- **Social links.** The GitHub and LinkedIn links in the Contact section still contain placeholders (`YOUR-USERNAME` and `YOUR-PROFILE`). Replace them with your real profile addresses.
- **Add a project.** Copy an existing `<article class="project">` block inside `#project-grid`. Set `data-category` to one or more filter names separated by spaces (for example `java banking`), and update the tag, title, description and link.
- **Add a filter.** Add a `<button class="filter" data-filter="name">` to the filter group. The name must match a word in the `data-category` of the cards it should show.
- **Colours.** Change the variables in `:root` for the light theme and in `:root[data-theme="dark"]` for the dark theme.
- **Favicon.** The page links to `assets/favicon.svg`. Add that file to an `assets` folder, or remove the `<link rel="icon">` line.
- **Drum groove.** Edit the `groove` array in the drum kit code. Each entry is one step and lists the sounds that play on it.

## Accessibility

- A "Skip to content" link for keyboard users
- Visible focus outlines on interactive elements
- Descriptive `aria-label`, `aria-pressed`, `aria-expanded` and `aria-current` attributes
- Form errors announced with `role="alert"` and linked to their fields with `aria-describedby`
- Decorative icons hidden from screen readers with `aria-hidden`
- Animations and the rotating greeting turned off for visitors who prefer reduced motion

## Browser support

The site works in current versions of Chrome, Edge, Firefox and Safari. If a browser doesn't support the Web Audio API, the drum pads still animate but stay silent. If it doesn't support `IntersectionObserver`, the site works but the active navigation highlight is turned off.

## Projects featured

| Project | Language or topic | Description |
| --- | --- | --- |
| [To-do list](https://github.com/genmahub/todo-list) | HTML, CSS, JavaScript | Add tasks and delete the ones added by mistake |
| [Temperature calculator](https://github.com/genmahub/temp-cal) | C# | Temperature calculation plus practice programs on variables, strings and maths |
| [GUI use](https://github.com/genmahub/GUI-use) | Java | My first graphical user interface |
| [Banking system simulator](https://github.com/genmahub/Banking-sysmen) | Banking | A banking system simulator |
| [Banking systems](https://github.com/genmahub/banking_systems) | Java, SQL | A simple banking system with a SQL file |
| [My portfolio](https://github.com/genmahub/my-potfolio) | HTML, CSS, JavaScript | This website |

## License

This project is released under the [MIT License](LICENSE).

## Contact

**Michele Kamanga**

- Email: [kamangamichele@gmail.com](mailto:kamangamichele@gmail.com)
- GitHub: [github.com/genmahub](https://github.com/genmahub)

I'm looking for a junior developer role or an internship where I can learn from a team and contribute from day one.
