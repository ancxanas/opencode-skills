------
{% raw %}
--|----------|--------|-----|-------|
| `en-US` | English | US | No | |
| `en-GB` | English | UK | No | date format: DD/MM/YYYY |
| `es` | Spanish | — | No | |
| `es-MX` | Spanish | Mexico | No | |
| `fr` | French | France | No | |
| `de` | German | Germany | No | |
| `pt-BR` | Portuguese | Brazil | No | |
| `ja` | Japanese | Japan | No | No plural forms |
| `zh-CN` | Chinese (Simplified) | China | No | No plural forms |
| `zh-TW` | Chinese (Traditional) | Taiwan | No | No plural forms |
| `ko` | Korean | Korea | No | No plural forms |
| `ar` | Arabic | — | Yes | |
| `ar-SA` | Arabic | Saudi Arabia | Yes | |
| `he` | Hebrew | Israel | Yes | |
| `fa` | Persian | Iran | Yes | |
| `hi` | Hindi | India | No | |
| `th` | Thai | Thailand | No | |
| `vi` | Vietnamese | Vietnam | No | |
| `ru` | Russian | Russia | No | |
| `pl` | Polish | Poland | No | |
| `nl` | Dutch | Netherlands | No | |
| `tr` | Turkish | Turkey | No | |
| `sv` | Swedish | Sweden | No | |

## ICU Plural Categories

| Category | en | ru/pl | ar | ja/zh/ko/th/vi |
|----------|-----|-------|-----|-----|
| `zero` | — | — | some numbers | — |
| `one` | 1 | 1, 21, 31... | 1 | all |
| `two` | — | 2 | 2 | — |
| `few` | — | 2-4 (pl), 2-4,22-24 (ru) | 3-10 | — |
| `many` | — | 0,5-20 (pl), 5-20 (ru) | 11-99 | — |
| `other` | 0,2+ | all other | 100+ | — |

### English Example
```json
{
  "cookies": "{count} cookie{count, plural, one {} other {s}}"
}
```

## Date & Time Format Differences

| Locale | Short Date | Time (12/24) | First Day |
|--------|------------|-------------|-----------|
| en-US | MM/DD/YYYY | 12h | Sunday |
| en-GB | DD/MM/YYYY | 24h | Monday |
| de | DD.MM.YYYY | 24h | Monday |
| fr | DD/MM/YYYY | 24h | Monday |
| ja | YYYY/MM/DD | 24h | Monday |
| zh-CN | YYYY-MM-DD | 24h | Monday |
| ar | DD/MM/YYYY | 24h | Saturday |
| ko | YYYY. MM. DD. | 24h | Sunday |

## Number Formatting
| Locale | Grouping | Decimal | Currency |
|--------|----------|---------|----------|
| en-US | 1,234.56 | `.` | $1,234.56 |
| en-GB | 1,234.56 | `.` | £1,234.56 |
| de | 1.234,56 | `,` | 1.234,56 € |
| fr | 1 234,56 | `,` | 1 234,56 € |
| ja | 1,234.56 | `.` | ¥1,235 |
| ar | 1,234.56 | `.` | ١٬٢٣٤٫٥٦ ر.س |

## RTL Specifics
- `direction: rtl` on `<html>` element
- Mirror margins/padding: `margin-inline-start` / `margin-inline-end`
- Logical properties: `inset-inline-start` instead of `left`
- Text alignment: `start` / `end` instead of `left` / `right`
- Special glyphs for some digits (Arabic-Indic: ١٢٣)

## Framework i18n Library URLs
| Framework | Library | URL |
|-----------|---------|-----|
| React | react-i18next | https://react.i18next.com/ |
| React | FormatJS (react-intl) | https://formatjs.io/ |
| Vue | vue-i18n | https://vue-i18n.intlify.dev/ |
| Next.js | next-intl | https://next-intl-docs.vercel.app/ |
| Angular | @angular/localize | https://angular.io/guide/i18n |
| JS | Lingui | https://lingui.dev/ |
| JS | globalize | https://github.com/globalizejs/globalize |

{% endraw %}
