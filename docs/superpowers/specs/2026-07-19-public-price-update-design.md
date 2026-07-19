# Public Product Price Update Design

## Scope

Update the official Sheepie website's visible single-product prices to match the approved operational price list. This is a content-data change only.

## Changes

- CerviCloud Pillow: `IDR 770.000` to `IDR 838.000`.
- CerviCloud Pillow variant: `IDR 770.000` to `IDR 838.000`.
- LumiCloud Eye Mask: `IDR 198.000` to `IDR 218.000`.
- CalmiCloud Earplugs: remain `IDR 88.000`.

## Preserved Content

- Existing crossed-out promotional prices remain unchanged.
- Existing marketplace links remain unchanged.
- No bundle product pages, selectors, or bundle prices are added to the public site.

## Implementation and Verification

The canonical `data/products.json` data file is the only file changed. Existing product cards and product detail pages consume this data, so the updated prices propagate to both surfaces. Validate the JSON and run the website lint/build checks after the edit.
