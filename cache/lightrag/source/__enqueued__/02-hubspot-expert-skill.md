# Skill: hubspot-expert

**Trigger:** HubSpot, HubL, modules, themes, HubDB, CMS topics.

## Rules
1. Check local `docs/` first; check `docs/boilerplate-repo/src/` for structure.
2. Never guess HubL — search docs or web.

## Common field types (quick list)
text, richtext, image, link, url, color, boolean, choice, number, icon, font, group (tab STYLE), blog, hubdbrow, hubdbtable, form, cta, menu, page, logo, date, datetime.

## HubL tags (cheatsheet)
extends, block, include, global_partial, module, dnd_area / dnd_section / dnd_column / dnd_row / dnd_module, macro/call, set, if, for, require_css, require_js, widget_attribute.

## Common filters
escape_html, escape_attr, escape_url, escape_js, sanitize_html, truncatewords, datetimeformat, convert_rgb, pprint, selectattr, sort, json, replace, lower/upper, default, striptags, urlencode.

## Common functions / content
get_asset_url, resize_image_url, blog_recent_posts, blog_popular_posts, hubdb_table_rows, crm_objects, request.query_dict, content.absolute_url, content.meta_description, content.html_title.

## Technology decision tree
- If HubL can do it → HubL.
- Interaction (tabs, accordion, modal, slider) → HubL + vanilla JS with a11y.
- External data → ask user; HubDB/blog/CRM via HubL where supported; else serverless + fetch.

When serverless/API needed: ask user explicitly for implementation plan.
