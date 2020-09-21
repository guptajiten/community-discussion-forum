import React from 'react'
import { Link } from 'react-router'
import Toolbar from './views/action/Toolbar'
import TopNav from './widgets/TopNav'

export default React.createClass({

  propTypes: {
    params: React.PropTypes.object
  },

  render() {
    const {id=0, entity=null} = this.props.params,
      urlParts = window.location.pathname.split('/'),
      view = urlParts.length>1 ? urlParts[2] : false,
      isNew = urlParts.length>2 ? urlParts[3]=='0' : false
    return (
      <div>
          <TopNav>
              <div className="cdfo-toolbar">
                  <ul role="nav" className="cdfo-nav-pills pull-left">
                      <li><Link to="/topics/list" id="topics" className={entity==='topics'?'active':''}>Topics</Link></li>
                  </ul>
                  <div className="clearer"/>
              </div>
              <h2><Link to="/">Community Discussion Forum</Link></h2>
              <div className="clearer"/>
              {entity ? <Toolbar key="tb" entity={entity} params={this.props.params} isNew={isNew} view={view}/> : null}
          </TopNav>
          
          <div className="TopNavComplement" />
          {this.props.children}
      </div>
    )
  }
})
