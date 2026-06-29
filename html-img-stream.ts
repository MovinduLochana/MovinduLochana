import path from "node:path";

const FILE = "D:\\Projects\\portfolio\\github_profile\\test.html" as const;
const OUTPUT_DIR = "D:\\Projects\\portfolio\\github_profile\\test_imgs" as const;

const html = await Bun.file(FILE).text();

const tasks: Promise<number>[] = [];

new HTMLRewriter().on("img", {
    element(element) {
        const src = element.getAttribute("src");
        if (!src) return;

        const task = (async () => {
            try {
                const response = await fetch(src);
                if (!response.ok) return 0;

                const fname = path.basename(new URL(src).pathname) || `${crypto.randomUUID()}.jpg`;
                const destination = path.join(OUTPUT_DIR, fname);

                // Efficiently stream the response body to disk
                return await Bun.write(destination, response);
            } catch (err) {
                console.error(`Failed: ${src}`, err);
                return 0;
            }
        })();

        tasks.push(task);
        console.log(`${src} : Processing`);
    }
}).transform(html);

await Promise.all(tasks);
console.log("All writes finished successfully");