from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H = 400, 225
try:
    font_big = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 18)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 7)
    font_tiny = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 6)
except OSError:
    font_big = font_small = font_tiny = ImageFont.load_default()

# Schematic land shapes and city references are purely illustrative, not geographic data.
land = [
    [(105,86),(118,64),(142,58),(158,72),(152,92),(138,100),(127,120),(115,115)],
    [(150,126),(168,132),(177,157),(168,183),(158,170),(155,148)],
    [(202,70),(220,59),(249,65),(264,80),(257,96),(239,99),(227,91),(211,100),(198,88)],
    [(221,110),(245,109),(260,127),(251,158),(237,174),(222,156),(215,132)],
    [(270,164),(286,159),(299,170),(291,183),(277,180)]
]
frames = []
for frame in range(24):
    image = Image.new("RGB", (W, H), (7, 12, 19))
    draw = ImageDraw.Draw(image)
    for x, y in [(18,26),(374,31),(349,87),(24,190),(365,197),(74,52),(325,45),(44,148)]:
        draw.ellipse((x,y,x+1,y+1), fill=(57,78,96))
    draw.text((18,14), "THE GRAVEYARD", font=font_big, fill=(241,238,229))
    draw.text((19,39), "GLOBAL STARTUP FAILURE ATLAS", font=font_tiny, fill=(139,158,177))
    draw.text((382,20), "2000 — 2026", font=font_small, fill=(211,166,118), anchor="ra")
    cx, cy, radius = 200, 124, 83
    draw.ellipse((cx-radius,cy-radius,cx+radius,cy+radius), fill=(12,29,42), outline=(82,127,146), width=2)
    draw.arc((cx-radius+12,cy-radius,cx+radius-12,cy+radius), 65, 295, fill=(41,72,91), width=1)
    draw.arc((cx-radius+32,cy-radius,cx+radius-32,cy+radius), 85, 275, fill=(41,72,91), width=1)
    draw.arc((cx-radius,cy-radius+25,cx+radius,cy+radius-25), 0, 360, fill=(41,72,91), width=1)
    draw.line((cx-radius,cy,cx+radius,cy), fill=(41,72,91), width=1)
    shift = round(math.sin(frame / 24 * math.tau) * 5)
    for polygon in land:
        draw.polygon([(x+shift,y) for x,y in polygon], fill=(39,71,76), outline=(78,119,112))
    point = (225 + int(12*math.sin(frame/24*math.tau)), 106 + int(7*math.cos(frame/24*math.tau)))
    draw.ellipse((point[0]-10,point[1]-10,point[0]+10,point[1]+10), outline=(214,162,110), width=1)
    draw.ellipse((point[0]-3,point[1]-3,point[0]+3,point[1]+3), fill=(238,177,119))
    draw.line((point[0],point[1],point[0]+26,point[1]+22), fill=(117,166,176), width=1)
    draw.ellipse((point[0]+23,point[1]+19,point[0]+29,point[1]+25), fill=(117,166,176))
    draw.line((18,207,382,207), fill=(37,52,67), width=1)
    draw.text((19,213), "EXPLORE  ·  FILTER  ·  INVESTIGATE", font=font_tiny, fill=(139,158,177))
    draw.text((382,213), "INTERACTIVE GLOBAL ARCHIVE", font=font_tiny, fill=(211,166,118), anchor="ra")
    frames.append(image.quantize(colors=32, method=Image.Quantize.MEDIANCUT))

frames[0].save(ROOT / "public/graveyard-demo.gif", save_all=True, append_images=frames[1:], duration=90, loop=0, optimize=True, disposal=2)
print(ROOT / "public/graveyard-demo.gif")
