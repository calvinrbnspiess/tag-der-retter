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
            <meta
              name="description"
              content="18. August 2018 - 7 Hilfsorganisationen stellen sich vor. Bei uns ziehen alle an einem Strang."
            />
            <meta name="image" content="http://tagderretter.de/151.jpg" />
            <meta itemProp="name" content="Tag der Retter" />
            <meta
              itemProp="description"
              content="18. August 2018 - 7 Hilfsorganisationen stellen sich vor. Bei uns ziehen alle an einem Strang."
            />
            <meta itemProp="image" content="http://tagderretter.de/151.jpg" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Tag der Retter" />
            <meta
              name="twitter:description"
              content="18. August 2018 - 7 Hilfsorganisationen stellen sich vor. Bei uns ziehen alle an einem Strang."
            />
            <meta name="twitter:site" content="@feuerwehr_ld" />
            <meta name="twitter:creator" content="@feuerwehr_ld" />
            <meta
              name="twitter:image:src"
              content="http://tagderretter.de/151.jpg"
            />
            <meta property="og:title" content="Tag der Retter" />
            <meta
              property="og:description"
              content="18. August 2018 - 7 Hilfsorganisationen stellen sich vor. Bei uns ziehen alle an einem Strang."
            />
            <meta
              property="og:image"
              content="http://tagderretter.de/151.jpg"
            />
            <meta property="og:url" content="https://tagderretter.de/" />
            <meta property="og:site_name" content="Tag der Retter" />
            <meta property="og:locale" content="de_DE" />
            <meta property="fb:admins" content="110421832318284" />
            <meta property="og:type" content="website" />
            {renderMeta.styleTags}
          </Head>
          <Body>{children}</Body>
        </Html>
      );
    }
  }
};
