import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import ScrollLock from "react-scrolllock";

import defaultTheme from "./theme";
import Arrow from "./components/Arrow";
import Container from "./components/Container";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PaginatedThumbnails from "./components/PaginatedThumbnails";
import Portal from "./components/Portal";
import DefaultSpinner from "./components/Spinner";

import { /*bindFunctions,*/ canUseDom, deepMerge } from "./utils/util";

function normalizeSourceSet(data) {
  const sourceSet = data.srcSet || data.srcset;

  if (Array.isArray(sourceSet)) {
    return sourceSet.join();
  }

  return sourceSet;
}

const ThemeContext = React.createContext({
  theme: defaultTheme,
  toggleTheme: (newTheme) => {
    return newTheme;
  },
});

let ImgsViewer = (props) => {
  const mergedTheme = deepMerge(defaultTheme, props.theme);

  const classes = StyleSheet.create(
    deepMerge(defaultStyles, props.theme)
  );

  const doToggleTheme = (theme) => {
    setToggleTheme(theme);
  };

  const [ imgLoaded, setImgLoaded] = useState(false);
  const [ theme, setTheme ] = useState(mergedTheme);
  const [ toggleTheme, setToggleTheme ] = useState(doToggleTheme);    
  const [ isOpen, setIsOpen ] = useState(props.isOpen);
  const [ currImg, setCurrImg ] = useState(props.currImg);
  const [ enableKeyboardInput, setEnableKeyboardInput ] = useState(props.enableKeyboardInput);

  /*bindFunctions.call(this, [
    "gotoNext",
    "gotoPrev",
    "closeBackdrop",
    "handleKeyboardInput",
    "handleImgLoaded",
  ]);*/
  
  useEffect(() => {
    if (isOpen) {
      if (enableKeyboardInput) {
        window.addEventListener("keydown", handleKeyboardInput);
      }
      if (typeof props.currImg === "number") {
        preloadImg(props.currImg, handleImgLoaded);
      }
    }
  }, []);

  let cleanupFunction = () => {
    if (enableKeyboardInput) {
      window.removeEventListener("keydown", handleKeyboardInput);
    }
  }

  useEffect(() => {
    if (!canUseDom) return cleanupFunction;

    // const instance = this

    // always to preload imgs with both directions
    // then when user changs direction, img also show quickly
    if (props.preloadNextImg) {
      const nextIdx = props.currImg + 1;
      const prevIdx = props.currImg - 1;
      // debugger
      // if (!this) return null
      preloadImg(prevIdx);
      preloadImg(nextIdx);
    }
    // preload currImg
    if (
      currImg !== props.currImg ||
      (!isOpen && props.isOpen)
    ) {
      const img = preloadImgData(
        props.imgs[props.currImg],
        handleImgLoaded
      );
      if (img) setImgLoaded(img.complete);
    }

    // add/remove event listeners
    if (
      !isOpen &&
      props.isOpen &&
      props.enableKeyboardInput
    ) {
      window.addEventListener("keydown", handleKeyboardInput);
    }
    if (!props.isOpen && props.enableKeyboardInput) {
      window.removeEventListener("keydown", handleKeyboardInput);
    }

    // update local state
    if (props.isOpen !== isOpen) setIsOpen(props.isOpen);
    if (props.currImg !== currImg) setCurrImg(props.currImg);
    if (props.enableKeyboardInput !== enableKeyboardInput) setEnableKeyboardInput(props.enableKeyboardInput);

    return cleanupFunction;
  }, [props.currImg, props.isOpen, props.enableKeyboardInput, props.preloadNextImg]);


  // static getDerivedStateFromProps (nextProps, prevState) {
  /*const UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (!canUseDom) return;

    // const instance = this

    // always to preload imgs with both directions
    // then when user changs direction, img also show quickly
    if (nextProps.preloadNextImg) {
      const nextIdx = nextProps.currImg + 1;
      const prevIdx = nextProps.currImg - 1;
      // debugger
      // if (!this) return null
      this.preloadImg(prevIdx);
      this.preloadImg(nextIdx);
    }
    // preload currImg
    if (
      this.props.currImg !== nextProps.currImg ||
      (!this.props.isOpen && nextProps.isOpen)
    ) {
      const img = this.preloadImgData(
        nextProps.imgs[nextProps.currImg],
        this.handleImgLoaded
      );
      if (img)
        this.setState({
          imgLoaded: img.complete,
        });
    }

    // add/remove event listeners
    if (
      !this.props.isOpen &&
      nextProps.isOpen &&
      nextProps.enableKeyboardInput
    ) {
      window.addEventListener("keydown", this.handleKeyboardInput);
    }
    if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
      window.removeEventListener("keydown", this.handleKeyboardInput);
    }

    return null;
  }*/

  /*componentWillUnmount() {
    if (this.props.enableKeyboardInput) {
      window.removeEventListener("keydown", this.handleKeyboardInput);
    }
  }*/

  // ====================
  // Methods
  // ====================

  const preloadImg = (idx, onload) => {
    return preloadImgData(props.imgs[idx], onload);
  };

  const preloadImgData = (data, onload) => {
    if (!data) return;

    const img = new Image();
    const sourceSet = normalizeSourceSet(data);

    // Todo: add error handling for missing imgs
    img.onerror = onload;
    img.onload = onload;
    img.src = data.src;

    if (sourceSet) img.srcset = sourceSet;

    return img;
  };

  const gotoNext = (event) => {
    const { currImg, imgs } = props;

    if (!imgLoaded || currImg === imgs.length - 1) return;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    props.onClickNext();
  };

  const gotoPrev = (event) => {
    const { currImg } = props;

    if (!imgLoaded || currImg === 0) return;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    props.onClickPrev();
  };

  const closeBackdrop = (event) => {
    if (
      event.target.id === "viewerBackdrop" ||
      event.target.tagName === "FIGURE"
    ) {
      props.onClose();
    }
  };

  const handleKeyboardInput = (event) => {
    const { keyCode } = event;
    if (keyCode === 37 || keyCode === 33 || keyCode === 38) {
      // left, pageup, up
      gotoPrev(event);
      return true;
    } else if (keyCode === 39 || keyCode === 34 || keyCode === 40) {
      // right, pagedown, down
      gotoNext(event);
      return true;
    } else if (keyCode === 27 || keyCode === 32) {
      // esc, space
      props.onClose();
      return true;
    }
    return false;
  }

  const handleImgLoaded = () => {
    setImgLoaded(true);
  }

  // ====================
  // Renderers
  // ====================

  const renderArrowPrev = (theme) => {
    if (props.currImg === 0) return null;

    return (
      <Arrow
        theme={theme}
        direction="left"
        icon="arrowLeft"
        onClick={gotoPrev}
        title={props.leftArrowTitle}
        type="button"
      />
    );
  };

  const renderArrowNext = (theme) => {
    if (props.currImg === props.imgs.length - 1) return null;

    return (
      <Arrow
        theme={theme}
        direction="right"
        icon="arrowRight"
        onClick={gotoNext}
        title={props.rightArrowTitle}
        type="button"
      />
    );
  };

  const renderDialog = (newState) => {
    const { backdropCloseable, isOpen, showThumbnails, width } = props;
    if (!isOpen) return <span key="closed" />;

    const offsetThumbnails = showThumbnails
      ? this.theme.thumbnail.size + this.theme.container.gutter.vertical
      : 0;

    return (
      <ThemeContext.Consumer>
        {({ theme, toggleTheme }) => {
          theme = newState.theme;
          return (
            <Container
              theme={theme}
              key="open"
              onClick={backdropCloseable && closeBackdrop}
              onTouchEnd={backdropCloseable && closeBackdrop}
            >
              <Fragment>
                <div
                  className={css(classes.content)}
                  style={{
                    marginBottom: offsetThumbnails,
                    maxWidth: width,
                  }}
                >
                  {imgLoaded && renderHeader(theme)}{" "}
                  {renderImgs(theme)}
                  {renderSpinner()} {imgLoaded && renderFooter(theme)}
                </div>
                {imgLoaded && renderThumbnails(theme)}
                {imgLoaded && renderArrowPrev(theme)}
                {imgLoaded && renderArrowNext(theme)}
                {props.preventScroll && <ScrollLock />}
              </Fragment>
            </Container>
          );
        }}
      </ThemeContext.Consumer>
    );
  };

  const renderImgs = (theme) => {
    const { currImg, imgs, onClickImg, showThumbnails } = props;
    if (!imgs || !imgs.length) return null;

    const img = imgs[currImg];
    const sourceSet = normalizeSourceSet(img);
    const sizes = sourceSet ? "100vw" : null;

    const thumbnailsSize = showThumbnails ? theme.thumbnail.size : 0;
    const heightOffset = `${
      theme.header.height +
      theme.footer.height +
      thumbnailsSize +
      theme.container.gutter.vertical
    }px`;

    return (
      <figure className={css(classes.figure)}>
        <img
          className={css(classes.img, imgLoaded && classes.imgLoaded)}
          onClick={onClickImg}
          sizes={sizes}
          alt={img.alt}
          src={img.src}
          srcSet={sourceSet}
          style={{
            cursor: onClickImg ? "pointer" : "auto",
            maxHeight: `calc(100vh - ${heightOffset}`,
          }}
        />
      </figure>
    );
  };

  const renderThumbnails = (theme) => {
    const {
      imgs,
      currImg,
      leftArrowTitle,
      rightArrowTitle,
      onClickThumbnail,
      showThumbnails,
      thumbnailOffset,
    } = props;

    if (!showThumbnails) return null;

    return (
      <PaginatedThumbnails
        theme={theme}
        leftTitle={leftArrowTitle}
        rightTitle={rightArrowTitle}
        currImg={currImg}
        imgs={imgs}
        offset={thumbnailOffset}
        onClickThumbnail={onClickThumbnail}
      />
    );
  };

  const renderHeader = (theme) => {
    const { closeBtnTitle, customControls, onClose, showCloseBtn } = props;

    return (
      <Header
        theme={theme}
        customControls={customControls}
        onClose={onClose}
        showCloseBtn={showCloseBtn}
        closeBtnTitle={closeBtnTitle}
      />
    );
  };

  const renderFooter = (theme) => {
    const { currImg, imgs, imgCountSeparator, showImgCount } = props;
    if (!imgs || !imgs.length) return null;

    return (
      <Footer
        theme={theme}
        caption={imgs[currImg].caption}
        countCurr={currImg + 1}
        countSeparator={imgCountSeparator}
        countTotal={imgs.length}
        showCount={showImgCount}
      />
    );
  };

  const renderSpinner = () => {
    const { spinner, spinnerDisabled, spinnerColor, spinnerSize } = props;
    
    const Spinner = spinner;
    if (spinnerDisabled) return null;
    return (
      <div
        className={css(
          classes.spinner,
          !imgLoaded && classes.spinnerActive
        )}
      >
        <Spinner color={spinnerColor} size={spinnerSize} />
      </div>
    );
  };

  let stateToPass = {
    theme: theme,
    toggleTheme: toggleTheme,
    imgLoaded: imgLoaded
  };

  return (
    <ThemeContext.Provider value={stateToPass}>
      <Portal> {renderDialog(stateToPass)} </Portal>
    </ThemeContext.Provider>
  );
};

ImgsViewer.propTypes = {
  backdropCloseable: PropTypes.bool,
  closeBtnTitle: PropTypes.string,
  currImg: PropTypes.number,
  customControls: PropTypes.arrayOf(PropTypes.node),
  enableKeyboardInput: PropTypes.bool,
  imgCountSeparator: PropTypes.string,
  imgs: PropTypes.arrayOf(
    PropTypes.shape({
      alt: PropTypes.string,
      src: PropTypes.string.isRequired,
      srcSet: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
      caption: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      thumbnail: PropTypes.string,
    })
  ).isRequired,
  isOpen: PropTypes.bool,
  leftArrowTitle: PropTypes.string,
  onClickImg: PropTypes.func,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  onClickThumbnail: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  preloadNextImg: PropTypes.bool,
  preventScroll: PropTypes.bool,
  rightArrowTitle: PropTypes.string,
  showCloseBtn: PropTypes.bool,
  showImgCount: PropTypes.bool,
  showThumbnails: PropTypes.bool,
  spinnerDisabled: PropTypes.bool,
  spinner: PropTypes.func,
  spinnerColor: PropTypes.string,
  spinnerSize: PropTypes.number,
  theme: PropTypes.object,
  thumbnailOffset: PropTypes.number,
  width: PropTypes.number,
};

ImgsViewer.defaultProps = {
  currImg: 0,
  enableKeyboardInput: true,
  imgCountSeparator: " / ",
  onClickShowNextImg: true,
  preloadNextImg: true,
  preventScroll: true,
  showCloseBtn: true,
  showImgCount: true,
  spinnerDisabled: false,
  spinner: DefaultSpinner,
  spinnerColor: "#fff",
  spinnerSize: 50,
  theme: {},
  thumbnailOffset: 2,
  width: 1024,
};

const defaultStyles = {
  content: {
    position: "relative",
  },
  figure: {
    margin: 0, // remove browser default
  },
  img: {
    display: "block", // removes browser default gutter
    height: "auto",
    margin: "0 auto", // main center on very short screens or very narrow img
    maxWidth: "100%",

    // disable user select
    WebkitTouchCallout: "none",
    userSelect: "none",

    // opacity animation on image load
    opacity: 0,
    transition: "opacity .3s",
  },
  imgLoaded: {
    opacity: 1,
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    // opacity animation to make spinner appear with delay
    opacity: 0,
    transition: "opacity .3s",
    pointerEvents: "none",
  },
  spinnerActive: {
    opacity: 1,
  },
};

export default ImgsViewer;
