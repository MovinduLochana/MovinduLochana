import { mkdir } from "node:fs/promises";
import path from "node:path";

// const srcs = new Array<Promise<Response>>();

// const rt = new HTMLRewriter().on("img", {
//     element(element) {
//         const src = element.getAttribute("src")!;
//         srcs.push(fetch(src));
//     }
// });

// rt.transform(await Bun.file("test.html").text());

// const FILE_PATH = "D:\\Projects\\portfolio\\github_profile\\test_imgs" as const;

// srcs.forEach(async src => {

//     if (await Bun.file(src).exists()) return;

//     const b = await fetch(src).then(r => r.arrayBuffer());

//     const ext = path.extname(src);
//     const cc = await Bun.write(`${FILE_PATH}\\${!ext ? `${crypto.randomUUID()}.jpg` : ext}`, b);
//     console.log(cc);

// })

class Extractor {
    #fileName: string;
    #src_arr: string[] = [];

    constructor(file: string) {
        this.#fileName = file;
    }

    async extract() {
        const rt = new HTMLRewriter().on("img", {
            element: element => {
                const src = element.getAttribute("src")!;
                this.#src_arr.push(src);
            }
        });
        rt.transform(await Bun.file(this.#fileName).text());
    }

    downloadAll() {
        const downloads: Promise<Response>[] = [];

        this.#src_arr.forEach(async src => {
            if (await Bun.file(src).exists()) return;
            downloads.push(fetch(src));
        });

        return Promise.all(downloads);
    }

    get srcs() {
        if (!this.#src_arr.length) throw new Error("No srcs extracted");
        return this.#src_arr;
    }
}

class FileWriter {
    #dirName: string;

    constructor(dirName: string) {
        this.#dirName = dirName;

        mkdir(this.#dirName, { recursive: true })
        .then((ret) => console.log("dir created: " + ret))
        .catch((err) => console.error("Failed to create dir: " + err));
    }

    write(name: string, file: ArrayBuffer) {



        // const ext = path.extname(src);
        // const cc = await Bun.write(`${this.#dirName}\\${!ext ? `${crypto.randomUUID()}.jpg` : ext}`, b);
        // console.log(cc);
    }
}

// function downloadImage(url: string): Promise<Response>[] {
//     return srcs.map(src => fetch(src));
// }

async function writeBuffer(filename: string, buffer: ArrayBuffer): Promise<void> {
    await Bun.write(filename, buffer);
}

const extractor = new Extractor("test.html");
extractor.extract()

const downloads = await extractor.downloadAll()

const fw = new FileWriter("test_imgs");

downloads.forEach(async (response, index) => {
    if (!response.ok) {
        console.error(`Failed to fetch ${extractor.srcs[index]}: ${response.statusText}`);
        return;
    }

  
});