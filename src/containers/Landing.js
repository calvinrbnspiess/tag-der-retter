import React, { Component } from "react";
import { withSiteData } from "react-static";
import styled, { css, keyframes } from "styled-components";

const Site = styled.div`
  font-family: Adobe Gothic Std Bold;
`;

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

const TagDerRetterLogo = styled.video`
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

  shouldComponentUpdate = (nextProps, nextState) => {
    console.log(Math.abs(nextState.vertical - this.state.vertical));
    return (
      this.state.vertical !== nextState.vertical &&
      Math.abs(nextState.vertical - this.state.vertical) > 0.5
    );
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

const EventInfo = styled.div`
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

export default withSiteData(() => (
  <Site>
    <Hero>
      <TagDerRetterLogo muted autoPlay playsInline src="tdrlogo.mp4" />
    </Hero>
    <ZickZack>
      <Triangle bgColor="#dbd9d8">
        {" "}
        <EventInfo>
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
        </EventInfo>
      </Triangle>
      <ParallaxBackgroundTriangle url="/092.jpg" />
      <ParallaxBackgroundTriangle url="/112.jpg" />
      <Triangle bgColor="#dbd9d8">
        <EventInfo>
          <Block color="#676666">
            <Block larger color="#41403F">
              6
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
        </EventInfo>
      </Triangle>
      <ParallaxBackgroundTriangle url="/318.jpg" />
    </ZickZack>
  </Site>
));
