import React, { Component, Fragment } from "react";
import { withSiteData } from "react-static";
import styled, { css, keyframes } from "styled-components";

const Hero = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;

  width: 100%;
  height: 25vw;
  font-size: 25vw;

  @media (min-width: 1024px) {
    height: 5vw;
    font-size: 15vw;
  }
`;

const TagDerRetterLogo = styled.img`
  width: 4em;
  position: absolute;
  top: -0.25em;

  ${"" /* @media (max-width: 1024px) {
    max-width: 615px;
  } */};
`;

const ZickZack = styled.div`
  display: grid;
  max-width: 100%;
  grid-template-columns: 100vw 100vw;
  grid-auto-rows: 100vw;
`;

// const fadeinOdd = keyframes`
//   from {
//     transform: translateX(-100%) translateZ(0);
//     opacity: 0;
//     backface-visibility: hidden;
// perspective: 1000;
// will-change: transform;
//
//   }
//
//   to {
//     transform: none;
//     opacity 1;
//   }
// `;

// const fadeinEven = keyframes`
//   from {
//     transform: translateX(0%) translateY(50%);
//     opacity: 0;
//     backface-visibility: hidden;
//     perspective: 1000;
//     will-change: transform;
//   }
//
//   to {
//   transform: translateX(-100%) translateY(50%);
//   opacity 1;
//   }
// `;

const Triangle = styled.div.attrs({
  style: props => ({
    backgroundPosition: `center ${
      props.vertical !== undefined ? props.vertical : 50
    }%`
  })
})`
  width: 100%;
  height: 100%;
  ${props =>
    props.url &&
    css`
      background: url(${props.url});
    `};
  ${props =>
    props.bgColor &&
    css`
      background-color: ${props.bgColor};
    `};
  background-size: auto 110%;
  transition: background-position 0.25s;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 7.5vw;
  position: relative;
  &:nth-child(odd) {
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    text-align: left;
  }

  &:nth-child(even) {
    clip-path: polygon(100% 0, 0 50%, 100% 100%);
    transform: translateX(-100%) translateY(50%);
    text-align: right;
  }
`;

const isElementInPartiallyViewport = el => {
  let percentVisible = 25;

  let rect = el.getBoundingClientRect(),
    windowHeight = window.innerHeight || document.documentElement.clientHeight;

  return !(
    Math.floor(
      100 - (rect.top >= 0 ? 0 : rect.top) / +-(rect.height / 1) * 100
    ) < percentVisible ||
    Math.floor(100 - (rect.bottom - windowHeight) / rect.height * 100) <
      percentVisible
  );
};

class ParallaxBackgroundTriangle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vertical: 50
    };

    this.lastOffset = typeof document !== "undefined" ? window.scrollY : 0;

    this.element = React.createRef();
  }

  handleScroll = () => {
    const offsetDelta = window.scrollY - this.lastOffset;

    if (Math.abs(offsetDelta) < 50) {
      return;
    }

    if (!isElementInPartiallyViewport(this.element.current)) {
      return;
    }

    let nextVertical = this.state.vertical + offsetDelta * 0.1;

    nextVertical = Math.max(0, nextVertical);
    nextVertical = Math.min(nextVertical, 100);

    this.lastOffset = window.scrollY;

    this.setState({
      vertical: Math.round(nextVertical * 100) / 100
    });
  };

  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  render() {
    return (
      <Triangle
        innerRef={this.element}
        vertical={this.state.vertical}
        {...this.props}
      />
    );
  }
}

const Content = styled.div`
  display: inline-flex;
  flex-direction: column;
  font-size: 1em;
  padding: 0.5em;
  line-height: 1;
  width: 100%;
`;

const Block = styled.span`
  ${props =>
    props.uppercase &&
    css`
      text-transform: uppercase;
    `};
  ${props =>
    props.color &&
    css`
      color: ${props.color};
    `};
  ${props =>
    props.smaller &&
    css`
      font-size: 0.75em;
    `};
  ${props =>
    props.larger &&
    css`
      font-size: 1.5em;
    `};
`;

const Controls = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.25em;
  padding: 3em;
  padding-right: 7.5em;
  box-sizing: border-box;
`;

const ControlButton = styled.div`
  border: solid white;
  border-width: 0 0.75em 0.75em 0;
  display: inline-block;
  padding: 1em;
  ${props => props.active && `cursor: pointer`};
  transition: transform 0.5s, border-color 0.25s;

  &:hover {
    border-color: #676666;
  }
`;

const Previous = ControlButton.extend`
  transform: rotate(135deg)
    ${props => (props.active === true ? `scale(1)` : `scale(0)`)};
`;

const Next = ControlButton.extend`
  transform: rotate(-45deg)
    ${props => (props.active === true ? `scale(1)` : `scale(0)`)};
`;

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      previousAvailable: false,
      nextAvailable: props.items.length > 1
    };
  }

  updateIndex = index => {
    this.setState({
      index: index,
      previousAvailable: index > 0,
      nextAvailable: index + 1 < this.props.items.length
    });
  };

  onPrevious = () => {
    if (!this.state.previousAvailable) {
      return;
    }

    this.updateIndex(this.state.index - 1);
  };

  onNext = () => {
    if (!this.state.nextAvailable) {
      return;
    }

    this.updateIndex(this.state.index + 1);
  };

  render() {
    return this.props.render(
      this.props.items[this.state.index],
      this.onPrevious,
      this.onNext,
      this.state.previousAvailable,
      this.state.nextAvailable
    );
  }
}

const Logo = styled.img`
  width: 7.5em;
  align-self: center;
  object-fit: contain;
  max-height: 3.5em;
`;

const InstitutionDescription = styled.div`
  font-size: 0.25em;
  padding: 1em;
`;

const institutions = [
  {
    name: "Freiwillige Feuerwehr Landau",
    header: "/318.jpg"
  },
  {
    name: "Technisches Hilfswerk Ortsverband Landau",
    header: "/168.jpg"
  },
  {
    name: "Deutsches Rotes Kreuz",
    header: "/151.jpg"
  },
  {
    name: "Kriseninterventionsdienst",
    header: "/151.jpg"
  },
  {
    name: "Polizeidirektion Landau",
    header: "/151.jpg"
  },
  {
    name: "Deutsche Lebens-Rettungs-Gesellschaft",
    header: "/151.jpg"
  },
  {
    name: "Reservisten der Bundeswehr",
    header: "/151.jpg"
  }
];

const sponsors = [
  "./logo-energie-südwest.png",
  "./logo-vr-bank.jpg",
  "./logo-sparkasse-süw.jpg",
  "./logo-kissel-stiftung.jpg",
  "./logo-pro-group.jpg",
  "./logo-antenne-landau.png"
];

const Footer = styled.div`
  transform: translateY(50vw);
  padding: 0.5em;
`;

const Sponsors = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5em, 1fr));
  grid-gap: 2.5em;
  padding: 2.5em;
`;

const Sponsor = styled.img`
  width: 100%;
  object-fit: contain;
`;

const FooterText = styled.div`
  text-align: center;
  padding: 1em;
  font-size: 2.5vmax;
  color: #41403f;

  ${props =>
    props.larger &&
    css`
      font-size: 5vmax;
    `};
`;

const Link = styled.a`
  text-align: center;
  display: block;
  font-size: 1.5vmax;
  text-decoration: none;
  color: #676666;
  transition: color 0.5s;

  &:hover {
    color: #41403f;
    text-decoration: underline;
  }
`;

const Timeline = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
`;

const Event = styled.div`
  --timeline-width: 0.25em;

  display: block;
  position: relative;
  padding-bottom: 2.5em;
  font-size: 1.5em;
  text-align: center;

  &:not(:last-child) {
    &:after {
      content: "";
      border-left: var(--timeline-width) solid #41403f;
      transform: translateX(calc(50% - var(--timeline-width) / 2));
      height: 2.5em;
      width: 100%;
      display: block;
      position: absolute;
    }
  }
`;

const Description = styled.span`
  padding: 1em;
  color: #676666;
`;

export default withSiteData(() => (
  <Fragment>
    <Hero>
      <TagDerRetterLogo src="logo-tdr-nl-larger.gif" />
    </Hero>
    <ZickZack>
      <Triangle bgColor="#dbd9d8">
        {" "}
        <Content>
          <Block smaller>
            <Block uppercase color="#41403F">
              09-18
            </Block>{" "}
            <Block color="#676666">Uhr</Block>
          </Block>
          <Block>
            <Block uppercase color="#41403F">
              18. August
            </Block>{" "}
            <Block color="#676666">2018</Block>
          </Block>
          <Block smaller uppercase color="#41403F">
            Landau
          </Block>
          <Block uppercase color="#676666">
            Alter Messplatz
          </Block>
        </Content>
      </Triangle>
      <ParallaxBackgroundTriangle url="/092.jpg" />
      <ParallaxBackgroundTriangle url="/112.jpg" />
      <Triangle bgColor="#dbd9d8">
        <Content>
          <Block color="#676666">
            <Block larger color="#41403F">
              7
            </Block>{" "}
            <Block smaller>Hilfsorganisationen</Block>
          </Block>
          <Block color="#676666">
            <Block smaller>stellen ihr </Block>
            <Block uppercase color="#41403F">
              Ehrenamt
            </Block>
          </Block>
          <Block smaller color="#676666">
            zur Schau
          </Block>
        </Content>
      </Triangle>
    </ZickZack>
    <Footer>
      <FooterText larger>Tagesprogramm</FooterText>
      <Timeline>
        <Event>
          9:00 Uhr
          <Description>Musikalische Einstimmung</Description>
        </Event>
        <Event>
          10:00 Uhr<Description>Offizielle Eroeffnung</Description>
        </Event>
        <Event>
          10:15-10:45 Uhr<Description>Polizeihunde</Description>
        </Event>
        <Event>
          11:00-11:45 Uhr<Description>Einsatzuebung Feuerwehr/DRK</Description>
        </Event>
        <Event>
          11:45 Uhr<Description>Auslosung Quiz</Description>
        </Event>
        <Event>
          11:45-12:15 Uhr<Description>Talkrunde</Description>
        </Event>
        <Event>
          12:15-13:00 Uhr<Description>Einsatzuebung THW</Description>
        </Event>
        <Event>
          13:00 Uhr<Description>Auslosung Quiz</Description>
        </Event>
        <Event>
          13:15-13:45 Uhr<Description>Polizeihunde</Description>
        </Event>
        <Event>
          13:55 Uhr<Description>Auslosung Quiz</Description>
        </Event>
        <Event>
          14:00-14:45 Uhr<Description>Landespolizeiorhester</Description>
        </Event>
        <Event>
          14:45 Uhr<Description>Auslosung Quiz</Description>
        </Event>
        <Event>
          14:45-15:15 Uhr<Description>Talkrunde</Description>
        </Event>
        <Event>
          15:15-16:00 Uhr<Description>Landespolizeiorhester</Description>
        </Event>
        <Event>
          16:00 Uhr<Description>Auslosung Quiz</Description>
        </Event>
        <Event>
          16:15-16:45 Uhr<Description>Polizeihunde</Description>
        </Event>
        <Event>
          17:00-17:45 Uhr<Description>Einsatzuebung Feuerwehr/DRK</Description>
        </Event>
        <Event>
          17:45 Uhr<Description>Auslosung Quiz</Description>
        </Event>
        <Event>
          18:00 Uhr<Description>Veranstaltungsende</Description>
        </Event>
      </Timeline>
      <FooterText>Mit freundlicher Unterstuetzung von:</FooterText>
      <Sponsors children={sponsors.map(src => <Sponsor src={src} />)} />
      <Link href="./impressum">Impressum</Link>
    </Footer>
  </Fragment>
));
