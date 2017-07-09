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
    universalPositioning: PropTypes.boolean
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

  get passPropsToState() { return ['show']; }

  constructor(props) {
    super(props);
    this._bindFunctions('open', 'close', '_reposition');
    this.state = this._stateFromProps(props);
  }

  componentWillReceiveProps(newProps) {
    this.setState( this._stateFromProps(newProps, newProps.force ? {} : this.props) );
  }

  componentDidMount() {
    this._handleTransitions();
    this._reposition();
  }

  componentWillUnmount() {
    document.querySelector('body').classList.remove(this.props.noscrollClass || 'noscroll');
  }

  componentDidUpdate(prevProps, prevState) {
    this._handleTransitions(prevState);
    this._reposition();
  }

  open() { this.setState({ show: true }); }

  close() { this.setState({ show: false }); }

  toggle() { this.setState({ show: !this.state.show }); }

  render() {
    const { show } = this.state;
    const { html, children, modal, popupClass, closeOnClick } = this.props;
    const modalClasses = this.props.modalClasses || {};
    const contentOpts = html ?
      { dangerouslySetInnerHTML : { __html: html } } : { children };
    if (modal) {
      return <div className={ modalClasses.container || 'Arise-modal-container' } ref="container">
        <div ref="overlay" className={ modalClasses.overlay || 'Arise-modal-overlay' }
          onClick={ closeOnClick ? this.close : null } />
        <div className={ modalClasses.content || 'Arise-modal-content '} ref="content"
          { ... contentOpts } />
      </div>;
    } else {
      return <div className={ popupClass || 'Arise-popup' } ref="container"
        { ... contentOpts } />;
    }
  }

  // TODO: clean up variables names to be more readable
  _handleTransitions(prevState = {}) {
    if (prevState.show == this.state.show) return;
    let { container } = this.refs;
    let { showClass, hideTransitionClass } = this.props;
    let sc = showClass || 'Arise-show',
      htc = hideTransitionClass || 'Arise-hide-transition',
      cl = container.classList,
      bcl = document.querySelector('body').classList,
      ns = this.props.noscrollClass || 'noscroll';
    this.state.show ? bcl.add(ns) : bcl.remove(ns);
    const listener = (e) => {
      container.removeEventListener('transitionend', listener);
      cl.remove(htc);
    };
    if (this.state.show) {
      cl.add(sc);
    } else {
      container.addEventListener('transitionend', listener);
      cl.remove(sc);
      cl.add(htc);
    }
  }

  _reposition() {
    let { modal, anchorElement, popupPadding, universalPositioning } = this.props;
    let { show } = this.state;
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

  _stateFromProps(newProps, oldProps) {
    let vars = this.passPropsToState, p;
    let newState = {};
    oldProps = oldProps || {};
    for (let i=0; p = vars[i]; i++) {
      if (newProps[p] !== oldProps[p]) newState[p] = newProps[p];
    }
    return newState;
  }

}
