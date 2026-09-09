from playwright.sync_api import sync_playwright
from pathlib import Path

out=Path('/mnt/data/step52inspect/screens'); out.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':412,'height':915}, device_scale_factor=1)
    errors=[]
    page.on('console', lambda m: errors.append(f'console {m.type}: {m.text}') if m.type=='error' else None)
    page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
    page.goto('file:///mnt/data/step52inspect/index.html', wait_until='networkidle')
    page.screenshot(path=str(out/'home.png'), full_page=True)
    print('HOME title', page.title())
    print('HOME width', page.locator('body').evaluate('(e)=>({scrollWidth:e.scrollWidth,clientWidth:e.clientWidth})'))
    print('HOME ask visible', page.locator('.ai-nav').is_visible())
    # AI direct
    page.goto('file:///mnt/data/step52inspect/ai.html?ac=6&party=BJP', wait_until='networkidle')
    page.screenshot(path=str(out/'ai.png'), full_page=True)
    print('AI width', page.locator('body').evaluate('(e)=>({scrollWidth:e.scrollWidth,clientWidth:e.clientWidth})'))
    print('AI header', page.locator('.ta-ai-app-brand').inner_text() if page.locator('.ta-ai-app-brand').count() else 'none')
    # click a prompt if present
    prompts=page.locator('.ai-suggest')
    print('suggest count', prompts.count())
    if prompts.count():
      prompts.first.click()
      page.wait_for_timeout(1500)
      print('after click output', page.locator('[data-ai-output]').inner_text()[:300] if page.locator('[data-ai-output]').count() else 'no output')
    # locate floating launcher on AI page
    print('AI fab count', page.locator('#ta-ai-fab,.ta-ai-fab').count())
    print('errors', errors[:20])
    browser.close()
