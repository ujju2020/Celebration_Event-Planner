"""
Copyright (c) 2026 Ujjwal Kumar Bhowmick
Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
All rights reserved.

Automated Instagram Reel Generator for CelebraTech AI (PromptWars Challenge 5)
Generates a complete 9:16 1080x1920 vertical video with real UI captures,
voiceover narration, animated captions, and developer attribution.
"""

import os
import sys
import time
import subprocess
import glob
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ASSETS_DIR = "reel_build_assets"
FRAMES_DIR = os.path.join(ASSETS_DIR, "frames")
AUDIO_DIR = os.path.join(ASSETS_DIR, "audio")
SCREENS_DIR = os.path.join(ASSETS_DIR, "screens")
OUTPUT_VIDEO = "CelebraTech_AI_Reel.mp4"

os.makedirs(FRAMES_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(SCREENS_DIR, exist_ok=True)

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

# Scene definitions: (id, voiceover_text, title_overlay, caption_text, tab_action)
SCENES = [
    {
        "id": "scene1",
        "voice": "Planning an Indian wedding, milestone birthday, or festival used to mean spreadsheet chaos and budget stress. Stop struggling! Meet CelebraTech AI, built for PromptWars Challenge 5.",
        "badge": "🚀 PROMPTWARS CHALLENGE 5",
        "title": "STOP SPREADSHEET CHAOS!",
        "subtitle": "Meet CelebraTech AI • GenAI Event Planner",
        "tab": "overview",
        "scroll": 0
    },
    {
        "id": "scene2",
        "voice": "Just select your event: Grand Royal Wedding in Jaipur, 15 Lakhs budget in Indian Rupees, with 250 guests. Click Generate Full AI Plan, and watch the magic happen!",
        "badge": "💍 1-CLICK DEMO PRESETS",
        "title": "JAIPUR ROYAL WEDDING (₹15 LAKHS)",
        "subtitle": "Instant Benchmarking & 1-Click Generation",
        "tab": "overview",
        "scroll": 200
    },
    {
        "id": "scene3",
        "voice": "Instantly, it allocates realistic budgets with an 8 percent emergency contingency cushion, real-time cost-per-guest metrics, and overspend warnings.",
        "badge": "💰 DYNAMIC BUDGET ALLOCATOR",
        "title": "AUTONOMOUS BUDGETING IN INR (₹)",
        "subtitle": "8% Emergency Contingency • Cost/Guest Analytics",
        "tab": "tabBudget",
        "scroll": 0
    },
    {
        "id": "scene4",
        "voice": "It maps out month-by-month countdown phases backwards from your wedding date, plus an hour-by-hour Day-Of Run of Show from morning styling to midnight send-off.",
        "badge": "⏱️ RUN OF SHOW TIMELINE",
        "title": "COUNTDOWN MILESTONES & HOURLY SCHEDULE",
        "subtitle": "T-180 Days to Day-Of Run of Show Schedule",
        "tab": "tabTimeline",
        "scroll": 0
    },
    {
        "id": "scene5",
        "voice": "Under the Vendor Hub, you get interview questions, copy-paste RFP drafts, and contract red-flag warnings to protect your hard-earned money.",
        "badge": "🤝 VENDOR HUB & RFPS",
        "title": "CONTRACT RED FLAGS & AUTOMATED RFPS",
        "subtitle": "Pre-screen Venues, Caterers & Photographers",
        "tab": "tabVendors",
        "scroll": 0
    },
    {
        "id": "scene6",
        "voice": "Our creative studio generates aesthetic 4-swatch color palettes with hex codes, decor concepts, and customized host welcome speeches and toasts.",
        "badge": "🎨 GENAI CREATIVE STUDIO",
        "title": "AESTHETIC PALETTES & CUSTOM SPEECHES",
        "subtitle": "Color Swatches • Invitations • Host Toasts",
        "tab": "tabTheme",
        "scroll": 0
    },
    {
        "id": "scene7",
        "voice": "Need adjustments? Ask the live context-aware Copilot. If your guest count jumps to 250, it dynamically rebalances your catering and venue allocations in real time.",
        "badge": "💬 INTERACTIVE AI COPILOT",
        "title": "REAL-TIME ADAPTIVE REBALANCING",
        "subtitle": "Dynamic Headcount Simulation & Cost Cutting",
        "tab": "tabCopilot",
        "scroll": 0
    },
    {
        "id": "scene8",
        "voice": "Engineered with strict PII guardrails, zero bloat, and 99.38% test coverage. Developed by Ujjwal Kumar Bhowmick. Check the link in bio to try it on GitHub!",
        "badge": "🌟 99.38% TEST VERIFIED",
        "title": "CLEAN CODE • ZERO DEPENDENCY",
        "subtitle": "Developer: Ujjwal Kumar Bhowmick • Link in Bio!",
        "tab": "overview",
        "scroll": 0
    }
]

def capture_ui_screenshots():
    """Captures ultra-high-res 1080x1920 vertical screenshots using Selenium."""
    print(">>> Launching Headless Chrome to capture real application UI...")
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1080,1920")
    options.add_argument("--force-device-scale-factor=1")
    options.add_argument("--hide-scrollbars")
    options.add_argument("--disable-gpu")

    driver = webdriver.Chrome(options=options)
    html_path = "file:///" + os.path.abspath("index.html").replace("\\", "/")
    driver.get(html_path)
    time.sleep(1.5)

    # Overview screenshot
    driver.save_screenshot(os.path.join(SCREENS_DIR, "overview.png"))
    print("Captured: overview.png")

    # Budget tab screenshot
    btn = driver.find_element(By.CSS_SELECTOR, "button[data-tab='tabBudget']")
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.6)
    driver.save_screenshot(os.path.join(SCREENS_DIR, "tabBudget.png"))
    print("Captured: tabBudget.png")

    # Timeline tab screenshot
    btn = driver.find_element(By.CSS_SELECTOR, "button[data-tab='tabTimeline']")
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.6)
    driver.save_screenshot(os.path.join(SCREENS_DIR, "tabTimeline.png"))
    print("Captured: tabTimeline.png")

    # Vendors tab screenshot
    btn = driver.find_element(By.CSS_SELECTOR, "button[data-tab='tabVendors']")
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.6)
    driver.save_screenshot(os.path.join(SCREENS_DIR, "tabVendors.png"))
    print("Captured: tabVendors.png")

    # Theme tab screenshot
    btn = driver.find_element(By.CSS_SELECTOR, "button[data-tab='tabTheme']")
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.6)
    driver.save_screenshot(os.path.join(SCREENS_DIR, "tabTheme.png"))
    print("Captured: tabTheme.png")

    # Copilot tab screenshot
    btn = driver.find_element(By.CSS_SELECTOR, "button[data-tab='tabCopilot']")
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.5)
    chat_input = driver.find_element(By.ID, "chatInput")
    chat_input.send_keys("Our guest count increased to 250, rebalance budget")
    send_btn = driver.find_element(By.ID, "sendChatBtn")
    driver.execute_script("arguments[0].click();", send_btn)
    time.sleep(1.0)
    driver.save_screenshot(os.path.join(SCREENS_DIR, "tabCopilot.png"))
    print("Captured: tabCopilot.png")

    driver.quit()
    print(">>> All screenshots captured successfully!")

def generate_voiceovers():
    """Generates crystal-clear voiceover audio files using Windows Speech Synthesis."""
    print(">>> Generating crystal-clear voiceovers with Windows SAPI...")
    durations = {}

    for idx, scene in enumerate(SCENES):
        wav_file = os.path.join(AUDIO_DIR, f"{scene['id']}.wav").replace("\\", "/")
        text = scene["voice"].replace('"', '\\"')

        # PowerShell command to synthesize voice to wave file
        ps_cmd = f"""
Add-Type -AssemblyName System.speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speak.Rate = 1
$speak.SetOutputToWaveFile("{wav_file}")
$speak.Speak("{text}")
$speak.Dispose()
"""
        subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], check=True)

        # Get audio duration using ffmpeg
        dur_cmd = [
            FFMPEG_EXE, "-i", wav_file, "-f", "null", "-"
        ]
        res = subprocess.run(dur_cmd, stderr=subprocess.PIPE, text=True)
        # Parse duration from ffmpeg output: Duration: 00:00:05.42
        dur = 5.0
        for line in res.stderr.splitlines():
            if "Duration:" in line:
                part = line.split("Duration:")[1].split(",")[0].strip()
                h, m, s = part.split(":")
                dur = float(h)*3600 + float(m)*60 + float(s)
                break
        durations[scene["id"]] = dur
        print(f"Generated {scene['id']}.wav ({dur:.2f}s)")

    return durations

def get_font(size, bold=False):
    """Loads a clean system TrueType font or falls back to default."""
    candidates = [
        "C:/Windows/Fonts/seguiemj.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf"
    ]
    if bold:
        candidates = ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"] + candidates

    for font_path in candidates:
        if os.path.exists(font_path):
            try:
                return ImageFont.truetype(font_path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def render_reel_frames(durations):
    """Renders composite 1080x1920 frames with motion, badges, and animated captions."""
    print(">>> Rendering composite 1080x1920 video frames...")
    fps = 30
    frame_index = 0
    total_scenes = len(SCENES)
    total_duration = sum(durations.values())

    font_badge = get_font(32, bold=True)
    font_title = get_font(44, bold=True)
    font_sub = get_font(30, bold=False)
    font_footer = get_font(24, bold=True)

    elapsed_time = 0.0

    for s_idx, scene in enumerate(SCENES):
        scene_dur = durations[scene["id"]]
        scene_frames = int(scene_dur * fps)
        screen_file = os.path.join(SCREENS_DIR, f"{scene['tab']}.png")
        base_img = Image.open(screen_file).convert("RGBA")

        # In case base image is not exactly 1080x1920, resize it
        if base_img.size != (1080, 1920):
            base_img = base_img.resize((1080, 1920), Image.Resampling.LANCZOS)

        for f in range(scene_frames):
            frame_time = elapsed_time + (f / fps)
            progress = min(1.0, frame_time / total_duration)

            # Subtle slow camera zoom/pan (Ken Burns effect)
            zoom = 1.0 + 0.03 * (f / scene_frames)
            w = int(1080 * zoom)
            h = int(1920 * zoom)
            zoomed = base_img.resize((w, h), Image.Resampling.BILINEAR)

            # Crop back to 1080x1920 from center
            left = (w - 1080) // 2
            top = min(scene["scroll"], h - 1920)
            frame = zoomed.crop((left, top, left + 1080, top + 1920))

            # Overlay Canvas
            overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)

            # 1. Top Gradient Header Bar
            draw.rectangle([(0, 0), (1080, 140)], fill=(15, 23, 42, 230))
            draw.line([(0, 140), (1080, 140)], fill=(99, 102, 241, 180), width=3)

            # Top Badge Pill
            draw.rounded_rectangle([(36, 32), (480, 96)], radius=24, fill=(79, 70, 229, 240), outline=(129, 140, 248, 255), width=2)
            draw.text((56, 46), scene["badge"], fill=(255, 255, 255, 255), font=font_badge)

            # Top Right App Name
            draw.text((720, 50), "🎉 CelebraTech AI", fill=(248, 250, 252, 255), font=font_title)

            # Progress Bar across top
            bar_width = int(1080 * progress)
            draw.rectangle([(0, 136), (bar_width, 140)], fill=(236, 72, 153, 255))

            # 2. Bottom Caption Container (Glassmorphism dark card)
            card_top = 1620
            card_bottom = 1860
            draw.rounded_rectangle([(36, card_top), (1044, card_bottom)], radius=24, fill=(15, 23, 42, 235), outline=(99, 102, 241, 200), width=3)

            # Scene Title & Subtitle inside card
            draw.text((64, card_top + 28), scene["title"], fill=(253, 224, 71, 255), font=font_title)
            draw.text((64, card_top + 92), scene["subtitle"], fill=(241, 245, 249, 255), font=font_sub)

            # Developer Tag Banner at very bottom
            draw.rectangle([(0, 1870), (1080, 1920)], fill=(10, 15, 30, 255))
            draw.text((44, 1882), "Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com) • PromptWars", fill=(148, 163, 184, 255), font=font_footer)

            # Composite final frame
            final_frame = Image.alpha_composite(frame, overlay).convert("RGB")
            frame_path = os.path.join(FRAMES_DIR, f"frame_{frame_index:05d}.jpg")
            final_frame.save(frame_path, quality=90)

            frame_index += 1

        elapsed_time += scene_dur
        print(f"Scene {s_idx+1}/{total_scenes} rendered ({scene_frames} frames)")

    print(f">>> Rendered {frame_index} total video frames!")
    return frame_index

def mux_final_reel():
    """Concatenates voiceover audio and muxes with video frames into MP4."""
    print(">>> Concatenating audio tracks...")
    concat_txt = os.path.join(ASSETS_DIR, "audio_concat.txt")
    with open(concat_txt, "w") as f:
        for scene in SCENES:
            wav_path = os.path.abspath(os.path.join(AUDIO_DIR, f"{scene['id']}.wav")).replace("\\", "/")
            f.write(f"file '{wav_path}'\n")

    full_audio = os.path.join(ASSETS_DIR, "full_voiceover.wav")
    concat_cmd = [
        FFMPEG_EXE, "-y", "-f", "concat", "-safe", "0", "-i", concat_txt, "-c", "copy", full_audio
    ]
    subprocess.run(concat_cmd, check=True)
    print("Voiceover audio concatenated!")

    print(f">>> Encoding final Instagram Reel ({OUTPUT_VIDEO})...")
    frames_pattern = os.path.join(FRAMES_DIR, "frame_%05d.jpg")

    mux_cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", frames_pattern,
        "-i", full_audio,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_VIDEO
    ]
    subprocess.run(mux_cmd, check=True)
    print(f">>> SUCCESS! Instagram Reel created: {OUTPUT_VIDEO}")

if __name__ == "__main__":
    t0 = time.time()
    capture_ui_screenshots()
    durations = generate_voiceovers()
    render_reel_frames(durations)
    mux_final_reel()
    print(f">>> Full Reel pipeline finished in {time.time() - t0:.1f}s!")

