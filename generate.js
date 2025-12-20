import fs from "fs"
import path from "path"
import { Canvas, loadImage } from "skia-canvas"

const sourceDir = "C:/Users/ewanh/AppData/Roaming/.minecraft/resourcepacks/1.21.10/assets/minecraft/textures/block"
const mappingPath = "./mapping.json"
const basePath = "./base.png"
const outPath = "./test.png"

const SLOT = 18
const INNER = 16
const BORDER = 1

const names = JSON.parse(await fs.promises.readFile(mappingPath, "utf8"))
const baseImg = await loadImage(basePath)

const canvas = new Canvas(baseImg.width, baseImg.height)
const ctx = canvas.getContext("2d")

ctx.drawImage(baseImg, 0, 0)

const cols = Math.floor(baseImg.width / SLOT)

let x = 0
let y = 0

for (const name of names) {
  const img = await loadImage(path.join(sourceDir, name + ".png"))

  const dx = x * SLOT
  const dy = y * SLOT

  ctx.clearRect(dx, dy, SLOT, SLOT)

  const srcW = Math.min(img.width, INNER)
  const srcH = Math.min(img.height, INNER)

  ctx.drawImage(
    img,
    0,
    0,
    srcW,
    srcH,
    dx + BORDER,
    dy + BORDER,
    srcW,
    srcH
  )

  ctx.drawImage(img, 0, 0, 1, srcH, dx, dy + BORDER, 1, srcH)
  ctx.drawImage(img, srcW - 1, 0, 1, srcH, dx + BORDER + srcW, dy + BORDER, 1, srcH)
  ctx.drawImage(img, 0, 0, srcW, 1, dx + BORDER, dy, srcW, 1)
  ctx.drawImage(img, 0, srcH - 1, srcW, 1, dx + BORDER, dy + BORDER + srcH, srcW, 1)

  ctx.drawImage(img, 0, 0, 1, 1, dx, dy, 1, 1)
  ctx.drawImage(img, srcW - 1, 0, 1, 1, dx + BORDER + srcW, dy, 1, 1)
  ctx.drawImage(img, 0, srcH - 1, 1, 1, dx, dy + BORDER + srcH, 1, 1)
  ctx.drawImage(img, srcW - 1, srcH - 1, 1, 1, dx + BORDER + srcW, dy + BORDER + srcH, 1, 1)

  x++
  if (x >= cols) {
    x = 0
    y++
  }
}

await canvas.toFile(outPath)