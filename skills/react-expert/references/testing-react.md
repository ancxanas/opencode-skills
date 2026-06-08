------
{% raw %}
-|----------|
| `getByRole` | Buttons, links, headings |
| `getByLabelText` | Form inputs |
| `getByText` | Non-interactive text |
| `findByX` | Async/loading content |
| `queryByX` | Assert NOT present |

| Pattern | Use Case |
|---------|----------|
| `userEvent.setup()` | User interactions |
| `renderHook()` | Testing custom hooks |
| `msw` | Mocking API calls |
| Custom render | Wrap with providers |
{% endraw %}
