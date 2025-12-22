// ==UserScript==
// @name         Merl Resource Packs
// @namespace    https://github.com/ewanhowell5195/merl-resourcepacks
// @version      1.0.1
// @description  Resource Packs and Skins for Merl
// @author       Ewan Howell
// @match        https://help.minecraft.net/*
// @icon         https://ewanhowell.com/assets/images/logo/logo.webp
// @updateURL    https://raw.githubusercontent.com/ewanhowell5195/merl-resourcepacks/master/script.user.js
// @downloadURL  https://raw.githubusercontent.com/ewanhowell5195/merl-resourcepacks/master/script.user.js
// @grant        none
// ==/UserScript==

{
  const style = document.createElement("style")
  style.innerHTML = `
    body:has(#ewan-fullscreen-toggle.active):has(#AvatarSection[style*="display: flex"]) {
      overflow: hidden;

      .chat-widget {
        left: 0;
        right: 0 !important;
        top: 0;
        bottom: 0 !important;
        border: 0;
      }

      .chat-widget #FooterSection {
        display: none;
      }

      #chat-content {
        width: 100%;
        max-width: 100%;
        height: 100%;
        padding: 0;
      }

      #AnimationAndChatContainer {
        gap: 0 !important;
      }

      #AvatarSection {
        width: 80% !important;
        border-radius: 0 !important;

        > :last-child {
          pointer-events: none;

          > * {
            pointer-events: initial;
          }
        }
      }

      .chat-widget.open + .chat-toggle-button {
        bottom: initial;
        top: 0;
        right: 0;
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="%23000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>');
        filter: none;
        background-size: 24px;
        background-position: center;
        width: 52px;
        height: 52px;
      }

      #AnimationAndChatContainer[style*="flex-direction: column"] #AvatarSection {
        width: 100% !important;
      }

      .chat-widget.open:has(#AnimationAndChatContainer[style*="flex-direction: column"]) + .chat-toggle-button {
        width: 60px;
        height: 60px;
      }

      #AvatarSection canvas,
      #ChatSection {
        border-radius: 0 !important;
      }

      #HeaderOutsideChat > :first-child > :first-child > h1 {
        order: 1;
      }
    }

    .chat-widget #mc-disclaimer-toast-wrapper,
    #ChatPreambleTextArea {
      display: none;
    }

    #AvatarSection > :last-child {
      pointer-events: none;

      > * {
        pointer-events: initial;
      }
    }

    .ewan-toggle.active svg:last-child {
      display: none;
    }

    .ewan-toggle:not(.active) svg:first-child {
      display: none;
    }
  `
  document.body.append(style)

  function convertSkin(img) {
    if (img.width === img.height) {
      return img
    }
    const m = img.width / 64
    const canvas = document.createElement("canvas")
    canvas.width = 64 * m
    canvas.height = 64 * m
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)
    ctx.save()
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(img, 0 * m, 20 * m, 12 * m, 12 * m, 36 * m, 52 * m, 12 * m, 12 * m)
    ctx.drawImage(img, 12 * m, 20 * m, 4 * m, 12 * m, 32 * m, 52 * m, 4 * m, 12 * m)
    ctx.drawImage(img, 4 * m, 16 * m, 4 * m, 4 * m, 40 * m, 48 * m, 4 * m, 4 * m)
    ctx.drawImage(img, 8 * m, 16 * m, 4 * m, 4 * m, 36 * m, 48 * m, 4 * m, 4 * m)
    ctx.drawImage(img, 40 * m, 20 * m, 12 * m, 12 * m, 20 * m, 52 * m, 12 * m, 12 * m)
    ctx.drawImage(img, 52 * m, 20 * m, 4 * m, 12 * m, 16 * m, 52 * m, 4 * m, 12 * m)
    ctx.drawImage(img, 44 * m, 16 * m, 4 * m, 4 * m, 24 * m, 48 * m, 4 * m, 4 * m)
    ctx.drawImage(img, 48 * m, 16 * m, 4 * m, 4 * m, 20 * m, 48 * m, 4 * m, 4 * m)
    ctx.restore()
    return canvas
  }

  function slimConverter(img) {
    const m = img.width / 64
    const canvas = document.createElement("canvas")
    canvas.width = 64 * m
    canvas.height = 64 * m
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)
    const isSlim = !ctx.getImageData(50 * m, 16 * m, 1, 1).data[3]
    if (isSlim) {
      return img
    }
    const column = 0
    ctx.clearRect((44 + column) * m, 16 * m, (12 - column) * m, 16 * m)
    ctx.drawImage(img, (45 + column) * m, 16 * m, (10 - column * 2) * m, 16 * m, (44 + column) * m, 16 * m, (10 - column * 2) * m, 16 * m)
    ctx.drawImage(img, (56 - column) * m, 20 * m, column * m, 12 * m, (54 - column) * m, 20 * m, column * m, 12 * m)
    ctx.clearRect((47 + column) * m, 16 * m, (4 - column) * m, 4 * m)
    ctx.drawImage(img, (49 + column) * m, 16 * m, (3 - column) * m, 4 * m, (47 + column) * m, 16 * m, (3 - column) * m, 4 * m)
    ctx.clearRect((39 - column) * m, 48 * m, (9 + column) * m, 16 * m)
    ctx.drawImage(img, (40 - column) * m, 48 * m, (4 + column * 2) * m, 16 * m, (39 - column) * m, 48 * m, (4 + column * 2) * m, 16 * m)
    ctx.drawImage(img, (45 + column) * m, 52 * m, (3 - column) * m, 12 * m, (43 + column) * m, 52 * m, (3 - column) * m, 12 * m)
    ctx.clearRect((42 - column) * m, 48 * m, (1 + column) * m, 4 * m)
    ctx.drawImage(img, (44 - column) * m, 48 * m, column * m, 4 * m, (42 - column) * m, 48 * m, column * m, 4 * m)
    return canvas
  }

  function flattenSkin(skin) {
    const m = skin.width / 64
    const canvas = document.createElement("canvas")
    canvas.width = skin.width
    canvas.height = skin.height
    const ctx = canvas.getContext("2d")
    ctx.drawImage(skin, 0, 0, 32 * m, 16 * m, 0, 0, 32 * m, 16 * m)
    ctx.drawImage(skin, 32 * m, 0, 32 * m, 16 * m, 0, 0, 32 * m, 16 * m)
    ctx.drawImage(skin, 16 * m, 16 * m, 24 * m, 16 * m, 16 * m, 16 * m, 24 * m, 16 * m)
    ctx.drawImage(skin, 16 * m, 32 * m, 24 * m, 16 * m, 16 * m, 16 * m, 24 * m, 16 * m)
    ctx.drawImage(skin, 40 * m, 16 * m, 16 * m, 16 * m, 40 * m, 16 * m, 16 * m, 16 * m)
    ctx.drawImage(skin, 40 * m, 32 * m, 16 * m, 16 * m, 40 * m, 16 * m, 16 * m, 16 * m)
    ctx.drawImage(skin, 32 * m, 48 * m, 16 * m, 16 * m, 32 * m, 48 * m, 16 * m, 16 * m)
    ctx.drawImage(skin, 48 * m, 48 * m, 16 * m, 16 * m, 32 * m, 48 * m, 16 * m, 16 * m)
    ctx.drawImage(skin, 0, 16 * m, 16 * m, 16 * m, 0, 16 * m, 16 * m, 16 * m)
    ctx.drawImage(skin, 0, 32 * m, 16 * m, 16 * m, 0, 16 * m, 16 * m, 16 * m)
    ctx.drawImage(skin, 16 * m, 48 * m, 16 * m, 16 * m, 16 * m, 48 * m, 16 * m, 16 * m)
    ctx.drawImage(skin, 0, 48 * m, 16 * m, 16 * m, 16 * m, 48 * m, 16 * m, 16 * m)
    return canvas
  }

  let skinURL, texturesURL, Texture, defaultArcState

  const preloadPromise = new Promise(async fulfil => {
    const params = new URLSearchParams(location.search)
    const skin = params.get("skin")
    const textures = params.get("textures") || "base"

    if (skin && skin !== "merl") {
      let url
      if (skin.startsWith("http://") || skin.startsWith("https://")) {
        url = `https://api.codetabs.com/v1/proxy/?quest=${skin}`
      } else {
        url = `https://raw.githubusercontent.com/ewanhowell5195/merl-resourcepacks/refs/heads/master/skins/${skin}.png`
      }

      try {
        const r = await fetch(url)
        if (!r.ok) throw 0
      } catch {
        const profile = await fetch(
          `https://api.codetabs.com/v1/proxy/?quest=https://api.minecraftservices.com/minecraft/profile/lookup/name/${skin}`
        ).then(r => r.json())

        const session = await fetch(
          `https://api.codetabs.com/v1/proxy?quest=https://sessionserver.mojang.com/session/minecraft/profile/${profile.id}`
        ).then(r => r.json())

        const prop = session.properties.find(e => e.name === "textures")
        const decoded = JSON.parse(atob(prop.value))
        url = "https://api.codetabs.com/v1/proxy/?quest=" + decoded.textures.SKIN.url
      }

      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      const out = slimConverter(flattenSkin(convertSkin(img)))

      const blob = out instanceof HTMLCanvasElement
        ? await new Promise(r => out.toBlob(r))
        : await fetch(out.src).then(r => r.blob())

      skinURL = URL.createObjectURL(blob)
    }

    let texUrl
    if (textures.startsWith("http://") || textures.startsWith("https://")) {
      texUrl = `https://api.codetabs.com/v1/proxy/?quest=${textures}`
    } else {
      texUrl = `https://raw.githubusercontent.com/ewanhowell5195/merl-resourcepacks/refs/heads/master/textures/${textures}.png`
    }

    texturesURL = URL.createObjectURL(await fetch(texUrl).then(r => r.blob()))

    fulfil()
  })

  async function loadTexture(texture, material, index = 0) {
    const oldMat = _ewanScene.materials.find(e => e.id === material)
    const mat = oldMat.clone(material + "_new")

    const oldBlocks = oldMat.getTextureBlocks()
    const newBlocks = mat.getTextureBlocks()

    for (let i = 0; i < newBlocks.length; i++) {
      if (i !== index) {
        newBlocks[i].texture = oldBlocks[i].texture
      }
    }

    const img = new Image()
    img.src = texture
    await img.decode()

    const sizeBlock = mat.getInputBlocks().find(b => b.name === "diffuseTexSize")
    sizeBlock.value.x = img.width
    sizeBlock.value.y = img.height

    const block = mat.getTextureBlocks()[index]
    block.texture = new Texture(texture, _ewanScene, false, false)

    for (const mesh of _ewanScene.meshes) {
      if (mesh.material === oldMat) {
        mesh.material = mat
      }
    }
  }

  window.initEwanCustom = async scene => {
    await preloadPromise

    Texture = scene.textures.find(t => t.getClassName() === "Texture").constructor

    defaultArcState = {
      alpha: _ewanScene.cameras[0].alpha,
      beta: _ewanScene.cameras[0].beta,
      radius: _ewanScene.cameras[0].radius
    }

    if (skinURL) {
      loadTexture(skinURL, "characterOpaqueMaterial")

      scene.meshes
        .filter(e =>
          e.id.includes("primitive") ||
          e.id.includes("backpack") ||
          e.id.includes("Sleeve") ||
          e.id.includes("hat_hair") ||
          e.id.includes("Pants") ||
          e.id === "Geo_Minecraft_Mouth"
        )
        .forEach(e => e.dispose())

      const leftLeg = scene.meshes.find(e => e.id === "merl:leftLeg_leftLeg_0")
      const rightLeg = scene.meshes.find(e => e.id === "merl:rightLeg_rightLeg_0")
      leftLeg.rotationQuaternion = null
      rightLeg.rotationQuaternion = null
      leftLeg.setPivotPoint(leftLeg.getBoundingInfo().boundingBox.center)
      rightLeg.setPivotPoint(rightLeg.getBoundingInfo().boundingBox.center)
      leftLeg.rotation.y = Math.PI
      rightLeg.rotation.y = Math.PI

      scene.meshes.find(e => e.id === "merl:leftArm_leftArm_0").position.y = 0.03125
      scene.meshes.find(e => e.id === "merl:rightArm_rightArm_0").position.y = 0.03125
    }

    if (texturesURL) {
      loadTexture(texturesURL, "workshopOpaqueMaterial", 1)
      loadTexture(texturesURL, "workshopTransparentMaterial", 1)
    }
  }

  const originalAppend = Element.prototype.appendChild

  Element.prototype.appendChild = function (node) {
    if (node?.tagName === "SCRIPT" && typeof node.src === "string" && node.src.includes("XSVAUiBundle.min.js")) {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", node.src, false)
    xhr.send()

    if (xhr.status === 200) {
      let raw = xhr.responseText

      raw = raw.replace('key:"setupCamera",value:function(e){', 'key:"setupCamera",value:function(e){window._ewanScene=e;setTimeout(() => initEwanCustom(e), 100);')

      const blob = new Blob([raw], { type: "application/javascript" })
      const blobUrl = URL.createObjectURL(blob)

      node.src = blobUrl

      const onload = node.onload
      node.onload = () => {
        URL.revokeObjectURL(blobUrl)
        onload()
      }

      return originalAppend.call(this, node)
    }

    console.error("failed to load XSVAUiBundle", xhr.status)
    return node
    }

    return originalAppend.call(this, node)
  }

  const observer = new MutationObserver(() => {
    const el = document.querySelector("#AvatarSection > :nth-child(2)")
    if (!el) return
    observer.disconnect()

    const target = document.querySelector("#CharacterPanelClose")

    const fullscreenToggle = document.createElement("div")

    fullscreenToggle.id = "ewan-fullscreen-toggle"
    fullscreenToggle.innerHTML = target.outerHTML
    fullscreenToggle.dataset.tooltip = "Toggle fullscreen"

    fullscreenToggle.querySelector("span").innerHTML = `
      <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/></svg>
      <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/></svg>
    `

    fullscreenToggle.classList.add("ewan-toggle", "active")
    fullscreenToggle.addEventListener("click", () => fullscreenToggle.classList.toggle("active"))

    const unlockToggle = document.createElement("div")

    unlockToggle.id = "ewan-unlock-toggle"
    unlockToggle.innerHTML = target.outerHTML
    unlockToggle.dataset.tooltip = "Toggle locked camera"

    unlockToggle.querySelector("span").innerHTML = `
      <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-160h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Zm0 80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h280v-80q0-83 58.5-141.5T720-920q83 0 141.5 58.5T920-720h-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80h120q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Z"/></svg>
      <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>
    `

    unlockToggle.classList.add("ewan-toggle")
    unlockToggle.addEventListener("click", () => {
      unlockToggle.classList.toggle("active")
      if (unlockToggle.classList.contains("active")) {
        _ewanScene.cameras[0].attachControl(_ewanScene.getEngine().getRenderingCanvas(), true)
      } else {
        _ewanScene.cameras[0].detachControl()
      }
    })

    const resetButton = document.createElement("div")

    resetButton.id = "ewan-reset-button"
    resetButton.innerHTML = target.outerHTML
    resetButton.dataset.tooltip = "Reset camera"

    resetButton.querySelector("span").innerHTML = `
      <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg>
    `

    resetButton.addEventListener("click", () => {
      _ewanScene.cameras[0].alpha = defaultArcState.alpha
      _ewanScene.cameras[0].beta = defaultArcState.beta
      _ewanScene.cameras[0].radius = defaultArcState.radius
    })

    el.prepend(fullscreenToggle)
    el.prepend(unlockToggle)
    el.prepend(resetButton)
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  })

  document.addEventListener("click", e => {
    const target = e.target.closest('[aria-label="See visualization"]')
    if (!target) return
    document.querySelector("#ewan-unlock-toggle").classList.remove("active")
  })

  const tooltipScript = document.createElement("script")
  tooltipScript.src = "https://cdn.jsdelivr.net/npm/easy-tooltips@1.2.9/dist/easy-tooltips.min.js"
  tooltipScript.defer = true

  const tooltipStyle = document.createElement("link")
  tooltipStyle.rel = "stylesheet"
  tooltipStyle.href = "https://cdn.jsdelivr.net/npm/easy-tooltips@1.2.9/dist/easy-tooltips.min.css"

  document.body.append(tooltipStyle, tooltipScript)
}