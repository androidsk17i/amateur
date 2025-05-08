# Amateur Photo Prompt Generator

A specialized prompt generator for creating amateur-looking photos with Stable Diffusion's RealisticVisionV60B1_v51HyperVAE model.

![Amateur Photo Prompt Generator](https://example.com/screenshot.jpg)

## Overview

This tool helps you generate prompts that create intentionally amateur-looking photographs with Stable Diffusion's RealisticVisionV60B1_v51HyperVAE model. Unlike most prompt generators that aim for professional, high-quality images, this generator intentionally includes photographic "mistakes" and limitations that make images look like they were taken by everyday people rather than professional photographers.

## Features

- **Amateur Level Control**: Adjust how amateur the photos should look, from subtle to extreme
- **Tabbed Interface**: Easy navigation between settings, results, history, and favorites
- **History & Favorites**: Save and reuse your favorite prompts
- **Dark Mode**: Toggle between light and dark themes
- **Quick Subject Ideas**: Grid of common subject ideas for quick selection
- **Editable Prompts**: Fine-tune generated prompts for perfect results
- **Amateur Photography Elements**:
  - Common photography mistakes (red eye, blur, overexposure, etc.)
  - Amateur camera technology (phone cameras, old digital cameras, etc.)
  - Realistic lighting issues (harsh flash, mixed lighting, bad white balance)
  - Typical amateur locations and subjects
  - Time period-specific characteristics (80s, 90s, early digital, etc.)
- **RealisticVisionV60B1 Optimization**: Specifically formatted prompts for best results with this model
- **Send to Stable Diffusion**: Direct integration with local Stable Diffusion WebUI installations

## Why Use This Tool?

While most AI image generators try to create perfect, professional-looking photos, sometimes you want images that look more authentic and relatable. This generator creates prompts that produce photos that look like they were taken by:

- Family members at gatherings
- Friends on vacation
- Children experimenting with cameras
- Everyday people capturing everyday moments

The results have the authentic charm and imperfections of real amateur photography rather than the polished look of professional photos.

## How It Works

The generator creates prompts with:

1. **Subject Selection**: Choose from common amateur photo subjects or specify your own
2. **Amateur Qualifiers**: Descriptions of typical amateur photography characteristics
3. **Technical Limitations**: Camera and technical constraints common in non-professional photography
4. **Common Mistakes**: Typical errors made by amateur photographers
5. **Weighted Prompts**: Uses positive and negative weighting to emphasize amateur qualities
6. **RealisticVision-Specific Format**: Structured specifically for this hyperrealistic model

## Usage

1. Select your desired amateur photo characteristics or use the "Random" button
2. Adjust the "Amateur Level" slider to control how amateur the result should look
3. Click "Generate Prompt" to create prompts for Stable Diffusion
4. Copy the prompts or use the "Send to Stable Diffusion" feature
5. Save your favorites for later use

## Installation

Simply download the files and open `index.html` in your web browser, or host the files on any web server.

No server-side components are required - everything runs in your browser!

## Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/amateur-photo-prompt-generator.git

# Navigate to the directory
cd amateur-photo-prompt-generator

# Open in your browser
open index.html  # or double-click the file in your file explorer
```

## License

MIT License - Feel free to use, modify, and distribute this tool!

## Acknowledgements

- Inspired by the need for more authentic-looking AI-generated photos
- Optimized for RealisticVisionV60B1_v51HyperVAE model
- Icons from Font Awesome
- Fonts from Google Fonts 