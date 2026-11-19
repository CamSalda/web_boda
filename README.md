# Boda Camilo & Eli — 26.12.2026

Sitio de la boda. Santa Ana, San José, Costa Rica.
Publicado en <https://camsalda.github.io/web_boda/>

Basado en [zaxtax/wedding-website](https://github.com/zaxtax/wedding-website).

## Cómo editar

No hay build, no hay npm, no hay que instalar nada. Se edita el HTML y se hace push.

| Qué cambiar | Dónde |
|---|---|
| Todo el texto (español e inglés) | `index.html` |
| Colores, tipografías, espaciados | `css/boda.css` |
| Fecha del contador, idioma por defecto | `js/boda.js` |
| Enlaces de los formularios de RSVP | atributos `data-form-es` / `data-form-en` en `index.html` |
| Punto de encuentro (Google Maps) | el botón dentro de `#logistica` en `index.html` |
| Invitación, fondo, imagen de preview | `images/invitacion-es.jpg`, `invitacion-en.jpg`, `monstera-bg.png`, `og.jpg` |

### Los dos idiomas

Cada texto existe dos veces:

```html
<span class="es">Confirmá tu asistencia</span><span class="en">RSVP here</span>
```

CSS esconde el idioma inactivo (`css/boda.css`) y `js/boda.js` cambia el atributo
`lang` del `<html>`. La primera visita detecta el idioma del navegador (inglés → EN,
cualquier otro → ES) y después recuerda la elección en `localStorage`.

**Al agregar texto nuevo hay que agregar siempre las dos versiones**, si no, el texto
desaparece al cambiar de idioma.

### Ver el sitio localmente

```sh
python -m http.server 8000    # luego abrir http://localhost:8000
```

### Publicar

```sh
git add -A && git commit -m "..." && git push
```

GitHub Pages lo publica desde `main` en un minuto.
