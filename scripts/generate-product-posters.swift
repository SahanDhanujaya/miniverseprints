import AppKit
import Foundation

struct PosterProduct {
    let source: String
    let output: String
    let title: String
    let price: String
    let startingFrom: Bool
}

let products: [PosterProduct] = [
    .init(source: "/Users/chan.nn/Downloads/491635c0-6ef0-4e22-a04a-3f123f1a6e4e.JPG", output: "valentine-rose.png", title: "Valentine Rose", price: "RS 980", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/b8d7df3e-941b-4c2c-906a-2e314400fb30.JPG", output: "car-stand.png", title: "Car Stand", price: "RS 1200", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/9bc1ad60-ebdb-4bcb-a964-d0f95b4432a9.JPG", output: "anime-keychains.png", title: "Anime Keychains", price: "RS 300", startingFrom: true),
    .init(source: "/Users/chan.nn/Downloads/06499cae-de08-45b0-a5cf-556c1c524cd7.JPG", output: "customized-funkos.png", title: "Customized Funkos", price: "RS 3800", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/9f46aa47-2d81-47ec-8fb9-f4997c8312cd.JPG", output: "mk1-headset-stand.png", title: "MK1 Headset Stand", price: "RS 6800", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/fddb2c5b-e216-4fd7-a58f-39d168cf53b4.JPG", output: "controller-holder.png", title: "Controller Holder", price: "RS 3700", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/9a96d8ce-7957-485d-869d-4d7e6a06144c.JPG", output: "hotwheel-card-holder.png", title: "Hotwheel Card Holder", price: "RS 500", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/767a50d0-84e0-4f90-9a70-0e8586470c7a.JPG", output: "customized-lithoplane-lamp.png", title: "Customized Lithoplane Lamp", price: "RS 3900", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/3ee43f53-9760-427d-accd-c2ed80dc9d29.JPG", output: "customized-qr-codes.png", title: "Customized QR Codes", price: "RS 400 EACH", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/dc17c059-1993-431e-9e1b-bf48192264c4.JPG", output: "sasuke-figure.png", title: "Sasuke Figure", price: "RS 6000", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/a673b9fb-cd94-4968-aef3-2e1597bff981.JPG", output: "spiderman-bust.png", title: "Spiderman Bust", price: "RS 2800", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/955df690-9bd6-4441-b472-843664a6f0fb.JPG", output: "stich-minifigure.png", title: "Stich Minifigure", price: "RS 1800", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/b1513cbc-f876-44c5-8f96-fb501f781bd2.JPG", output: "hello-kitty-minifigure.png", title: "Hello Kitty Minifigure", price: "RS 1800", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/a35252e2-7aaa-4f2a-bdca-6f3bc0984540.JPG", output: "red-hulk-figure.png", title: "Red Hulk Figure", price: "RS 6000", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/0bf480ee-623e-4c07-a5ab-a74eff75d713.JPG", output: "safari-elephant.png", title: "Safari Elephant", price: "RS 500", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/0f0f53ce-006a-45f2-9078-2c5b5730be4b.JPG", output: "minatos-kunai.png", title: "Minato's Kunai", price: "RS 3200", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/b9f66430-8018-46a2-8db8-423e4c72c6f3.JPG", output: "cat-ornament.png", title: "Cat Ornament", price: "RS 3800", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/9900c38f-7fd9-4216-8f6a-03648476cfe2.JPG", output: "key-holder-dragon.png", title: "Key Holder Dragon", price: "RS 2800", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/a9259c1f-e6f5-43f5-8603-54b976695db4.JPG", output: "skull-controller-holder.png", title: "Skull Controller Holder", price: "RS 4700", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/0c2e2999-5208-4501-b576-c08c0515598f.JPG", output: "oni-mask-controller-holder.png", title: "Oni Mask Controller Holder", price: "RS 4600", startingFrom: false),
    .init(source: "/Users/chan.nn/Downloads/61ded926-8530-43c7-9d54-be88645b9e96.JPG", output: "dummy-action-figure.png", title: "Dummy Action Figure", price: "RS 1200", startingFrom: false),
]

let canvasSize = NSSize(width: 1086, height: 1448)
let outputDir = URL(fileURLWithPath: "/Users/chan.nn/Desktop/miniversee/public/images/products", isDirectory: true)
let phoneText = "+94 78 2525 156"

func color(_ hex: UInt32, alpha: CGFloat = 1) -> NSColor {
    NSColor(
        calibratedRed: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: alpha
    )
}

func paragraph(_ alignment: NSTextAlignment = .center, lineHeight: CGFloat? = nil) -> NSMutableParagraphStyle {
    let style = NSMutableParagraphStyle()
    style.alignment = alignment
    style.lineBreakMode = .byWordWrapping
    if let lineHeight {
        style.minimumLineHeight = lineHeight
        style.maximumLineHeight = lineHeight
    }
    return style
}

func fittedFont(for text: String, maxWidth: CGFloat, start: CGFloat, minimum: CGFloat) -> NSFont {
    var size = start
    while size > minimum {
        let font = NSFont.systemFont(ofSize: size, weight: .heavy)
        let rect = NSString(string: text).boundingRect(
            with: NSSize(width: maxWidth, height: 260),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            attributes: [.font: font, .paragraphStyle: paragraph(.center, lineHeight: size * 0.9)]
        )
        if rect.height <= 190 {
            return font
        }
        size -= 4
    }
    return NSFont.systemFont(ofSize: minimum, weight: .heavy)
}

func drawText(_ text: String, in rect: NSRect, font: NSFont, color: NSColor, alignment: NSTextAlignment = .center, lineHeight: CGFloat? = nil, kern: CGFloat = 0) {
    NSString(string: text).draw(
        with: rect,
        options: [.usesLineFragmentOrigin, .usesFontLeading],
        attributes: [
            .font: font,
            .foregroundColor: color,
            .paragraphStyle: paragraph(alignment, lineHeight: lineHeight),
            .kern: kern,
        ]
    )
}

func aspectFillRect(imageSize: NSSize, target: NSRect) -> NSRect {
    let scale = max(target.width / imageSize.width, target.height / imageSize.height)
    let width = imageSize.width * scale
    let height = imageSize.height * scale
    return NSRect(x: target.midX - width / 2, y: target.midY - height / 2, width: width, height: height)
}

func aspectFitRect(imageSize: NSSize, target: NSRect) -> NSRect {
    let scale = min(target.width / imageSize.width, target.height / imageSize.height)
    let width = imageSize.width * scale
    let height = imageSize.height * scale
    return NSRect(x: target.midX - width / 2, y: target.midY - height / 2, width: width, height: height)
}

func drawPalmShadow() {
    NSGraphicsContext.saveGraphicsState()
    color(0x654321, alpha: 0.20).setFill()
    let origin = NSPoint(x: 875, y: 1195)
    for i in 0..<8 {
        let path = NSBezierPath()
        let angle = CGFloat(i) * 0.22 - 0.55
        let length = CGFloat(230 + i * 18)
        path.move(to: origin)
        path.curve(
            to: NSPoint(x: origin.x + cos(angle) * length, y: origin.y - 110 - CGFloat(i * 34)),
            controlPoint1: NSPoint(x: origin.x + 120, y: origin.y - 10 - CGFloat(i * 10)),
            controlPoint2: NSPoint(x: origin.x + 160, y: origin.y - 120 - CGFloat(i * 18))
        )
        path.curve(
            to: origin,
            controlPoint1: NSPoint(x: origin.x + 130, y: origin.y - 100 - CGFloat(i * 20)),
            controlPoint2: NSPoint(x: origin.x + 45, y: origin.y - 35)
        )
        path.fill()
    }
    NSGraphicsContext.restoreGraphicsState()
}

func makePoster(_ product: PosterProduct) throws {
    guard let source = NSImage(contentsOfFile: product.source) else {
        throw NSError(domain: "Poster", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not read \(product.source)"])
    }

    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: Int(canvasSize.width),
        pixelsHigh: Int(canvasSize.height),
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .calibratedRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ) else {
        throw NSError(domain: "Poster", code: 3, userInfo: [NSLocalizedDescriptionKey: "Could not create bitmap"])
    }
    bitmap.size = canvasSize

    let context = NSGraphicsContext(bitmapImageRep: bitmap)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context

    NSGradient(colors: [color(0xd5a06b), color(0xba8049), color(0xa66d38)])!.draw(in: NSRect(origin: .zero, size: canvasSize), angle: 90)
    color(0x000000, alpha: 0.08).setFill()
    NSRect(x: 0, y: 0, width: canvasSize.width, height: 250).fill()
    drawPalmShadow()

    drawText("MINIVERSEPRINTS", in: NSRect(x: 110, y: 1365, width: 866, height: 40), font: NSFont.systemFont(ofSize: 26, weight: .bold), color: .white, kern: 9)
    drawText("—  ✦  —", in: NSRect(x: 340, y: 1318, width: 406, height: 36), font: NSFont.systemFont(ofSize: 24, weight: .regular), color: .white, kern: 5)

    let titleFont = fittedFont(for: product.title, maxWidth: 920, start: product.title.count > 22 ? 76 : 94, minimum: 58)
    drawText(product.title, in: NSRect(x: 83, y: 1160, width: 920, height: 190), font: titleFont, color: .white, lineHeight: titleFont.pointSize * 0.92)

    let photoRect = NSRect(x: 105, y: 235, width: 876, height: 900)
    let shadow = NSBezierPath(roundedRect: photoRect.insetBy(dx: -4, dy: -4), xRadius: 34, yRadius: 34)
    NSGraphicsContext.saveGraphicsState()
    let photoShadow = NSShadow()
    photoShadow.shadowColor = color(0x38210f, alpha: 0.34)
    photoShadow.shadowOffset = NSSize(width: 0, height: -18)
    photoShadow.shadowBlurRadius = 36
    photoShadow.set()
    color(0x000000, alpha: 0.18).setFill()
    shadow.fill()
    NSGraphicsContext.restoreGraphicsState()

    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(roundedRect: photoRect, xRadius: 30, yRadius: 30).addClip()
    source.draw(in: aspectFillRect(imageSize: source.size, target: photoRect), from: .zero, operation: .sourceOver, fraction: 0.18)
    color(0xbf8753, alpha: 0.48).setFill()
    photoRect.fill(using: .sourceAtop)
    source.draw(in: aspectFitRect(imageSize: source.size, target: photoRect.insetBy(dx: 18, dy: 18)), from: .zero, operation: .sourceOver, fraction: 1)
    NSGraphicsContext.restoreGraphicsState()

    let bottomY: CGFloat = 48
    drawText("☎  \(phoneText)", in: NSRect(x: 55, y: bottomY + 4, width: 290, height: 54), font: NSFont.systemFont(ofSize: 24, weight: .semibold), color: .white, alignment: .left)

    let buttonRect = NSRect(x: 375, y: bottomY, width: 336, height: 66)
    let button = NSBezierPath(roundedRect: buttonRect, xRadius: 33, yRadius: 33)
    color(0xffffff, alpha: 0.94).setStroke()
    button.lineWidth = 3
    button.stroke()
    drawText("ORDER NOW", in: NSRect(x: 375, y: bottomY + 17, width: 336, height: 34), font: NSFont.systemFont(ofSize: 26, weight: .heavy), color: .white)

    if product.startingFrom {
        drawText("STARTING FROM", in: NSRect(x: 760, y: bottomY + 66, width: 270, height: 28), font: NSFont.systemFont(ofSize: 23, weight: .bold), color: .white, kern: 3)
    }
    drawText(product.price, in: NSRect(x: 750, y: bottomY + 5, width: 300, height: 68), font: NSFont.systemFont(ofSize: product.price.count > 8 ? 44 : 52, weight: .heavy), color: .white, alignment: .right)

    NSGraphicsContext.restoreGraphicsState()

    guard let png = bitmap.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "Poster", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not encode \(product.output)"])
    }

    try png.write(to: outputDir.appendingPathComponent(product.output))
}

for product in products {
    try makePoster(product)
    print(product.output)
}
