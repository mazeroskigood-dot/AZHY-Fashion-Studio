
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700;800&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: #25231f;
  background: #f7f6f2;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --gold: #c6a15b;
  --dark: #171714;
  --cream: #f7f6f2;
  --text: #25231f;
  --muted: #89877f;
  --border: #e9e6df;
}

* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  min-height: 100%;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: var(--cream);
}

body,
button,
input,
textarea,
select {
  font-family: 'DM Sans', sans-serif;
}

button,
input,
textarea,
select {
  font-size: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

a {
  color: inherit;
  text-decoration: none;
}

img,
canvas,
svg {
  max-width: 100%;
}

img {
  display: block;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin-top: 0;
}

::selection {
  color: #fff;
  background: #a9874b;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d3cfc5;
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b7a98e;
}

#root {
  min-height: 100vh;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
