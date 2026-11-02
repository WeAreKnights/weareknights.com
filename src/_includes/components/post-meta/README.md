# post-meta

One-line post meta: `By <author> • <relative date> • <tag>, <tag>`, small caps. Used by `post-list` (cards) and `hero` (post header).

```liquid
{% include "components/post-meta/post-meta.liquid", authorId: post.data.author, tags: post.data.tags, date: post.date %}
```

Pass `authorId` (an `authors.json` id), `tags` and `date`; in a post layout these are the page's own `author`, `tags` and `date`. The tag list hides internal tags via `filterTagList`.
