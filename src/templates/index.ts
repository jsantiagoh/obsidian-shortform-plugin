// I would love to define this in an external file and have it as a resource but
// I don't know how without adding webpack and don't want to add it

export const bookTemplate: string = `---
title: {{title}}
author: {{author}}
document_type: {{type}}
source: shortform
url: {{url}}
---

# {{title}} 

> [!ABSTRACT] Metadata
> - Author: {{author}}
> - Content: [{{title}}]({{url}})

## Highlights
{% for quote in quotes %}
> {{quote.quote}}
{% if quote.text %}

{{quote.text}}
{% endif %}
---
{% endfor%}
`