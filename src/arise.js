import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

let div;

export default class Arise extends React.Component {

  static propTypes = {
    force: PropTypes.bool,
    show: PropTypes.bool.isRequired,
    html: PropTypes.string,
    children: PropTypes.node,
    modal: PropTypes.bool,
    modalClasses: PropTypes.object,
    popupClass: PropTypes.string,
    closeOnClick: PropTypes.bool,
    anchorElement: PropTypes.node,
    popupPadding: PropTypes.string,
    universalPositioning: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    closeOnClick: true
  };

  static universal(props) {
    if (!div) {
      div = document.createElement('div');
      document.body.appendChild(div);
    }
    return ReactDOM.render( <Arise force={ true } { ... props } universalPositioning={ true } />, div );
  }

  constructor(props) {
    super(props);
    this._bindFunctions('_reposition');
    this.state = { transitioning: false };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ transitioning: true });
  }

  componentDidMount() {
    this._handleTransitions();
    this._reposition();
  }

  componentWillUnmount() {
    document.querySelector('body').classList.remove(this.props.noscrollClass || 'noscroll');
  }

  componentDidUpdate(prevProps, prevState) {
    this._handleTransitions(prevProps);
    this._reposition();
  }

  render() {
    const { html, children, modal, popupClass, closeOnClick, universalPositioning, onClose } = this.props;
    const modalClasses = this.props.modalClasses || {};
    const contentOpts = html ?
      { dangerouslySetInnerHTML : { __html: html } } : { children };
    const fixed = universalPositioning ? ' fixed' : '';
    if (modal) {
      return <div className={ modalClasses.container || 'Arise-modal-container' } ref="container">
        <div ref="overlay" className={ ( modalClasses.overlay || 'Arise-modal-overlay') + fixed }
          onClick={ closeOnClick ? onClose : null } />
        <div className={ ( modalClasses.content || 'Arise-modal-content' ) + fixed } ref="content"
          { ... contentOpts } />
      </div>;
    } else {
      return <div className={ popupClass || 'Arise-popup' } ref="container"
        { ... contentOpts } />;
    }
  }

  // TODO: clean up variables names to be more readable
  _handleTransitions(prevProps = {}) {
    let { showClass, hideTransitionClass, show } = this.props;
    if (prevProps.show === show) return;
    let { container } = this.refs;
    let sc = showClass || 'Arise-show',
      htc = hideTransitionClass || 'Arise-hide-transition',
      cl = container.classList,
      bcl = document.querySelector('body').classList,
      ns = this.props.noscrollClass || 'noscroll';
    show ? bcl.add(ns) : bcl.remove(ns);
    const listener = (e) => {
      container.removeEventListener('transitionend', listener);
      cl.remove(htc);
    };
    if (show) {
      cl.add(sc);
    } else  {
      if (this.state.transitioning) {
        container.addEventListener('transitionend', listener);
        cl.add(htc);
      }
      cl.remove(sc);
    }
  }

  _reposition() {
    let { modal, anchorElement, popupPadding, universalPositioning, show }
      = this.props;
    let { container } = this.refs;
    if (modal || !show) return;
    let bottom, left;
    if (universalPositioning) {
      let bcr = anchorElement.getBoundingClientRect();
      bottom = bcr.bottom + ( window.scrollY || window.pageYOffset );
      left = bcr.left + ( window.scrollX || window.pageXOffset );
    } else {
      bottom = anchorElement.offsetTop + anchorElement.offsetHeight;
      left = anchorElement.offsetLeft;
    }
    container.style.top = `calc(${ bottom }px + ${ popupPadding || '5px' })`;
    container.style.left = left + 'px';
  }

  _bindFunctions() {
    let arg;
    for (let i=0; arg = arguments[i]; i++) {
      this[arg] = this[arg].bind(this);
    }
  }

}
