import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = r"d:\Desktop\博客\public\assets\images\s16-worlds"
os.makedirs(OUTPUT_DIR, exist_ok=True)

FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
FONT_REGULAR = r"C:\Windows\Fonts\msyh.ttc"

teams = [
    {
        "id": "al",
        "name": "AL (Anyone's Legend)",
        "cn_name": "谁说凡人不可成传奇",
        "seed": "LPL #1 一号种子",
        "bg_top": (25, 8, 14),
        "bg_bot": (10, 4, 6),
        "accent": (230, 70, 70),
        "accent_light": (255, 180, 100),
        "roster": "TOP: Breathe  |  JUG: Tarzan  |  MID: Shanks  |  BOT: Hope  |  SUP: Kael",
        "quote": "“西风猎猎，旌旗蔽空。六年底色尽是泥泞，一朝登顶银龙拂晓。”",
        "story_tag": "新科银龙冠军 · 草根突围神话",
        "border_color": (200, 60, 60)
    },
    {
        "id": "blg",
        "name": "BLG (Bilibili Gaming)",
        "cn_name": "重剑无锋 锋芒自现",
        "seed": "LPL #2 二号种子",
        "bg_top": (10, 22, 45),
        "bg_bot": (4, 10, 22),
        "accent": (0, 180, 255),
        "accent_light": (120, 220, 255),
        "roster": "TOP: Bin  |  JUG: Wei / Xun  |  MID: Knight  |  BOT: Elk / Viper  |  SUP: ON",
        "quote": "“笑容收起，目光坚定。背负赛区无尽期许，以纯粹锋芒破浪而行。”",
        "story_tag": "争冠绝对热门 · 破浪求道之志",
        "border_color": (0, 160, 230)
    },
    {
        "id": "tes",
        "name": "TES (Top Esports)",
        "cn_name": "搏至则菁 向死而生",
        "seed": "LPL #3 三号种子",
        "bg_top": (38, 14, 20),
        "bg_bot": (18, 6, 10),
        "accent": (255, 82, 82),
        "accent_light": (255, 160, 60),
        "roster": "TOP: 369  |  JUG: Tian  |  MID: Creme  |  BOT: JackeyLove  |  SUP: Meiko",
        "quote": "“上一秒随性日常，下一秒战意沸腾。老将归队，何惧漫漫长夜。”",
        "story_tag": "兄弟同袍共进 · 永远向前闪现",
        "border_color": (230, 60, 70)
    },
    {
        "id": "ig",
        "name": "iG (Invictus Gaming)",
        "cn_name": "涅槃重逢 极地飞雪",
        "seed": "LPL #4 四号种子",
        "bg_top": (18, 24, 32),
        "bg_bot": (8, 10, 15),
        "accent": (100, 220, 240),
        "accent_light": (230, 240, 250),
        "roster": "TOP: TheShy  |  JUG: Wei  |  MID: Rookie  |  BOT: Photic  |  SUP: Jwei",
        "quote": "“熟悉的身影再度并肩。从涅槃底泥杀穿资格赛，翻过那座山，传奇仍是少年。”",
        "story_tag": "十年情怀归来 · 绝境逆风狂岚",
        "border_color": (80, 180, 200)
    },
    {
        "id": "t1",
        "name": "T1 (SK Telecom T1)",
        "cn_name": "不朽王座 诸神黄昏",
        "seed": "LCK #3 三号种子",
        "bg_top": (30, 10, 20),
        "bg_bot": (12, 5, 8),
        "accent": (235, 60, 60),
        "accent_light": (250, 200, 80),
        "roster": "TOP: Doran  |  JUG: Oner  |  MID: Faker  |  BOT: Gumayusi  |  SUP: Keria",
        "quote": "“第十三年的执念。哪怕岁月漫长，只要李相赫端坐高台，城墙便坚不可摧。”",
        "story_tag": "电竞活化石 · 奇迹本身的化身",
        "border_color": (220, 50, 60)
    },
    {
        "id": "gen",
        "name": "GEN (Gen.G Esports)",
        "cn_name": "百炼成钢 终极征途",
        "seed": "LCK #1 一号种子",
        "bg_top": (28, 22, 10),
        "bg_bot": (12, 10, 4),
        "accent": (212, 175, 55),
        "accent_light": (255, 230, 140),
        "roster": "TOP: Kiin  |  JUG: Canyon  |  MID: Chovy  |  BOT: Ruler / Peyz  |  SUP: Lehends",
        "quote": "“统治本土，渴盼登顶。数度折戟从未击溃意志，这一季唯冠军为归途。”",
        "story_tag": "王朝绝对统治 · 矢志世界之巅",
        "border_color": (190, 150, 45)
    },
    {
        "id": "dk_hle",
        "name": "DK & HLE (Dplus KIA / Hanwha Life)",
        "cn_name": "守望荣光与银河破晓",
        "seed": "LCK 宿将劲旅",
        "bg_top": (14, 26, 30),
        "bg_bot": (6, 12, 15),
        "accent": (50, 205, 150),
        "accent_light": (255, 140, 50),
        "roster": "DK: ShowMaker, Lucid, Aiming  |  HLE: Zeus, Kanavi, Zeka, Viper, Delight",
        "quote": "“‘这可能是我最后的机会。’荣光沉淀在眼底，银河在绝壁之上重新点亮星火。”",
        "story_tag": "老将执念不熄 · 银河战舰集结",
        "border_color": (40, 180, 130)
    },
    {
        "id": "west_wildcard",
        "name": "G2 / KC / TL / C9",
        "cn_name": "世界狂潮 蓝墙与骑士",
        "seed": "LEC / LCS / 外卡 群雄出征",
        "bg_top": (20, 16, 35),
        "bg_bot": (8, 6, 15),
        "accent": (120, 110, 240),
        "accent_light": (180, 170, 255),
        "roster": "LEC: G2 (Caps), KC (Caliste)  |  LCS: TL (Impact, CoreJJ), C9  |  APAC: TSW, CFO",
        "quote": "“从巴黎街头的蓝色人潮，到暮年老兵的孤舟横渡。赛场无界，唯热爱不死。”",
        "story_tag": "次级狂飙奇迹 · 跨越大陆的挑战",
        "border_color": (100, 90, 210)
    }
]

WIDTH = 1200
HEIGHT = 675

def create_team_card(team):
    img = Image.new("RGBA", (WIDTH, HEIGHT), (10, 10, 15, 255))
    draw = ImageDraw.Draw(img)

    # 1. Background vertical gradient
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(team["bg_top"][0] * (1 - ratio) + team["bg_bot"][0] * ratio)
        g = int(team["bg_top"][1] * (1 - ratio) + team["bg_bot"][1] * ratio)
        b = int(team["bg_top"][2] * (1 - ratio) + team["bg_bot"][2] * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))

    # 2. Tech grid overlay
    grid_color = (team["accent"][0], team["accent"][1], team["accent"][2], 18)
    for x in range(0, WIDTH, 40):
        draw.line([(x, 0), (x, HEIGHT)], fill=grid_color, width=1)
    for y in range(0, HEIGHT, 40):
        draw.line([(0, y), (WIDTH, y)], fill=grid_color, width=1)

    # 3. Ambient glow circle in center-right
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    gx, gy, gr = 850, 320, 280
    glow_draw.ellipse(
        [(gx - gr, gy - gr), (gx + gr, gy + gr)],
        fill=(team["accent"][0], team["accent"][1], team["accent"][2], 45)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # 4. Border & Corner Tech Brackets
    border_col = (team["border_color"][0], team["border_color"][1], team["border_color"][2], 140)
    draw.rectangle([(25, 25), (WIDTH - 25, HEIGHT - 25)], outline=border_col, width=2)
    # Highlight corner brackets
    c_len = 35
    c_col = (team["accent_light"][0], team["accent_light"][1], team["accent_light"][2], 240)
    # top-left
    draw.line([(20, 20), (20 + c_len, 20)], fill=c_col, width=4)
    draw.line([(20, 20), (20, 20 + c_len)], fill=c_col, width=4)
    # top-right
    draw.line([(WIDTH - 20 - c_len, 20), (WIDTH - 20, 20)], fill=c_col, width=4)
    draw.line([(WIDTH - 20, 20), (WIDTH - 20, 20 + c_len)], fill=c_col, width=4)
    # bot-left
    draw.line([(20, HEIGHT - 20), (20 + c_len, HEIGHT - 20)], fill=c_col, width=4)
    draw.line([(20, HEIGHT - 20 - c_len), (20, HEIGHT - 20)], fill=c_col, width=4)
    # bot-right
    draw.line([(WIDTH - 20 - c_len, HEIGHT - 20), (WIDTH - 20, HEIGHT - 20)], fill=c_col, width=4)
    draw.line([(WIDTH - 20, HEIGHT - 20 - c_len), (WIDTH - 20, HEIGHT - 20)], fill=c_col, width=4)

    # 5. Fonts
    f_sub = ImageFont.truetype(FONT_BOLD, 20)
    f_badge = ImageFont.truetype(FONT_BOLD, 18)
    f_title = ImageFont.truetype(FONT_BOLD, 54)
    f_cn = ImageFont.truetype(FONT_BOLD, 32)
    f_roster = ImageFont.truetype(FONT_REGULAR, 22)
    f_quote = ImageFont.truetype(FONT_REGULAR, 24)
    f_foot = ImageFont.truetype(FONT_REGULAR, 17)

    # 6. Top Header Line
    draw.text((60, 50), "WORLDS 2026 // S16 英雄联盟全球总决赛 · 出征纪实", font=f_sub, fill=(180, 190, 205, 220))
    
    # Seed Badge (Top Right)
    badge_text = team["seed"]
    badge_w = 210
    badge_h = 36
    bx = WIDTH - 60 - badge_w
    by = 45
    draw.rectangle([(bx, by), (bx + badge_w, by + badge_h)], fill=(team["accent"][0], team["accent"][1], team["accent"][2], 180), outline=c_col, width=1)
    draw.text((bx + 18, by + 6), badge_text, font=f_badge, fill=(255, 255, 255, 255))

    # Divider line
    draw.line([(60, 95), (WIDTH - 60, 95)], fill=(team["accent"][0], team["accent"][1], team["accent"][2], 80), width=1)

    # 7. Big Team Name
    draw.text((60, 135), team["name"], font=f_title, fill=(255, 255, 255, 255))

    # Sub title / CN Motto
    draw.text((62, 210), team["cn_name"], font=f_cn, fill=team["accent_light"])

    # Story Tag Pill
    tag_text = team["story_tag"]
    draw.rectangle([(62, 275), (62 + 320, 275 + 32)], fill=(30, 35, 45, 200), outline=(team["accent"][0], team["accent"][1], team["accent"][2], 160), width=1)
    draw.text((75, 280), f"⚡ {tag_text}", font=ImageFont.truetype(FONT_BOLD, 16), fill=(240, 245, 255, 240))

    # 8. Roster Block
    card_bg = (15, 18, 25, 220)
    draw.rectangle([(60, 335), (WIDTH - 60, 415)], fill=card_bg, outline=(60, 70, 90, 120), width=1)
    # Accent indicator bar on left
    draw.rectangle([(60, 335), (66, 415)], fill=team["accent"])
    draw.text((85, 348), "出征首发大名单 (ROSTER)", font=ImageFont.truetype(FONT_BOLD, 15), fill=team["accent_light"])
    draw.text((85, 373), team["roster"], font=f_roster, fill=(230, 235, 245, 255))

    # 9. Quote / Legend Narrative Box
    draw.rectangle([(60, 440), (WIDTH - 60, 545)], fill=(20, 24, 34, 180), outline=(team["accent"][0], team["accent"][1], team["accent"][2], 70), width=1)
    draw.rectangle([(60, 440), (66, 545)], fill=c_col)
    draw.text((85, 455), "传奇志 · 为什么为奇迹而战", font=ImageFont.truetype(FONT_BOLD, 15), fill=(160, 175, 195, 220))
    draw.text((85, 485), team["quote"], font=f_quote, fill=(255, 250, 235, 240))

    # 10. Footer / Slogan
    draw.line([(60, 575), (WIDTH - 60, 575)], fill=(60, 70, 90, 100), width=1)
    draw.text((60, 600), "S16 OFFICIAL WORLD CHAMPIONSHIP // THIS IS OUR MOMENT · 让奇迹发生", font=f_foot, fill=(140, 150, 170, 190))
    draw.text((WIDTH - 290, 600), "LEAGUE OF LEGENDS 2026", font=f_foot, fill=(team["accent_light"][0], team["accent_light"][1], team["accent_light"][2], 210))

    out_path = os.path.join(OUTPUT_DIR, f"{team['id']}_departure.png")
    img.save(out_path, format="PNG")
    print("Saved:", out_path)

for t in teams:
    create_team_card(t)
print("All team cards created successfully!")
