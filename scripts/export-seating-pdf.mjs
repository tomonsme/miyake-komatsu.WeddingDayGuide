import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'
import { PDFDocument, rgb } from 'pdf-lib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const port = Number(process.env.SEATING_PDF_PORT || 3030)
const baseUrl = process.env.SEATING_PDF_URL || `http://127.0.0.1:${port}`
const pageUrl = `${baseUrl}/seating`
const gotoTimeout = Number(process.env.SEATING_PDF_TIMEOUT || 60000)
const outputPath = resolve(rootDir, 'public', 'seating.pdf')

const startServer = () => {
  const child = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: rootDir,
    stdio: 'inherit'
  })
  return child
}

const waitForServer = async (url, attempts = 60) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (res.ok) return
    } catch {
      // Retry until the dev server is ready.
    }
    await delay(500)
  }
  throw new Error(`Server did not respond in time: ${url}`)
}

const pxToMm = (px) => (px * 25.4) / 96

const renderPdf = async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: Number(process.env.SEATING_PDF_DSF || 3)
    })
    page.setDefaultTimeout(gotoTimeout)
    await page.emulateMedia({ media: 'screen' })
    const inviteKey = process.env.INVITE_ACCESS_KEY
    if (inviteKey) {
      const url = new URL(baseUrl)
      await page.context().addCookies([
        {
          name: 'invite_key',
          value: inviteKey,
          url: `${url.protocol}//${url.host}`
        }
      ])
    }
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: gotoTimeout })
    await page.waitForSelector('.seating-shell', { state: 'visible' })
    const sheet = page.locator('.seating-sheet')
    await sheet.waitFor({ state: 'visible' })
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready
    })
    await page.waitForFunction(() => {
      const sheetEl = document.querySelector('.seating-sheet')
      if (!sheetEl) return false
      const styles = getComputedStyle(sheetEl)
      return styles.borderRadius !== '0px' && styles.backgroundColor !== 'rgba(0, 0, 0, 0)'
    })
    await page.addStyleTag({
      content: `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }
        #__nuxt, #__nuxt > div {
          background: #fff !important;
          background-image: none !important;
        }
        canvas,
        .sparkles,
        .sparkle,
        .pointer-events-none.fixed.inset-0 {
          display: none !important;
        }
        main {
          background: #fff !important;
        }
        .seating-shell {
          padding: 0 !important;
          margin: 0 !important;
          background: #fff !important;
          width: max-content !important;
          height: max-content !important;
        }
        .seating-scroll {
          overflow: visible !important;
          padding: 0 !important;
          margin: 0 !important;
          width: max-content !important;
          height: max-content !important;
          display: block !important;
          background: #fff !important;
        }
        .seating-sheet {
          transform: none !important;
          transform-origin: top left !important;
          box-shadow: none !important;
          padding-bottom: 32px !important;
        }
        #seating-pdf-wrapper {
          background: #fff !important;
          display: inline-block !important;
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: var(--seating-pdf-pad, 48px) !important;
        }
      `
    })
    const paddingPx = Number(process.env.SEATING_PDF_PAD_PX || 48)
    await page.evaluate((pad) => {
      const sheetEl = document.querySelector('.seating-sheet')
      if (!sheetEl) return
      const wrapperId = 'seating-pdf-wrapper'
      let wrapper = document.getElementById(wrapperId)
      if (!wrapper) {
        wrapper = document.createElement('div')
        wrapper.id = wrapperId
        const parent = sheetEl.parentElement
        if (!parent) return
        parent.insertBefore(wrapper, sheetEl)
        wrapper.appendChild(sheetEl)
      }
      wrapper.style.setProperty('--seating-pdf-pad', `${pad}px`)
    }, paddingPx)
    await page.waitForTimeout(100)
    const wrapper = page.locator('#seating-pdf-wrapper')
    await wrapper.waitFor({ state: 'visible' })
    let box = await wrapper.boundingBox()
    if (!box) throw new Error('Failed to measure seating sheet')
    const viewport = page.viewportSize()
    let clipX = Math.floor(box.x)
    let clipY = Math.floor(box.y)
    let clipWidth = Math.ceil(box.width + (box.x - clipX))
    let clipHeight = Math.ceil(box.height + (box.y - clipY))
    let requiredWidth = Math.ceil(clipX + clipWidth)
    let requiredHeight = Math.ceil(clipY + clipHeight)
    if (viewport && (requiredWidth > viewport.width || requiredHeight > viewport.height)) {
      await page.setViewportSize({
        width: Math.max(viewport.width, requiredWidth),
        height: Math.max(viewport.height, requiredHeight)
      })
      await page.waitForTimeout(50)
      box = await wrapper.boundingBox()
      if (!box) throw new Error('Failed to measure seating sheet after resize')
      clipX = Math.floor(box.x)
      clipY = Math.floor(box.y)
      clipWidth = Math.ceil(box.width + (box.x - clipX))
      clipHeight = Math.ceil(box.height + (box.y - clipY))
      requiredWidth = Math.ceil(clipX + clipWidth)
      requiredHeight = Math.ceil(clipY + clipHeight)
      if (viewport) {
        if (requiredWidth > viewport.width || requiredHeight > viewport.height) {
          await page.setViewportSize({
            width: Math.max(viewport.width, requiredWidth),
            height: Math.max(viewport.height, requiredHeight)
          })
          await page.waitForTimeout(50)
        }
      }
    }
    await wrapper.scrollIntoViewIfNeeded()
    const image = await wrapper.screenshot({ type: 'png', scale: 'device', omitBackground: false })
    const header = image.subarray(0, 24)
    const pngWidth = header.readUInt32BE(16)
    const pngHeight = header.readUInt32BE(20)
    if (pngWidth < Math.round(clipWidth) || pngHeight < Math.round(clipHeight)) {
      throw new Error(`Screenshot clipped: ${pngWidth}x${pngHeight} < ${clipWidth}x${clipHeight}`)
    }
    const pdfDoc = await PDFDocument.create()
    const pngImage = await pdfDoc.embedPng(image)
    const pdfPage = pdfDoc.addPage([pngImage.width, pngImage.height])
    pdfPage.drawRectangle({
      x: 0,
      y: 0,
      width: pdfPage.getWidth(),
      height: pdfPage.getHeight(),
      color: rgb(1, 1, 1)
    })
    pdfPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: pngImage.width,
      height: pngImage.height
    })
    const pdfBytes = await pdfDoc.save()
    await fs.writeFile(outputPath, pdfBytes)
  } finally {
    await browser.close()
  }
}

const main = async () => {
  const server = startServer()
  try {
    await waitForServer(pageUrl)
    await renderPdf()
  } finally {
    if (!server.killed) {
      server.kill('SIGTERM')
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
