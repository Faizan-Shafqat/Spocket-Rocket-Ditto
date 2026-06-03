# common-mistakes.md — indexed topics (for retrieval)

Each entry is a documented WRONG vs RIGHT pattern in the toolkit `docs/common-mistakes.md`.

1. Menus via repeater — use `simplemenu` + `{% menu %}`
2. Custom HTML forms — use `form` field + HubSpot form in UI
3. CTA field everywhere — prefer simple button link group unless tracked CTA needed
4. Wrong image field access — use `.src` / `.alt` / dimensions
5. Wrong link field access — use nested `.url.href`, `open_in_new_tab`
6. Wrong color access — `.color`, opacity, `convert_rgb` for rgba
7. Wrong font access — object properties not raw dump
8. Deprecated blog listing tags
9. Missing or wrong `require_css` / `require_js`
10. Missing `{% if %}` around optional UI
11. Missing escape filters (XSS)
12. Missing `help_text` on fields
13. `{% include %}` for global content — use `{% global_partial %}`
14. Missing `loading="lazy"` on non-hero images
15. Wrong `choice` JSON structure — array of `[value, label]` pairs
16. Rebuilding HubSpot native features (nav, forms, blog, etc.)
17. Modules without sensible defaults
18. `url` vs `link` field type misuse
19. Relative href defaults breaking external detection
20. Reserved field names → upload failures
21. Invalid `host_template_types` in meta.json
22. Wrong `responsive_breakpoints` in theme.json
23. Missing template annotation — template invisible in HubSpot
24. Wrong `get_asset_url()` paths
25. Using `require_css` to load the module’s own `module.css` (auto-loaded — duplicate/wrong)
27. Hardcoded icons/SVG — use editable icon group pattern
28. Hardcoded text that should be fields
29. Building without mobile frame check
30. `starts with` not valid in HubL — use `in` etc.
31. `{% global_module %}` does not exist — use `{% module %}` for globals
26. `now()` does not exist in HubL
32. Membership templates cannot contain `{% dnd_area %}`
33. Reserved names inside repeating group children
34. `slice` in HubL is 1-based — not `slice(0,1)` like JS
35. `datetimeformat` on null contact property
36. `LANDING_PAGE` not valid for `host_template_types`
37. `strip` filter invalid — use `trim`
38. `hubdb_table_rows()` validated at upload — table must exist
39. `hubdbrow` must reference real `table_name_or_id`
40. `{% if %}` does not bypass HubSpot upload-time validation
