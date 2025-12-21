import fs from "fs"
import { Canvas, loadImage } from "skia-canvas"

const configName = "f8thful"

const config = JSON.parse(fs.readFileSync(`config/${configName}.json`))

const m = config.size / 16

const SLOT = 18 * m
const BORDER = 1 * m

const names = JSON.parse(fs.readFileSync(`config/mappings/${config.mapping}.json`, "utf8"))
const tints = JSON.parse(fs.readFileSync(`config/tints/${config.tints}.json`, "utf8"))
const leaves = JSON.parse(fs.readFileSync(`config/leaves/${config.leaves}.json`, "utf8"))

const baseImg = await loadImage("textures/base.png")

const canvas = new Canvas(baseImg.width * m, baseImg.height * m)
const ctx = canvas.getContext("2d")

ctx.imageSmoothingEnabled = false
ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height)

const cols = Math.floor(canvas.width / SLOT)

let x = 0
let y = 0

const debugImg = await loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABuUlEQVR42pXRwUuTARzG8Yf3Hyh1spBFobvYpZYngzLAyFvU685ZVBf1klRAuHU0Kkgg5k5Zl5oBCTJBRRVQAXUoKIpuorABe2FzRxF9eeT58QJehfHZ5fc+X15egLzcD0Cdr78GyrAZMaNmmxk3STo3D1hXQ9RnCLhFhu0iAnSQUbtrA5Jk3K6BI2gjTwD3fPnowl6/mTYZWHAezqvQtctQFXFfhTdWSFphzAp2XSH3gBq0N0UAL7flgC+/UU6aDNwxp52enyr0Z9lQQXKT1zykfV4H5q1g12VyywrZoPAhpY3P/+XvdbnsX9zeMMfNEedTUoXh7yqM/WXYw9oKI0VQzxTJVcAjM1YYDgrpd1oaH5Ibo5KL5tmS5C9zyHzvjD5XYbKPoQq2EiowRZTynJ1DocSzESskgCrZFxRmXO3t9Ei+Nb9k5cRXeTog+cLsdhY6VNh7rO9Al/DW+CqjwmBChT+vkSvztNveoSso7Mdstd3sTEm3V/a68kenPGmXvOsc3lCBLUQ1w9ZBlHOMuSgWeP8B8iU+iyHn8WMr/lV53BIUeIWy/qlsvCObmmVzk7zdKJ/Uy9rVc6GBZfJIb3EsAAAAAElFTkSuQmCC")
const debug = new Canvas(config.size, config.size)
const debugCtx = debug.getContext("2d")
debugCtx.imageSmoothingEnabled = false
debugCtx.drawImage(debugImg, 0, 0, config.size, config.size)

const blank = new Canvas(config.size, config.size)

for (let name of names) {
  let texturePath
  if (name.includes("/")) {
    texturePath = `${config.source}/${name}.png`
  } else {
    texturePath = `${config.source}/block/${name}.png`
  }

  if (name !== "debug" && !fs.existsSync(texturePath)) {
    x++
    if (x >= cols) {
      x = 0
      y++
    }
    continue
  }

  async function loadTexture(path) {
    let img = await loadImage(path)
    if (img.width < config.size) {
      const canvas = new Canvas(config.size, config.size)
      const ctx = canvas.getContext("2d")
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, img.width, Math.min(img.height, config.size), 0, 0, config.size, Math.min(img.height, config.size) * (config.size / img.width))
      img = canvas
    }
    return img
  }

  let img
  if (
    name === "air" ||
    name === "entity/chest/normal" ||
    name === "entity/chest/ender"
  ) {
    img = blank
  } else if (name === "debug") {
    img = debug
  } else {
    img = await loadTexture(texturePath)
  }

  const dx = x * SLOT
  const dy = y * SLOT

  ctx.clearRect(dx, dy, SLOT, SLOT)

  const srcW = Math.min(img.width, config.size)
  const srcH = Math.min(img.height, config.size)

  function drawImage(img) {
    ctx.drawImage(img, 0, 0, srcW, srcH, dx + BORDER, dy + BORDER, srcW, srcH)
  }

  drawImage(img)

  if (name === "open_eyeblossom") {
    if (fs.existsSync(`${config.source}/block/open_eyeblossom_emissive.png`)) {
      drawImage(await loadTexture(`${config.source}/block/open_eyeblossom_emissive.png`))
    }
  } else if (name === "firefly_bush") {
    if (fs.existsSync(`${config.source}/block/firefly_bush_emissive.png`)) {
      drawImage(await loadTexture(`${config.source}/block/firefly_bush_emissive.png`))
    }
  }

  if (tints[name]) {
    const maskCanvas = new Canvas(SLOT, SLOT)
    const maskCtx = maskCanvas.getContext("2d")

    maskCtx.drawImage(canvas, dx, dy, SLOT, SLOT, 0, 0, SLOT, SLOT)
    maskCtx.globalCompositeOperation = "multiply"
    maskCtx.fillStyle = tints[name]
    maskCtx.fillRect(0, 0, SLOT, SLOT)
    maskCtx.globalCompositeOperation = "destination-in"
    maskCtx.drawImage(canvas, dx, dy, SLOT, SLOT, 0, 0, SLOT, SLOT)

    ctx.drawImage(maskCanvas, dx, dy)
  }

  if (leaves.includes(name)) {
    const imgData = ctx.getImageData(dx, dy, SLOT, SLOT)
    const data = imgData.data

    let darkest = null
    let minBrightness = Infinity

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a === 0) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      const brightness = r + g + b
      if (brightness < minBrightness) {
        minBrightness = brightness
        darkest = [r, g, b]
      }
    }

    if (darkest) {
      const dr = Math.floor(darkest[0] * 0.75)
      const dg = Math.floor(darkest[1] * 0.75)
      const db = Math.floor(darkest[2] * 0.75)

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) {
          data[i] = dr
          data[i + 1] = dg
          data[i + 2] = db
          data[i + 3] = 255
        }
      }

      ctx.putImageData(imgData, dx, dy)
    }
  }

  x++
  if (x >= cols) {
    x = 0
    y++
  }
}

ctx.drawImage(canvas, 18 * 38 * m, 0 * m, 18 * m, 18 * m, 18 * 3 * m, 0 * m, 18 * m, 18 * m)

if (fs.existsSync(`${config.source}/entity/chest/normal.png`)) {
  const img = await loadImage(`${config.source}/entity/chest/normal.png`)
  const canvas2 = new Canvas(img.width, img.height)
  const ctx2 = canvas2.getContext("2d")
  ctx2.save()
  ctx2.translate(img.width / 2, img.height / 2)
  ctx2.rotate(Math.PI)
  ctx2.drawImage(img, -img.width / 2, -img.height / 2)
  ctx.drawImage(canvas2, 22 * m, 50 * m, 14 * m, 14 * m, (18 * 25 + 2) * m, 2 * m, 14 * m, 14 * m)
  ctx.drawImage(canvas2, 22 * m, 22 * m, 14 * m, 9 * m, (18 * 26 + 2) * m, 8 * m, 14 * m, 9 * m)
  ctx.drawImage(canvas2, 22 * m, 45 * m, 14 * m, 5 * m, (18 * 26 + 2) * m, 3 * m, 14 * m, 5 * m)
  ctx.drawImage(canvas2, 8 * m, 22 * m, 14 * m, 9 * m, (18 * 27 + 2) * m, 8 * m, 14 * m, 9 * m)
  ctx.drawImage(canvas2, 8 * m, 45 * m, 14 * m, 5 * m, (18 * 27 + 2) * m, 3 * m, 14 * m, 5 * m)
  ctx.drawImage(canvas2, 58 * m, 59 * m, 5 * m, 4 * m, (18 * 31 + 2) * m, (18 * 7 + 2) * m, 5 * m, 4 * m)
  ctx.drawImage(canvas2, 63 * m, 59 * m, 1 * m, 4 * m, (18 * 31 + 1) * m, (18 * 7 + 2) * m, 1 * m, 4 * m)

  ctx2.restore()
  ctx2.clearRect(0, 0, img.width, img.height)
  ctx2.translate(0, img.height)
  ctx2.scale(1, -1)
  ctx2.drawImage(img, 0, 0)

  ctx.drawImage(canvas2, 3 * m, 63 * m, 2 * m, 1 * m, (18 * 31 + 2) * m, (18 * 7 + 1) * m, 2 * m, 1 * m)
  ctx.drawImage(canvas2, 1 * m, 63 * m, 2 * m, 1 * m, (18 * 31 + 4) * m, (18 * 7 + 1) * m, 2 * m, 1 * m)
}

if (fs.existsSync(`${config.source}/entity/chest/ender.png`)) {
  const img = await loadImage(`${config.source}/entity/chest/ender.png`)
  const canvas2 = new Canvas(img.width, img.height)
  const ctx2 = canvas2.getContext("2d")
  ctx2.save()
  ctx2.translate(img.width / 2, img.height / 2)
  ctx2.rotate(Math.PI)
  ctx2.drawImage(img, -img.width / 2, -img.height / 2)
  ctx.drawImage(canvas2, 22 * m, 50 * m, 14 * m, 14 * m, (18 * 50 + 2) * m, (18 * 3 + 2) * m, 14 * m, 14 * m)
  ctx.drawImage(canvas2, 22 * m, 22 * m, 14 * m, 9 * m, (18 * 51 + 2) * m, (18 * 3 + 8) * m, 14 * m, 9 * m)
  ctx.drawImage(canvas2, 22 * m, 45 * m, 14 * m, 5 * m, (18 * 51 + 2) * m, (18 * 3 + 3) * m, 14 * m, 5 * m)
  ctx.drawImage(canvas2, 8 * m, 22 * m, 14 * m, 9 * m, (18 * 52 + 2) * m, (18 * 3 + 8) * m, 14 * m, 9 * m)
  ctx.drawImage(canvas2, 8 * m, 45 * m, 14 * m, 5 * m, (18 * 52 + 2) * m, (18 * 3 + 3) * m, 14 * m, 5 * m)
  ctx.drawImage(canvas2, 58 * m, 59 * m, 5 * m, 4 * m, (18 * 49 + 2) * m, (18 * 3 + 2) * m, 5 * m, 4 * m)
  ctx.drawImage(canvas2, 63 * m, 59 * m, 1 * m, 4 * m, (18 * 49 + 1) * m, (18 * 3 + 2) * m, 1 * m, 4 * m)

  ctx2.restore()
  ctx2.clearRect(0, 0, img.width, img.height)
  ctx2.translate(0, img.height)
  ctx2.scale(1, -1)
  ctx2.drawImage(img, 0, 0)

  ctx.drawImage(canvas2, 3 * m, 63 * m, 2 * m, 1 * m, (18 * 49 + 2) * m, (18 * 3 + 1) * m, 2 * m, 1 * m)
  ctx.drawImage(canvas2, 1 * m, 63 * m, 2 * m, 1 * m, (18 * 49 + 4) * m, (18 * 3 + 1) * m, 2 * m, 1 * m)
}

const full = ctx.getImageData(0, 0, canvas.width, canvas.height)
const data = full.data
const stride = canvas.width * 4

x = 0
y = 0

for (let name of names) {
  const dx = x * SLOT
  const dy = y * SLOT

  const innerX = dx + BORDER
  const innerY = dy + BORDER

  for (let i = 0; i < SLOT; i++) {
    data.fill(0, (dy * canvas.width + dx + i) * 4, (dy * canvas.width + dx + i) * 4 + 4)
    data.fill(0, ((dy + SLOT - 1) * canvas.width + dx + i) * 4, ((dy + SLOT - 1) * canvas.width + dx + i) * 4 + 4)
    data.fill(0, ((dy + i) * canvas.width + dx) * 4, ((dy + i) * canvas.width + dx) * 4 + 4)
    data.fill(0, ((dy + i) * canvas.width + dx + SLOT - 1) * 4, ((dy + i) * canvas.width + dx + SLOT - 1) * 4 + 4)
  }

  for (let y2 = 0; y2 < config.size; y2++) {
    const srcRow = ((innerY + y2) * canvas.width + innerX) * 4
    const dstRow = ((dy + BORDER + y2) * canvas.width) * 4

    const left = data.subarray(srcRow, srcRow + 4)
    const right = data.subarray(srcRow + (config.size - 1) * 4, srcRow + config.size * 4)

    for (let b = 0; b < BORDER; b++) {
      data.set(left, dstRow + (dx + b) * 4)
      data.set(right, dstRow + (dx + BORDER + config.size + b) * 4)
    }
  }

  for (let x2 = 0; x2 < config.size; x2++) {
    const top = data.subarray(
      ((innerY) * canvas.width + innerX + x2) * 4,
      ((innerY) * canvas.width + innerX + x2) * 4 + 4
    )
    const bottom = data.subarray(
      ((innerY + config.size - 1) * canvas.width + innerX + x2) * 4,
      ((innerY + config.size - 1) * canvas.width + innerX + x2) * 4 + 4
    )

    for (let b = 0; b < BORDER; b++) {
      data.set(top, ((dy + b) * canvas.width + dx + BORDER + x2) * 4)
      data.set(bottom, ((dy + BORDER + config.size + b) * canvas.width + dx + BORDER + x2) * 4)
    }
  }

  const tl = data.subarray(((innerY) * canvas.width + innerX) * 4, ((innerY) * canvas.width + innerX) * 4 + 4)
  const tr = data.subarray(((innerY) * canvas.width + innerX + config.size - 1) * 4, ((innerY) * canvas.width + innerX + config.size - 1) * 4 + 4)
  const bl = data.subarray(((innerY + config.size - 1) * canvas.width + innerX) * 4, ((innerY + config.size - 1) * canvas.width + innerX) * 4 + 4)
  const br = data.subarray(((innerY + config.size - 1) * canvas.width + innerX + config.size - 1) * 4, ((innerY + config.size - 1) * canvas.width + innerX + config.size - 1) * 4 + 4)

  for (let by = 0; by < BORDER; by++) {
    for (let bx = 0; bx < BORDER; bx++) {
      data.set(tl, ((dy + by) * canvas.width + dx + bx) * 4)
      data.set(tr, ((dy + by) * canvas.width + dx + BORDER + config.size + bx) * 4)
      data.set(bl, ((dy + BORDER + config.size + by) * canvas.width + dx + bx) * 4)
      data.set(br, ((dy + BORDER + config.size + by) * canvas.width + dx + BORDER + config.size + bx) * 4)
    }
  }

  x++
  if (x >= cols) {
    x = 0
    y++
  }
}

ctx.putImageData(full, 0, 0)

await canvas.toFile(`textures/${configName}.png`)