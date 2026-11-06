# Translation glossary and style guide

Source language for keys: **English** (`src/i18n/**/en`). Targets: **German (de, default)**, **French (fr)**, **Arabic (ar, RTL)**.

The site is a developer portfolio read by recruiters and engineering leads. Translations must read like a professional wrote them in that language — not like a literal rendering of the English.

## Voice and register

| | Register |
| --- | --- |
| German | Formal and direct, professional tech register ("Sie" when addressing the reader). Prefer clear active sentences; compound nouns are fine but do not stack more than two. |
| French | Professional, "vous". Avoid anglicisms where a standard French term exists, but keep established tech terms (backend, API, framework, CI/CD). |
| Arabic | Modern Standard Arabic, clear technical prose. Keep established Latin tech terms inline (NestJS, PostgreSQL, Docker, API …). |

The text is written in the **first person** (the portfolio owner speaking). Do not add pronouns that are not in the source. Avoid grammatically gender-marked self-description where a neutral phrasing exists (e.g. German "mit Abschluss in …" instead of "Absolvent", French "titulaire d'un …" instead of "diplômé", Arabic prefer noun phrases). Where a gendered form is unavoidable, use the standard masculine/generic form of the language.

## Never translate

- Product, library, framework, language, cloud and tool names: TypeScript, NestJS, Laravel, PostgreSQL, Redis, Docker, React Native, Expo, AWS, Terraform, GitHub Actions, Testcontainers, BullMQ, TypeORM, Caddy, Swagger/OpenAPI, Jest, k6, …
- Project brand names: Stockwell, PDFNexus, USNS, Cloudix, Amman's Treasure, Master Laravel, Angular SKY, Bidding Management System (the descriptive part of a title after a dash **is** translated).
- Company and institution names (CSC Beyond, AI Quintessential, Orange Coding Academy, Al-Zaytoonah University of Jordan, Sky Software …).
- Code, identifiers, HTTP status codes and methods (`409`, `404`, `SELECT … FOR UPDATE`, `Idempotency-Key`), file names, URLs, e-mail addresses, version numbers.
- Numbers and metric values such as `50 → 1 + 49×409`, `15+`, `8`. Use **Latin digits (0-9) in all languages, including Arabic**.
- Pattern names that are standard in English technical writing: Clean Architecture, Domain-Driven Design (DDD), SOLID, CQRS, row-level security (RLS), optimistic/pessimistic locking may be translated in prose but keep the English term in parentheses on first use if the translation is not universal.

## Fixed terminology

| English | German | French | Arabic |
| --- | --- | --- | --- |
| Software Engineer | Software Engineer | Ingénieur logiciel | مهندس برمجيات |
| Backend Engineer / Developer | Backend-Entwicklung (role: Backend Engineer) | Ingénierie backend (rôle : Backend Engineer) | هندسة الواجهة الخلفية (الدور: Backend Engineer) |
| Full Stack Developer | Full-Stack Developer | Développement full stack | تطوير Full Stack |
| Frontend / Backend / Mobile | Frontend / Backend / Mobile | Frontend / Backend / Mobile | الواجهة الأمامية / الواجهة الخلفية / الجوال |
| Case study | Fallstudie | Étude de cas | دراسة حالة |
| Retrospective / What I would do differently | Rückblick / Was ich anders machen würde | Rétrospective / Ce que je ferais autrement | نظرة استرجاعية / ما الذي كنت سأفعله بشكل مختلف |
| Trade-off | Zielkonflikt / Trade-off | Compromis | مفاضلة |
| Decision | Entscheidung | Décision | قرار |
| Outcome | Ergebnis | Résultat | النتيجة |
| Approach | Vorgehen | Approche | المنهج |
| Architecture | Architektur | Architecture | البنية المعمارية |
| Deployment / deploy | Deployment / deployen | Déploiement / déployer | النشر / نشر |
| Pipeline (CI/CD) | Pipeline | Pipeline | خط التكامل والنشر (CI/CD) |
| Test (unit / integration / E2E) | Unit-, Integrations-, E2E-Tests | Tests unitaires, d'intégration, E2E | اختبارات الوحدة والتكامل وE2E |
| Open to relocate | Umzugsbereit | Prêt à déménager | مستعد للانتقال |
| EU Blue Card | Blaue Karte EU | Carte bleue européenne | البطاقة الزرقاء للاتحاد الأوروبي |
| Work authorisation | Arbeitserlaubnis | Autorisation de travail | تصريح العمل |
| Graduation | Abschluss | Obtention du diplôme | التخرج |
| Confidential client work | Vertrauliche Kundenarbeit | Travaux clients confidentiels | أعمال عملاء سرّية |
| Tech stack | Tech-Stack | Stack technique | الحزمة التقنية (Tech Stack) |

## Mechanics

- Keep the **exact JSON structure**: same keys, same array lengths, same order. Only values change.
- Keep punctuation style: curly quotes `’ “ ”` and em dashes stay where the source uses them; use the target language's normal quotation marks (« » in French, „ “ in German, “ ” or « » in Arabic) for quoted words in prose.
- `{placeholders}` and ICU syntax in UI messages must be copied verbatim.
- Summaries keep roughly the same length as the source (card text must stay scannable; the unit tests cap `summary` at 260 characters in every language).
- Do not invent facts, numbers or claims. Do not drop sentences. Do not add marketing language.
