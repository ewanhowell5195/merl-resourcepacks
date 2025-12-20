import fs from "fs"
import { Canvas, loadImage } from "skia-canvas"

const sourceDir = "C:/Users/ewanh/AppData/Roaming/.minecraft/resourcepacks/1.21.10/assets/minecraft/textures"
const mappingPath = "./mapping.json"
const tintsPath = "./tints.json"
const basePath = "./textures/base.png"
const outPath = "./textures/vanilla.png"

const SLOT = 18
const INNER = 16
const BORDER = 1

const names = JSON.parse(await fs.promises.readFile(mappingPath, "utf8"))
const tints = JSON.parse(await fs.promises.readFile(tintsPath, "utf8"))

const baseImg = await loadImage(basePath)

const canvas = new Canvas(baseImg.width, baseImg.height)
const ctx = canvas.getContext("2d")

ctx.drawImage(baseImg, 0, 0)

const cols = Math.floor(baseImg.width / SLOT)

let x = 0
let y = 0

for (let name of names) {
  let texturePath
  if (name.includes("/")) {
    texturePath = `${sourceDir}/${name}.png`
  } else {
    texturePath = `${sourceDir}/block/${name}.png`
  }

  if (!fs.existsSync(texturePath)) {
    x++
    if (x >= cols) {
      x = 0
      y++
    }
    continue
  }

  let img
  if (
    name === "air" ||
    name === "entity/chest/normal" ||
    name === "entity/chest/ender"
  ) {
    img = new Canvas(16, 16)
  } else {
    img = await loadImage(texturePath)
  }

  const dx = x * SLOT
  const dy = y * SLOT

  ctx.clearRect(dx, dy, SLOT, SLOT)

  const srcW = Math.min(img.width, INNER)
  const srcH = Math.min(img.height, INNER)

  function drawImage(img) {
    ctx.drawImage(img, 0, 0, srcW, srcH, dx + BORDER, dy + BORDER, srcW, srcH)

    ctx.drawImage(img, 0, 0, 1, srcH, dx, dy + BORDER, 1, srcH)
    ctx.drawImage(img, srcW - 1, 0, 1, srcH, dx + BORDER + srcW, dy + BORDER, 1, srcH)
    ctx.drawImage(img, 0, 0, srcW, 1, dx + BORDER, dy, srcW, 1)
    ctx.drawImage(img, 0, srcH - 1, srcW, 1, dx + BORDER, dy + BORDER + srcH, srcW, 1)

    ctx.drawImage(img, 0, 0, 1, 1, dx, dy, 1, 1)
    ctx.drawImage(img, srcW - 1, 0, 1, 1, dx + BORDER + srcW, dy, 1, 1)
    ctx.drawImage(img, 0, srcH - 1, 1, 1, dx, dy + BORDER + srcH, 1, 1)
    ctx.drawImage(img, srcW - 1, srcH - 1, 1, 1, dx + BORDER + srcW, dy + BORDER + srcH, 1, 1)
  }

  drawImage(img)

  if (name === "open_eyeblossom") {
    if (fs.existsSync(`${sourceDir}/block/open_eyeblossom_emissive.png`)) {
      drawImage(await loadImage(`${sourceDir}/block/open_eyeblossom_emissive.png`))
    }
  } else if (name === "firefly_bush") {
    if (fs.existsSync(`${sourceDir}/block/firefly_bush_emissive.png`)) {
      drawImage(await loadImage(`${sourceDir}/block/firefly_bush_emissive.png`))
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

  x++
  if (x >= cols) {
    x = 0
    y++
  }
}

ctx.drawImage(canvas, 18 * 38, 0, 18, 18, 18 * 3, 0, 18, 18)

if (fs.existsSync(`${sourceDir}/entity/chest/normal.png`)) {
  const img = await loadImage(`${sourceDir}/entity/chest/normal.png`)
  const canvas2 = new Canvas(img.width, img.height)
  const ctx2 = canvas2.getContext("2d")
  ctx2.save()
  ctx2.translate(img.width / 2, img.height / 2)
  ctx2.rotate(Math.PI)
  ctx2.drawImage(img, -img.width / 2, -img.height / 2)
  ctx.drawImage(canvas2, 22, 50, 14, 14, 18 * 25 + 2, 2, 14, 14)
  ctx.drawImage(canvas2, 22, 22, 14, 9, 18 * 26 + 2, 8, 14, 9)
  ctx.drawImage(canvas2, 22, 30, 14, 1, 18 * 26 + 2, 17, 14, 1)
  ctx.drawImage(canvas2, 22, 45, 14, 5, 18 * 26 + 2, 3, 14, 5)
  ctx.drawImage(canvas2, 8, 22, 14, 9, 18 * 27 + 2, 8, 14, 9)
  ctx.drawImage(canvas2, 8, 30, 14, 1, 18 * 27 + 2, 17, 14, 1)
  ctx.drawImage(canvas2, 8, 45, 14, 5, 18 * 27 + 2, 3, 14, 5)
  ctx.drawImage(canvas2, 58, 59, 5, 4, 18 * 31 + 2, 18 * 7 + 2, 5, 4)
  ctx.drawImage(canvas2, 63, 59, 1, 4, 18 * 31, 18 * 7 + 2, 1, 4)
  ctx.drawImage(canvas2, 63, 59, 1, 4, 18 * 31 + 1, 18 * 7 + 2, 1, 4)

  ctx2.restore()
  ctx2.clearRect(0, 0, img.width, img.height)
  ctx2.translate(0, img.height)
  ctx2.scale(1, -1)
  ctx2.drawImage(img, 0, 0)

  ctx.drawImage(canvas2, 3, 63, 2, 1, 18 * 31 + 2, 18 * 7, 2, 1)
  ctx.drawImage(canvas2, 3, 63, 2, 1, 18 * 31 + 2, 18 * 7 + 1, 2, 1)
  ctx.drawImage(canvas2, 1, 63, 2, 1, 18 * 31 + 4, 18 * 7, 2, 1)
  ctx.drawImage(canvas2, 1, 63, 2, 1, 18 * 31 + 4, 18 * 7 + 1, 2, 1)
}

if (fs.existsSync(`${sourceDir}/entity/chest/ender.png`)) {
  const img = await loadImage(`${sourceDir}/entity/chest/ender.png`)
  const canvas2 = new Canvas(img.width, img.height)
  const ctx2 = canvas2.getContext("2d")
  ctx2.save()
  ctx2.translate(img.width / 2, img.height / 2)
  ctx2.rotate(Math.PI)
  ctx2.drawImage(img, -img.width / 2, -img.height / 2)
  ctx.drawImage(canvas2, 22, 50, 14, 14, 18 * 50 + 2, 18 * 3 + 2, 14, 14)
  ctx.drawImage(canvas2, 22, 22, 14, 9, 18 * 51 + 2, 18 * 3 + 8, 14, 9)
  ctx.drawImage(canvas2, 22, 30, 14, 1, 18 * 51 + 2, 18 * 3 + 17, 14, 1)
  ctx.drawImage(canvas2, 22, 45, 14, 5, 18 * 51 + 2, 18 * 3 + 3, 14, 5)
  ctx.drawImage(canvas2, 8, 22, 14, 9, 18 * 52 + 2, 18 * 3 + 8, 14, 9)
  ctx.drawImage(canvas2, 8, 30, 14, 1, 18 * 52 + 2, 18 * 3 + 17, 14, 1)
  ctx.drawImage(canvas2, 8, 45, 14, 5, 18 * 52 + 2, 18 * 3 + 3, 14, 5)
  ctx.drawImage(canvas2, 58, 59, 5, 4, 18 * 49 + 2, 18 * 3 + 2, 5, 4)
  ctx.drawImage(canvas2, 63, 59, 1, 4, 18 * 49, 18 * 3 + 2, 1, 4)
  ctx.drawImage(canvas2, 63, 59, 1, 4, 18 * 49 + 1, 18 * 3 + 2, 1, 4)

  ctx2.restore()
  ctx2.clearRect(0, 0, img.width, img.height)
  ctx2.translate(0, img.height)
  ctx2.scale(1, -1)
  ctx2.drawImage(img, 0, 0)

  ctx.drawImage(canvas2, 3, 63, 2, 1, 18 * 49 + 2, 18 * 3, 2, 1)
  ctx.drawImage(canvas2, 3, 63, 2, 1, 18 * 49 + 2, 18 * 3 + 1, 2, 1)
  ctx.drawImage(canvas2, 1, 63, 2, 1, 18 * 49 + 4, 18 * 3, 2, 1)
  ctx.drawImage(canvas2, 1, 63, 2, 1, 18 * 49 + 4, 18 * 3 + 1, 2, 1)
}

await canvas.toFile(outPath)