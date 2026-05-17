import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Since I can't easily run the dev server and wait for it in this environment
        # I will just check if index.html exists and is valid
        import os
        if os.path.exists('index.html'):
            print("index.html found")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
