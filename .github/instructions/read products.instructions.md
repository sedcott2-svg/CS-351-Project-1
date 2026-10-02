---
description: Load for every request involving this project so the agent rereads the products JSON before responding or making changes.
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

Before handling every request, execute a PowerShell script to read the project's products JSON file and use its current contents as context. Reread the file for each request; do not rely on cached or remembered product data. If the file path is not specified or cannot be determined from project context, ask the user for its path before proceeding.

```powershell
$productsPath = "<path-to-products.json>"
$products = Get-Content -LiteralPath $productsPath -Raw | ConvertFrom-Json
$products
```