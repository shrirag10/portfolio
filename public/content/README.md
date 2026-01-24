# Portfolio Content Folder

This folder contains all your portfolio assets. Drop files here and update the website accordingly.

## Folder Structure

```
content/
├── images/
│   ├── projects/     # Project images (e.g., tesla-amr.jpg, rtab-slam.png)
│   ├── profile/      # Profile photos
│   └── misc/         # Other images
├── logos/            # Company logos for professional projects
│   └── (add: tesla.png, hero-motocorp.png, etc.)
├── documents/        # Resume and other documents
│   └── (add: resume.pdf)
```

## Adding Content

### Project Images
1. Add image to `images/projects/` 
2. Name format: `{project-id}.{ext}` (e.g., `tesla-amr.jpg`)
3. Reference in website: `/content/images/projects/tesla-amr.jpg`

### Company Logos
1. Add logo to `logos/`
2. Recommended size: 200x200px, transparent PNG
3. Name format: `{company-name}.png` (e.g., `tesla.png`)

### Profile Photos
1. Add to `images/profile/`
2. Recommended: 800x800px square

## Supported Formats
- Images: `.jpg`, `.png`, `.webp`, `.svg`
- Documents: `.pdf`
