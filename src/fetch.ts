"use strict";

import scrape from "website-scraper";
import fetch from "node-fetch";
import xml2js from "xml2js";
import fs from "fs-extra";

export const config = {
    directory: "package",
    // assetsOutputDir: "website_assets",
};

const websiteProtocol = "https";
export const websiteHostname = "octobear.webflow.io";
// should be exact domain for correct moving/renaming
export const assetHostnames = ["assets.website-files.com", "uploads-ssl.webflow.com"];

export const urlArg = `${websiteProtocol}://${websiteHostname}/sitemap.xml`;

const buildUrlFromPath = (path: string) => `${websiteProtocol}://${websiteHostname}/${path}`;

// additional hostnames for asset urls, etc.
const allowedHosts = [
    websiteHostname,
    // webflow assets
    ...assetHostnames
];

// @ts-ignore
const appPaths = fs.readdirSync("../", { withFileTypes: true })
    // @ts-ignore
    .filter((item) => item.isDirectory())
    // @ts-ignore
    .map((item) => buildUrlFromPath(item.name));

const disallowedPaths = [
    "/cv.pdf"
];

const options = {
    directory: config.directory,
    recursive: true,
    maxRecursiveDepth: 2,
    filenameGenerator: "bySiteStructure",
    subdirectories: [
        { directory: 'img', extensions: ['.jpg', '.png', '.svg', '.webp'] },
        { directory: 'js', extensions: ['.js'] },
        { directory: 'css', extensions: ['.css'] },
        { directory: 'video', extensions: ['.webm', '.mp4'] },
        { directory: 'files', extensions: ['.pdf'] }
    ],
    sources: [
        { selector: "img", attr: "src" },
        { selector: "img", attr: "srcset" },
        { selector: 'link[rel="stylesheet"]', attr: "href" },
        { selector: 'link[rel*="icon"]', attr: "href" },
        { selector: "style", attr: "src" },
        { selector: "script", attr: "src" },
        { selector: "[style]", attr: "style" },
        { selector: "[div]", attr: "style" },
        { selector: "[data-bg]", attr: "data-bg" },
        { selector: "[data-src]", attr: "data-src" },
        { selector: "video", attr: "poster" },

        // temporary fix is to keep OG image with original url,
        // 'cause OG doesn't work with relative paths
        { selector: "meta[property='og:image']", attr: "content" },
        { selector: "a[data-file]", attr: "href" },
    ],
    urlFilter: (url: string) => {
        const hostsCheck = allowedHosts.some((hostname) => {
            return url.indexOf(hostname) !== -1;
        });

        const pathsCheck = !disallowedPaths.some(pathItem => {
            return (new RegExp(pathItem)).test(url);
        });

        return hostsCheck && pathsCheck;
    },
};

async function perform() {
    console.log(`Fetching ${urlArg}`);
    const resp = await fetch(urlArg);
    const body = await resp.text();
    console.log(body);
    let urls;
    if (urlArg.indexOf("sitemap.xml") > 0) {
        await xml2js.parseString(body, function (err, result) {
            const urlset = result.urlset.url;
            urls = urlset.map((u: any) => {
                return u.loc[0].replace(/(\r\n|\n|\r|\s)/gm, "");
            });
        });
    } else {
        urls = [urlArg];
    }
    console.log(urls);
    // scrape({ ...options, urls: urls })
    // @ts-ignore
    scrape({ ...options, urls })
        .then((result) => {
            console.log("Saved to " + options.directory);

            // moveFiles();
        })
        .catch((err) => {
            console.log(err);
        });
};

// function moveFiles() {
//     exec(
//         `mv ${config.directory}/${websiteHostname}/* ${config.directory}/`,
//         (error) => {
//             if (error) {
//                 console.error(`exec error: ${error}`);

//                 return;
//             }
//         }
//     );
// }

perform();


