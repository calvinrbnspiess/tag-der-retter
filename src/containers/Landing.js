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
  grid-auto-rows: 115.47vw;
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
    clip-path: polygon(0 0, 0 100%, 100% 50%);
    text-align: left;
  }

  &:nth-child(even) {
    clip-path: polygon(100% 0, 100% 100%, 0 50%);
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

const FluentContent = styled.div`
  transform: translateY(50vw);
`;

const Footer = FluentContent.extend`
  padding: 0.5em;
  background-color: white;
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
`;

const Link = styled.a`
  text-align: center;
  display: inline;
  font-size: 1.25em;
  text-decoration: none;
  color: #191919;
  transition: color 0.5s;
  position: relative;
  line-height: 1.25;
  padding: 0.5em;
  &:after {
    display: block;
    content: "";
    border-bottom: solid 0.125em #41403f;
    transform: scaleX(0);
    transition: transform 250ms ease-in-out;
    transform-origin: 0% 50%;
  }

  &:hover:after {
    transform: scaleX(1);
  }
`;

const Timeline = styled.div`
  display: grid;
  grid-template-columns: 1fr 5em 1fr;
  font-size: 1.5em;
  margin-bottom: 5em;
`;

const Event = styled.div`
  position: relative;
  &:nth-child(odd) {
    grid-column: 1;
    justify-self: end;
  }

  &:nth-child(even) {
    grid-column: 3;
    justify-self: start;
  }
`;

const BlurredVideo = styled.video`
  filter: blur(10px) saturate(1.25);
  width: 100%;
  height: 100%;
  position: fixed;
  transform: scale(1.25);
  background-color: black;
  opacity: 0.75;
`;

const TiltedTitle = styled.div`
  transform: translateY(-25vw) rotate(30deg);
  font-size: 7.5vmax;
  color: #191919;
  text-align: center;
  padding: 1em;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RhomboidTitle = styled.div`
  position: relative;
  font-size: 2.5em;
  color: #191919;
  text-align: center;
  display: inline;
  padding: 0.25em 1em 0.25em 1em;
  line-height: 1;
  margin: 1em;

  &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: white;
    transform: skewX(-5deg);
    top: 0;
    left: 0;
    z-index: -1;
  }
`;

const Time = styled.span`
  display: inline-block;
  color: #41403f;
  justify-self: start;
  font-size: 0.75em;
  line-height: 1;
  &:after {
    content: "Uhr";
    color: #676666;
    font-size: 0.75em;
    padding: 0.25em;
  }
`;

const Description = RhomboidTitle.extend`
  position: relative;
  color: #191919;
  text-align: center;
  padding: 0.75em 1em;
  font-size: 1em;
  line-height: 1;
  display: grid;
  justify-items: start;
  margin: 1em;
  min-width: 7.5em;
  width: fit-content;
`;

const Line = styled.div`
  width: 100%;
  position: relative;
  grid-row: span 2;
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props =>
    props.lineToLast &&
    css`
      &:before {
        position: absolute;
        content: "";
        width: 100%;
        border-bottom: 0.25em solid #191919;
        transform: rotate(30deg) scaleX(2);
        z-index: -2;
      }
    `} ${props =>
    props.lineToNext &&
    css`
      &:after {
        position: absolute;
        content: "";
        width: 100%;
        border-bottom: 0.25em solid #191919;
        transform: rotate(-30deg) scaleX(2);
        top: 100%;
        z-index: -2;
      }
    `};
`;

export default withSiteData(() => (
  <Fragment>
    <BlurredVideo playsInline autoPlay loop muted>
      <source src="./bgVideo-compressed-480.mp4" type="video/mp4" />
    </BlurredVideo>
    <Hero>
      <TagDerRetterLogo src="logo-tdr-nl-larger-nobg.gif" />
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
    <FluentContent>
      <Centered>
        <RhomboidTitle>Tagesprogramm</RhomboidTitle>
      </Centered>
      <Centered>
        <Timeline>
          {[
            <Event>
              <Description>
                <Time>9:00</Time>
                Musikalische Einstimmung
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>10:00</Time>Offizielle Eroeffnung
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>10:15-10:45</Time>Polizeihunde
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>11:00-11:45</Time>Einsatzuebung Feuerwehr/DRK
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>11:45</Time>Auslosung Quiz
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>11:45-12:15</Time>Talkrunde
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>12:15-13:00</Time>Einsatzuebung THW
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>13:00</Time>Auslosung Quiz
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>13:15-13:45</Time>Polizeihunde
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>13:55</Time>Auslosung Quiz
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>14:00-14:45</Time>Landespolizeiorhester
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>14:45</Time>Auslosung Quiz
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time> 14:45-15:15</Time>Talkrunde
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>15:15-16:00</Time>Landespolizeiorchester
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>16:00</Time>Auslosung Quiz
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>16:15-16:45</Time>Polizeihunde
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>17:00-17:45</Time>Einsatzuebung Feuerwehr/DRK
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>17:45</Time>Auslosung Quiz
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>18:00</Time>Veranstaltungsende
              </Description>
            </Event>,
            <Event>
              <Description>
                <Time>18:00</Time>Veranstaltungsende
              </Description>
            </Event>
          ].map(
            (item, index, array) =>
              index % 2 ? (
                <Fragment>
                  <div />
                  {item}
                </Fragment>
              ) : (
                <Fragment>
                  {item}
                  <Line
                    lineToLast={index + 1 < array.length}
                    lineToNext={index + 2 < array.length}
                  />
                </Fragment>
              )
          )}
        </Timeline>
      </Centered>
      <Centered>
        <RhomboidTitle>Mit freundlicher Unterstuetzung von</RhomboidTitle>
      </Centered>
    </FluentContent>
    <Footer>
      <Sponsors children={sponsors.map(src => <Sponsor src={src} />)} />
      <Centered>
        <Link href="./impressum">Impressum</Link>
      </Centered>
    </Footer>
  </Fragment>
));
