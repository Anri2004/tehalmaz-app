from PIL import Image
import os

ASSETS = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(ASSETS, "logo.png")

logo_orig = Image.open(LOGO_PATH).convert("RGBA")

# Убираем белый фон
data = logo_orig.getdata()
new_data = []
for r, g, b, a in data:
    if r > 220 and g > 220 and b > 220:
        new_data.append((r, g, b, 0))
    else:
        new_data.append((r, g, b, a))
logo_orig.putdata(new_data)

# ── СПЛЭШ-ЭКРАН: чистый белый фон, только SVG логотип по центру ───────────────
SPLASH_W, SPLASH_H = 1284, 2778
LOGO_W = int(SPLASH_W * 0.55)   # логотип 55% ширины

splash = Image.new("RGBA", (SPLASH_W, SPLASH_H), (255, 255, 255, 255))  # белый фон

logo = logo_orig.copy()
logo.thumbnail((LOGO_W, LOGO_W), Image.LANCZOS)

x = (SPLASH_W - logo.width) // 2
y = (SPLASH_H - logo.height) // 2
splash.paste(logo, (x, y), logo)
splash.save(os.path.join(ASSETS, "splash.png"), "PNG")
print("splash.png OK")

# ── ИКОНКА 1024x1024: тёмный фон + логотип ───────────────────────────────────
ICON_SIZE = 1024
LOGO_ICON = int(ICON_SIZE * 0.72)
BG = (26, 26, 46, 255)

icon = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), BG)
logo_i = logo_orig.copy()
logo_i.thumbnail((LOGO_ICON, LOGO_ICON), Image.LANCZOS)
xi = (ICON_SIZE - logo_i.width) // 2
yi = (ICON_SIZE - logo_i.height) // 2
icon.paste(logo_i, (xi, yi), logo_i)
icon.save(os.path.join(ASSETS, "icon.png"), "PNG")
print("icon.png OK")
