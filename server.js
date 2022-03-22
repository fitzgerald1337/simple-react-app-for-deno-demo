import React from "https://dev.jspm.io/react@17.0.2"
import ReactDOMServer from "https://dev.jspm.io/react-dom@17.0.2/server"
import { opine } from "https://deno.land/x/opine@0.25.0/mod.ts"
import App from "./app.js"

// create client bundle
const [diagnostics, js] = await Deno.bundle(
    "./client.js",
    undefined,
    { lib: ["dom", "dom.iterable", "esnext"] },
)

if (diagnostics) {
    console.log(diagnostics)
}

// create Opine server
const app = opine()
const browserBundlePath = "/browser.js"

const html =
    `<html><head><script type="module" src="${browserBundlePath}"></script></head><body><div id="root">${ReactDOMServer.renderToString(<App />)
    }</div></body></html>`

app.use(browserBundlePath, (req, res, next) => {
    res.type("application/javascript").send(js)
})

app.use("/", (req, res, next) => {
    res.type("text/html").send(html)
})

app.listen({ port: 3000 })

console.log("React SSR App listening on port 3000")
