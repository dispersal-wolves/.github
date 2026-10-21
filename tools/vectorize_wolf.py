from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageColor, ImageDraw, ImageFont


FIR = "#071310"
PINE = "#10231F"
LICHEN = "#41645D"
FOG = "#9CAAA6"
BONE = "#E8E8DF"

# Font stacks from docs/brand/BRAND.md.
SERIF_STACK = "'Iowan Old Style', Palatino, Georgia, serif"
SANS_STACK = "'Arial Narrow', 'Helvetica Neue', Arial, sans-serif"


def contour_path(contour: np.ndarray, origin_x: int, origin_y: int, pad: int) -> str:
    points = contour.reshape(-1, 2)
    commands = [f"M{points[0, 0] - origin_x + pad} {points[0, 1] - origin_y + pad}"]
    commands.extend(f"L{x - origin_x + pad} {y - origin_y + pad}" for x, y in points[1:])
    commands.append("Z")
    return "".join(commands)


def make_svg(path_data: str, width: int, height: int, fill: str, title: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">An original side-profile silhouette of a wolf walking with its head held low.</desc>
  <path id="mark" fill="{fill}" fill-rule="evenodd" d="{path_data}"/>
</svg>
'''


def fit_mark(mark: Image.Image, canvas: Image.Image, box: tuple[int, int, int, int], color: str) -> None:
    x0, y0, x1, y1 = box
    max_width, max_height = x1 - x0, y1 - y0
    scale = min(max_width / mark.width, max_height / mark.height)
    size = (max(1, round(mark.width * scale)), max(1, round(mark.height * scale)))
    alpha = mark.getchannel("A").resize(size, Image.Resampling.LANCZOS)
    solid = Image.new("RGBA", size, ImageColor.getrgb(color) + (255,))
    solid.putalpha(alpha)
    canvas.alpha_composite(solid, (x0 + (max_width - size[0]) // 2, y0 + (max_height - size[1]) // 2))


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def main() -> None:
    parser = argparse.ArgumentParser(description="Trace a generated walking-wolf raster into reproducible brand assets.")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    original = Image.open(args.input).convert("RGBA")
    rgba = np.array(original)
    alpha = rgba[:, :, 3]
    mask = np.where(alpha >= 128, 255, 0).astype(np.uint8)

    contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    if hierarchy is None or not contours:
        raise RuntimeError("No traceable silhouette found")

    kept: list[np.ndarray] = []
    for contour in contours:
        if abs(cv2.contourArea(contour)) < 80:
            continue
        kept.append(cv2.approxPolyDP(contour, 1.35, True))
    if not kept:
        raise RuntimeError("All contours were filtered out")

    all_points = np.concatenate([item.reshape(-1, 2) for item in kept])
    x0, y0 = all_points.min(axis=0)
    x1, y1 = all_points.max(axis=0)
    pad = 20
    width = int(x1 - x0 + 1 + pad * 2)
    height = int(y1 - y0 + 1 + pad * 2)
    path_data = "".join(contour_path(item, int(x0), int(y0), pad) for item in kept)

    (args.output / "mark.svg").write_text(make_svg(path_data, width, height, "currentColor", "Dispersal Wolves walking wolf"), encoding="utf-8")
    (args.output / "mark-reversed.svg").write_text(make_svg(path_data, width, height, BONE, "Dispersal Wolves walking wolf"), encoding="utf-8")
    (args.output / "mark-monochrome.svg").write_text(make_svg(path_data, width, height, "#000000", "Dispersal Wolves walking wolf"), encoding="utf-8")

    source_box = (max(0, int(x0) - 36), max(0, int(y0) - 36), min(original.width, int(x1) + 37), min(original.height, int(y1) + 37))
    cropped = original.crop(source_box)
    cropped.save(args.output / "wolf-source.png", optimize=True)

    mark_1024 = Image.new("RGBA", (1024, 512), (0, 0, 0, 0))
    fit_mark(cropped, mark_1024, (28, 28, 996, 484), "#000000")
    mark_1024.save(args.output / "mark-1024.png", optimize=True)

    reverse_1024 = Image.new("RGBA", (1024, 512), (0, 0, 0, 0))
    fit_mark(cropped, reverse_1024, (28, 28, 996, 484), BONE)
    reverse_1024.save(args.output / "mark-reversed-1024.png", optimize=True)

    avatar = Image.new("RGBA", (1024, 1024), ImageColor.getrgb(FIR) + (255,))
    fit_mark(cropped, avatar, (92, 220, 932, 804), BONE)
    avatar.save(args.output / "avatar-1024.png", optimize=True)

    social = Image.new("RGBA", (1280, 640), ImageColor.getrgb(FIR) + (255,))
    draw = ImageDraw.Draw(social)
    draw.rectangle((0, 0, 16, 640), fill=ImageColor.getrgb(LICHEN))
    fit_mark(cropped, social, (64, 126, 508, 470), FOG)
    serif_path = r"C:\Windows\Fonts\georgia.ttf"
    sans_path = r"C:\Windows\Fonts\arial.ttf"
    draw.text((570, 188), "Dispersal", font=font(serif_path, 76), fill=ImageColor.getrgb(BONE))
    draw.text((570, 274), "Wolves", font=font(serif_path, 76), fill=ImageColor.getrgb(BONE))
    draw.text((576, 394), "DEFENSIVE UTILITIES FOR LINUX HOSTS", font=font(sans_path, 18), fill=ImageColor.getrgb(FOG), spacing=6)
    draw.line((576, 446, 1180, 446), fill=ImageColor.getrgb(LICHEN), width=2)
    social.save(args.output / "social-preview-1280x640.png", optimize=True)

    favicon_width = max(width, height)
    offset_x = (favicon_width - width) // 2
    offset_y = (favicon_width - height) // 2
    favicon_path = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {favicon_width} {favicon_width}"><path transform="translate({offset_x} {offset_y})" fill="{FIR}" fill-rule="evenodd" d="{path_data}"/></svg>\n'
    (args.output / "favicon.svg").write_text(favicon_path, encoding="utf-8")

    avatar_scale = min(820 / width, 560 / height)
    avatar_x = (1024 - width * avatar_scale) / 2
    avatar_y = (1024 - height * avatar_scale) / 2
    avatar_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-labelledby="title">
  <title id="title">Dispersal Wolves</title>
  <rect width="1024" height="1024" rx="72" fill="{FIR}"/>
  <path transform="translate({avatar_x:.2f} {avatar_y:.2f}) scale({avatar_scale:.6f})" fill="{BONE}" fill-rule="evenodd" d="{path_data}"/>
</svg>
'''
    (args.output / "avatar.svg").write_text(avatar_svg, encoding="utf-8")

    wordmark_scale = min(590 / width, 300 / height)
    wordmark_y = (420 - height * wordmark_scale) / 2
    wordmark_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 420" role="img" aria-labelledby="title">
  <title id="title">Dispersal Wolves</title>
  <path transform="translate(40 {wordmark_y:.2f}) scale({wordmark_scale:.6f})" fill="{FIR}" fill-rule="evenodd" d="{path_data}"/>
  <text x="700" y="190" fill="{FIR}" font-family="{SERIF_STACK}" font-size="120">Dispersal</text>
  <text x="700" y="320" fill="{FIR}" font-family="{SERIF_STACK}" font-size="120">Wolves</text>
</svg>
'''
    (args.output / "wordmark.svg").write_text(wordmark_svg, encoding="utf-8")

    social_scale = min(430 / width, 310 / height)
    social_y = (640 - height * social_scale) / 2
    social_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" role="img" aria-labelledby="title desc">
  <title id="title">Dispersal Wolves</title>
  <desc id="desc">Defensive utilities for Linux hosts</desc>
  <rect width="1280" height="640" fill="{FIR}"/>
  <rect width="16" height="640" fill="{LICHEN}"/>
  <path transform="translate(64 {social_y:.2f}) scale({social_scale:.6f})" fill="{FOG}" fill-rule="evenodd" d="{path_data}"/>
  <text x="570" y="258" fill="{BONE}" font-family="{SERIF_STACK}" font-size="76">Dispersal</text>
  <text x="570" y="344" fill="{BONE}" font-family="{SERIF_STACK}" font-size="76">Wolves</text>
  <text x="576" y="412" fill="{FOG}" font-family="{SANS_STACK}" font-size="18" letter-spacing="2">DEFENSIVE UTILITIES FOR LINUX HOSTS</text>
  <path d="M576 446H1180" stroke="{LICHEN}" stroke-width="2"/>
</svg>
'''
    (args.output / "social-preview.svg").write_text(social_svg, encoding="utf-8")

    print(f"traced_contours={len(kept)}")
    print(f"viewbox={width}x{height}")


if __name__ == "__main__":
    main()
