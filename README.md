
# Merl Resource Packs

Resource Packs and Skins for Merl

![Screenshot of Merl using the Dokucraft resource pack and the Alex skin.](https://raw.githubusercontent.com/ewanhowell5195/merl-resourcepacks/master/screenshot.png)

## How to use
1. Install the [Tampermonkey browser extension](https://www.tampermonkey.net/).
2. Visit [this link](https://raw.githubusercontent.com/ewanhowell5195/merl-resourcepacks/master/script.user.js) and install the user script.
3. Visit https://help.minecraft.net/hc/en-us and open Merl.
4. Optional: append query params to select a texture or skin, for example:

```
https://help.minecraft.net/hc/en-us?textures=vanilla&skin=alex
```

## Resource packs
### How to use
Add a `textures` query param when you open Merl:

```
https://help.minecraft.net/hc/en-us?textures=vanilla
```

You can also pass a direct image URL:

```
https://help.minecraft.net/hc/en-us?textures=https://example.com/merl-pack-atlas.png
```

### Supported resource packs
- base (default)
- dokucraft
- f8thful
- faithful
- faithful_64
- mspainted
- vanilla

### Submitting a resource pack
1. Create a new `config/<pack>.json`. These configs tell the generator where to read textures from and which mapping/tint/leaf rules to use.
2. Set `source` to the pack's `assets/minecraft/textures` directory and set `size` to the pack's base tile size (16, 32, 64, etc).

```js
// config/my_pack.json
{
  "source": "C:/path/to/pack/assets/minecraft/textures", // The textures folder to use
  "size": 16, // The texture size. For packs below 16x, keep as 16
  "mapping": "vanilla", // the mappings to use (optional, defaults to "vanilla")
  "tints": "vanilla", // the tints to use (optional, defaults to "vanilla")
  "leaves": "vanilla" // the leaf handling to use (optional, defaults to "vanilla")
}
```

Mappings map the atlas to textures in your pack. It is a list of textures in the order that they appear in the atlas. You can refer to `textures/vanilla.png` for a reference.
```js
// config/mappings/my_pack.json
[
  "grass_block_top",
  "stone",
  "dirt"
  // ...more entries
]
```

Tints tell the generator what colours to tint specific textures.
```js
// config/tints/my_pack.json
{
  "grass_block_top": "#7fb238",
  "oak_leaves": "#7fb238"
  // ...more entries
}
```

Leaves tell the generator what textures to apply the leaf rendering to. Generates accurate "Fast Leaves" textures.
```js
// config/leaves/my_pack.json
[
  "oak_leaves",
  "birch_leaves"
  // ...more entries
]
```
3. Open `generate.js` and set `configName` to the name of the config JSON file that you made.
4. Run `node generate.js` to generate your resource pack atlas.
5. Edit this `README.md` to say the pack is supported.
6. Open a pull request.

## Skins
### How to use
Add a `skin` query param when you open Merl:

```
https://help.minecraft.net/hc/en-us?skin=alex
```

You can also use a Minecraft username or a direct image URL:

```
https://help.minecraft.net/hc/en-us?skin=ewanhowell5195
https://help.minecraft.net/hc/en-us?skin=https://example.com/skin.png
```

### Supported custom skins
- alex
- ari
- efe
- ewan
- kai
- makena
- noor
- steve
- sunny
- zuri

### Submitting a skin
1. Add your skin file to the `skins` folder, for example: `skins/alex.png`
2. Use a slim skin layout in the 64x64 skin layout. Second skin layers are not supported.
3. Edit this `README.md` to say the pack is supported.
4. Open a pull request.