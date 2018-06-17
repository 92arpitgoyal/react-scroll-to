import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { easeInOutQuad } from "./utilities/easingFunctions";
import scrollWindow from "./utilities/scrollWindow";

export const ScrollToContext = createContext("scrollToContext");

/**
 * Component that uses render props to inject
 * a function that allows the consumer to scroll to a
 * position in the window or ScrollArea component
 */
class ScrollTo extends Component {
  constructor(props) {
    super(props);

    this.scrollArea = {};

    this.getContext = {
      addScrollArea: (id, ref) => {
        this.scrollArea[id] = ref;
      },
      removeScrollArea: id => {
        delete this.scrollArea[id];
      }
    };
  }

  handleScroll = (props = {}) => {
    const { id = null, x = 0, y = 0, duration = 0, ...rest } = props; // Assign default values to props

    if (duration > 0) {
      this._smoothScroll({ id, x, y, duration, ...rest });
    } else {
      this._handleScrollOptions({ id, x, y, duration, ...rest });
    }
  };

  _handleScrollOptions = (props = {}) => {
    if (props.id) {
      return this._handleScrollById(props.id, props.x, props.y);
    }

    const scrollAreaKeys = Object.keys(this.scrollArea);

    if (scrollAreaKeys.length === 0) {
      scrollWindow(props.x, props.y);
    } else {
      scrollAreaKeys.forEach(key => {
        const node = this.scrollArea[key];

        node.scrollLeft = props.x;
        node.scrollTop = props.y;
      });
    }
  };

  _handleScrollById = (id, x, y) => {
    const node = this.scrollArea[id];
    if (node) {
      node.scrollLeft = x;
      node.scrollTop = y;
    }
  };

  // Referenced from: https://www.sitepoint.com/smooth-scrolling-vanilla-javascript/
  _smoothScroll = (options = {}) => {
    let startY = 0;
    let startX = 0;
    let timeStart;
    let timeElapsed;

    requestAnimationFrame(time => {
      timeStart = time;
      loop(time);
    });

    const loop = time => {
      timeElapsed = time - timeStart;

      this._handleScrollOptions({
        ...options,
        x: easeInOutQuad(timeElapsed, startX, options.x, options.duration),
        y: easeInOutQuad(timeElapsed, startY, options.y, options.duration)
      });

      if (timeElapsed < duration) {
        requestAnimationFrame(loop);
      } else {
        this._handleScrollOptions({
          ...options,
          x: startX + options.x,
          y: startY + options.y
        });
      }
    };
  };

  render() {
    return (
      <ScrollToContext.Provider value={this.getContext}>
        {this.props.children &&
          this.props.children({
            scrollTo: this.handleScroll
          })}
      </ScrollToContext.Provider>
    );
  }
}

ScrollTo.defaultProps = {
  children: () => {}
};

ScrollTo.propTypes = {
  children: PropTypes.func.isRequired
};

export default ScrollTo;
