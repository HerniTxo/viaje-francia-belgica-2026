"""Regenerate missing French MP3s. Optional authoring dependency: edge-tts.

Install edge-tts in the authoring environment, then run from the repository root.
The deployed site plays static MP3s and does not call the synthesis service.
"""
import asyncio
import hashlib
import json
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'docs/data/trip.json'

async def main():
    data = json.loads(DATA.read_text(encoding='utf-8'))
    page = next(p for p in data['pages'] if p['id'] == 'frances')
    phrases = [item for pane in page['panes'] for block in pane['blocks']
               if block['type'] == 'phrases' for item in block['items']]
    voices = await edge_tts.list_voices()
    french = [v for v in voices if v['Locale'] == 'fr-FR']
    if not french:
        raise RuntimeError('No French voice returned by the synthesis service')
    voice = next((v['ShortName'] for v in french if v['ShortName'] == 'fr-FR-DeniseNeural'), french[0]['ShortName'])
    print('Voice:', voice, flush=True)
    semaphore = asyncio.Semaphore(3)
    async def generate(item):
        digest = hashlib.sha256(item['fr'].encode('utf-8')).hexdigest()[:16]
        item['audio'] = f'assets/francais/{digest}.mp3'
        target = ROOT / 'docs' / item['audio']
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.stat().st_size > 1000:
            return
        async with semaphore:
            await asyncio.wait_for(edge_tts.Communicate(item['fr'], 'en-GB-SoniaNeural' if item.get('lang') == 'en' else voice, rate='-20%' if item.get('lang') else '-12%').save(str(target)), timeout=45)
            if target.stat().st_size <= 1000:
                raise RuntimeError('Audio file empty: ' + str(target))
            print('Created:', target.name, flush=True)
    await asyncio.gather(*(generate(item) for item in phrases))
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Ready:', len(phrases), 'French recordings', flush=True)

if __name__ == '__main__':
    asyncio.run(main())
