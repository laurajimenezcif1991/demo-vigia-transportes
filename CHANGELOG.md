# Changelog — Unio B2B

> Historial de cambios del proyecto. Se actualiza automáticamente con cada commit.  
> Consulta este archivo en: `CHANGELOG.md` en la raíz del repositorio.

---

## [Sin commitear]

---

## [alex-agent] — 04 May 2026

### Landing page Agente Alex — Vigía Conductor C2
- **`src/pages/AlexAgent.tsx`** — Nueva landing page pública en `/alex` que simula el estado de procesamiento del Agente Alex. Incluye: avatar circular con anillo de gradiente animado, video de fondo como halo, texto dinámico con el estado actual por fase, y tres tarjetas de fase (Validación inicial, Contacto, Agendamiento) con pasos que se revelan secuencialmente y animación de carga. Logo de Vigía centrado en header y "Powered by Unio" en footer.
- **`src/App.tsx`** — Ruta pública `/alex` agregada.
- **`public/alex-avatar.avif`** — Avatar del Agente Alex copiado al directorio público.
- **`public/video-alex-avatar.mp4`** — Animación de fondo del avatar copiada al directorio público.

---

## [deploy] — 03 May 2026

### Deploy a GitHub Pages
- **`vite.config.ts`** — Agregado `base: '/demo-vigia-transportes/'` para rutas correctas en GitHub Pages.
- **`public/404.html`** — Agregado redirect SPA para que React Router funcione en GitHub Pages.
- **`index.html`** — Script de restauración de rutas SPA en carga inicial.
- **`package.json`** — Agregado script `deploy` con `gh-pages`. Build sin `tsc -b` para evitar bloqueos por errores de tipo no críticos.

---

## [pre-summary] — 03 May 2026

### Fase Pre-screening — Vigía Conductores
- **`mock.ts`** — Extendido `prescreeningAI` con campos `entornoPersonal` y `experienciaLaboral`. Añadidos `_vigiaPersonal` (datos personales confirmados por el agente IA en llamada/WhatsApp) y `_vigiaExpPrev` (historial previo). `_mkVigia` ahora acepta parámetro `stage`; genera datos de pre-screening para candidatos en etapa `prescreening`. Top 10 candidatos Vigía movidos a `prescreening`, 5 restantes en `scoring`. `mockCandidatesByStage` y conteos de `getMockPipelineStages` actualizados.
- **`CandidateOnepage.tsx`** — `PrescreeningContent` expandido: nueva sección "Resumen de la conversación", tabla "Entorno personal" con íconos de estado (ok/warning/neutral), y tarjetas de "Experiencia laboral" con empresa, rol, período y descripción.

---

## [1cfbf64] — 03 May 2026

### Demo mode — solo mocks Vigía
- **`useVacantes.ts`** — Eliminada llamada a API (`getCompanyDashboard`); hook devuelve directamente `MOCK_VACANTES` con logo y nombre de Vigía Transportes hardcodeados. Evita que jobs reales de otros clientes contaminen la lista de vacantes del demo.

### Logo Vigía Transportes
- **`public/logo-vigia.png`** — Añadido logo oficial de Vigía Transportes S.A.S. a la carpeta de assets estáticos
- **`Sidebar.tsx`, `HomeVacantes.tsx`, `PipelineContext.tsx`, `useVacantes.ts`** — Reemplazado logo Comfandi por logo Vigía en sidebar y lista de vacantes; actualizado alt text a `'Vigía Transportes'`
- **`AnalizandoVacante.tsx`, `CompletarRCP.tsx`, `CrearVacante.tsx`, `RCPGenerado.tsx`, `CanalesPublicacion.tsx`, `NoNegociables.tsx`** — Logo actualizado en todas las vistas del wizard de Crear Vacante

### Tabla Verificación RUNT — Design System aplicado
- **`CandidateOnepage.tsx`** — Reemplazados todos los colores hardcodeados del table RUNT por tokens del DS: `var(--color-brand-primary)` para el header oscuro, `var(--color-primary-600)` para los encabezados de columna, `var(--color-neutral-*)` para bordes y fondos alternados, `var(--color-secondary-50)` + `var(--color-brand-accent)` para el footer de manifiestos. Tipografía unificada con `var(--font-display)`, pesos 800/700/400 según jerarquía.

---

## [08ac866] — 03 May 2026

### Demo Vigía — Conductor C2 Carga Refrigerada
- **`mock.ts`** — Reemplazadas todas las vacantes mock anteriores por una única vacante `mock-vigia`: "Conductor C2 Carga Refrigerada" para Transportes Vigía S.A.S., con 15 candidatos en etapa de entrada (Verificados RUNT/RNDC). Candidatos con datos realistas del sector transporte de carga: licencias C2, manifiestos de ruta RNDC, empresas colombianas reales.
- **`mock.ts`** — `getMockPipelineStages`: simplificado para solo manejar `mock-vigia`; eliminados casos de vacantes anteriores
- **`mock.ts`** — `mockCandidatesByStage` y `mockCandidatesById` actualizados para apuntar únicamente a `vigiaCandidates`
- **`mock.ts`** — Renombrado `'Scoring IA'` → `'Verificados (RUNT/RNDC)'` en `getPipelineStages`
- **`Sidebar.tsx`** — Etiqueta de stage `scoring` renombrada a `'Verificados (RUNT/RNDC)'`
- **`Pipeline.tsx`** — `STAGE_META.scoring.label` y `stageBadge` actualizados a `'Verificados (RUNT/RNDC)'` / `'Verificados'`
- **`CandidateOnepage.tsx`** — Título del acordeón de scoring actualizado a `'Verificados (RUNT/RNDC)'`
- **`ValidationPipelineFilter.tsx`** — Chip label de scoring actualizado a `'Verificados'`

---

## [a58c5da] — 04 Abr 2026

### Datos mock para demos
- **`mock.ts`** — Añadidas 3 vacantes mock (`MOCK_VACANTES`: `mock-entrevistas`, `mock-pruebas`, `mock-finalistas`) para demos independientes de la API
- **`mock.ts`** — `getMockPipelineStages()`: stages distintos por vacante mock con estados realistas
- **`mock.ts`** — `mockCandidatesByStage` y `mockCandidatesById`: candidatos locales por jobId y stage para evitar llamadas de red en demos

### Hooks
- **`useVacantes.ts`** — Inyecta `MOCK_VACANTES` al final de la lista real; si la API falla, muestra los mocks igualmente
- **`useCandidateDetail.ts`** — Sirve candidatos mock localmente sin llamar a la API cuando el ID pertenece al catálogo mock

### Pipeline y navegación
- **`Pipeline.tsx`** — Usa `getMockPipelineStages` cuando `jobId` empieza con `mock-`; desbloquea Finalistas en el sidebar vía `setProgressStage`; búsqueda de vacante mejorada para cubrir `mock-` IDs
- **`CandidateList.tsx`** — Para flujos mock, usa `mockCandidatesByStage` en lugar de la API; loading y errores también se cortan
- **`Sidebar.tsx`** — Eliminada la bandera `FINALISTA_VIEW_ENABLED`; Finalistas siempre visible con ruta `${stageBase}/finalistas`
- **`App.tsx`** — Rutas de Finalistas (`/pipeline/:jobId/finalistas` y con `processId`) ya no redirigen sino que renderizan `<Shortlist />` directamente
- **`Shortlist.tsx`** — Título de la vacante ahora dinámico vía `useVacantes` en lugar de hardcodeado

### Reglas y documentación
- **`.cursor/rules/auto-commit.mdc`** — Actualizada para incluir paso de actualizar `CHANGELOG.md` en cada commit
- **`CHANGELOG.md`** — Creado historial completo del proyecto desde el primer commit

---

## [e6a630b] — 04 Abr 2026

- **Caché en memoria** para respuestas de API — elimina llamadas de red redundantes

## [d9611cd] — 04 Abr 2026

- **Fix sidebar** — estado activo correcto para rutas de pipeline con segmentos de proceso

## [8a4c661] — 04 Abr 2026

- **Renombrar títulos** — "Proceso de validación" en `CandidateOnepage` y `FinalistView`

## [9129b6c] — 04 Abr 2026

- **Ocultar botón** "Vista finalista" del header de `CandidateOnepage`

## [c8aa179] — 04 Abr 2026

- **Foto del candidato** — mapeada desde la respuesta de la API `onePage` en `useCandidateDetail`

## [e157d72] — 04 Abr 2026

- **Gauge animado** y renderizado de foto en la tarjeta de perfil de `CandidateOnepage`

## [551c227] — 04 Abr 2026

- **Parser de JSON** en strings de logros/señales antes de renderizar en secciones de scoring y prescreening

## [29b528c] — 04 Abr 2026

- **Chips con forma pill** — estilos actualizados; ocultar campo de experiencia vacío en `CandidateCard`

## [c40c654] — 04 Abr 2026

- **Chip de ubicación** — movido junto al chip de rol en `CandidateCard`, estilo unificado

## [8691ac7] — 04 Abr 2026

- **Skeleton loading** — estados de carga añadidos a todas las pantallas principales de la app

## [cf54010] — 03 Abr 2026

- **Logout** — reemplazado el dropdown de avatar en el header por botón directo "Salir"

## [d6d0159] — 31 Mar 2026

- **Datos prescreening** — añadidos datos `prescreeningAI` a candidatos c2–c6 en mock

## [4956eed] — 31 Mar 2026

- **Fix click en candidate card** — reemplazado `JOB_ID` indefinido por `vacante.id`

## [c937f1a] — 31 Mar 2026

- **Fix etiquetas de estado** — "Por validar" amarillo por defecto, "Continúa" al pasar etapa

## [ff88cbf] — 31 Mar 2026

- **Fix lógica de estado y ordenamiento** en la lista de candidatos

## [a023e56] — 30 Mar 2026

- **Fix ícono de ubicación** — reemplazado SVG roto por `MapPin` de lucide-react en `CandidateOnepage` y `FinalistView`

## [9837719] — 30 Mar 2026

- **Gradient outline consistente** en la tarjeta de perfil del Pipeline candidato

## [0fd42fc] — 30 Mar 2026

- **Módulo Entrevistas** — movido al accordion de `CandidateOnepage`; eliminada la ruta standalone

## [e0d874b] — 30 Mar 2026

- **Toggle lectura/edición** — lógica para secciones HR y HM en el módulo de entrevistas

## [a46b219] — 30 Mar 2026

- **Gradient stroke** en tarjeta Finalista; restaurado borde blanco en Pipeline candidato

## [60d8d66] — 30 Mar 2026

- **Fix gradient stroke** — efecto solo en borde con interior blanco

## [2ccede7] — 30 Mar 2026

- **Fondo fijo y gradient stroke** en el flujo del pipeline

## [c042af4] — 30 Mar 2026

- **Fondo global y bordes degradado** en el flujo del pipeline

## [52ece2b] — 29 Mar 2026

- **Fix anchos de badges** en tabla de Vacantes; paleta de Finalistas actualizada

## [98b67ab] — 29 Mar 2026

- **Branding global** — logos, íconos del sidebar e imagen de éxito actualizados

## [8e7388e] — 29 Mar 2026

- **`InterviewContext`** — creado con `useInterview`, `calcScore` e `InterviewProvider` para compartir el estado de feedback entre páginas

## [9672749] — 28 Mar 2026

- **Flujo inicial** — generación del proyecto base
