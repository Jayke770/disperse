import React from "react"
import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document"
import { CssBaseline } from "@nextui-org/react"
export default class _Document extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: React.Children.toArray([initialProps.styles]),
        };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    {CssBaseline.flush()}
                    <link rel="shortcut icon" href="/logo.png" type="image/x-png" />
                    <meta name="theme-color" content="#202020" />
                    <link rel="apple-touch-icon" href="/logo.png" />
                    <meta charSet="utf-8" />
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}