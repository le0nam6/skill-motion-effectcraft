"""Narração do Reel do Nubank (20/10). voz.py texto.txt saida.wav uso.json"""
import json, os, subprocess, sys, base64, urllib.request
K = subprocess.run(["security","find-generic-password","-s","gemini-estudio","-w"],capture_output=True,text=True).stdout.strip()
T = open(sys.argv[1]).read().strip()
body = {"contents":[{"role":"user","parts":[{"text":T,"speech_metadata":{"style":"Português do Brasil falado, tom de conversa com um amigo, de quem conta um bastidor de mercado pra um amigo, curioso e com um toque de provocação, ritmo ágil de Reels, sem cara de locutor"}}]}],
        "generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"voice":"Charon"}}}}
req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent",
      data=json.dumps(body).encode(), headers={"x-goog-api-key":K,"Content-Type":"application/json"})
r = json.load(urllib.request.urlopen(req, timeout=300))
d = base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
mime = r["candidates"][0]["content"]["parts"][0]["inlineData"].get("mimeType","")
raw = sys.argv[2] + ".raw"; open(raw,"wb").write(d)
if d[:4] == b"RIFF": os.replace(raw, sys.argv[2])
else:
    rate = 24000
    if "rate=" in mime: rate = int(mime.split("rate=")[1].split(";")[0])
    subprocess.run(["ffmpeg","-v","error","-y","-f","s16le","-ar",str(rate),"-ac","1","-i",raw,sys.argv[2]],check=True); os.remove(raw)
json.dump(r.get("usageMetadata",{}), open(sys.argv[3],"w"), indent=1)
print(mime, r.get("usageMetadata",{}).get("totalTokenCount"))
