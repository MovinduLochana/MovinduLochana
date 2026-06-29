import path from "node:path";

const FILE = "D:\\Projects\\portfolio\\github_profile\\test.html" as const;
const OUTPUT_DIR = "D:\\Projects\\portfolio\\github_profile\\test_imgs" as const;

const img_srcs = [] as Promise<Response>[];

new HTMLRewriter().on("img", {
    element(element) {
        const src = element.getAttribute("src")!;
        img_srcs.push(fetch(src));
        console.log(src + " : Added");
    }
}).transform(await Bun.file(FILE).text());


const files = Promise.all(img_srcs)

files.then(res => {
    res.forEach(async file => {
        const ext = path.extname(file.url);
        const fname = path.basename(file.url);
        Bun.write(`${OUTPUT_DIR}\\${!ext ? `${crypto.randomUUID()}.jpg` : `${fname}`}`, await file.arrayBuffer());
    })
    console.log("write finish");
})

