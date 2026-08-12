# Assets

This project reuses the imagery already generated for the original
**landi-contractor-site** build — no new image generation.

Required files (drop them in this folder):

| File                | Where it's used                          |
| ------------------- | ---------------------------------------- |
| `landi-logo.png`    | Header brand, footer brand, favicon      |
| `hero.jpg`          | Hero background                          |
| `svc-roofing.jpg`   | Services — Roofing                       |
| `svc-siding.jpg`    | Services — Siding                        |
| `svc-flooring.jpg`  | Services — Flooring                      |
| `svc-painting.jpg`  | Services — Painting                      |
| `svc-fence.jpg`     | Services — Fences & Decks, "Why Us" bg   |

## Getting them

Copy from the original project folder on your machine:

```powershell
Copy-Item "<original Landi site folder>\assets\*" `
          ".\landi-construction-redesign\assets\" -Force
```

Or pull them from the live original deployment:

```powershell
$src = "https://landi-contractor-site.vercel.app/assets"
"landi-logo.png","hero.jpg","svc-roofing.jpg","svc-siding.jpg",
"svc-flooring.jpg","svc-painting.jpg","svc-fence.jpg" | ForEach-Object {
    Invoke-WebRequest "$src/$_" -OutFile ".\assets\$_"
}
```
