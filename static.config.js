import axios from "axios";
import React, { Component } from "react";
import { ServerStyleSheet } from "styled-components";

export default {
  getSiteData: () => ({
    title: "Tag der Retter"
  }),
  getRoutes: async () => {
    return [
      {
        path: "/",
        component: "src/containers/Landing"
      },
      {
        is404: true,
        component: "src/containers/404"
      },
      {
        path: "/impressum",
        component: "src/containers/Imprint"
      }
    ];
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet();
    const html = render(sheet.collectStyles(<Comp />));
    meta.styleTags = sheet.getStyleElement();
    return html;
  },
  Document: class CustomHtml extends Component {
    render() {
      const { Html, Head, Body, children, renderMeta } = this.props;

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Tag der Retter</title>
            {renderMeta.styleTags}
          </Head>
          <Body>{children}</Body>
        </Html>
      );
    }
  }
};
